import { ref, computed } from 'vue'
import { Capacitor, CapacitorHttp } from '@capacitor/core'
import { parseSaveData } from '@/stores/useSaveStore'

const STORAGE_KEY = 'taoyuanxiang_webdav'
const SAVE_KEY_PREFIX = 'taoyuanxiang_save_'
const MAX_SLOTS = 3

export interface WebdavConfig {
  enabled: boolean
  serverUrl: string
  path: string
  username: string
  password: string
}

const defaultConfig = (): WebdavConfig => ({
  enabled: false,
  serverUrl: '',
  path: '',
  username: '',
  password: ''
})

const loadConfig = (): WebdavConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultConfig(), ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultConfig()
}

/** Persistence configuration */
const config = ref<WebdavConfig>(loadConfig())
const testStatus = ref<'idle' | 'testing' | 'success' | 'failed'>('idle')
const testError = ref('')
const traceLogs = ref<string[]>([])
const TRACE_LOG_LIMIT = 80

/** Check whether in Electron environment */
const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')

/** Current time (HH:mm:ss) */
const nowLabel = (): string => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

/** WebDAV debugging log (used for Android environment troubleshooting to avoid relying on console) */
const pushTrace = (msg: string) => {
  traceLogs.value.push(`[${nowLabel()}] ${msg}`)
  if (traceLogs.value.length > TRACE_LOG_LIMIT) {
    traceLogs.value.splice(0, traceLogs.value.length - TRACE_LOG_LIMIT)
  }
}

const clearTrace = () => {
  traceLogs.value = []
}

const formatUrlForLog = (url: string): string => {
  try {
    const u = new URL(url)
    return `${u.origin}${u.pathname}`
  } catch {
    return url
  }
}

const extractErrorMessage = (e: unknown): string => {
  if (e instanceof Error && e.message) return e.message
  if (typeof e === 'string') return e
  if (e && typeof e === 'object') {
    const message = (e as { message?: unknown }).message
    if (typeof message === 'string' && message) return message
    try {
      return JSON.stringify(e)
    } catch {
      return String(e)
    }
  }
  return String(e)
}

const normalizeUserError = (msg: string): string => {
  // Android's native HttpURLConnection only returns the URL text in some failure branches, which has poor readability.
  if (/^https?:\/\//i.test(msg.trim())) {
    return 'Request failed (server refused or path does not exist)'
  }
  return msg
}

/** Platform adaptive HTTP request: native platform uses CapacitorHttp, dev uses Vite proxy, Electron/production web direct connection */
const webdavFetch = async (
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ status: number; data: string }> => {
  const logUrl = formatUrlForLog(url)
  pushTrace(`Request ${method} ${logUrl}`)
  try {
    // Native platform (Capacitor Android/iOS): CapacitorHttp bypasses CORS
    if (Capacitor.isNativePlatform()) {
      const res = await CapacitorHttp.request({
        url,
        method,
        headers,
        data: body
      })pushTrace(`response ${method} ${res.status}`)
      return {
        status: res.status,
        data: typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
      }
    }
    // Dev environment (non-Electron): use Vite proxy middleware to bypass CORS
    if (import.meta.env.DEV && !isElectron) {
      const res = await fetch('/__webdav', {
        method,
        headers: { ...headers, 'x-webdav-url': url },
        body
      })
      pushTrace(`response ${method} ${res.status}`)
      return { status: res.status, data: await res.text() }
    }
    // Electron (CORS header has been injected into the main process) / production web (same source deployment): direct connection
    // credentials: 'omit' prevents the browser from popping up the native authentication dialog box (authentication is handled by the Authorization header itself)
    const res = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'omit'
    })
    pushTrace(`response ${method} ${res.status}`)
    return { status: res.status, data: await res.text() }
  } catch (e: unknown) {
    const msg = extractErrorMessage(e)
    pushTrace(`Exception ${method} ${msg}`)
    throw e
  }
}

/** Return targeted path prompts based on the serverUrl domain name */
const getPathHint = (serverUrl: string): string => {
  try {
    const host = new URL(serverUrl).hostname.toLowerCase()
    if (host.includes('jianguoyun')) return 'Nut Cloud Please fill in the existing folder name in the "Storage Path", such as "My Nut Cloud". '
    if (host.includes('nextcloud') || serverUrl.includes('/remote.php/dav')) return 'Nextcloud Please fill in the target folder name in "Storage Path". '
    if (host.includes('owncloud') || serverUrl.includes('/remote.php/webdav')) return 'ownCloud Please fill in the target folder name in "Storage Path". '
  } catch {
    /* ignore */
  }
  return 'Please fill in an existing folder name in "Storage Path". '
}

export const useWebdav = () => {
  const webdavConfig = config
  const webdavTestStatus = testStatus
  const webdavTestError = testError

  const webdavReady = computed(() => config.value.enabled && testStatus.value === 'success')

  const saveConfig = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
  }

  /** Make sure the URL ends with / */
  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim().replace(/\/+$/, '')
    return trimmed ? trimmed + '/' : ''
  }

  /** Splice serverUrl + path to get the complete directory URL (percent-encode the path segment to support Chinese) */
  const fullDirUrl = (): string => {
    const base = normalizeUrl(config.value.serverUrl)
    const sub = config.value.path.trim().replace(/^\/+|\/+$/g, '')
    if (!sub) return base
    const encoded = sub
      .split('/')
      .map(s => encodeURIComponent(s))
      .join('/')
    return base + encoded + '/'
  }

  /** Generate Basic Auth header */
  const authHeaders = (): Record<string, string> => ({
    Authorization: 'Basic ' + btoa(config.value.username + ':' + config.value.password)
  })

  /** Remote file path */
  const remoteFilePath = (slot: number): string => fullDirUrl() + `taoyuan_save_${slot}.tyx`

  /** Set test error prompt based on status code */
  const setTestErrorByStatus = (status: number, phase?: string) => {
    const prefix = phase ? `${phase}：` : ''
    if (status === 401 || status === 403) {
      testError.value = prefix + 'Authentication failed, please check username and password'
    } else if (status === 404 || status === 409) {testError.value = prefix + 'Path does not exist. ' + getPathHint(config.value.serverUrl)
    } else if (status === 405 || status === 501) {
      testError.value = prefix + 'The server does not support the current WebDAV operation'
    } else {
      testError.value = prefix + `The server returned ${status}`
    }
    pushTrace(`Test failed ${prefix}${status}`)
  }

  /** Native platform connection detection: try to PUT temporary file and DELETE after success */
  const probeNativeWritable = async (dirUrl: string): Promise<{ status: number; error: string }> => {
    // Avoid using dot prefixes to hide file names. Some WebDAV services will reject such files.
    const probeUrl = dirUrl + `taoyuan_probe_${Date.now()}.tyx`
    pushTrace('Native detection: Try PUT temporary file')
    try {
      const putRes = await webdavFetch(
        probeUrl,
        'PUT',
        {
          ...authHeaders(),
          'Content-Type': 'application/octet-stream'
        },
        'probe'
      )
      if (putRes.status >= 200 && putRes.status < 300) {
        try {
          pushTrace('Native detection: PUT successful, try DELETE temporary file')
          await webdavFetch(probeUrl, 'DELETE', authHeaders())
        } catch {
          /* Ignore cleanup failures to avoid affecting test results */
          pushTrace('Native detection: DELETE cleanup failed (ignored)')
        }
      }
      return { status: putRes.status, error: '' }
    } catch (e: unknown) {
      const msg = normalizeUserError(extractErrorMessage(e))
      pushTrace(`Native detection exception: ${msg}`)
      return { status: 0, error: msg }
    }
  }

  /** Test connection: Web/Electron gives priority to PROPFIND; native platform HEAD first, fallback to PUT+DELETE detection after failure */
  const testConnection = async (): Promise<boolean> => {
    clearTrace()
    testStatus.value = 'testing'
    testError.value = ''
    pushTrace(`Start test connection (platform=${Capacitor.getPlatform()})`)
    try {
      const base = normalizeUrl(config.value.serverUrl)
      if (!base) {
        testStatus.value = 'failed'
        testError.value = 'Server address is empty'
        pushTrace('Failed: Server address is empty')
        return false
      }
      const url = fullDirUrl()
      const isNative = Capacitor.isNativePlatform()
      pushTrace(`Target directory ${formatUrlForLog(url)}`)

      if (!isNative) {
        pushTrace('Strategy: PROPFIND detection directory')
        const res = await webdavFetch(url, 'PROPFIND', {
          ...authHeaders(),
          Depth: '0'
        })
        // Most WebDAV returns 207, some implementations may return 200
        if (res.status === 207 || res.status === 200) {
          testStatus.value = 'success'
          pushTrace('Test successful')
          return true
        }
        testStatus.value = 'failed'
        setTestErrorByStatus(res.status, 'PROPFIND')
        return false
      }

      // The native platform skips HEAD: When HEAD fails on Android, only a URL text exception is thrown, and the status code cannot be obtained stably.
      pushTrace('Strategy: PUT detects directory writability (Android skips HEAD)')
      const probe = await probeNativeWritable(url)
      if (probe.status >= 200 && probe.status < 300) {
        testStatus.value = 'success'
        pushTrace('Test successful (PUT detection)')
        return true
      }

      if (probe.status > 0) {
        testStatus.value = 'failed'
        setTestErrorByStatus(probe.status, 'PUT')
        return false
      }

      testStatus.value = 'failed'
      testError.value = probe.error || 'Connection failed (PUT detection exception)'pushTrace(testError.value)
      return false
    } catch (e: unknown) {
      testStatus.value = 'failed'
      const msg = normalizeUserError(extractErrorMessage(e))
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) {
        testError.value = 'Network error, please check whether the address is correct'
      } else {
        testError.value = msg || 'Connection failed'
      }
      pushTrace(`Exception failure: ${testError.value}`)
      return false
    }
  }

  /** Make sure the remote directory exists (MKCOL). If it already exists, 405/409 is normal */
  const ensureDirectory = async (): Promise<void> => {
    // CapacitorHttp is based on HttpURLConnection and does not support MKCOL
    if (Capacitor.isNativePlatform()) {
      pushTrace('Skip MKCOL: not supported by native platform')
      return
    }
    const url = fullDirUrl()
    if (!url) return
    try {
      pushTrace('Try MKCOL to create directory')
      await webdavFetch(url, 'MKCOL', authHeaders())
    } catch {
      /* Ignore: Directory creation failure does not block the upload process */
      pushTrace('MKCOL failed (ignored)')
    }
  }

  /** Upload archive to WebDAV */
  const uploadSave = async (slot: number): Promise<{ success: boolean; message: string }> => {
    pushTrace(`Upload starts slot=${slot}`)
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`)
    if (!raw) return { success: false, message: 'The local archive does not exist. ' }
    try {
      let res = await webdavFetch(
        remoteFilePath(slot),
        'PUT',
        {
          ...authHeaders(),
          'Content-Type': 'application/octet-stream'
        },
        raw
      )
      // 404 usually means that the remote directory does not exist. The Web/Electron side tries to create MKCOL and try again.
      if (res.status === 404 && !Capacitor.isNativePlatform()) {
        await ensureDirectory()
        res = await webdavFetch(
          remoteFilePath(slot),
          'PUT',
          {
            ...authHeaders(),
            'Content-Type': 'application/octet-stream'
          },
          raw
        )
      }
      if (res.status >= 200 && res.status < 300) {
        pushTrace(`Upload successful slot=${slot}`)
        return { success: true, message: `Archive ${slot + 1} has been uploaded to the cloud. ` }
      }
      if (Capacitor.isNativePlatform() && (res.status === 404 || res.status === 409)) {
        return {
          success: false,
          message: 'The upload path is invalid. The Android side does not support automatic directory creation. Please create the folder on the network disk first. ' + getPathHint(config.value.serverUrl)
        }
      }
      if (res.status === 404) {
        return {
          success: false,
          message: 'The upload path is invalid. ' + getPathHint(config.value.serverUrl)
        }
      }
      pushTrace(`Upload failed slot=${slot} status=${res.status}`)
      return { success: false, message: `Upload failed (${res.status}). ` }
    } catch (e: unknown) {
      const msg = normalizeUserError(extractErrorMessage(e))
      pushTrace(`Upload exception slot=${slot} ${msg}`)
      return { success: false, message: `Upload failed: ${msg}` }
    }
  }

  /** Download archive from WebDAV */
  const downloadSave = async (slot: number): Promise<{ success: boolean; message: string }> => {
    pushTrace(`Download starts slot=${slot}`)
    try {
      const res = await webdavFetch(remoteFilePath(slot), 'GET', authHeaders())
      if (res.status === 404) {return { success: false, message: `The archive ${slot + 1} does not exist in the cloud. ` }
      }
      if (res.status < 200 || res.status >= 300) {
        return { success: false, message: `Download failed (${res.status}). ` }
      }
      if (!parseSaveData(res.data)) {
        return { success: false, message: 'The cloud archive data is invalid or damaged. ' }
      }
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slot}`, res.data)
      pushTrace(`Download successful slot=${slot}`)
      return { success: true, message: `Archive ${slot + 1} has been downloaded from the cloud. ` }
    } catch (e: unknown) {
      const msg = normalizeUserError(extractErrorMessage(e))
      pushTrace(`Download exception slot=${slot} ${msg}`)
      return { success: false, message: `Download failed: ${msg}` }
    }
  }

  /** List whether the remote archive exists */
  const listRemoteSaves = async (): Promise<{ slot: number; exists: boolean }[]> => {
    pushTrace('Start listing remote archives')
    const results: { slot: number; exists: boolean }[] = []
    const isNative = Capacitor.isNativePlatform()
    for (let i = 0; i < MAX_SLOTS; i++) {
      try {
        // Some WebDAV services have incomplete support for HEAD. The native platform uses GET to determine the existence of the file instead.
        const method = isNative ? 'GET' : 'HEAD'
        const res = await webdavFetch(remoteFilePath(i), method, authHeaders())
        pushTrace(`remote slot slot=${i} status=${res.status}`)
        results.push({
          slot: i,
          exists: res.status >= 200 && res.status < 300
        })
      } catch {
        pushTrace(`remote slot slot=${i} request exception`)
        results.push({ slot: i, exists: false })
      }
    }
    return results
  }

  return {
    webdavConfig,
    webdavTestStatus,
    webdavTestError,
    webdavTraceLogs: traceLogs,
    webdavReady,
    saveConfig,
    clearTrace,
    testConnection,
    uploadSave,
    downloadSave,
    listRemoteSaves
  }
}