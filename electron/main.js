import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, session } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import pkg from '../package.json'

// Application root directory (when developing, it is the project root directory, and after packaging, it is app.asar)
const appRoot = app.getAppPath()

// preload path
const preloadPath = path.join(appRoot, 'dist-electron', 'preload.js')

// Build product path (Vite output to docs/)
const docsPath = path.join(appRoot, 'docs')

// Static resource path
const publicPath = path.join(appRoot, 'public')

//Set file path
const settingsPath = path.join(app.getPath('userData'), 'settings.json')

//Default settings
const defaultSettings = {
  closeToTray: false, // Hide to tray when closing window
  autoLaunch: false // Auto-launch at boot
}

//Read settings
const loadSettings = () => {
  try {
    if (fs.existsSync(settingsPath)) {
      return {
        ...defaultSettings,
        ...JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
      }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return { ...defaultSettings }
}

// save settings
const saveSettings = s => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

let settings = loadSettings()
let win = null
let tray = null
let isQuitting = false

// Destroy the tray
const destroyTray = () => {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

//Set auto-start at boot
const setAutoLaunch = enable => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: app.getPath('exe')
  })
}

//Create tray
const createTray = () => {
  if (tray) return

  const iconPath = path.join(publicPath, 'favicon.ico')
  const trayIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty()

  tray = new Tray(trayIcon)
  tray.setToolTip(pkg.title)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show window', click: () => win?.show() },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => win?.show())
}

//Create application menu
const createAppMenu = () => {
  const template = [
    {
      label: 'setting',
      submenu: [
        {
          label: 'Minimize to tray when closing',
          type: 'checkbox',
          checked: settings.closeToTray,
          click: menuItem => {
            settings.closeToTray = menuItem.checked
            saveSettings(settings)
            if (settings.closeToTray) {
              createTray()
            } else {
              destroyTray()
            }
          }
        },
        {
          label: 'Automatically start at boot',
          type: 'checkbox',
          checked: settings.autoLaunch,
          click: menuItem => {
            settings.autoLaunch = menuItem.checked
            saveSettings(settings)
            setAutoLaunch(settings.autoLaunch)
          }
        },
        {
          label: 'Exit game',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            isQuitting = true
            app.quit()
          }
        }
      ]},
    {
      label: 'development',
      submenu: [
        {
          label: 'Developer Tools',
          accelerator: 'F12',
          click: () => win?.webContents.toggleDevTools()
        },
        {
          label: 'reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => win?.webContents.reload()
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

//Create window
const createWindow = () => {
  win = new BrowserWindow({
    title: pkg.title,
    icon: path.join(publicPath, 'favicon.ico'),
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  })

  createAppMenu()
  win.loadFile(path.join(docsPath, 'index.html'))

  // WebDAV CORS bypass: inject CORS response headers for all non-original requests
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders }
    headers['access-control-allow-origin'] = ['*']
    headers['access-control-allow-methods'] = ['GET, PUT, DELETE, PROPFIND, HEAD, OPTIONS']
    headers['access-control-allow-headers'] = ['Authorization, Content-Type, Depth']
    // Strip WWW-Authenticate to prevent the browser from popping up the native authentication dialog box (the application handles authentication errors by itself)
    delete headers['www-authenticate']
    delete headers['WWW-Authenticate']
    callback({ responseHeaders: headers })
  })

  // window close event
  win.on('close', e => {
    if (settings.closeToTray && !isQuitting) {
      e.preventDefault()
      win.hide()
      createTray()
    }
  })
}

//IPC handling
ipcMain.handle('get-settings', () => settings)

ipcMain.handle('set-settings', (_, newSettings) => {
  settings = { ...settings, ...newSettings }
  saveSettings(settings)

  // Handle auto-start at boot
  setAutoLaunch(settings.autoLaunch)

  // handle pallet
  if (settings.closeToTray) {
    createTray()
  } else {
    destroyTray()
  }

  return { needRestart: false }
})

ipcMain.handle('restart-window', () => {
  if (win) {
    const bounds = win.getBounds()
    win.destroy()
    createWindow()
    win.setBounds(bounds)
  }
})

ipcMain.handle('quit-app', () => {
  isQuitting = true
  app.quit()
})

app.whenReady().then(() => {
  createWindow()

  // If the tray function is enabled, create the tray
  if (settings.closeToTray) {
    createTray()
  }

  // Apply auto-start settings at boot
  setAutoLaunch(settings.autoLaunch)
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win) {
    win.show()
  } else {
    createWindow()
  }
})
