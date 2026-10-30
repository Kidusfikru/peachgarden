import type { PondLevel, PondableFishDef, FishGenetics } from '@/types/fishPond'

// === Construction/Upgrade Cost ===

export const POND_BUILD_COST = {
  money: 5000,
  materials: [
    { itemId: 'wood', quantity: 100 },
    { itemId: 'bamboo', quantity: 50 }
  ]
}

export const POND_UPGRADE_COSTS: Record<2 | 3, { money: number; materials: { itemId: string; quantity: number }[] }> = {
  2: {
    money: 10000,
    materials: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'iron_bar', quantity: 5 }
    ]
  },
  3: {
    money: 25000,
    materials: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'iron_bar', quantity: 10 }
    ]
  }
}

// === Capacity ===

export const POND_CAPACITY: Record<PondLevel, number> = {
  1:8,
  2:16,
  3:30
}

// === Water quality parameters ===

/** Basic water quality attenuation/day */
export const WATER_QUALITY_DECAY_BASE = 2
/** Density > 50% additional attenuation */
export const WATER_QUALITY_DECAY_HALF = 2
/** Density > 80% additional attenuation */
export const WATER_QUALITY_DECAY_CROWDED = 3
/** Unfed additional attenuation */
export const WATER_QUALITY_DECAY_HUNGRY = 5

/** When the water quality is lower than this value, there is a probability of getting sick */
export const DISEASE_THRESHOLD = 30
/** Daily basic probability of getting sick */
export const DISEASE_CHANCE_BASE = 0.05
/** Number of consecutive days of illness and death */
export const SICK_DEATH_DAYS = 5

/** Feeding restores water quality */
export const FEED_WATER_RESTORE = 10
/** Water quality improver restores water quality */
export const PURIFIER_WATER_RESTORE = 30

/** Reproduction cycle (days) */
export const FISH_BREEDING_DAYS = 3

/** Genetic constants */
export const GENETICS_FLUCTUATION_BASE = 15
export const POND_MUTATION_JUMP_MIN = 15
export const POND_MUTATION_JUMP_MAX = 30

// === Fish species that can be cultured (13 species) ===

const defaultGene = (overrides: Partial<FishGenetics> = {}): FishGenetics => ({
  weight: 50,
  growthRate: 50,
  diseaseRes: 50,
  qualityGene: 30,
  mutationRate: 10,
  ...overrides
})

export const PONDABLE_FISH: PondableFishDef[] = [
  // stream
  {
    fishId: 'crucian',
    name: 'crucian carp',
    maturityDays: 3,
    baseProductionRate: 0.4,
    productItemId: 'crucian',
    defaultGenetics: defaultGene({
      weight: 30,
      growthRate: 70,
      diseaseRes: 60
    })
  },
  {
    fishId: 'carp',
    name: 'carp',
    maturityDays: 4,
    baseProductionRate: 0.35,
    productItemId: 'carp',
    defaultGenetics: defaultGene({
      weight: 45,
      growthRate: 55,
      diseaseRes: 55
    })
  },
  {
    fishId: 'grass_carp',
    name: 'grass carp',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'grass_carp',
    defaultGenetics: defaultGene({
      weight: 60,
      growthRate: 45,
      diseaseRes: 50
    })
  },
  // pond
  {
    fishId: 'golden_carp',
    name: 'Golden Carp',
    maturityDays: 7,
    baseProductionRate: 0.2,
    productItemId: 'golden_carp',
    defaultGenetics: defaultGene({
      weight: 40,
      growthRate: 35,
      diseaseRes: 40,
      qualityGene: 50
    })
  },
  {
    fishId: 'koi',
    name: 'Koi',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'koi',
    defaultGenetics: defaultGene({
      weight: 45,
      growthRate: 40,
      diseaseRes: 45,
      qualityGene: 55
    })
  },{
    fishId: 'pond_turtle',
    name: 'turtle',
    maturityDays: 8,
    baseProductionRate: 0.15,
    productItemId: 'pond_turtle',
    defaultGenetics: defaultGene({
      weight: 70,
      growthRate: 25,
      diseaseRes: 80,
      qualityGene: 40
    })
  },
  // rivers
  {
    fishId: 'bass',
    name: 'bass',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'bass',
    defaultGenetics: defaultGene({
      weight: 55,
      growthRate: 50,
      diseaseRes: 45
    })
  },
  {
    fishId: 'catfish',
    name: 'catfish',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'catfish',
    defaultGenetics: defaultGene({
      weight: 65,
      growthRate: 45,
      diseaseRes: 50
    })
  },
  {
    fishId: 'yellow_eel',
    name: 'Eel',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'yellow_eel',
    defaultGenetics: defaultGene({
      weight: 50,
      growthRate: 40,
      diseaseRes: 55,
      qualityGene: 45
    })
  },
  // waterfall
  {
    fishId: 'rainbow_trout',
    name: 'Rainbow Trout',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'rainbow_trout',
    defaultGenetics: defaultGene({
      weight: 50,
      growthRate: 45,
      diseaseRes: 40,
      qualityGene: 50
    })
  },
  // swamp
  {
    fishId: 'mud_loach',
    name: 'Swamp Loach',
    maturityDays: 3,
    baseProductionRate: 0.4,
    productItemId: 'mud_loach',
    defaultGenetics: defaultGene({
      weight: 25,
      growthRate: 65,
      diseaseRes: 70
    })
  },
  {
    fishId: 'pond_snail',
    name: 'Snail',
    maturityDays: 2,
    baseProductionRate: 0.5,
    productItemId: 'pond_snail',
    defaultGenetics: defaultGene({
      weight: 15,
      growthRate: 80,
      diseaseRes: 75,
      qualityGene: 20
    })
  },
  // Mine
  {
    fishId: 'cave_blindfish',
    name: 'Cave blind fish',
    maturityDays: 8,
    baseProductionRate: 0.15,
    productItemId: 'cave_blindfish',
    defaultGenetics: defaultGene({
      weight: 35,
      growthRate: 30,
      diseaseRes: 30,
      qualityGene: 60,
      mutationRate: 25
    })
  }
]

/** Search the cultureable definition based on the fish species ID */
export const getPondableFish = (fishId: string): PondableFishDef | undefined => {
  return PONDABLE_FISH.find(f => f.fishId === fishId)
}

/** Determine whether the fish can be cultured */
export const isPondableFish = (fishId: string): boolean => {
  return PONDABLE_FISH.some(f => f.fishId === fishId)
}