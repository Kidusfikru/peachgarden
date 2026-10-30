import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { isShopOpen, TAB_TO_LOCATION_GROUP } from '@/data/timeConstants'
import type { LocationGroup } from '@/types'
import { TABS, navigateToPanel } from './useNavigation'

/** Single panel item in TABS */
export type PanelTab = (typeof TABS)[number]

export interface PanelPager {
  /** The previous panel in the same group; null when there are less than 2 detachable panels */
  prevPanel: ComputedRef<PanelTab | null>
  /** The next panel in the same group; null if there are less than 2 panels */
  nextPanel: ComputedRef<PanelTab | null>
  goPrevPanel: () => void
  goNextPanel: () => void
}

/** The location group to which the panel belongs; panels without locations (the value is null or not registered) are collectively classified into the "portable" group, represented by null */
const getPanelGroup = (key: string): LocationGroup | null => TAB_TO_LOCATION_GROUP[key] ?? null

/**
 * Panel page turning: Find the previous/next panel in TABS order in the location group to which the current panel belongs, looping from beginning to end.
 * It only turns inside the same group, so there is no time-consuming movement; the current panel that cannot be entered (not open for business) is skipped, and the current panel is always retained as the starting point.
 */
export const usePanelPager = (current: MaybeRefOrGetter<string>): PanelPager => {
  const gameStore = useGameStore()

  const neighbors = computed((): { prev: PanelTab | null; next: PanelTab | null } => {
    const currentKey = toValue(current)
    const group = getPanelGroup(currentKey)
    // Use hourly hours: the business status only switches on the hour, and does not need to be recalculated frequently with the 200ms tick
    const hour = Math.floor(gameStore.hour)
    const tabs = TABS.filter(
      t => getPanelGroup(t.key) === group && (t.key === currentKey || isShopOpen(t.key, gameStore.day, hour).open)
    )
    const index = tabs.findIndex(t => t.key === currentKey)
    if (index < 0 || tabs.length < 2) return { prev: null, next: null }
    return {
      prev: tabs[(index - 1 + tabs.length) % tabs.length] ?? null,
      next: tabs[(index + 1) % tabs.length] ?? null
    }
  })

  // Neighbors will be recalculated every time the clock moves; the same object in TABS is taken out here, and re-rendering will not be triggered when the reference remains unchanged.
  const prevPanel = computed(() => neighbors.value.prev)
  const nextPanel = computed(() => neighbors.value.next)

  const goPrevPanel = () => {
    if (prevPanel.value) navigateToPanel(prevPanel.value.key)
  }

  const goNextPanel = () => {
    if (nextPanel.value) navigateToPanel(nextPanel.value.key)
  }

  return { prevPanel, nextPanel, goPrevPanel, goNextPanel }
}