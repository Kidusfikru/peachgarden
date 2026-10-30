import type { Weather, Season } from '@/types'
import type { MonsterDef } from '@/types/skill'

/** Collection object definition */
export interface ForageItemDef {
  itemId: string
  name: string
  season: ('spring' | 'summer' | 'autumn' | 'winter')[]
  chance: number // Probability of occurrence 0-1
  expReward: number
}

/** Weather correction to collection probability */
export const WEATHER_FORAGE_MODIFIER: Record<Weather, number> = {
  sunny: 1.0,
  rainy: 1.15,
  stormy: 0.8,
  snowy: 0.9,
  windy: 1.1,
  green_rain: 1.5
}

/** Bamboo forest collection */
export const FORAGE_ITEMS: ForageItemDef[] = [
  {
    itemId: 'bamboo',
    name: 'bamboo',
    season: ['spring', 'summer', 'autumn'],
    chance: 0.5,
    expReward: 3
  },
  {
    itemId: 'wood',
    name: 'Wood',
    season: ['spring', 'summer', 'autumn', 'winter'],
    chance: 0.6,
    expReward: 2
  },
  {
    itemId: 'herb',
    name: 'herb',
    season: ['spring', 'summer', 'autumn'],
    chance: 0.3,
    expReward: 5
  },
  {
    itemId: 'firewood',
    name: 'Firewood',
    season: ['spring', 'summer', 'autumn', 'winter'],
    chance: 0.7,
    expReward: 1
  },
  {
    itemId: 'winter_bamboo_shoot',
    name: 'Winter bamboo shoots',
    season: ['winter'],
    chance: 0.35,
    expReward: 8
  },
  {
    itemId: 'wintersweet',
    name: 'Wangmei',
    season: ['winter'],
    chance: 0.2,
    expReward: 10
  },
  {
    itemId: 'wild_mushroom',
    name: 'Wild Mushroom',
    season: ['autumn'],
    chance: 0.35,
    expReward: 6
  },
  {
    itemId: 'ginseng',
    name: 'ginseng',
    season: ['autumn', 'winter'],
    chance: 0.1,
    expReward: 15
  },
  {
    itemId: 'wild_berry',
    name: 'wild fruit',
    season: ['summer'],
    chance: 0.4,
    expReward: 4
  },
  {
    itemId: 'pine_cone',
    name: 'pine cone',
    season: ['autumn', 'winter'],
    chance: 0.3,
    expReward: 5
  },
  {
    itemId: 'camphor_seed',
    name: 'camphor tree seeds',
    season: ['spring', 'summer'],
    chance: 0.15,
    expReward: 5
  },
  {
    itemId: 'mulberry',
    name: 'mulberry',
    season: ['summer', 'autumn'],
    chance: 0.2,
    expReward: 4
  },

  // ===== Rare collections (museum fossils/antiquities) =====
  {
    itemId: 'ancient_pottery',
    name: 'ancient pottery fragment',
    season: ['spring', 'summer', 'autumn', 'winter'],
    chance: 0.03,
    expReward: 12
  },
  {
    itemId: 'bamboo_scroll',
    name: 'Bamboo Slips',
    season: ['spring', 'summer', 'autumn'],
    chance: 0.03,
    expReward: 12
  },
  {
    itemId: 'stone_axe_head',
    name: 'Stone Axe',
    season: ['spring', 'summer', 'autumn', 'winter'],
    chance: 0.04,
    expReward: 10
  },
  {
    itemId: 'fern_fossil',
    name: 'Fossil fern leaf',
    season: ['spring', 'summer', 'autumn'],
    chance: 0.03,
    expReward: 12
  },
  {
    itemId: 'petrified_wood',
    name: 'Petrified Wood',
    season: ['autumn', 'winter'],
    chance: 0.04,
    expReward: 10
  }
]

/** Get collectible items in the current season */
export const getForageItems = (season: string): ForageItemDef[] => {
  return FORAGE_ITEMS.filter(f => f.season.includes(season as any))
}

// ===== Bamboo Forest Animal Encounter =====

/** Bamboo forest animal encounter probability */
export const FOREST_ENCOUNTER_CHANCE = 0.15

/** Definition of gentle animals */
export interface FriendlyAnimalDef {
  id: stringname: string
  productItemId: string
  collectExp:number
  chaseExp:number
  season: Season[]
  weight: number
}

export const FRIENDLY_ANIMALS: FriendlyAnimalDef[] = [
  {
    id: 'wild_chicken',
    name: 'Pheasant',
    productItemId: 'egg',
    collectExp: 5,
    chaseExp: 8,
    season: ['spring', 'summer', 'autumn', 'winter'],
    weight: 4
  },
  {
    id: 'wild_cow',
    name: 'Bison',
    productItemId: 'milk',
    collectExp: 5,
    chaseExp: 8,
    season: ['spring', 'summer', 'autumn'],
    weight: 3
  },
  {
    id: 'wild_rabbit',
    name: 'Hare',
    productItemId: 'rabbit_fur',
    collectExp: 5,
    chaseExp: 8,
    season: ['spring', 'summer', 'autumn', 'winter'],
    weight: 4
  },
  {
    id: 'wild_goat',
    name: 'Ibex',
    productItemId: 'goat_milk',
    collectExp: 5,
    chaseExp: 8,
    season: ['spring', 'summer', 'autumn'],
    weight: 3
  }
]

/** Definition of Bamboo Forest Beast */
export const HOSTILE_ANIMALS: MonsterDef[] = [
  {
    id: 'forest_wolf',
    name: 'Bamboo Wolf',
    HP: 40,
    attack: 12,
    defense: 3,
    expReward: 20,
    drops: [
      { itemId: 'wolf_pelt', chance: 0.6 },
      { itemId: 'wolf_fang', chance: 0.3 }
    ],
    description: 'The gray wolf wandering in the bamboo forest, alert and ferocious. '
  },
  {
    id: 'forest_bear',
    name: 'Black Bear',
    HP: 70,
    attack: 18,
    defense: 5,
    expReward: 35,
    drops: [
      { itemId: 'bear_pelt', chance: 0.5 },
      { itemId: 'bear_gall', chance: 0.2 },
      { itemId: 'honey', chance: 0.4 }
    ],
    description: 'A huge black bear with amazing strength. '
  },
  {
    id: 'forest_tiger',
    name: 'Tiger',
    HP: 100,
    attack: 25,
    defense: 8,
    expReward: 50,
    drops: [
      { itemId: 'tiger_pelt', chance: 0.4 },
      { itemId: 'tiger_bone', chance: 0.25 },
      { itemId: 'tiger_fang', chance: 0.3 }
    ],
    description: 'The king of the bamboo forest, an extremely dangerous beast. '
  }
]

/** Punishment for defeating the Bamboo Forest Beast */
export const FOREST_DEFEAT_MONEY_PENALTY_RATE = 0.1
export const FOREST_DEFEAT_MONEY_PENALTY_CAP = 5000

/** Randomly select an animal encounter according to season (gentle 70%/beast 30%) */
export const rollForestEncounter = (
  season: season
): { type: 'friendly'; animal: FriendlyAnimalDef } | { type: 'hotile'; monster: MonsterDef } | null => {
  const friendlyCandidates = FRIENDLY_ANIMALS.filter(a => a.season.includes(season))
  const hostileCandidates = HOSTILE_ANIMALS

  if (friendlyCandidates.length === 0 && hostileCandidates.length === 0) return null

  if (Math.random() < 0.7 && friendlyCandidates.length > 0) {
    // Mild animals — extracted by weight
    const totalWeight = friendlyCandidates.reduce((s, a) => s + a.weight, 0)
    let roll = Math.random() * totalWeight
    for (const animal of friendlyCandidates) {
      roll -= animal.weight
      if (roll <= 0) return { type: 'friendly', animal }
    }
    return { type: 'friendly', animal: friendlyCandidates[0]! }
  } else if (hostileCandidates.length > 0) {
    // Beast — Equally weighted random
    const idx = Math.floor(Math.random() * hostileCandidates.length)
    return { type: 'hostile', monster: hostileCandidates[idx]! }
  }

  return null
}
