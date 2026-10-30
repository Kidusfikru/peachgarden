import type { AnimalBuildingDef, AnimalDef, AnimalBuildingType, AnimalType } from '@/types'

/**
 *Number of animals accommodated in each level of barn.
 * Originally, "Level × 4" was fixed, and there were only 12 animals at the full level, so there was no room for them in the later stages of the ranch.
 */
export const BUILDING_CAPACITY_PER_LEVEL = 6

/** Animal house definition */
export const ANIMAL_BUILDINGS: AnimalBuildingDef[] = [
  {
    type: 'coop',
    name: 'chicken coop',
    description: 'Raise chickens, ducks and other small poultry. ',
    capacity: 6,
    cost: 4000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'bamboo', quantity: 50 }
    ]
  },
  {
    type: 'barn',
    name: 'Stable',
    description: 'Raise cattle, sheep and other large livestock. ',
    capacity: 6,
    cost: 6000,
    materialCost: [
      { itemId: 'wood', quantity: 150 },
      { itemId: 'iron_ore', quantity: 20 }
    ]
  },
  {
    type: 'stable',
    name: 'stable',
    description: 'Raise horses and travel faster on horseback. ',
    capacity: 1,
    cost: 10000,
    materialCost: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'iron_ore', quantity: 30 }
    ]
  }
]

/** Animal definition */
export const ANIMAL_DEFS: AnimalDef[] = [
  // ===== Chicken Coop Animals (8 types) =====
  {
    type: 'chicken',
    name: 'Chicken',
    building: 'coop',
    cost: 800,
    productId: 'egg',
    productName: 'egg',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'duck',
    name: 'duck',
    building: 'coop',
    cost: 1200,
    productId: 'duck_egg',
    productName: 'duck egg',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'rabbit',
    name: 'Rabbit',
    building: 'coop',
    cost: 2000,
    productId: 'rabbit_fur',
    productName: 'rabbit hair',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'goose',
    name: 'goose',
    building: 'coop',
    cost: 1500,
    productId: 'goose_egg',
    productName: 'goose egg',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'quail',
    name: 'quail',
    building: 'coop',
    cost: 500,
    productId: 'quail_egg',
    productName: 'Quail Egg',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'pigeon',
    name: 'Pigeon',
    building: 'coop',
    cost: 1000,
    productId: 'pigeon_egg',
    productName: 'Pigeon Egg',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'silkie',
    name: 'silky chicken',
    building: 'coop',
    cost: 3000,
    productId: 'silkie_egg',
    productName: 'Black Egg',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'peacock',
    name: 'Peacock',
    building: 'coop',
    cost: 8000,
    productId: 'peacock_feather',
    productName: 'Peacock Feather',
    produceDays: 4,
    friendship: { min: 0, max: 1000 }
  },
  // ===== Barn animals (11 species) =====
  {
    type: 'cow',
    name: 'cow',
    building: 'barn',
    cost: 1500,
    productId: 'milk',
    productName: 'milk',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'sheep',
    name: 'sheep',
    building: 'barn',
    cost: 8000,
    productId: 'wool',
    productName: 'wool',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'goat',
    name: 'goat',
    building: 'barn',cost: 4000,
    productId: 'goat_milk',
    productName: 'goat milk',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'pig',
    name: 'pig',
    building: 'barn',
    cost: 16000,
    productId: 'truffle',
    productName: 'truffle',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'buffalo',
    name: 'Buffalo',
    building: 'barn',
    cost: 3000,
    productId: 'buffalo_milk',
    productName: 'Buffalo milk',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'yak',
    name: 'yak',
    building: 'barn',
    cost: 5000,
    productId: 'yak_milk',
    productName: 'yak milk',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'alpaca',
    name: 'Alpaca',
    building: 'barn',
    cost: 6000,
    productId: 'alpaca_wool',
    productName: 'Alpaca',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'deer',
    name: 'Deer',
    building: 'barn',
    cost: 12000,
    productId: 'antler_velvet',
    productName: 'Deer Antler',
    produceDays: 5,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'donkey',
    name: 'Donkey',
    building: 'barn',
    cost: 3000,
    productId: 'donkey_milk',
    productName: 'Donkey milk',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'camel',
    name: 'Camel',
    building: 'barn',
    cost: 7000,
    productId: 'camel_milk',
    productName: 'camel milk',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'ostrich',
    name: 'ostrich',
    building: 'barn',
    cost: 10000,
    productId: 'ostrich_egg',
    productName: 'ostrich egg',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  // ===== Stable (1 type) =====
  {
    type: 'horse',
    name: 'horse',
    building: 'stable',
    cost: 5000,
    productId: '',
    productName: '',
    produceDays: 0,
    friendship: { min: 0, max: 1000 }
  }
]

/** Hay item ID */
export const HAY_ITEM_ID = 'hay'

/** Hay purchase price */
export const HAY_PRICE = 50

export const PREMIUM_FEED_ID = 'premium_feed'
export const NOURISHING_FEED_ID = 'nourishing_feed'
export const VITALITY_FEED_ID = 'vitality_feed'

/**
 * All feed definitions (used for UI traversal, the drug store and the barn share the same price).
 * The listed price is about 2.3 times the recycling price: the buying price is still higher than the recycling price even with full discount, so avoid buying and selling.
 */
export const FEED_DEFS: {
  id: string
  name: string
  price:number
  description: string
}[] = [
  { id: 'hay', name: 'Hay', price: HAY_PRICE, description: 'Basic feed' },
  {
    id: 'premium_feed',
    name: 'Concentrate Feed',
    price: 620,
    description: 'Mood +60, favorability doubled'
  },
  {
    id: 'nourishing_feed',
    name: 'Nutritional feed',
    price: 550,
    description: 'Number of days of production -1'
  },
  {
    id: 'vitality_feed',
    name: 'Energy Feed',
    price: 460,
    description: '100% cure of disease'
  }
]

/** Feed price */
export const getFeedPrice = (id: string): number => FEED_DEFS.find(f => f.id === id)?.price ?? 0

/** Feed dosage text, such as "Concentrated feed × 3, hay × 2" */
export const formatFeedUsage = (used: Record<string, number>): string =>
  FEED_DEFS.filter(f => (used[f.id] ?? 0) > 0)
    .map(f => `${f.name}×${used[f.id]}`)
    .join(',')export const getAnimalDef = (type: string): AnimalDef | undefined => {
  return ANIMAL_DEFS.find(d => d.type === type)
}

export const getBuildingDef = (type: string): AnimalBuildingDef | undefined => {
  return ANIMAL_BUILDINGS.find(b => b.type === type)
}

/** Animal house upgrade definition: capacity = level × BUILDING_CAPACITY_PER_LEVEL */
export const BUILDING_UPGRADES: {
  type: AnimalBuildingType
  level: number
  name: string
  capacity: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
}[] = [
  {
    type: 'coop',
    level: 2,
    name: 'Large Chicken Coop',
    capacity: 12,
    cost: 10000,
    materialCost: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'iron_ore', quantity: 15 }
    ]
  },
  {
    type: 'coop',
    level: 3,
    name: 'Luxury Chicken Coop',
    capacity: 18,
    cost: 20000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'gold_ore', quantity: 10 }
    ]
  },
  {
    type: 'barn',
    level: 2,
    name: 'Large stable',
    capacity: 12,
    cost: 12000,
    materialCost: [
      { itemId: 'wood', quantity: 250 },
      { itemId: 'iron_ore', quantity: 25 }
    ]
  },
  {
    type: 'barn',
    level: 3,
    name: 'Luxury stable',
    capacity: 18,
    cost: 25000,
    materialCost: [
      { itemId: 'wood', quantity: 400 },
      { itemId: 'gold_ore', quantity: 15 }
    ]
  }
]

export const getBuildingUpgrade = (type: AnimalBuildingType, toLevel: number) => {
  return BUILDING_UPGRADES.find(u => u.type === type && u.level === toLevel)
}

/** Hatching mapping: egg → animal type + number of days of incubation + belonging building */
export const INCUBATION_MAP: Record<string, { animalType: AnimalType; days: number; building: AnimalBuildingType }> = {
  egg: { animalType: 'chicken', days: 5, building: 'coop' },
  duck_egg: { animalType: 'duck', days: 7, building: 'coop' },
  goose_egg: { animalType: 'goose', days: 6, building: 'coop' },
  quail_egg: { animalType: 'quail', days: 4, building: 'coop' },
  pigeon_egg: { animalType: 'pigeon', days: 5, building: 'coop' },
  silkie_egg: { animalType: 'silkie', days: 6, building: 'coop' },
  ostrich_egg: { animalType: 'ostrich', days: 10, building: 'barn' }
}