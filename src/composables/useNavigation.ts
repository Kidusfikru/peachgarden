import type { Component } from 'vue'
import router from '@/router'
import { useGameStore } from '@/stores/useGameStore'
import { isShopOpen, TAB_TO_LOCATION_GROUP } from '@/data/timeConstants'
import { addLog, showFloat } from './useGameLog'
import { handleEndDay } from './useEndDay'
import { sfxClick, useAudio } from './useAudio'
import { setClockBlocker } from './useGameClock'
import { useTutorialStore } from '@/stores/useTutorialStore'
import {
  Wheat,
  Egg,
  Home,
  Heart,
  Building,
  Users,
  Store,
  TreePine,
  Fish,
  Pickaxe,
  Flame,
  Cog,
  Wrench,
  Package,
  Star,
  BookOpen,
  Wallet,
  ScrollText,
  User,
  FlaskConical,
  Landmark,
  Swords,
  Tent,
  Waves,
  Handshake
} from 'lucide-vue-next'
import { useNpcStore } from '@/stores/useNpcStore'

export type PanelKey =
  | 'farm'
  | 'shop'
  | 'inventory'
  | 'fishing'
  | 'mining'
  | 'village'
  | 'cooking'
  | 'forage'
  | 'upgrade'
  | 'skills'
  | 'workshop'
  | 'achievement'
  | 'animal'
  | 'home'
  | 'wallet'
  | 'quest'
  | 'charinfo'
  | 'breeding'
  | 'museum'
  | 'guild'
  | 'hanhai'
  | 'fishpond'
  | 'cottage'
  | 'trade'

export const TABS: {
  key: PanelKey
  label: string
  icon: Component
  getIcon?: () => Component
}[] = [
  { key: 'farm', label: 'farm', icon: Wheat },
  { key: 'animal', label: 'Pasture', icon: Egg },
  {
    key: 'cottage',
    label: 'hut',
    icon: Home,
    getIcon: () => (useNpcStore().getSpouse() ? Heart : Home)
  },
  { key: 'home', label: 'facilities', icon: Building },
  { key: 'breeding', label: 'breeding', icon: FlaskConical },
  { key: 'fishpond', label: 'fishpond', icon: Waves },
  { key: 'village', label: 'Taoyuan Village', icon: Users },
  { key: 'shop', label: 'Business District', icon: Store },
  { key: 'trade', label: 'Chamber of Commerce', icon: Handshake },
  { key: 'forage', label: 'Bamboo Forest', icon: TreePine },
  { key: 'fishing', label: 'Qingxi', icon: Fish },
  { key: 'mining', label: 'mine', icon: Pickaxe },
  { key: 'cooking', label: 'stove', icon: Flame },
  { key: 'workshop', label: 'processing workshop', icon: Cog },
  { key: 'upgrade', label: 'workshop', icon: Wrench },
  { key: 'charinfo', label: 'role', icon: User },
  { key: 'inventory', label: 'backpack', icon: Package },
  { key: 'skills', label: 'skills', icon: Star },
  { key: 'achievement', label: 'illustrated book', icon: BookOpen },
  { key: 'wallet', label: 'wallet', icon: Wallet },
  { key: 'quest', label: 'Notice Board', icon: ScrollText },
  { key: 'museum', label: 'museum', icon: Landmark },
  { key: 'guild', label: 'guild', icon: Swords },
  { key: 'hanhai', label: 'Hanhai', icon: Tent }
]

/** Navigate to the game panel and check travel times, bedtimes, and store hours */
export const navigateToPanel = (panelKey: PanelKey) => {
  const gameStore = useGameStore()
  const { startBgm } = useAudio()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  // Store business check
  const shopCheck = isShopOpen(panelKey, gameStore.day, gameStore.hour)
  if (!shopCheck.open) {
    showFloat(shopCheck.reason!, 'danger')
    return
  }

  // travel time
  const travelResult = gameStore.travelTo(panelKey)if (travelResult.timeCost > 0) {
    addLog(travelResult.message)
  }
  if (travelResult.passedOut) {
    handleEndDay()
    return
  }

  sfxClick()
  startBgm()
  void router.push({ name: panelKey })
  useTutorialStore().markPanelVisited(panelKey)

  //Pure UI panel (no corresponding location) pauses the clock and releases it when returning to the game panel
  const targetGroup = TAB_TO_LOCATION_GROUP[panelKey]
  setClockBlocker('panel', targetGroup === null || targetGroup === undefined)
}

export const useNavigation = () => {
  return {
    TABS,
    navigateToPanel
  }
}