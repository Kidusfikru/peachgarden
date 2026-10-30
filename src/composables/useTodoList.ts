import { computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useFarmStore } from '@/stores/useFarmStore'
import { useAnimalStore } from '@/stores/useAnimalStore'
import { useProcessingStore } from '@/stores/useProcessingStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { useFishPondStore } from '@/stores/useFishPondStore'
import { useBreedingStore } from '@/stores/useBreedingStore'
import { NPCS, getNpcById } from '@/data/npcs'
import { getProcessingRecipeById, PROCESSING_MACHINES } from '@/data/processing'
import { getStoryQuestById } from '@/data/storyQuests'
import type { PanelKey } from './useNavigation'

/** To-do category */
export type TodoCategory = 'farm' | 'animal' | 'processing' | 'social' | 'quest' | 'craft'

/** Urgency: urgent will be highlighted, info will only prompt */
export type TodoUrgency = 'urgent' | 'normal' | 'info'

export interface TodoItem {
  id: string
  category: TodoCategory
  /** One sentence to describe what to do */
  text: string
  /** Additional instructions (quantity, remaining days, etc.) */
  detail?: string
  urgency: TodoUrgency
  /** The panel that jumps after clicking */
  panel?: PanelKey
}

export const TODO_CATEGORY_NAMES: Record<TodoCategory, string> = {
  farm: 'Farming',
  animal: 'pasture',
  processing: 'processing',
  social: 'favor',
  quest: 'Quest',
  craft: 'workshop'
}

/**
 * To-do list.
 *
 * The daily business in Taoyuan Township is very spread out - the ground needs to be watered, the animals need to be fed, the processed products need to be collected, who has a birthday, and the commission is about to expire.
 * This information was originally scattered in seven or eight panels, and players could only rely on memorization. Here they are summarized into a "what to do today".
 */
export const useTodoList = () => {
  const gameStore = useGameStore()

  const todos = computed((): TodoItem[] => {
    const list: TodoItem[] = []
    const farmStore = useFarmStore()
    const animalStore = useAnimalStore()
    const processingStore = useProcessingStore()
    const npcStore = useNpcStore()
    const questStore = useQuestStore()
    const inventoryStore = useInventoryStore()
    const fishPondStore = useFishPondStore()
    const breedingStore = useBreedingStore()

    // --- Farming ---
    const unwatered = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered).length
    if (unwatered > 0 && !gameStore.isRainy) {
      list.push({
        id: 'farm-water',
        category: 'farm',
        text: 'There are crops that haven't been watered yet',
        detail: `${unwatered} block`,
        urgency: 'urgent',
        panel: 'farm'
      })
    }

    const harvestable = farmStore.plots.filter(p => p.state === 'harvestable').length
    if (harvestable > 0) {
      list.push({
        id: 'farm-harvest',
        category: 'farm',
        text: 'There are crops to harvest',
        detail: `${harvestable} block`,
        urgency: 'normal',
        panel: 'farm'
      })
    }

    const troubled = farmStore.plots.filter(p => p.infested || p.weedy).length
    if (troubled > 0) {
      list.push({
        id: 'farm-pest',
        category: 'farm',
        text: 'There are weeds or insect pests in the fields',
        detail: `${troubled} at`,
        urgency: 'normal',
        panel: 'farm'
      })
    }

    // Reminder before the season change: The season will change before going to bed on the 28th day, and cross-season crops will wither.
    if (gameStore.day === 28) {const planted = farmStore.plots.filter(p => p.state === 'planted' || p.state === 'growing').length
      if (planted > 0) {
        list.push({
          id: 'farm-season',
          category: 'farm',
          text: 'The season will change tomorrow, and crops out of season will wither',
          detail: `${planted} plant is growing`,
          urgency: 'urgent',
          panel: 'farm'
        })
      }
    }

    // --- Ranch ---
    const unfed = animalStore.animals.filter(a => !a.wasFed).length
    if (unfed > 0) {
      list.push({
        id: 'animal-feed',
        category: 'animal',
        text: 'The livestock haven't been fed yet',
        detail: `${unfed} only`,
        urgency: 'urgent',
        panel: 'animal'
      })
    }

    const unpetted = animalStore.animals.filter(a => !a.wasPetted).length
    if (unpetted > 0) {
      list.push({
        id: 'animal-pet',
        category: 'animal',
        text: 'There are still livestock that have not been petted (affecting mood and output)',
        detail: `${unpetted} only`,
        urgency: 'normal',
        panel: 'animal'
      })
    }

    if (fishPondStore.pond.built && !fishPondStore.pond.fedToday) {
      list.push({
        id: 'pond-feed',
        category: 'animal',
        text: 'The fish pond has not been baited yet',
        urgency: 'normal',
        panel: 'fishpond'
      })
    }

    // --- Processing ---
    const readyCount = processingStore.machines.filter(m => m.ready).length
    if (readyCount > 0) {
      list.push({
        id: 'processing-collect',
        category: 'processing',
        text: 'The processing workshop has finished products that can be collected',
        detail: `${readyCount} copies`,
        urgency: 'normal',
        panel: 'workshop'
      })
    }

    const idleCount = processingStore.machines.filter(m => !m.recipeId).length
    if (idleCount > 0) {
      list.push({
        id: 'processing-idle',
        category: 'processing',
        text: 'The processing station has free slots and is not working',
        detail: `${idleCount} items`,
        urgency: 'info',
        panel: 'workshop'
      })
    }

    // The processed products will be collected tomorrow, please say hello in advance.
    const tomorrowReady = processingStore.machines.filter(m => m.recipeId && !m.ready && m.totalDays - m.daysProcessed === 1)
    if (tomorrowReady.length > 0) {
      const names = [...new Set(tomorrowReady.map(m => getProcessingRecipeById(m.recipeId!)?.name ?? ''))].filter(Boolean)
      list.push({
        id: 'processing-tomorrow',
        category: 'processing',
        text: 'Can be collected tomorrow:' + names.slice(0, 3).join(', '),
        detail: `${tomorrowReady.length} copies`,
        urgency: 'info',
        panel: 'workshop'
      })
    }

    //breeding station
    const breedingReady = breedingStore.stations.filter(s => s.ready).length
    if (breedingReady > 0) {
      list.push({
        id: 'breeding-ready',
        category: 'processing',
        text: 'The results from the breeding platform can be taken out',
        detail: `${breedingReady} items`,
        urgency: 'normal',
        panel: 'breeding'
      })
    }

    // --- Workshop ---
    if (inventoryStore.pendingUpgrade) {
      const remain = inventoryStore.pendingUpgrade.daysRemaining
      list.push({
        id: 'craft-tool',
        category: 'craft',
        text: remain <= 0 ? 'The upgraded tools can be retrieved' : 'The tools are being upgraded',detail: remain <= 0 ? 'Completed' : `${remain} days to go`,
        urgency: remain <= 0 ? 'normal' : 'info',
        panel: 'upgrade'
      })
    }

    // --- Favor ---
    //Village whose birthday is today
    for (const npc of NPCS) {
      if (!npcStore.isBirthday(npc.id)) continue
      const state = npcStore.getNpcState(npc.id)
      list.push({
        id: `birthday-${npc.id}`,
        category: 'social',
        text: `Today is the birthday of ${npcStore.getNpcDisplayName(npc.id)}`,
        detail: state?.birthdayGiftGiven ? 'Birthday gift has been given' : 'An additional birthday gift ×4',
        urgency: state?.birthdayGiftGiven ? 'info' : 'urgent',
        panel: 'village'
      })
    }

    // For birthdays within the next three days, prepare gifts in advance
    const upcoming = getUpcomingBirthdays(gameStore.season, gameStore.day, 3)
    for (const b of upcoming) {
      list.push({
        id: `birthday-soon-${b.npcId}`,
        category: 'social',
        text: `${npcStore.getNpcDisplayName(b.npcId)}’s birthday is coming`,
        detail: `${b.daysLeft} days left`,
        urgency: 'info',
        panel: 'village'
      })
    }

    // Villagers who haven’t spoken yet today (only prompt those present to avoid screen swiping)
    const notTalked = npcStore.npcStates.filter(s => !s.talkedToday).length
    if (notTalked > 0) {
      list.push({
        id: 'social-talk',
        category: 'social',
        text: 'There are still villagers who haven't said hello today',
        detail: `${notTalked} people`,
        urgency: 'info',
        panel: 'village'
      })
    }

    // Spouse and children
    const spouse = npcStore.getSpouse()
    if (spouse && !spouse.talkedToday) {
      const name = getNpcById(spouse.npcId) ? npcStore.getNpcDisplayName(spouse.npcId) : 'Companion'
      list.push({
        id: 'social-spouse',
        category: 'social',
        text: `I haven’t spoken to ${name} yet`,
        urgency: 'normal',
        panel: 'cottage'
      })
    }
    const childrenToVisit = npcStore.children.filter(c => !c.interactedToday).length
    if (childrenToVisit > 0) {
      list.push({
        id: 'social-child',
        category: 'social',
        text: 'The child is still waiting for you to accompany you for a while',
        detail: `${childrenToVisit} items`,
        urgency: 'normal',
        panel: 'cottage'
      })
    }

    // --- Task ---
    for (const quest of questStore.activeQuests) {
      const done = Math.max(quest.collectedQuantity, inventoryStore.getItemCount(quest.targetItemId)) >= quest.targetQuantity
      list.push({
        id: `quest-${quest.id}`,
        category: 'quest',
        text: done ? `Can deliver: Delegation of ${npcStore.getNpcDisplayName(quest.npcId)}` : `Delegation in progress: ${quest.targetItemName}`,
        detail: done
          ? `${quest.daysRemaining} days left to expire`
          : `${quest.collectedQuantity}/${quest.targetQuantity} · ${quest.daysRemaining} days remaining`,
        urgency: done ? 'normal' : quest.daysRemaining <= 1 ? 'urgent' : 'info',
        panel: 'quest'
      })
    }

    if (questStore.mainQuest?.accepted && questStore.canSubmitMainQuest()) {
      const def = getStoryQuestById(questStore.mainQuest.questId)
      list.push({
        id: 'quest-main',
        category: 'quest',
        text: `The main line can be delivered: ${def?.title ?? ''}`,
        urgency: 'normal',
        panel: 'quest'})
    } else if (questStore.mainQuest && !questStore.mainQuest.accepted) {
      const def = getStoryQuestById(questStore.mainQuest.questId)
      list.push({
        id: 'quest-main-accept',
        category: 'quest',
        text: `There is a new main line available: ${def?.title ?? ''}`,
        urgency: 'info',
        panel: 'quest'
      })
    }

    return list
  })

  /** The number of entries that need to be processed immediately, used for navigation markers */
  const urgentCount = computed(() => todos.value.filter(t => t.urgency === 'urgent').length)

  /** Number of all to-do items (excluding pure prompts) */
  const actionableCount = computed(() => todos.value.filter(t => t.urgency !== 'info').length)

  /** Group by category */
  const groupedTodos = computed(() => {
    const groups = new Map<TodoCategory, TodoItem[]>()
    for (const todo of todos.value) {
      const list = groups.get(todo.category) ?? []
      list.push(todo)
      groups.set(todo.category, list)
    }
    return [...groups.entries()].map(([category, items]) => ({
      category,
      name: TODO_CATEGORY_NAMES[category],
      items
    }))
  })

  return { todos, groupedTodos, urgentCount, actionableCount }
}

/** Find the villagers whose birthdays are in the next N days */
const getUpcomingBirthdays = (season: string, day: number, withinDays: number): { npcId: string; daysLeft: number }[] => {
  const result: { npcId: string; daysLeft: number }[] = []
  for (const npc of NPCS) {
    if (!npc.birthday || npc.birthday.season !== season) continue
    const daysLeft = npc.birthday.day - day
    if (daysLeft > 0 && daysLeft <= withinDays) {
      result.push({ npcId: npc.id, daysLeft })
    }
  }
  return result.sort((a, b) => a.daysLeft - b.daysLeft)
}

/** Machine type name (for interface display) */
export const getMachineName = (type: string): string => {
  return PROCESSING_MACHINES.find(m => m.id === type)?.name ?? type
}