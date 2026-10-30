import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { PASSOUT_HOUR, MIDNIGHT_HOUR } from '@/data/timeConstants'
import { addLog } from './useGameLog'

// === constants ===
/** Stardew Valley rate: 0.7 real seconds = 1 game minute */
const REAL_MS_PER_GAME_MINUTE = 700
/** tick interval (ms), the smaller it is, the smoother the display */
const TICK_MS = 200

/**
 * Reason for clock blocking.
 * Each source registers/cancels independently to avoid permanent stagnation or unexpected passage of time caused by "A pauses and then B resumes".
 */
export type ClockBlocker = 'modal' | 'panel' | 'hidden' | 'endday' | 'bedtime'

// === Module-level singleton status ===
const gameSpeed = ref(1)
/** Players manually pause in settings */
const manualPaused = ref(false)
/** The currently effective set of blocking reasons */
const blockers = ref<Set<ClockBlocker>>(new Set())
/** Whether the clock has been started (interval exists) */
let timerId: ReturnType<typeof setInterval> | null = null

/** Whether the clock is paused (manually paused or there is any blocking) */
const isPaused = computed(() => manualPaused.value || blockers.value.size > 0)

/** Register/unregister a blocking reason */
export const setClockBlocker = (reason: ClockBlocker, active: boolean) => {
  const had = blockers.value.has(reason)
  // If the status has not changed, skip it to avoid unnecessary reassignment and trigger responsive propagation.
  if (active === had) return
  if (active) blockers.value.add(reason)
  else blockers.value.delete(reason)
  // The addition and deletion of Set will not trigger the deep response of ref. Reassignment ensures that computed is updated.
  blockers.value = new Set(blockers.value)
}

/** Game hours advanced per tick */
const getHoursPerTick = (): number => {
  const minutesPerTick = (TICK_MS / REAL_MS_PER_GAME_MINUTE) * gameSpeed.value
  return minutesPerTick/60
}

/**
 * clock tick.
 * Only responsible for advancing time; bedtime reminder and fainting settlement are handled uniformly by GameLayout monitoring `gameStore.hour`,
 * In this way, real-time passage and player operation advancement (advanceTime) follow the same set of prompt logic.
 */
const tick = () => {
  if (isPaused.value) return

  const gameStore = useGameStore()
  const prevHour = gameStore.hour
  const newHour = prevHour + getHoursPerTick()

  // Reach the fainting time: stop at this moment and let the GameLayout pop-up window notify and settle
  if (newHour >= PASSOUT_HOUR) {
    gameStore.hour = PASSOUT_HOUR
    return
  }

  gameStore.hour = newHour

  // Prompt across midnight (only once, shares flag with advanceTime)
  if (!gameStore.midnightWarned && prevHour < MIDNIGHT_HOUR && newHour >= MIDNIGHT_HOUR) {
    gameStore.midnightWarned = true
    addLog('It's past midnight and you are starting to feel sleepy...')
  }
}

export const useGameClock = () => {
  /** Start the real-time clock */
  const startClock = () => {
    if (timerId) return
    manualPaused.value = false
    blockers.value = new Set()
    timerId = setInterval(tick, TICK_MS)
  }

  /** Stop the real-time clock (destroy interval) */
  const stopClock = () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  /** Pause the clock (equivalent to registering misc blocking, reserved for the old call site) */
  const pauseClock = (reason: ClockBlocker = 'modal') => {
    setClockBlocker(reason, true)
  }

  /** Recover the clock (logout corresponds to blocking) */
  const resumeClock = (reason: ClockBlocker = 'modal') => {
    setClockBlocker(reason, false)
  }

  /** Set speed multiplier */
  const setSpeed = (speed: number) => {
    gameSpeed.value = speed
  }

  /** Loop switching speed 1→2→3→1 */
  const cycleSpeed = () => {
    gameSpeed.value = gameSpeed.value >= 3 ? 1 : gameSpeed.value + 1
  }

  /** Switch manual pause/resume */
  const togglePause = () => {
    manualPaused.value = !manualPaused.value
  }

  return {
    gameSpeed,
    isPaused,
    manualPaused,
    blockers,startClock,
    stopClock,
    pauseClock,
    resumeClock,
    setClockBlocker,
    setSpeed,
    cycleSpeed,
    togglePause
  }
}

// === Page visibility processing (pause the clock when switching tabs to prevent background accumulated time from jumping) ===
document.addEventListener('visibilitychange', () => {
  setClockBlocker('hidden', document.hidden)
})