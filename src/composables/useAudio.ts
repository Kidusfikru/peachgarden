import { ref } from 'vue'
import type { Season, Weather, TimePeriod } from '@/types'
import type * as ToneNs from 'tone'
import { useGameStore } from '@/stores/useGameStore'
import { getTimePeriod } from '@/data/timeConstants'

// ====== Tone.js lazy loading (avoid creating AudioContext during module initialization) ======

type ToneModule = typeof ToneNs
let T: ToneModule | null = null

/** Dynamically load Tone.js and start AudioContext (the first call needs to be in user gesture) */
const loadTone = async (): Promise<ToneModule> => {
  if (!T) {
    T = await import('tone')
  }
  await T.start()
  return T
}

// ====== Volume setting ======

const sfxEnabled = ref(true)
const bgmEnabled = ref(true)
const sfxVolume = 0.3
const bgmVolume = 0.15

/** linear volume → decibel */
const toDb = (v: number): number => (v <= 0 ? -Infinity : 20 * Math.log10(v))

// ====== Sound Effects (SFX) ======

type WaveType = 'sine' | 'square' | 'triangle' | 'sawtooth'

/** Play simple synthesized sound effects (one-time Synth, automatically destroyed after playing) */
const playSfx = (freq: number, duration = 0.1, type: WaveType = 'square', vol = sfxVolume) => {
  if (!sfxEnabled.value || !T || document.hidden) return
  try {
    const synth = new T.Synth({
      oscillator: { type },
      envelope: {
        attack: 0.005,
        decay: duration * 0.6,
        sustain: 0,
        release: duration * 0.3
      },
      volume: toDb(vol)
    }).toDestination()
    synth.triggerAttackRelease(freq, duration)
    setTimeout(() => safeDispose(synth), (duration + 0.5) * 1000)
  } catch {
    /* AudioContext not ready */
  }
}

// ====== Game sound effects ======

/** Button click (crisp and short blip) */
export const sfxClick = () => {
  playSfx(1200, 0.025, 'square', 0.12)
  setTimeout(() => playSfx(800, 0.02, 'square', 0.08), 20)
}

/** Watering (droplet falling + diffusion) */
export const sfxWater = () => {
  playSfx(500, 0.06, 'sine', 0.2)
  setTimeout(() => playSfx(350, 0.08, 'triangle', 0.18), 50)
  setTimeout(() => playSfx(250, 0.1, 'sine', 0.12), 100)
}

/**Planting (gentle into the soil twice) */
export const sfxPlant = () => {
  playSfx(400, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(600, 0.05, 'triangle', 0.18), 40)
  setTimeout(() => playSfx(500, 0.03, 'sine', 0.12), 80)
}

/** Harvest (happy triplet ascending) */
export const sfxHarvest = () => {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.07, 'square', 0.22), i * 55))
  setTimeout(() => playSfx(784, 0.12, 'square', 0.15), 220)
}

/** Reclamation (dull hoe attack + broken soil) */
export const sfxDig = () => {
  playSfx(120, 0.06, 'sawtooth', 0.25)
  setTimeout(() => playSfx(200, 0.04, 'square', 0.18), 40)
  setTimeout(() => playSfx(350, 0.03, 'triangle', 0.1), 70)
}

/** Purchase (crisp two-tone confirmation) */
export const sfxBuy = () => {
  playSfx(660, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(880, 0.06, 'triangle', 0.22), 40)
  setTimeout(() => playSfx(880, 0.03, 'square', 0.1), 90)
}

/** Sell/obtain copper coins (classic copper coin bounce sound) */
export const sfxCoin = () => {
  playSfx(988, 0.04, 'square', 0.22)
  setTimeout(() => playSfx(1319, 0.08, 'square', 0.2), 35)
}

/** Upgrade (gorgeous upward fanfare) */
export const sfxLevelUp = () => {
  if (!sfxEnabled.value) return;[523, 659, 784, 880].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'square', 0.25), i * 80))
  setTimeout(() => playSfx(1047, 0.3, 'square', 0.22), 350)
  setTimeout(() => playSfx(1047, 0.15, 'triangle', 0.12), 500)
}

/** Combat attack (high-frequency downswipe + impact, 8-bit impact) */
export const sfxAttack = () => {
  playSfx(800, 0.04, 'sawtooth', 0.3)
  setTimeout(() => playSfx(400, 0.05, 'square', 0.25), 30)
  setTimeout(() => playSfx(150, 0.08, 'sawtooth', 0.2), 60)
}

/** Injury (rapid high and low buzzing, classic NES damage sound) */
export const sfxHurt = () => {
  playSfx(300, 0.04, 'square', 0.25)
  setTimeout(() => playSfx(150, 0.04, 'square', 0.2), 40)
  setTimeout(() => playSfx(300, 0.04, 'square', 0.2), 80)
  setTimeout(() => playSfx(120, 0.06, 'square', 0.15), 120)
}

/** Encountering monsters (urgent upward movement, danger warning) */
export const sfxEncounter = () => {
  ;[200, 300, 400, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.25), i * 50))
}

/** Defense block (short metallic sound) */
export const sfxDefend = () => {
  playSfx(600, 0.03, 'triangle', 0.25)
  setTimeout(() => playSfx(800, 0.05, 'triangle', 0.2), 30)
}

/** Escape (rapidly slide down) */
export const sfxFlee = () => {
  ;[500, 400, 300, 200].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'triangle', 0.2), i * 40))
}

/** Defeat the monster (short victory sound, ending in upward direction) */
export const sfxVictory = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'square', 0.25), i * 70))
}

/** Fishing line (tense ratchet sound, repeated pulling) */
export const sfxReel = () => {
  playSfx(700, 0.03, 'triangle', 0.18)
  setTimeout(() => playSfx(600, 0.03, 'triangle', 0.15), 35)
  setTimeout(() => playSfx(750, 0.03, 'triangle', 0.18), 70)
  setTimeout(() => playSfx(650, 0.03, 'triangle', 0.12), 105)
}

/** Caught a fish (jolly bounce up jingle) */
export const sfxFishCatch = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.22), i * 55))
  setTimeout(() => playSfx(1047, 0.1, 'square', 0.15), 280)
}

/** Broken line (sudden drop + muffled sound) */
export const sfxLineBroken = () => {
  playSfx(500, 0.04, 'sawtooth', 0.25)
  setTimeout(() => playSfx(300, 0.05, 'sawtooth', 0.2), 35)
  setTimeout(() => playSfx(120, 0.1, 'square', 0.15), 70)
}

/** Mining (sharp knock + gravel rebound) */
export const sfxMine = () => {
  playSfx(180, 0.04, 'sawtooth', 0.25)
  setTimeout(() => playSfx(400, 0.03, 'square', 0.18), 35)
  setTimeout(() => playSfx(300, 0.03, 'triangle', 0.12), 65)
}

/** Rest/sleep (soft descending lullaby) */
export const sfxSleep = () => {
  ;[523, 440, 392, 330, 262].forEach((f, i) => setTimeout(() => playSfx(f, 0.18, 'sine', 0.12), i * 130))
}

/** Error/Failure (short double buzz) */
export const sfxError = () => {
  playSfx(220, 0.06, 'square', 0.2)
  setTimeout(() => playSfx(180, 0.08, 'square', 0.18), 70)
}

/** Collection (quickly dial tones) */
export const sfxForage = () => {
  playSfx(500, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(660, 0.05, 'triangle', 0.18), 35)
  setTimeout(() => playSfx(550, 0.03, 'sine', 0.1), 75)
}

// ====== Mini-game exclusive sound effects ======

/** Mini-game starts (passionate upward fanfare, let’s go!) */
export const sfxGameStart = () => {;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'square', 0.22), i * 70))
  setTimeout(() => playSfx(1047, 0.2, 'square', 0.2), 240)
  setTimeout(() => playSfx(1047, 0.1, 'triangle', 0.1), 380)
}

/** Countdown tick (once per second, crisp and short) */
export const sfxCountdownTick = () => {
  playSfx(600, 0.04, 'triangle', 0.15)
}

/** The last 3 seconds of the countdown (more urgent, double tone) */
export const sfxCountdownFinal = () => {
  playSfx(800, 0.05, 'square', 0.2)
  setTimeout(() => playSfx(1000, 0.04, 'square', 0.18), 50)
}

/** Mini game operation button (textured feedback sound) */
export const sfxGameAction = () => {
  playSfx(500, 0.03, 'square', 0.18)
  setTimeout(() => playSfx(700, 0.025, 'triangle', 0.14), 30)
}

/** Receive rewards (copper coins + short celebration) */
export const sfxRewardClaim = () => {
  playSfx(880, 0.06, 'square', 0.22)
  setTimeout(() => playSfx(1047, 0.06, 'square', 0.2), 60)
  setTimeout(() => playSfx(1319, 0.1, 'square', 0.22), 120)
  setTimeout(() => playSfx(1319, 0.06, 'triangle', 0.12), 220)
}

// ====== Mini game result sound effects ======

/** Perfect operation (upward four-note celebration) */
export const sfxMiniPerfect = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.22), i * 60))
}

/** Nice operation (upward double tone) */
export const sfxMiniGood = () => {
  playSfx(523, 0.05, 'triangle', 0.18)
  setTimeout(() => playSfx(659, 0.05, 'triangle', 0.16), 50)
}

/** Poor operation (low tone) */
export const sfxMiniPoor = () => {
  playSfx(196, 0.08, 'triangle', 0.15)
}

/** Failure/error (double tone downlink) */
export const sfxMiniFail = () => {
  playSfx(330, 0.07, 'square', 0.2)
  setTimeout(() => playSfx(262, 0.07, 'square', 0.18), 70)
}

/** 1st place celebration (gorgeous five-tone fanfare) */
export const sfxRankFirst = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'square', 0.22), i * 80))
  setTimeout(() => playSfx(1047, 0.3, 'square', 0.2), 320)
  setTimeout(() => playSfx(1047, 0.15, 'triangle', 0.1), 520)
}

/** No. 2 (three ascending notes) */
export const sfxRankSecond = () => {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.07, 'triangle', 0.18), i * 70))
}

/** No. 3 (ascending double tone, soft) */
export const sfxRankThird = () => {
  playSfx(523, 0.06, 'triangle', 0.15)
  setTimeout(() => playSfx(659, 0.06, 'triangle', 0.13), 60)
}

/** Unranked (slowly descending three tones) */
export const sfxRankLose = () => {
  ;[330, 294, 262].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'sine', 0.12), i * 100))
}

// ====== Anti-overlap quick operation sound effects ======

let lastLightActionTime = 0
const LIGHT_ACTION_INTERVAL = 80

/** Quick operation sound effect (with 80ms throttling, suitable for quick clicks such as dragon boat paddling) */
export const sfxGameActionLight = () => {
  const now = Date.now()
  if (now - lastLightActionTime < LIGHT_ACTION_INTERVAL) return
  lastLightActionTime = now
  playSfx(700, 0.015, 'square', 0.1)
}

// ====== Game exclusive sound effects ======

// --- Fishing Contest ---

/** Urgent warning when fish is hooked */
export const sfxFishBite = () => {
  playSfx(880, 0.02, 'square', 0.2)
  setTimeout(() => playSfx(1175, 0.025, 'square', 0.2), 25)
}

/** Throwing rod (downward sweep) */
export const sfxCastLine = () => {
  playSfx(600, 0.04, 'triangle', 0.15)
  setTimeout(() => playSfx(400, 0.04, 'triangle', 0.12), 40)setTimeout(() => playSfx(250, 0.05, 'triangle', 0.1), 80)
}

// --- Dragon Boat Race ---

/** Paddle (low, lightweight, built-in throttling) */
let lastPaddleTime = 0
export const sfxPaddle = () => {
  const now = Date.now()
  if (now - lastPaddleTime < 100) return
  lastPaddleTime = now
  playSfx(150, 0.02, 'sine', 0.12)
}

/** Crossing the finish line (three tones going up) */
export const sfxRaceFinish = () => {
  ;[392, 523, 659].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.18), i * 50))
}

// --- Guess lantern riddles ---

/** Lantern lights up / Correct answer (upward ding dong) */
export const sfxRiddleReveal = () => {
  playSfx(659, 0.04, 'sine', 0.16)
  setTimeout(() => playSfx(880, 0.05, 'sine', 0.14), 45)
}

/** Wrong answer (low buzzing sound) */
export const sfxRiddleWrong = () => {
  playSfx(180, 0.1, 'square', 0.15)
}

// --- Tea Fighting Conference ---

/** Water injection sound (descending portamento) */
export const sfxTeaPour = () => {
  playSfx(400, 0.05, 'sine', 0.12)
  setTimeout(() => playSfx(300, 0.04, 'sine', 0.1), 50)
  setTimeout(() => playSfx(220, 0.05, 'sine', 0.08), 90)
}

/** Perfect step ringtone */
export const sfxTeaBell = () => {
  playSfx(880, 0.08, 'sine', 0.15)
  setTimeout(() => playSfx(1320, 0.06, 'sine', 0.13), 60)
}

// --- Agricultural Exhibition ---

/** Select items (quick dial tone) */
export const sfxItemSelect = () => {
  playSfx(660, 0.03, 'triangle', 0.15)
  setTimeout(() => playSfx(880, 0.025, 'triangle', 0.13), 30)
}

/** Jury drum sound (4-note rolling) */
export const sfxJudging = () => {
  ;[262, 330, 392, 523].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'square', 0.18), i * 50))
}

// --- throw pot ---

/** Arrow flight (upward sweep) */
export const sfxArrowFly = () => {
  playSfx(200, 0.04, 'triangle', 0.12)
  setTimeout(() => playSfx(350, 0.04, 'triangle', 0.12), 40)
  setTimeout(() => playSfx(500, 0.05, 'triangle', 0.1), 80)
}

/** Hit pot (metal collision sound) */
export const sfxPotClang = () => {
  playSfx(800, 0.02, 'sawtooth', 0.2)
  setTimeout(() => playSfx(1200, 0.03, 'triangle', 0.18), 20)
}

// --- Kite Fair ---

/** Wind direction change (low-frequency whistling) */
export const sfxWindGust = () => {
  playSfx(220, 0.06, 'sine', 0.08)
  setTimeout(() => playSfx(180, 0.08, 'sine', 0.06), 50)
}

/** Pull the string (shortly pluck the string, with built-in throttling) */
let lastKitePullTime = 0
export const sfxKitePull = () => {
  const now = Date.now()
  if (now - lastKitePullTime < 80) return
  lastKitePullTime = now
  playSfx(500, 0.015, 'triangle', 0.1)
}

// --- Make dumplings ---

/** Roll out the dough/put the filling (soft smothering) */
export const sfxDoughStep = () => {
  playSfx(200, 0.025, 'sine', 0.1)
}

/** Complete a dumpling (cheerful double tone) */
export const sfxDumplingDone = () => {
  playSfx(660, 0.03, 'square', 0.18)
  setTimeout(() => playSfx(880, 0.03, 'square', 0.16), 35)
}

// --- Fireworks Show ---

/** Fireworks take off (uplink sweep) */
export const sfxFireworkLaunch = () => {
  playSfx(200, 0.04, 'sawtooth', 0.12)
  setTimeout(() => playSfx(400, 0.04, 'sawtooth', 0.12), 40)
  setTimeout(() => playSfx(700, 0.05, 'sawtooth', 0.1), 80)
}

/** Fireworks burst (explosion mix) */
export const sfxFireworkBoom = () => {
  playSfx(400, 0.04, 'sawtooth', 0.2)
  setTimeout(() => playSfx(600, 0.06, 'square', 0.18), 20)
}

// ====== Casino sound effects ======

/** Single tick of the roulette wheel (one tick per grid, with built-in throttling) */
let lastRouletteTick = 0
export const sfxRouletteTick = () => {
  const now = Date.now()if (now - lastRouletteTick < 40) return
  lastRouletteTick = now
  playSfx(700 + Math.random() * 200, 0.015, 'square', 0.1)
}

/** Roulette wheel rotation (fast tick decrement) */
export const sfxRouletteSpin = () => {
  ;[800, 750, 700, 650, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.02, 'square', 0.12), i * 40))
}

/** Roulette stops (low tone) */
export const sfxRouletteStop = () => {
  playSfx(300, 0.06, 'triangle', 0.2)
  setTimeout(() => playSfx(200, 0.1, 'sine', 0.15), 60)
}

/** Single collision of the dice (one sound for each change, with built-in throttling) */
let lastDiceTick = 0
export const sfxDiceTick = () => {
  const now = Date.now()
  if (now - lastDiceTick < 60) return
  lastDiceTick = now
  playSfx(600 + Math.random() * 400, 0.012, 'square', 0.08)
}

/** The dice shakes (quickly cracks) */
export const sfxDiceRoll = () => {
  ;[900, 700, 1000, 800, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.015, 'square', 0.1), i * 30))
}

/** The dice settles (smothering) */
export const sfxDiceLand = () => {
  playSfx(150, 0.05, 'sawtooth', 0.2)
  setTimeout(() => playSfx(250, 0.04, 'triangle', 0.15), 40)
}

/** Guess the cup for a single move (one sound for each step, with built-in throttling) */
let lastCupTick = 0
export const sfxCupTick = () => {
  const now = Date.now()
  if (now - lastCupTick < 70) return
  lastCupTick = now
  playSfx(350 + Math.random() * 200, 0.018, 'triangle', 0.09)
}

/** Guess the cup and shuffle the cards (quickly move the sound left and right) */
export const sfxCupShuffle = () => {
  ;[400, 500, 350, 550, 400].forEach((f, i) => setTimeout(() => playSfx(f, 0.02, 'triangle', 0.1), i * 50))
}

/** Revealing the cup flip (crisp lid lift) */
export const sfxCupReveal = () => {
  playSfx(600, 0.03, 'triangle', 0.18)
  setTimeout(() => playSfx(900, 0.04, 'triangle', 0.16), 35)
}

/** Collision during cricket battle (one sound per step, with built-in throttling) */
let lastCricketTick = 0
export const sfxCricketTick = () => {
  const now = Date.now()
  if (now - lastCricketTick < 80) return
  lastCricketTick = now
  playSfx(400 + Math.random() * 300, 0.02, 'sawtooth', 0.1)
}

/** Crickets go out to fight (trembling like insects) */
export const sfxCricketChirp = () => {
  ;[1200, 1100, 1200, 1100].forEach((f, i) => setTimeout(() => playSfx(f, 0.015, 'square', 0.08), i * 25))
}

/** Cricket collision (short impact) */
export const sfxCricketClash = () => {
  playSfx(300, 0.03, 'sawtooth', 0.2)
  setTimeout(() => playSfx(500, 0.04, 'square', 0.18), 30)
}

/** Flop (card flip sound) */
export const sfxCardFlip = () => {
  playSfx(800, 0.02, 'triangle', 0.12)
  setTimeout(() => playSfx(600, 0.02, 'triangle', 0.1), 25)
}

/** Bet/raise (chip push) */
export const sfxChipBet = () => {
  playSfx(500, 0.02, 'square', 0.15)
  setTimeout(() => playSfx(700, 0.025, 'triangle', 0.12), 25)
  setTimeout(() => playSfx(600, 0.02, 'square', 0.1), 50)
}

/** Discard (low discard sound) */
export const sfxFoldCards = () => {
  playSfx(300, 0.04, 'sine', 0.12)
  setTimeout(() => playSfx(200, 0.05, 'sine', 0.1), 40)
}

/** Gunshot (shotgun fire, low frequency burst) */
export const sfxGunshot = () => {
  playSfx(100, 0.06, 'sawtooth', 0.3)
  setTimeout(() => playSfx(80, 0.08, 'square', 0.25), 30)
  setTimeout(() => playSfx(150, 0.04, 'sawtooth', 0.15), 70)
}

/** Empty bullet (dry click) */
export const sfxGunEmpty = () => {
  playSfx(400, 0.02, 'triangle', 0.15)setTimeout(() => playSfx(300, 0.02, 'triangle', 0.1), 25)
}

/** Win money from gambling (coin rain, more gorgeous than sfxCoin) */
export const sfxCasinoWin = () => {
  ;[880, 1047, 1319, 1047, 1319].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'square', 0.2), i * 50))
}

/** Losing money in gambling (sighing downward) */
export const sfxCasinoLose = () => {
  ;[330, 294, 262, 220].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'sine', 0.12), i * 80))
}

// ====== Background music (Chinese style pentatonic scale) ======

// Pentatonic scale: Gong (C) Shang (D) Jiao (E) Zheng (G) Yu (A)
// C3=131 D3=147 E3=165 G3=196 A3=220
// C4=262 D4=294 E4=330 G4=392 A4=440
// C5=523 D5=587 E5=659 G5=784 A5=880

// ---- BGM type definition ----

type SeasonBgmType = 'spring' | 'summer' | 'autumn' | 'winter'
type FestivalBgmType = 'festival_spring' | 'festival_summer' | 'festival_autumn' | 'festival_winter'
type MinigameBgmType =
  | 'minigame_fishing'
  | 'minigame_dragon_boat'
  | 'minigame_lantern_riddle'
  | 'minigame_tea_contest'
  | 'minigame_harvest_fair'
  | 'minigame_pot_throwing'
  | 'minigame_kite_flying'
  | 'minigame_dumpling'
  | 'minigame_firework'
  | 'hanhai'
type BgmType = SeasonBgmType | FestivalBgmType | MinigameBgmType | 'battle'

let currentFestivalOverride: FestivalBgmType | MinigameBgmType | null = null

// ---- Spring BGM (Bright Upside, Morning Light Pastoral) ----

const SPRING_MELODY: number[] = [
  330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 440, 523, 440, 392, 330, 0, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 392, 440,
  392, 330, 294, 0, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 294, 0, 440, 392, 330, 392, 440, 523, 440, 392,
  330, 294, 330, 392, 330, 294, 262, 0
]

const SPRING_BASS: number[] = [131, 147, 165, 196, 220, 196, 165, 131, 147, 165, 196, 131, 220, 196, 165, 131]

// ---- Summer BGM (lively high range, cicadas singing in the lotus pond) ----

const SUMMER_MELODY: number[] = [
  523, 587, 659, 587, 523, 440, 523, 587, 659, 784, 659, 587, 523, 440, 392, 0, 440, 523, 587, 523, 440, 392, 440, 523, 587, 523, 440, 392,
  330, 392, 440, 0, 784, 659, 587, 523, 587, 659, 523, 440, 392, 440, 523, 587, 523, 440, 392, 0, 392, 440, 523, 587, 659, 587, 523, 440,
  392, 330, 392, 440, 392, 330, 262, 0
]

const SUMMER_BASS: number[] = [165, 196, 220, 196, 131, 165, 196, 220, 196, 165, 131, 147, 165, 196, 220, 131]

// ---- Autumn BGM (slowly descending, sad fallen leaves) ----

const AUTUMN_MELODY: number[] = [
  440, 392, 330, 294, 262, 294, 330, 262, 440, 392, 330, 294, 262, 294, 262, 0, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392,
  330, 294, 262, 0, 523, 440, 392, 330, 262, 294, 330, 294, 262, 294, 330, 392, 330, 294, 262, 0, 294, 330, 392, 440, 392, 330, 294, 262,
  294, 262, 294, 330, 294, 262, 262, 0
]

const AUTUMN_BASS: number[] = [220, 196, 165, 131, 147, 165, 196, 165, 131, 147, 165, 196, 220, 196, 165, 131]

// ---- Winter BGM (sparse and ethereal, first snow and fire) ----

const WINTER_MELODY: number[] = [
  262, 0, 330, 0, 392, 330, 262, 0, 294, 0, 392, 0, 440, 392, 330, 0, 440, 392, 330, 262, 330, 392, 330, 0, 262, 294, 330, 294, 262, 0, 262,0, 330, 392, 440, 0, 392, 330, 0, 262, 294, 330, 0, 294, 262, 0, 262, 0, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 0, 294, 262, 0,
  262,0
]

const WINTER_BASS: number[] = [131, 0, 165, 0, 196, 0, 131, 0, 147, 0, 165, 131, 196, 165, 131, 0]

// ---- Battle BGM (fast-paced driven, Contra/Pokémon style) ----

const BATTLE_MELODY: number[] = [
  // Phase 1: Rapid upward riff (driving feeling)
  330, 392, 440, 523, 330, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392,
  // Phase 2: Syncopated impact (rests create a sense of impact)
  523, 0, 523, 587, 0, 659, 587, 523, 440, 0, 440, 523, 0, 392, 440, 0,
  // Phase 3: High range tense section
  659, 587, 523, 587, 659, 784, 659, 587, 523, 440, 392, 440, 523, 587, 659, 0,
  // Phase 4: Fall + Swing (loop point)
  784, 659, 587, 523, 392, 440, 523, 659, 587, 523, 440, 392, 330, 392, 440, 0
]

const BATTLE_BASS: number[] = [131, 196, 131, 196, 220, 196, 165, 196, 131, 220, 196, 165, 131, 165, 196, 220]

// ---- Festival BGM ----

const FESTIVAL_SPRING_MELODY: number[] = [523, 587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 523, 0]
const FESTIVAL_SPRING_BASS: number[] = [131, 196, 165, 220]

const FESTIVAL_SUMMER_MELODY: number[] = [440, 523, 587, 523, 440, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 0]
const FESTIVAL_SUMMER_BASS: number[] = [220, 196, 165, 196]

const FESTIVAL_AUTUMN_MELODY: number[] = [392, 440, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 523, 440, 392, 0]
const FESTIVAL_AUTUMN_BASS: number[] = [196, 220, 165, 131]

const FESTIVAL_WINTER_MELODY: number[] = [262, 330, 392, 440, 523, 440, 392, 330, 440, 523, 587, 659, 587, 523, 440, 0]
const FESTIVAL_WINTER_BASS: number[] = [131, 165, 196, 220]

// ---- Mini Game BGM ----

// Fishing competition: ups and downs like flowing water, the feeling of waiting patiently
const MINIGAME_FISHING_MELODY: number[] = [
  196, 220, 262, 294, 262, 220, 196, 0, 220, 262, 294, 330, 294, 262, 220, 196, 262, 294, 330, 392, 330, 294, 262, 0, 294, 330, 392, 440,
  392, 330, 294, 262, 330, 294, 262, 220, 262, 294, 330, 0, 392, 330, 294, 262, 220, 262, 220, 0
]
const MINIGAME_FISHING_BASS: number[] = [131, 196, 165, 220, 131, 196, 165, 131]

// Dragon Boat Festival Dragon Boat Race: fast-paced driving, as fast as drum beats
const MINIGAME_DRAGON_MELODY: number[] = [
  330, 392, 440, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 0, 440, 523, 330, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392,
  440, 523, 440, 0, 523, 587, 659, 587, 523, 440, 523, 587, 659, 784, 659, 587, 523, 0, 523, 0, 440, 523, 587, 523, 440, 392, 440, 523, 330,
  392, 440, 392, 330, 392, 330, 0
]
const MINIGAME_DRAGON_BASS: number[] = [131, 196, 131, 220, 165, 196, 131, 196]

// Guessing lantern riddles on Chinese Valentine’s Day: swaying lamp shadows, mysterious contemplation
const MINIGAME_RIDDLE_MELODY: number[] = [
  330, 0, 440, 392, 330, 0, 294, 262, 330, 392, 440, 0, 392, 330, 0, 262, 294, 330, 0, 440, 392, 330, 294, 0, 262, 330, 392, 0, 440, 523,
  440, 0, 392, 330, 0, 294, 330, 392, 0, 440, 523, 440, 392, 0, 330, 294, 262, 0
]
const MINIGAME_RIDDLE_BASS: number[] = [131, 0, 165, 0, 196, 0, 131, 0]

// Tea Fighting Conference: Elegant and exquisite, with the charm of Guqin
const MINIGAME_TEA_MELODY: number[] = [440, 392, 330, 294, 330, 392, 440, 0, 523, 440, 392, 330, 392, 440, 523, 0, 440, 523, 587, 523, 440, 392, 330, 392, 440, 392, 330, 294,
  262, 294, 330, 0, 330, 392, 440, 523, 440, 392, 330, 294, 330, 294, 262, 294, 330, 392, 330, 0
]
const MINIGAME_TEA_BASS: number[] = [220, 196, 165, 131, 220, 196, 165, 131]

// Harvest Feast·Agricultural Exhibition: Festive and joyful, bumper harvest
const MINIGAME_HARVEST_MELODY: number[] = [
  262, 294, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392, 330, 0, 523, 587, 659, 587, 523, 440, 392, 440, 523, 440, 392, 330,
  294, 330, 392, 0, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392, 440, 523, 440, 392, 330, 0
]
const MINIGAME_HARVEST_BASS: number[] = [131, 165, 196, 220, 131, 196, 165, 131]

// Double Ninth Festival Pot Toss: Calm focus, martial arts spirit
const MINIGAME_POT_MELODY: number[] = [
  294, 330, 392, 330, 294, 0, 262, 294, 330, 392, 440, 392, 330, 0, 294, 330, 392, 440, 523, 440, 392, 330, 294, 330, 392, 330, 294, 262,
  294, 330, 392, 0, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392, 330, 294, 262, 294, 262, 0
]
const MINIGAME_POT_BASS: number[] = [147, 196, 131, 165, 147, 196, 165, 131]

// Autumn Kite Festival: light and lofty, soaring into the sky
const MINIGAME_KITE_MELODY: number[] = [
  392, 440, 523, 587, 523, 440, 392, 0, 440, 523, 587, 659, 587, 523, 440, 0, 523, 587, 659, 784, 659, 587, 523, 440, 392, 440, 523, 440,
  392, 0, 330, 392, 440, 523, 587, 523, 440, 392, 440, 523, 587, 523, 440, 392, 330, 392, 330, 0
]
const MINIGAME_KITE_BASS: number[] = [196, 220, 196, 165, 131, 196, 165, 196]

// Making dumplings during the Winter Solstice: warm and lively, homely rhythm
const MINIGAME_DUMPLING_MELODY: number[] = [
  262, 294, 330, 294, 262, 294, 330, 392, 330, 294, 262, 294, 330, 392, 440, 0, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392,
  330, 294, 262, 0, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 262, 0
]
const MINIGAME_DUMPLING_BASS: number[] = [131, 165, 196, 131, 165, 131, 196, 165]

// Year-end fireworks show: splendid, ups and downs
const MINIGAME_FIREWORK_MELODY: number[] = [
  262, 330, 392, 523, 0, 523, 659, 784, 659, 523, 392, 0, 330, 392, 523, 659, 784, 880, 784, 659, 523, 392, 330, 0, 523, 659, 784, 0, 880,
  784, 659, 523, 392, 523, 659, 784, 659, 523, 392, 330, 262, 330, 392, 523, 659, 784, 880, 0
]
const MINIGAME_FIREWORK_BASS: number[] = [131, 196, 220, 196, 131, 165, 196, 220]

// ---- Hanhai BGM (Western Silk Road, Mysterious Casino) ----

const HANHAI_MELODY: number[] = [
  // Phase 1: Mysterious opening, lingering bass range
  220, 262, 294, 262, 220, 0, 196, 220, 262, 330, 294, 262, 220, 196, 220, 0,
  // Phase 2: Upward exploration, increasing tension
  294, 330, 392, 330, 294, 262, 294, 330, 392, 440, 392, 330, 294, 0, 262, 294,
  // Phase 3: Climax, casino excitement
  440, 392, 330, 392, 440, 523, 440, 392, 330, 294, 262, 294, 330, 392, 440, 0,
  // Phase 4: Fallback loop
  330, 294, 262, 220, 262, 294, 330, 262, 220, 196, 220, 262, 294, 262, 220, 0
]

const HANHAI_BASS: number[] = [131, 165, 196, 165, 131, 196, 220, 196, 131, 165, 196, 220, 165, 131, 196, 165]

// ---- BGM configuration table ----

interface BgmConfig {
  melody: number[]
  bass: number[]
  noteDur: number
  melodyWave: WaveType
  bassWave: WaveType
  /** Bass plays every few beats (default 4) */
  bassInterval?: number}

const BGM_CONFIG: Record<BgmType, BgmConfig> = {
  spring: {
    melody: SPRING_MELODY,
    bass: SPRING_BASS,
    noteDur: 0.38,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  summer: {
    melody: SUMMER_MELODY,
    bass: SUMMER_BASS,
    noteDur: 0.34,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  autumn: {
    melody: AUTUMN_MELODY,
    bass: AUTUMN_BASS,
    noteDur: 0.42,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  winter: {
    melody: WINTER_MELODY,
    bass: WINTER_BASS,
    noteDur: 0.5,
    melodyWave: 'sine',
    bassWave: 'sine'
  },
  festival_spring: {
    melody: FESTIVAL_SPRING_MELODY,
    bass: FESTIVAL_SPRING_BASS,
    noteDur: 0.3,
    melodyWave: 'square',
    bassWave: 'triangle'
  },
  festival_summer: {
    melody: FESTIVAL_SUMMER_MELODY,
    bass: FESTIVAL_SUMMER_BASS,
    noteDur: 0.4,
    melodyWave: 'sine',
    bassWave: 'sine'
  },
  festival_autumn: {
    melody: FESTIVAL_AUTUMN_MELODY,
    bass: FESTIVAL_AUTUMN_BASS,
    noteDur: 0.28,
    melodyWave: 'square',
    bassWave: 'triangle'
  },
  festival_winter: {
    melody: FESTIVAL_WINTER_MELODY,
    bass: FESTIVAL_WINTER_BASS,
    noteDur: 0.35,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  battle: {
    melody: BATTLE_MELODY,
    bass: BATTLE_BASS,
    noteDur: 0.15,
    melodyWave: 'sawtooth',
    bassWave: 'square',
    bassInterval: 2
  },
  // Mini game BGM
  minigame_fishing: {
    melody: MINIGAME_FISHING_MELODY,
    bass: MINIGAME_FISHING_BASS,
    noteDur: 0.4,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  minigame_dragon_boat: {
    melody: MINIGAME_DRAGON_MELODY,
    bass: MINIGAME_DRAGON_BASS,
    noteDur: 0.18,
    melodyWave: 'square',
    bassWave: 'square',
    bassInterval: 2
  },
  minigame_lantern_riddle: {
    melody: MINIGAME_RIDDLE_MELODY,
    bass: MINIGAME_RIDDLE_BASS,
    noteDur: 0.45,
    melodyWave: 'sine',
    bassWave: 'sine'
  },
  minigame_tea_contest: {
    melody: MINIGAME_TEA_MELODY,
    bass: MINIGAME_TEA_BASS,
    noteDur: 0.42,
    melodyWave: 'sine',
    bassWave: 'triangle'
  },
  minigame_harvest_fair: {
    melody: MINIGAME_HARVEST_MELODY,
    bass: MINIGAME_HARVEST_BASS,
    noteDur: 0.3,
    melodyWave: 'square',
    bassWave: 'triangle'
  },
  minigame_pot_throwing: {
    melody: MINIGAME_POT_MELODY,
    bass: MINIGAME_POT_BASS,
    noteDur: 0.3,
    melodyWave: 'sawtooth',
    bassWave: 'square'
  },
  minigame_kite_flying: {
    melody: MINIGAME_KITE_MELODY,
    bass: MINIGAME_KITE_BASS,
    noteDur: 0.28,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  minigame_dumpling: {
    melody: MINIGAME_DUMPLING_MELODY,
    bass: MINIGAME_DUMPLING_BASS,
    noteDur: 0.24,
    melodyWave: 'triangle',
    bassWave: 'triangle'
  },
  minigame_firework: {
    melody: MINIGAME_FIREWORK_MELODY,
    bass: MINIGAME_FIREWORK_BASS,
    noteDur: 0.22,
    melodyWave: 'square',
    bassWave: 'sawtooth',
    bassInterval: 2
  },
  // Hanhai BGM
  hanhai: {
    melody: HANHAI_MELODY,bass: HANHAI_BASS,
    noteDur: 0.32,
    melodyWave: 'sawtooth',
    bassWave: 'square',
    bassInterval: 2
  }
}

// ---- Weather modifier ----

type NoiseType = 'white' | 'pink' | 'brown'

interface WeatherModifier {
  tempoScale: number
  volumeScale: number
  melodyWaveOverride?: WaveType
  noiseType?: NoiseType
  noiseVolume?: number
  noiseFilterFreq?: number
  noiseFilterType?: BiquadFilterType
  detuneAmount?: number
}

const WEATHER_MODIFIERS: Record<Weather, WeatherModifier> = {
  sunny: {
    tempoScale: 1.0,
    volumeScale: 1.0
  },
  rainy: {
    tempoScale: 1.15,
    volumeScale: 0.85,
    noiseType: 'brown',
    noiseVolume: 0.04,
    noiseFilterFreq: 800,
    noiseFilterType: 'lowpass',
    detuneAmount: 5
  },
  stormy: {
    tempoScale: 0.9,
    volumeScale: 0.75,
    melodyWaveOverride: 'sawtooth',
    noiseType: 'brown',
    noiseVolume: 0.06,
    noiseFilterFreq: 600,
    noiseFilterType: 'lowpass',
    detuneAmount: 10
  },
  snowy: {
    tempoScale: 1.25,
    volumeScale: 0.7,
    melodyWaveOverride: 'sine',
    noiseType: 'white',
    noiseVolume: 0.02,
    noiseFilterFreq: 2000,
    noiseFilterType: 'lowpass',
    detuneAmount: 8
  },
  windy: {
    tempoScale: 0.95,
    volumeScale: 0.9,
    noiseType: 'pink',
    noiseVolume: 0.05,
    noiseFilterFreq: 800,
    noiseFilterType: 'bandpass',
    detuneAmount: 3
  },
  green_rain: {
    tempoScale: 1.1,
    volumeScale: 0.8,
    noiseType: 'brown',
    noiseVolume: 0.05,
    noiseFilterFreq: 1000,
    noiseFilterType: 'lowpass',
    detuneAmount: 6
  }
}

// ---- period modifier ----

interface TimeModifier {
  volumeScale: number
  tempoScale:number
  detuneOffset: number
  bassVolumeScale: number
}

const TIME_MODIFIERS: Record<TimePeriod, TimeModifier> = {
  morning: {
    volumeScale: 1.0,
    tempoScale: 1.0,
    detuneOffset: 0,
    bassVolumeScale: 0.8
  },
  afternoon: {
    volumeScale: 0.95,
    tempoScale: 1.05,
    detuneOffset: 0,
    bassVolumeScale: 1.0
  },
  evening: {
    volumeScale: 0.85,
    tempoScale: 1.1,
    detuneOffset: 3,
    bassVolumeScale: 1.1
  },
  night: {
    volumeScale: 0.7,
    tempoScale: 1.2,
    detuneOffset: 6,
    bassVolumeScale: 1.3
  },
  late_night: {
    volumeScale: 0.55,
    tempoScale: 1.3,
    detuneOffset: 10,
    bassVolumeScale: 1.5
  }
}

// ====== BGM playback core ======

let bgmPlaying = false
let bgmLoopId = 0
let melodySynth: any = null
let bassSynth: any = null
letNoise ambient: any = null
let ambientFilter: any = null

/** Safely release the Tone node (silently ignored if disposed) */
const safeDispose = (node: any) => {
  try {
    node?.dispose()
  } catch {
    /* already disposed */
  }
}

/** Stop the ambient sound layer */
const stopAmbient = () => {
  if (ambientNoise?.state === 'started') {
    try {
      ambientNoise.stop()
    } catch {
      /* ignore */
    }
  }
  safeDispose(ambientNoise)
  safeDispose(ambientFilter)
  ambientNoise = null
  ambientFilter = null
}

/** Clean up BGM synthesizer and ambient sounds */
const cleanupBgm = () => {
  safeDispose(melodySynth)
  safeDispose(bassSynth)melodySynth = null
  bassSynth = null
  stopAmbient()
}

/** BGM playback loop */
const playBgmLoop = async (type: BgmType = 'spring', weather: Weather = 'sunny') => {
  if (!bgmEnabled.value || bgmPlaying) return
  bgmPlaying = true
  const myLoopId = ++bgmLoopId

  // Dynamically load Tone.js and start AudioContext (first time in user gesture)
  let Tone: ToneModule
  try {
    Tone = await loadTone()
  } catch {
    bgmPlaying = false
    return
  }

  // Recheck the status after await (it may have been canceled during the wait)
  if (!bgmEnabled.value || !bgmPlaying || myLoopId !== bgmLoopId) {
    if (myLoopId === bgmLoopId) bgmPlaying = false
    return
  }

  const baseConfig = BGM_CONFIG[type]
  const isBattle = type === 'battle'
  const weatherMod = isBattle ? WEATHER_MODIFIERS.sunny : WEATHER_MODIFIERS[weather]

  // Weather modification (fixed during loop)
  const weatherNoteDur = baseConfig.noteDur * weatherMod.tempoScale
  const weatherMelodyWave = weatherMod.melodyWaveOverride ?? baseConfig.melodyWave
  const weatherBassWave = baseConfig.bassWave
  const weatherVolume = bgmVolume * weatherMod.volumeScale
  const weatherDetune = weatherMod.detuneAmount ?? 0

  //Create a melodic synthesizer
  melodySynth = new Tone.Synth({
    oscillator: { type: weatherMelodyWave },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.08, release: 0.1 },
    volume: toDb(weatherVolume)
  }).toDestination()

  //Create a bass synthesizer
  bassSynth = new Tone.Synth({
    oscillator: { type: weatherBassWave },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.2 },
    volume: toDb(weatherVolume * 0.5)
  }).toDestination()

  if (weatherDetune) {
    melodySynth.detune.value = weatherDetune
    bassSynth.detune.value = weatherDetune * 0.5
  }

  // Start the ambient noise layer (Tone.Noise + Filter = rain/wind/snow)
  if (weatherMod.noiseVolume && weatherMod.noiseFilterFreq) {
    try {
      ambientFilter = new Tone.Filter({
        frequency: weatherMod.noiseFilterFreq,
        type: weatherMod.noiseFilterType ?? 'lowpass'
      }).toDestination()

      ambientNoise = new Tone.Noise({
        type: weatherMod.noiseType ?? 'pink',
        volume: toDb(weatherMod.noiseVolume),
        fadeIn: 0.5,
        fadeOut: 0.3
      })
      ambientNoise.connect(ambientFilter)
      ambientNoise.start()
    } catch {
      /* noise setup failed */
    }
  }

  let noteIndex = 0

  const playNext = () => {
    // Check if playback should continue
    if (!bgmEnabled.value || !bgmPlaying || myLoopId !== bgmLoopId) {
      if (myLoopId === bgmLoopId) {
        bgmPlaying = false
        cleanupBgm()
      }
      return
    }

    // Exit if the compositor has been cleaned up
    if (!melodySynth || !bassSynth) return

    //Period modification (dynamic reading note by note, combat skip)
    const gameStore = useGameStore()
    const timeMod = isBattle ? TIME_MODIFIERS.morning : TIME_MODIFIERS[getTimePeriod(gameStore.hour)]

    //Synthesize final parameters
    const noteDur = weatherNoteDur * timeMod.tempoScale
    const volume = weatherVolume * timeMod.volumeScale
    const detune = weatherDetune + timeMod.detuneOffset

    const freq = baseConfig.melody[noteIndex % baseConfig.melody.length]!

    try {
      //Update melody volume and detuningmelodySynth.volume.value = toDb(volume)
      if (detune !== 0) melodySynth.detune.value = detune

      // Melody notes (freq=0 is rest, not played)
      if (freq > 0) {
        melodySynth.triggerAttackRelease(freq, noteDur * 0.8)
      }

      // Bass - beat one root note every bassInterval (default 4)
      const bassInterval = baseConfig.bassInterval ?? 4
      if (noteIndex % bassInterval === 0) {
        const bassIndex = Math.floor(noteIndex / bassInterval) % baseConfig.bass.length
        const bassFreq = baseConfig.bass[bassIndex]!
        if (bassFreq > 0) {
          bassSynth.volume.value = toDb(volume * timeMod.bassVolumeScale * 0.5)
          if (detune !== 0) bassSynth.detune.value = detune * 0.5
          bassSynth.triggerAttackRelease(bassFreq, noteDur * 3)
        }
      }
    } catch {
      /* synth may be disposed */
    }

    noteIndex++
    setTimeout(playNext, noteDur * 1000)
  }

  playNext()
}

/** Stop BGM */
const stopBgm = () => {
  bgmPlaying = false
  cleanupBgm()
}

/** Parse the BGM type and weather that should be played currently */
const resolveCurrentBgm = (): { type: BgmType; weather: Weather } => {
  const gameStore = useGameStore()
  if (currentFestivalOverride) {
    return { type: currentFestivalOverride, weather: 'sunny' }
  }
  return {
    type: gameStore.season as SeasonBgmType,
    weather: gameStore.weather as Weather
  }
}

// ====== Page visibility processing (stop/resume audio when switching tabs) ======

let bgmWasPlayingBeforeHidden = false

document.addEventListener('visibilitychange', () => {
  if (document. hidden) {
    bgmWasPlayingBeforeHidden = bgmPlaying
    if (bgmPlaying) stopBgm()
  } else {
    if (bgmWasPlayingBeforeHidden && bgmEnabled.value) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    }
    bgmWasPlayingBeforeHidden = false
  }
})

// ====== export composable ======

export const useAudio = () => {
  const toggleSfx = () => {
    sfxEnabled.value = !sfxEnabled.value
  }

  const toggleBgm = () => {
    bgmEnabled.value = !bgmEnabled.value
    if (bgmEnabled.value) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    } else {
      stopBgm()
    }
  }

  /** Start BGM (automatically match the current season + weather) */
  const startBgm = () => {
    if (bgmEnabled.value && !bgmPlaying) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    }
  }

  /** Forcibly switch to the BGM of the current season/weather (used after daily settlement) */
  const switchToSeasonalBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    const { type, weather } = resolveCurrentBgm()
    void playBgmLoop(type, weather)
  }

  /** Switch to combat BGM */
  const startBattleBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    void playBgmLoop('battle', 'sunny')
  }

  /** Restore the BGM before the battle (season/holiday) */
  const resumeNormalBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    const { type, weather } = resolveCurrentBgm()
    void playBgmLoop(type, weather)
  }

  /** Start playing holiday BGM */
  const startFestivalBgm = (season: Season) => {
    if (!bgmEnabled.value) returnconst festivalType = `festival_${season}` as FestivalBgmType
    currentFestivalOverride = festivalType
    stopBgm()
    void playBgmLoop(festivalType, 'sunny')
  }

  /** Start playing mini-game exclusive BGM */
  const startMinigameBgm = (festivalType: string) => {
    if (!bgmEnabled.value) return
    const MINIGAME_BGM_MAP: Record<string, MinigameBgmType> = {
      fishing_contest: 'minigame_fishing',
      dragon_boat: 'minigame_dragon_boat',
      lantern_riddle: 'minigame_lantern_riddle',
      tea_contest: 'minigame_tea_contest',
      harvest_fair: 'minigame_harvest_fair',
      pot_throwing: 'minigame_pot_throwing',
      kite_flying: 'minigame_kite_flying',
      dumpling_making: 'minigame_dumpling',
      firework_show: 'minigame_firework'
    }
    const bgmType = MINIGAME_BGM_MAP[festivalType]
    if (!bgmType) return
    currentFestivalOverride = bgmType
    stopBgm()
    void playBgmLoop(bgmType, 'sunny')
  }

  /** End holiday BGM and resume seasonal BGM */
  const endFestivalBgm = () => {
    currentFestivalOverride = null
    if (bgmEnabled.value) {
      switchToSeasonalBgm()
    }
  }

  /** Start playing Hanhai BGM */
  const startHanhaiBgm = () => {
    if (!bgmEnabled.value) return
    currentFestivalOverride = 'hanhai'
    stopBgm()
    void playBgmLoop('hanhai', 'sunny')
  }

  /** End Hanhai BGM and resume seasonal BGM */
  const endHanhaiBgm = () => {
    currentFestivalOverride = null
    if (bgmEnabled.value) {
      switchToSeasonalBgm()
    }
  }

  return {
    sfxEnabled,
    bgmEnabled,
    toggleSfx,
    toggleBgm,
    startBgm,
    stopBgm,
    startBattleBgm,
    resumeNormalBgm,
    switchToSeasonalBgm,
    startFestivalBgm,
    startMinigameBgm,
    endFestivalBgm,
    startHanhaiBgm,
    endHanhaiBgm
  }
}