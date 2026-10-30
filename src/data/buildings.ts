import type { FarmhouseLevel } from '@/types'

/** Farmhouse upgrade definition */
export interface FarmhouseUpgradeDef {
  level: FarmhouseLevel
  name: string
  description: string
  cost: number
  materialCost: { itemId: string; quantity: number }[]
  benefit: string
}

export const FARMHOUSE_UPGRADES: FarmhouseUpgradeDef[] = [
  {
    level: 1,
    name: 'Brick House',
    description: 'Upgrade the kitchen, cooking stamina recovery +20%. ',
    cost: 10000,
    materialCost: [{ itemId: 'wood', quantity: 200 }],
    benefit: 'kitchen_bonus'
  },
  {
    level: 2,
    name: 'house',
    description: 'Spacious courtyard, restores an additional 10% of physical strength every night. ',
    cost: 65000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'iron_ore', quantity: 50 }
    ],
    benefit: 'stamina_bonus'
  },
  {
    level: 3,
    name: 'wine cellar',
    description: 'The underground wine cellar can age fine wine to improve its quality. ',
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'gold_ore', quantity: 30 }
    ],
    benefit: 'cellar'
  }
]

/** Conditions for unlocking the cave - cumulative income reaches this value */
export const CAVE_UNLOCK_EARNINGS = 25000

/** Mushroom Cave’s daily output probability */
export const CAVE_MUSHROOM_DAILY_CHANCE = 0.6

/** Daily output probability of the Batcave */
export const CAVE_FRUIT_BAT_DAILY_CHANCE = 0.5

/** Cave quality improvement threshold over time (number of days) */
export const CAVE_QUALITY_THRESHOLDS = [
  { days: 0, quality: 'normal' as const },
  { days: 56, quality: 'fine' as const },
  { days: 112, quality: 'excellent' as const },
  { days: 224, quality: 'supreme' as const }
]

/** Cave upgrade definition */
export interface CaveUpgradeDef {
  level: number
  name: string
  mushroomChance: number
  fruitBatChance: number
  doubleChance: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
  mushroomPool: { itemId: string; weight: number }[]
  fruitPool: string[]
  /** Quality level improvement: increase a few levels on the basis of "accumulation based on days" */
  qualityBonus?: number
  /** Single output limit (the maximum number of outputs when triggering the bonus) */
  maxQty?: number
}

export const CAVE_UPGRADES: CaveUpgradeDef[] = [
  {
    level: 1,
    name: 'cave',
    mushroomChance: 0.6,
    fruitBatChance: 0.5,
    doubleChance: 0,
    cost: 0,
    materialCost: [],
    mushroomPool: [{ itemId: 'wild_mushroom', weight: 1 }],
    fruitPool: ['tree_peach', 'lychee', 'mandarin', 'plum_blossom']
  },
  {
    level: 2,
    name: 'Cave·II',
    mushroomChance: 0.7,
    fruitBatChance: 0.6,
    doubleChance: 0,
    cost: 15000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'iron_bar', quantity: 5 }
    ],
    mushroomPool: [
      { itemId: 'wild_mushroom', weight: 70 },
      { itemId: 'herb', weight: 30 }
    ],
    fruitPool: ['tree_peach', 'lychee', 'mandarin', 'plum_blossom', 'apricot', 'pomegranate']
  },
  {
    level: 3,
    name: 'Cave·Three',
    mushroomChance: 0.8,
    fruitBatChance: 0.7,
    doubleChance: 0.25,
    cost: 40000,
    materialCost: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'gold_bar', quantity: 10 }
    ],
    mushroomPool: [
      { itemId: 'wild_mushroom', weight: 50 },
      { itemId: 'herb', weight: 35 },
      { itemId: 'ginseng', weight: 15 }
    ],fruitPool: ['tree_peach', 'lychee', 'mandarin', 'plum_blossom', 'apricot', 'pomegranate', 'persimmon', 'hawthorn'],
    qualityBonus: 1,
    maxQty: 2
  },
  {
    level: 4,
    name: 'Cave·Si',
    mushroomChance: 1.0,
    fruitBatChance: 0.9,
    doubleChance: 0.5,
    cost: 90000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'iridium_bar', quantity: 5 },
      { itemId: 'crystal_ore', quantity: 20 }
    ],
    mushroomPool: [
      { itemId: 'wild_mushroom', weight: 35 },
      { itemId: 'herb', weight: 30 },
      { itemId: 'ginseng', weight: 25 },
      { itemId: 'truffle', weight: 10 }
    ],
    fruitPool: ['tree_peach', 'lychee', 'mandarin', 'plum_blossom', 'apricot', 'pomegranate', 'persimmon', 'hawthorn'],
    qualityBonus: 2,
    maxQty: 3
  }
]

/** Get the cave upgrade definition based on level */
export const getCaveUpgrade = (level: number): CaveUpgradeDef | undefined => {
  return CAVE_UPGRADES.find(u => u.level === level)
}

/** Get the cave quality based on the number of days */
export const getCaveQuality = (daysActive: number): 'normal' | 'fine' | 'excellent' | 'supreme' => {
  let result: 'normal' | 'fine' | 'excellent' | 'supreme' = 'normal'
  for (const t of CAVE_QUALITY_THRESHOLDS) {
    if (daysActive >= t.days) result = t.quality
  }
  return result
}

/** Material requirements for warehouse unlocking */
export const WAREHOUSE_UNLOCK_MATERIALS = [
  { itemId: 'wood', quantity: 300 },
  { itemId: 'iron_ore', quantity: 20 }
]

/** Greenhouse unlock price */
export const GREENHOUSE_UNLOCK_COST = 35000

/** Greenhouse material requirements */
export const GREENHOUSE_MATERIAL_COST = [
  { itemId: 'wood', quantity: 200 },
  { itemId: 'iron_ore', quantity: 30 },
  { itemId: 'gold_ore', quantity: 10 }
]

/** Number of greenhouse plots */
export const GREENHOUSE_PLOT_COUNT = 12

/** Greenhouse upgrade definition */
export interface GreenhouseUpgradeDef {
  level: number
  name: string
  plotCount: number
  gridCols:number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
  description: string
}

export const GREENHOUSE_UPGRADES: GreenhouseUpgradeDef[] = [
  {
    level: 1,
    name: 'Greenhouse Expansion One',
    plotCount: 20,
    gridCols: 5,
    cost: 50000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'iron_bar', quantity: 20 }
    ],
    description: 'Expand to 20 plots (5×4)'
  },
  {
    level: 2,
    name: 'Greenhouse Expansion·II',
    plotCount: 30,
    gridCols: 6,
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 500 },
      { itemId: 'gold_bar', quantity: 15 }
    ],
    description: 'Expand to 30 plots (6×5)'
  }
]

/** Number of days in the wine cellar value-added cycle */
export const CELLAR_VALUE_CYCLE_DAYS = 7

/** Wine cellar upgrade definition */
export interface CellarUpgradeDef {
  level: number
  name: string
  valuePerCycle: number
  maxSlots: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
}

export const CELLAR_UPGRADES: CellarUpgradeDef[] = [
  {
    level: 1,
    name: 'wine cellar',
    valuePerCycle: 100,
    maxSlots: 6,
    cost: 0,
    materialCost: []
  },
  {
    level: 2,
    name: 'Wine Cellar·II',
    valuePerCycle: 125,
    maxSlots: 9,
    cost: 30000,
    materialCost: [{ itemId: 'wood', quantity: 200 },
      { itemId: 'iron_bar', quantity: 10 }
    ]
  },
  {
    level: 3,
    name: 'Wine Cellar·Three',
    valuePerCycle: 150,
    maxSlots: 12,
    cost: 60000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'gold_bar', quantity: 10 }
    ]
  },
  {
    level: 4,
    name: 'Wine Cellar·Four',
    valuePerCycle: 175,
    maxSlots: 15,
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 400 },
      { itemId: 'gold_bar', quantity: 20 }
    ]
  },
  {
    level: 5,
    name: 'Wine Cellar·Wu',
    valuePerCycle: 200,
    maxSlots: 18,
    cost: 150000,
    materialCost: [
      { itemId: 'wood', quantity: 500 },
      { itemId: 'iridium_bar', quantity: 5 }
    ]
  }
]

export const getCellarUpgrade = (level: number): CellarUpgradeDef | undefined => CELLAR_UPGRADES.find(u => u.level === level)

export const getFarmhouseUpgrade = (level: number): FarmhouseUpgradeDef | undefined => {
  return FARMHOUSE_UPGRADES.find(u => u.level === level)
}