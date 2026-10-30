import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { useGameStore } from '@/stores/useGameStore'
import { addLog, showFloat } from './useGameLog'
import { getHiddenNpcById } from '@/data/hiddenNpcs'
import type { Quality } from '@/types'

/** Execute the offering */
export const doOffering = (npcId: string, itemId: string, quality: Quality): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.performOffering(npcId, itemId, quality)
  if (result.success) {
    const gameStore = useGameStore()
    gameStore.advanceTime(0.5)
    if (result.affinityChange > 0) {
      showFloat(`+${result.affinityChange}fate`, 'accent')
    } else if (result.affinityChange < 0) {
      showFloat(`${result.affinityChange}fate`, 'danger')
    }
    addLog(result.message)
  } else {
    addLog(result.message)
  }
  return result.success
}

/** Perform unique interactions */
export const doSpecialInteraction = (npcId: string): boolean => {
  const def = getHiddenNpcById(npcId)
  if (!def) return false
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.performSpecialInteraction(npcId)
  if (result.success) {
    const gameStore = useGameStore()
    gameStore.advanceTime(1)
    showFloat(`+${result.affinityChange}fate`, 'accent')
    addLog(result.message)
  } else {
    addLog(result.message)
  }
  return result.success
}

/** Initiate a quest for fate */
export const doCourting = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.startCourting(npcId)
  if (result.success) {
    showFloat('Success in seeking fate', 'accent')
  }
  addLog(result.message)
  return result.success
}

/** Initiate a relationship */
export const doBond = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.formBond(npcId)
  if (result.success) {
    showFloat('The relationship is successful!', 'accent')
  }
  addLog(result.message)
  return result.success
}

/** Release fate */
export const doDissolve = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.dissolveBond(npcId)
  addLog(result.message)
  return result.success
}

/** Get the offering preference tag */
export const getOfferingPreference = (npcId: string, itemId: string): 'resonant' | 'pleased' | 'repelled' | 'neutral' => {
  const def = getHiddenNpcById(npcId)
  if (!def) return 'neutral'
  if (def.resonantOfferings.includes(itemId)) return 'resonant'
  if (def.pleasedOfferings.includes(itemId)) return 'pleased'
  if (def.repelledOfferings.includes(itemId)) return 'repelled'
  return 'neutral'
}

export const OFFERING_PREF_LABELS: Record<string, string> = {
  resonant: 'lingxi',
  pleased: 'agreeable',
  repelled: 'repelled',
  neutral: ''
}

export const OFFERING_PREF_CLASS: Record<string, string> = {
  resonant: 'text-accent',
  pleased: 'text-success',
  repelled: 'text-danger',
  neutral: ''
}

export const OFFERING_PREF_ORDER: Record<string, number> = {
  resonant: 0,
  pleased: 1,
  neutral: 2,
  repelled: 3
}
