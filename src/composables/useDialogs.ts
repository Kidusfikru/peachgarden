import { ref } from 'vue'
import type { HeartEventDef, SkillType, SkillPerk5, SkillPerk10 } from '@/types'
import type { DiscoveryStep } from '@/types/hiddenNpc'
import type { SeasonEventDef } from '@/data/events'
import type { MorningChoiceEvent } from '@/data/farmEvents'
import { WEDDING_EVENT } from '@/data/heartEvents'
import { HIDDEN_NPCS } from '@/data/hiddenNpcs'
import { useGameStore } from '@/stores/useGameStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { addLog, showFloat, _registerPerkChecker } from './useGameLog'
import { useAudio } from './useAudio'

//Module level singleton state
const currentEvent = ref<SeasonEventDef | null>(null)
const pendingHeartEvent = ref<HeartEventDef | null>(null)
type FestivalType =
  | 'fishing_contest'
  | 'harvest_fair'
  | 'dragon_boat'
  | 'lantern_riddle'
  | 'pot_throwing'
  | 'dumpling_making'
  | 'firework_show'
  | 'tea_contest'
  | 'kite_flying'
const currentFestival = ref<FestivalType | null>(null)
const pendingPerk = ref<{ skillType: SkillType; level: 5 | 10 } | null>(null)

/** Pet adoption pop-up window */
const pendingPetAdoption = ref(false)

/** Check if there is a skill that reaches the talent threshold but has not yet selected a talent */
export const checkAllPerks = () => {
  const skillStore = useSkillStore()
  for (const skill of skillStore.skills) {
    if (skill.level >= 5 && !skill.perk5) {
      pendingPerk.value = { skillType: skill.type, level: 5 }
      return
    }
    if (skill.level >= 10 && !skill.perk10) {
      pendingPerk.value = { skillType: skill.type, level: 10 }
      return
    }
  }
}

// Register checkAllPerks with useGameLog so that addLog can trigger talent checks
_registerPerkChecker(checkAllPerks)

/** Process talent selection dialog box */
export const handlePerkSelect = (perk: SkillPerk5 | SkillPerk10) => {
  if (!pendingPerk.value) return
  const skillStore = useSkillStore()
  const { skillType, level } = pendingPerk.value
  if (level === 5) {
    skillStore.setPerk5(skillType, perk as SkillPerk5)
  } else {
    skillStore.setPerk10(skillType, perk as SkillPerk10)
  }
  addLog('Acquired new specialization!')
  pendingPerk.value = null
}

/** Determine whether it is a hidden NPC */
const isHiddenNpcId = (npcId: string): boolean => HIDDEN_NPCS.some(n => n.id === npcId)

/** Trigger heart event (called by NpcView / HiddenNpcModal) */
export const triggerHeartEvent = (event: HeartEventDef) => {
  if (isHiddenNpcId(event.npcId)) {
    const hiddenNpcStore = useHiddenNpcStore()
    hiddenNpcStore.markHeartEventTriggered(event.npcId, event.id)
  } else {
    const npcStore = useNpcStore()
    npcStore.markHeartEventTriggered(event.npcId, event.id)
  }
  pendingHeartEvent.value = event
}

/** Close the heart event dialog and apply the friendliness change */export const closeHeartEvent = (changes: { npcId: string; amount: number }[]) => {
  for (const change of changes) {
    if (isHiddenNpcId(change.npcId)) {
      const hiddenNpcStore = useHiddenNpcStore()
      hiddenNpcStore.addAffinity(change.npcId, change.amount)
    } else {const npcStore = useNpcStore()
      npcStore.adjustFriendship(change.npcId, change.amount)
    }
    if (change.amount > 0) {
      addLog(`Favorability+${change.amount}`)
    } else if (change.amount < 0) {
      addLog(`Favorability${change.amount}`)
    }
  }
  pendingHeartEvent.value = null
}

/** Trigger wedding event (called by useEndDay) */
export const triggerWeddingEvent = (npcId: string) => {
  const event: HeartEventDef = { ...WEDDING_EVENT, npcId }
  pendingHeartEvent.value = event
}

/** Display seasonal event dialog box */
export const showEvent = (event: SeasonEventDef) => {
  currentEvent.value = event
}

/** Close the seasonal event dialog box */
export const closeEvent = () => {
  currentEvent.value = null
  const { endFestivalBgm } = useAudio()
  endFestivalBgm()
}

/** Display the festival celebration interface and play mini-game exclusive BGM */
export const showFestival = (type: FestivalType) => {
  currentFestival.value = type
  const { startMinigameBgm } = useAudio()
  startMinigameBgm(type)
}

/** Close the holiday celebration and distribute prizes */
export const closeFestival = (prize: number) => {
  if (prize > 0) {
    const playerStore = usePlayerStore()
    playerStore.earnMoney(prize)
    showFloat(`+${prize}文`, 'accent')
    addLog(`Festival bonus: ${prize}text!`)
  }
  currentFestival.value = null
  // If there is still event narrative displayed, switch to the seasonal BGM; otherwise, directly restore the seasonal BGM
  if (currentEvent.value) {
    const { startFestivalBgm } = useAudio()
    const gameStore = useGameStore()
    startFestivalBgm(gameStore.season)
  } else {
    const { endFestivalBgm } = useAudio()
    endFestivalBgm()
  }
}

/** Trigger pet adoption pop-up window */
export const triggerPetAdoption = () => {
  pendingPetAdoption.value = true
}

/** Close the pet adoption pop-up window */
export const closePetAdoption = () => {
  pendingPetAdoption.value = false
}

/** Children's proposal pop-up window */
const childProposalVisible = ref(false)

/** Display child proposal pop-up window */
export const showChildProposal = () => {
  childProposalVisible.value = true
}

/** Close the child proposal pop-up window */
export const closeChildProposal = () => {
  childProposalVisible.value = false
}

/** Morning option event pop-up window */
const pendingFarmEvent = ref<MorningChoiceEvent | null>(null)

/** Display morning option events */
export const showFarmEvent = (event: MorningChoiceEvent) => {
  pendingFarmEvent.value = event
}

/** Close morning option event */
export const closeFarmEvent = () => {
  pendingFarmEvent.value = null
}

/** Fairy discovery scene pop-up window queue */const pendingDiscoveryScenes = ref<{ npcId: string; step: DiscoveryStep }[]>([])

/** Currently displayed discovery scene (queue head) */
const pendingDiscoveryScene = ref<{
  npcId: string
  step: DiscoveryStep
} | null>(null)

/** Add the fairy discovery scene to the queue */
export const showDiscoveryScene = (npcId: string, step: DiscoveryStep) => {
  pendingDiscoveryScenes.value.push({ npcId, step })
  if (!pendingDiscoveryScene.value) {
    pendingDiscoveryScene.value = pendingDiscoveryScenes.value.shift() ?? null
  }
}

/** Close the current fairy discovery scene and display the next one in the queue */
export const closeDiscoveryScene = () => {
  pendingDiscoveryScene.value = pendingDiscoveryScenes.value.shift() ?? null
}

export const useDialogs = () => {
  return {
    currentEvent,
    pendingHeartEvent,
    currentFestival,
    pendingPerk,
    pendingPetAdoption,
    childProposalVisible,
    checkAllPerks,handlePerkSelect,
    triggerHeartEvent,
    triggerWeddingEvent,
    closeHeartEvent,
    showEvent,
    closeEvent,
    showFestival,
    closeFestival,
    triggerPetAdoption,
    closePetAdoption,
    showChildProposal,
    closeChildProposal,
    pendingFarmEvent,
    showFarmEvent,
    closeFarmEvent,
    pendingDiscoveryScene,
    showDiscoveryScene,
    closeDiscoveryScene
  }
}