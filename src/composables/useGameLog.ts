import { ref } from 'vue'
import Qmsg from 'qmsg'

export type FloatColor = 'danger' | 'success' | 'accent' | 'water'

export interface QmsgConfigOptions {
  position: string
  timeout: number
  maxNums: number
  isLimitWidth: boolean
  limitWidthNum: number
  limitWidthWrap: 'no-wrap' | 'wrap' | 'ellipsis'
  animation: boolean
  autoClose: boolean
  showClose: boolean
  showIcon: boolean
  showReverse: boolean
}

//Configure Qmsg global style
Qmsg.config({
  position: 'top',
  showIcon: false,
  maxNums: 5,
  timeout: 2500,
  isHTML: true,
  useShadowRoot: false
})

/** Dynamically update all Qmsg notification configurations */
export const applyQmsgConfig = (opts: QmsgConfigOptions) => {
  Qmsg.config({
    isHTML: true,
    position: opts.position as 'top',
    timeout: opts.timeout,
    maxNums: opts.maxNums,
    isLimitWidth: opts.isLimitWidth,
    limitWidthNum: opts.limitWidthNum,
    limitWidthWrap: opts.limitWidthWrap,
    animation: opts.animation,
    autoClose: opts.autoClose,
    showClose: opts.showClose,
    showIcon: opts.showIcon,
    showReverse: opts.showReverse,
    useShadowRoot: false
  })
}

// Talent check callback — registered by useDialogs to avoid circular imports
let _perkChecker: (() => void) | null = null

/** Register talent check callback (called when useDialogs is initialized) */
export const _registerPerkChecker = (fn: () => void) => {
  _perkChecker = fn
}

/**
 * Actively trigger a talent check.
 * Can be called directly when upgrading skills: Mining/combat in the mine does not go through addLog.
 * Otherwise, after reaching level 5/10, the specialization pop-up window will not pop up until the player leaves the mine.
 * Creates the illusion of "exiting the mine after selecting a specialization".
 */
export const triggerPerkCheck = () => {
  _perkChecker?.()
}

// === Log history (in memory, not archived, cleared by refreshing the page) ===

export interface LogEntry {
  msg: string
  dayLabel: string
}

/** All log history */
export const logHistory = ref<LogEntry[]>([])

/** Days tag getter - registered when the app is started to avoid circular import */
let _dayLabelGetter: (() => string) | null = null

/** Registration days tag getter (called during App initialization) */
export const _registerDayLabelGetter = (fn: () => string) => {
  _dayLabelGetter = fn
}

/** The maximum number of log history entries, if exceeded, they will be cropped from the head */
const LOG_HISTORY_MAX = 300

/** Add log message (displayed as toast notification and recorded to history) */
export const addLog = (msg: string) => {
  Qmsg.info(msg)
  const dayLabel = _dayLabelGetter?.() ?? ''
  logHistory.value.push({ msg, dayLabel })
  // To prevent logs from accumulating indefinitely due to long-term play, only the most recent 300 entries will be retained.
  if (logHistory.value.length > LOG_HISTORY_MAX) {
    logHistory.value.splice(0, logHistory.value.length - LOG_HISTORY_MAX)
  }
  _perkChecker?.()
}

/** Display floating text feedback (displayed as toast notification) */
export const showFloat = (text: string, color: FloatColor = 'accent') => {
  switch (color) {
    case 'danger':
      Qmsg.error(text, { timeout: 1500 })
      break
    case 'success':
      Qmsg.success(text, { timeout: 1500 })
      break
    case 'accent':
      Qmsg.warning(text, { timeout: 1500 })
      break
    case 'water':
      Qmsg.info(text, { timeout: 1500 })
      break
  }
}

/** Reset log (new game) */
export const resetLogs = () => {
  Qmsg.closeAll()
}

/** Clear all log history */
export const clearAllLogs = () => {
  logHistory.value = []
}

/** Clear the logs of the specified day */
export const clearDayLogs = (dayLabel: string) => {
  logHistory.value = logHistory.value.filter(e => e.dayLabel !== dayLabel)
}

export const useGameLog = () => {return {
    addLog,
    showFloat,
    resetLogs,
    clearAllLogs,
    clearDayLogs,
    logHistory
  }
}