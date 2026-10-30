import type { SeedGenetics, HybridDef, SeedStarRating } from '@/types/breeding'
import type { Quality } from '@/types'
import { getCropById } from './crops'

// === constants ===

/** Basic capacity of seed box */
export const BASE_BREEDING_BOX = 30

/** Seed box upgrade definition */
export const SEED_BOX_UPGRADES = [
  {
    level: 1,
    cost: 5000,
    materials: [
      { itemId: 'wood', quantity: 50 },
      { itemId: 'copper_bar', quantity: 5 }
    ]
  },
  {
    level: 2,
    cost: 15000,
    materials: [
      { itemId: 'iron_bar', quantity: 8 },
      { itemId: 'pine_resin', quantity: 10 }
    ]
  },
  {
    level: 3,
    cost: 30000,
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'cloth', quantity: 3 },
      { itemId: 'wood', quantity: 100 }
    ]
  },
  {
    level: 4,
    cost: 50000,
    materials: [
      { itemId: 'gold_bar', quantity: 10 },
      { itemId: 'silk_cloth', quantity: 5 },
      { itemId: 'battery', quantity: 3 }
    ]
  },
  {
    level: 5,
    cost: 80000,
    materials: [
      { itemId: 'iridium_bar', quantity: 5 },
      { itemId: 'dream_silk', quantity: 3 },
      { itemId: 'moon_herb', quantity: 5 }
    ]
  }
]

/** Each level of seed box capacity increment */
export const SEED_BOX_UPGRADE_INCREMENT = 15

/** @deprecated Use useBreedingStore().maxSeedBox instead */
export const MAX_BREEDING_BOX = 30

/** Breeding and processing days */
export const BREEDING_DAYS = 1

/** Attribute upper limit */
export const STAT_CAP = 100

/** Basic fluctuation range */
export const BASE_MUTATION_MAGNITUDE = 8

/** Stability increases with each generation */
export const GENERATIONAL_STABILITY_GAIN = 5

/** Upper limit of stability */
export const MAX_STABILITY = 95

/** Attribute jump range during mutation */
export const MUTATION_JUMP_MIN = 15
export const MUTATION_JUMP_MAX = 30

/** The mutation rate floats by itself during mutation */
export const MUTATION_RATE_DRIFT = 5

/** Positive probability of mutation (increasing direction). It is biased towards the positive direction to prevent players from working hard to cultivate but getting worse as time goes by */
export const MUTATION_POSITIVE_CHANCE = 0.72

/**
 * Probability of returning seeds based on quality when harvesting breeding crops.
 * Failure to collect the seeds will directly interrupt the cultivation chain and cause the greatest frustration. Therefore, ordinary quality also guarantees a higher return rate.
 */
export const SEED_RETURN_CHANCE: Record<Quality, number> = {
  normal: 0.75,
  fine: 0.88,
  excellent: 1.0,
  supreme: 1.0
}

/** Determine whether to return breeding seeds when harvesting */
export const shouldReturnBreedingSeed = (quality: Quality): boolean => {
  return Math.random() < (SEED_RETURN_CHANCE[quality] ?? 0)
}

/**
 * Tolerance coefficient for hybrid attribute threshold.
 * Scrapping the entire batch if it is just one or two points away is the most dissuading design. The actual judgment is based on the ratio of the demand value.
 */
export const HYBRID_REQUIREMENT_TOLERANCE = 0.85

/** Breeding platform manufacturing cost: If the threshold is too high, no one will care about the whole set of gameplay. Here, it is reduced to a level that is accessible in the mid-term */
export const BREEDING_STATION_COST = {
  money: 25000,
  materials: [
    { itemId: 'wood', quantity: 30 },
    { itemId: 'iron_ore', quantity: 10 },
    { itemId: 'gold_ore', quantity: 3 }
  ]
}

/** Maximum number of breeding stations */
export const MAX_BREEDING_STATIONS = 3

// === Helper functions ===

let _nextGeneticsId = 1

/** Generate unique gene ID */
export const generateGeneticsId = (): string => {
  return `gen_${Date.now()}_${_nextGeneticsId++}`
}

/** Limit attribute value to 0-100 */
export const clampStat = (value: number): number => {
  return Math.max(0, Math.min(STAT_CAP, Math.round(value)))
}

/** Limit mutation rate to 1-50 */
export const clampMutationRate = (value: number): number => {
  return Math.max(1, Math.min(50, Math.round(value)))
}/** Calculate default gene attributes based on crop ID */
export const getDefaultGenetics = (cropId: string): Omit<SeedGenetics, 'id'> => {
  const crop = getCropById(cropId)
  if (!crop) {
    return {
      cropId,
      generation: 0,
      sweetness: 20,
      yield: 20,
      resistance: 20,
      stability: 50,
      mutationRate: 10,
      parentA: null,
      parentB: null,
      isHybrid: false,
      hybridId: null
    }
  }

  // Expensive/slow crops have higher attributes
  const priceScore = Math.min(crop.sellPrice / 350, 1) // 350 = Snow lotus selling price
  const growthScore = Math.min(crop.growthDays / 12, 1) // 12 = Snow lotus growth days

  const baseSweetness = clampStat(15 + Math.round(priceScore * 40))
  const baseYield = clampStat(15 + Math.round(growthScore * 35))
  const baseResistance = clampStat(10 + Math.round((priceScore + growthScore) * 15))

  return {
    cropId,
    generation: 0,
    sweetness: baseSweetness,
    yield: baseYield,
    resistance: baseResistance,
    stability: 50,
    mutationRate: 10,
    parentA: null,
    parentB: null,
    isHybrid: false,
    hybridId: null
  }
}

/** Calculate total attributes */
export const getTotalStats = (g: SeedGenetics): number => {
  return g.sweetness + g.yield + g.resistance
}

/** Get star rating */
export const getStarRating = (g: SeedGenetics): SeedStarRating => {
  const total = getTotalStats(g)
  if (total >= 250) return 5
  if (total >= 200) return 4
  if (total >= 150) return 3
  if (total >= 100) return 2
  return 1
}

/** Generate seed display label */
export const makeSeedLabel = (g: SeedGenetics): string => {
  const crop = getCropById(g.cropId)
  const name = crop?.name ?? g.cropId
  return `${name} G${g.generation}`
}

// === Hybrid recipe ===

export const HYBRID_DEFS: HybridDef[] = [
  {
    id: 'golden_melon',
    name: 'Golden Honeydew',
    parentCropA: 'watermelon',
    parentCropB: 'lotus_root',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'golden_melon',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 50 },
    discoveryText: 'The sweetness of watermelon and the freshness of lotus root are perfectly combined to create the legendary golden honeydew melon! '
  },
  {
    id: 'jade_tea',
    name: 'Emerald Tea',
    parentCropA: 'tea',
    parentCropB: 'chrysanthemum',
    minSweetness: 50,
    minYield: 45,
    resultCropId: 'jade_tea',
    baseGenetics: { sweetness: 60, yield: 55, resistance: 55 },
    discoveryText: 'The mellowness of tea leaves blends with the elegance of chrysanthemums, and the tea soup of emerald tea is glowing with green luster! '
  },
  {
    id: 'phoenix_pepper',
    name: 'Phoenix pepper',
    parentCropA: 'chili',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 55,
    resultCropId: 'phoenix_pepper',
    baseGenetics: { sweetness: 50, yield: 65, resistance: 60 },
    discoveryText: 'The heat of the chili pepper collides with the mellowness of the pumpkin, and the phoenix pepper is as gorgeous as a blazing flame! '
  },
  {
    id: 'moonlight_rice',
    name: 'Moonlight Rice',
    parentCropA: 'rice',
    parentCropB: 'bamboo_shoot',
    minSweetness: 45,
    minYield: 60,
    resultCropId: 'moonlight_rice',
    baseGenetics: { sweetness: 55, yield: 70, resistance: 45 },
    discoveryText: 'The simplicity of rice blends with the aura of spring bamboo shoots, and the moonlight rice glows with silver light under the moon! '
  },
  {
    id: 'frost_garlic',
    name: 'Frost Snow Garlic',
    parentCropA: 'snow_lotus',
    parentCropB: 'garlic',
    minSweetness: 55,
    minYield: 40,resultCropId: 'frost_garlic',
    baseGenetics: { sweetness: 65, yield: 50, resistance: 70 },
    discoveryText: 'The purity of snow lotus blends with the pungency of garlic, and frosty snow garlic exudes a frost-like chill! '
  },
  {
    id: 'emerald_radish',
    name: 'Emerald Carrot',
    parentCropA: 'cabbage',
    parentCropB: 'radish',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'emerald_radish',
    baseGenetics: { sweetness: 40, yield: 35, resistance: 30 },
    discoveryText: 'The crispness of greens blends with the sweetness of radish, and the emerald-like roots sparkle. '
  },
  {
    id: 'jade_shoot',
    name: 'Polygonatum odoratum',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'tea',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'jade_shoot',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'The freshness of spring bamboo shoots and the mellow aroma of tea blend together like jade and bamboo. '
  },
  {
    id: 'golden_tuber',
    name: 'Golden Potato',
    parentCropA: 'potato',
    parentCropB: 'rapeseed',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'golden_tuber',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 30 },
    discoveryText: 'The plumpness of potatoes and the golden color of rape are intertwined, and the whole body is golden. '
  },
  {
    id: 'peach_blossom_tea',
    name: 'Peach Blossom Tea',
    parentCropA: 'peach',
    parentCropB: 'tea',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'peach_blossom_tea',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 40 },
    discoveryText: 'The charm of peach blossoms and the elegance of tea are combined, and the petals are like butterflies. '
  },
  {
    id: 'ruby_bean',
    name: '红宝豆',
    parentCropA: 'broad_bean',
    parentCropB: 'peach',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'ruby_bean',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'The plumpness of broad beans and the ruddy color of peaches are combined, each piece is like a ruby. '
  },
  {
    id: 'twin_bean',
    name: 'Gemini Bean',
    parentCropA: 'broad_bean',
    parentCropB: 'rapeseed',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'twin_bean',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 30 },
    discoveryText: 'Bava beans and rapeseed are married, and each pod is like twin brothers. '
  },
  {
    id: 'jade_melon',
    name: 'jasper melon',
    parentCropA: 'watermelon',
    parentCropB: 'potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'jade_melon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 35 },
    discoveryText: 'The juiciness of watermelon collides with the mellowness of potatoes, and the flesh is as green as jade. '
  },
  {
    id: 'pearl_grain',
    name: 'Pearl Valley',
    parentCropA: 'rice',
    parentCropB: 'tea',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'pearl_grain',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'The simplicity of rice blends with the elegance of tea, and the rice grains are as crystal clear as pearls. '
  },
  {
    id: 'golden_corn',
    name: 'Golden Corn',
    parentCropA: 'corn',
    parentCropB: 'rapeseed',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'golden_corn',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'The richness of corn meets the golden color of rapeseed, and the ears are golden. '
  },
  {
    id: 'lotus_tea',
    name: 'Lotus Heart Tea',
    parentCropA: 'lotus_root',
    parentCropB: 'tea',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'lotus_tea',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 45 },
    discoveryText: 'The freshness of lotus root resonates with the fragrance of tea, and the lotus blooms in the cup. '
  },
  {id: 'purple_bamboo',
    name: 'Purple Bamboo Eggplant',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'eggplant',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'purple_bamboo',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 40 },
    discoveryText: 'The tallness of the spring bamboo shoots and the purple charm of the eggplant merge into one, the purple bamboo-shaped fruit. '
  },
  {
    id: 'honey_peach_melon',
    name: 'peach melon',
    parentCropA: 'peach',
    parentCropB: 'watermelon',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'honey_peach_melon',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 35 },
    discoveryText: 'The sweetness of peach blends with the refreshing taste of watermelon, and you will be filled with honey when you take a bite. '
  },
  {
    id: 'fire_bean',
    name: '火豆',
    parentCropA: 'broad_bean',
    parentCropB: 'chili',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_bean',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 40 },
    discoveryText: 'The plumpness of broad beans is wrapped in the flame of chili pepper, spicy and fragrant. '
  },
  {
    id: 'silk_bean',
    name: 'Sidou',
    parentCropA: 'green_bean',
    parentCropB: 'loofah',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'silk_bean',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The crispness of the beans is combined with the silkiness of the loofah, creating a silky texture. '
  },
  {
    id: 'double_oil_seed',
    name: 'Double oilseed',
    parentCropA: 'rapeseed',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'double_oil_seed',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 30 },
    discoveryText: 'Double mellow aroma of rapeseed and sesame, with extremely high oil yield. '
  },
  {
    id: 'lotus_potato',
    name: 'Lotus Potato',
    parentCropA: 'potato',
    parentCropB: 'lotus_seed',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'lotus_potato',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'The starch of potatoes and the sweetness of lotus seeds combine to create a dense texture. '
  },
  {
    id: 'jade_pumpkin',
    name: 'Emerald Pumpkin',
    parentCropA: 'potato',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'jade_pumpkin',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'The simplicity of potatoes blends with the golden color of pumpkin, emerald green on the outside and golden on the inside. '
  },
  {
    id: 'crystal_yam',
    name: 'Crystal Yam',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'yam',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'crystal_yam',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 45 },
    discoveryText: 'The crispness of spring bamboo shoots and the nourishment of yam are combined into one, making the whole body crystal clear. '
  },
  {
    id: 'osmanthus_tea',
    name: 'Osmanthus tea',
    parentCropA: 'tea',
    parentCropB: 'osmanthus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'osmanthus_tea',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 50 },
    discoveryText: 'The richness of tea and the fragrance of osmanthus are a perfect match, filling the room with fragrance. '
  },
  {
    id: 'mountain_bamboo',
    name: 'Mangosteen',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'mountain_bamboo',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'The freshness of spring bamboo shoots and the sweetness of sweet potatoes collide, the deliciousness of the mountains and fields. '
  },
  {
    id: 'golden_fruit',
    name: 'Golden Autumn Fruit',
    parentCropA: 'peach',
    parentCropB: 'persimmon',minSweetness: 45,
    minYield: 40,
    resultCropId: 'golden_fruit',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 40 },
    discoveryText: 'The sweetness of peaches and the glutinousness of persimmons blend perfectly, and the branches are full of golden fruits. '
  },
  {
    id: 'nut_potato',
    name: 'Peanut potato',
    parentCropA: 'potato',
    parentCropB: 'peanut',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'nut_potato',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'The combination of the denseness of potatoes and the crispiness of peanuts makes it more delicious the more you chew it. '
  },
  {
    id: 'autumn_bean',
    name: 'Qiuzaodou',
    parentCropA: 'broad_bean',
    parentCropB: 'jujube',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'autumn_bean',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'Broad beans and red dates are married, and the beans have the fragrance of dates. '
  },
  {
    id: 'jujube_blossom',
    name: 'Zaohuatao',
    parentCropA: 'peach',
    parentCropB: 'jujube',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'jujube_blossom',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 40 },
    discoveryText: 'The pinkness of peach blossoms and the elegance of jujube flowers bloom together, and the fruits are sweet. '
  },
  {
    id: 'ginger_blossom',
    name: 'ginger cauliflower',
    parentCropA: 'rapeseed',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'ginger_blossom',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'The tenderness of rape blends with the pungency of ginger, and the flowers bloom like butterflies. '
  },
  {
    id: 'fairy_chrysanthemum',
    name: 'Xianjucai',
    parentCropA: 'cabbage',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'fairy_chrysanthemum',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'The ordinaryness of vegetables blends with the elegance of chrysanthemums, and the edges of the leaves are like chrysanthemum petals. '
  },
  {
    id: 'imperial_cabbage',
    name: 'Imperial Cabbage',
    parentCropA: 'cabbage',
    parentCropB: 'napa_cabbage',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'imperial_cabbage',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The royal marriage of green vegetables and cabbage, the leaves are tender and delicious. '
  },
  {
    id: 'spicy_radish',
    name: 'garlic radish',
    parentCropA: 'radish',
    parentCropB: 'garlic',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spicy_radish',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The crunchy sweetness of radish and the spiciness of garlic are intertwined, creating a unique flavor. '
  },
  {
    id: 'snow_tea',
    name: 'Snow Tea',
    parentCropA: 'tea',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 45,
    resultCropId: 'snow_tea',
    baseGenetics: { sweetness: 65, yield: 55, resistance: 55 },
    discoveryText: 'The ultimate fusion of tea leaves and snow lotus, the tea soup is as pure white as snow. '
  },
  {
    id: 'spring_chive',
    name: 'Spring Leek',
    parentCropA: 'cabbage',
    parentCropB: 'chives',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'spring_chive',
    baseGenetics: { sweetness: 30, yield: 40, resistance: 30 },
    discoveryText: 'The mildness of green vegetables and the richness of leeks are combined into one, and can be grown in all seasons. '
  },
  {
    id: 'wheat_potato',
    name: 'Wheat Sweet Potato',
    parentCropA: 'potato',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'wheat_potato',baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'Potatoes and winter wheat cross-season marriage, potatoes with a wheaty aroma. '
  },
  {
    id: 'spring_green_peach',
    name: 'Green Peach',
    parentCropA: 'peach',
    parentCropB: 'spinach',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'spring_green_peach',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'The sweetness of peach blends with the greenness of spinach, and the peel is as green as jade. '
  },
  {
    id: 'mustard_bean',
    name: 'mustard bean',
    parentCropA: 'broad_bean',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'mustard_bean',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'Broad beans wrapped in mustard greens are a great treat in winter and spring. '
  },
  {
    id: 'frost_rapeseed',
    name: 'Frost Rapeseed',
    parentCropA: 'rapeseed',
    parentCropB: 'spinach',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'frost_rapeseed',
    baseGenetics: { sweetness: 35, yield: 35, resistance: 35 },
    discoveryText: 'Rapeseed rape is not afraid of frost, and the leaves are still green despite the frost. '
  },
  {
    id: 'purple_melon',
    name: 'Amethyst Melon',
    parentCropA: 'watermelon',
    parentCropB: 'eggplant',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_melon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'The juiciness of watermelon collides with the purple charm of eggplant, and the flesh is as purple as crystal. '
  },
  {
    id: 'golden_rice',
    name: 'Jinzhidao',
    parentCropA: 'rice',
    parentCropB: 'sesame',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'golden_rice',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'Rice and sesame are one, and the golden grains exude the fragrance of sesame. '
  },
  {
    id: 'double_lotus',
    name: 'Double Lotus',
    parentCropA: 'lotus_root',
    parentCropB: 'lotus_seed',
    minSweetness: 50,
    minYield: 45,
    resultCropId: 'double_lotus',
    baseGenetics: { sweetness: 60, yield: 55, resistance: 50 },
    discoveryText: 'The ultimate fusion of lotus roots and lotus seeds growing from the same root, with flowers blooming and pedicled. '
  },
  {
    id: 'fire_sesame',
    name: 'hemum kernel',
    parentCropA: 'chili',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_sesame',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'The fire of chili peppers and the aroma of sesame seeds are perfectly combined, spicy and fragrant. '
  },
  {
    id: 'silk_corn',
    name: 'Sisui',
    parentCropA: 'loofah',
    parentCropB: 'corn',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'silk_corn',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 40 },
    discoveryText: 'The smoothness of the loofah blends with the ears of corn, and the silk is golden. '
  },
  {
    id: 'purple_lotus',
    name: 'Purple Lotus Kettle',
    parentCropA: 'eggplant',
    parentCropB: 'lotus_root',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_lotus',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 45 },
    discoveryText: 'The purple charm of eggplant is combined with the freshness of lotus root, making it look like a lotus. '
  },
  {
    id: 'chrysanthemum_melon',
    name: 'Chrysanthemum',
    parentCropA: 'watermelon',
    parentCropB: 'chrysanthemum',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'chrysanthemum_melon',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 40 },
    discoveryText: 'The sweetness of watermelon blends with the elegance of chrysanthemum, and the melon has a floral fragrance. '
  },
  {id: 'pumpkin_rice',
    name: 'Pumpkin Rice',
    parentCropA: 'rice',
    parentCropB: 'pumpkin',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'pumpkin_rice',
    baseGenetics: { sweetness: 45, yield: 55, resistance: 40 },
    discoveryText: 'The pastoral marriage of rice and pumpkin, the rice has the sweet fragrance of pumpkin. '
  },
  {
    id: 'mountain_lotus',
    name: 'Mountain Lotus',
    parentCropA: 'lotus_root',
    parentCropB: 'yam',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'mountain_lotus',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 50 },
    discoveryText: 'The freshness of lotus root and the nourishment of yam blend together, and the mountains and rivers are interdependent. '
  },
  {
    id: 'double_nut',
    name: 'Double Nut',
    parentCropA: 'peanut',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'double_nut',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Peanuts and sesame kernels are combined into one, with a rich aroma. '
  },
  {
    id: 'sweet_gourd',
    name: 'Sweet Luffa',
    parentCropA: 'loofah',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'sweet_gourd',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'The tenderness of the loofah collides with the sweetness of the sweet potato, and the flesh of the melon is sweet. '
  },
  {
    id: 'purple_persimmon',
    name: 'Purple Persimmon',
    parentCropA: 'eggplant',
    parentCropB: 'persimmon',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_persimmon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'The purple color of eggplant blends with the sweetness of persimmon, and the fruit is purple-red. '
  },
  {
    id: 'fire_ginger',
    name: 'Fire Ginger',
    parentCropA: 'chili',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_ginger',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 45 },
    discoveryText: 'The heat of chili peppers and the pungent warmth of ginger combine to create a warm feeling. '
  },
  {
    id: 'osmanthus_lotus',
    name: 'Guilian',
    parentCropA: 'lotus_seed',
    parentCropB: 'osmanthus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'osmanthus_lotus',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 55 },
    discoveryText: 'The pure heart of lotus seeds resonates with the fragrance of sweet-scented osmanthus, like entering a fairyland. '
  },
  {
    id: 'golden_sweet',
    name: 'Golden Potato',
    parentCropA: 'corn',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'golden_sweet',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 35 },
    discoveryText: 'The golden color of corn and the sweetness of sweet potato are combined into one, making the whole body golden. '
  },
  {
    id: 'ruby_melon',
    name: '红宝瓜',
    parentCropA: 'watermelon',
    parentCropB: 'jujube',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'ruby_melon',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 40 },
    discoveryText: 'The juiciness of watermelon collides with the sweetness of red dates, and the flesh is as red as gems. '
  },
  {
    id: 'chrysanthemum_rice',
    name: 'Judao',
    parentCropA: 'rice',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'chrysanthemum_rice',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'A pastoral fusion of rice and chrysanthemums, with the rice carrying a faint fragrance of chrysanthemum. '
  },
  {
    id: 'nut_corn',
    name: 'Peanut Corn',
    parentCropA: 'corn',
    parentCropB: 'peanut',
    minSweetness: 35,minYield: 40,
    resultCropId: 'nut_corn',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'A combination of corn and peanuts, each ear carrying a peanut aroma. '
  },
  {
    id: 'frost_melon',
    name: 'Frost Melon',
    parentCropA: 'watermelon',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'frost_melon',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'The sweetness of watermelon blends with the cold resistance of cabbage, creating a sweetness that can be tasted even in winter. '
  },
  {
    id: 'twin_grain',
    name: 'Double Valley',
    parentCropA: 'rice',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'twin_grain',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'The cereal marriage of rice and winter wheat, the blending of north and south. '
  },
  {
    id: 'lotus_cabbage',
    name: 'Lotus cabbage',
    parentCropA: 'lotus_root',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'lotus_cabbage',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'The freshness of lotus root and the simplicity of cabbage are combined into one, refreshing and nourishing in winter. '
  },
  {
    id: 'garlic_sesame',
    name: 'Garlic Chia',
    parentCropA: 'sesame',
    parentCropB: 'garlic',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'garlic_sesame',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'The rich aroma of sesame and the spiciness of garlic collide, making this a holy seasoning. '
  },
  {
    id: 'chive_gourd',
    name: 'leeks gourd',
    parentCropA: 'loofah',
    parentCropB: 'chives',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'chive_gourd',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The tenderness of loofah is intertwined with the richness of leeks, and can be grown in three seasons. '
  },
  {
    id: 'mustard_eggplant',
    name: 'mustard',
    parentCropA: 'eggplant',
    parentCropB: 'mustard_green',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'mustard_eggplant',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'The purple charm of eggplant is wrapped in the mild spiciness of mustard, which has a unique flavor. '
  },
  {
    id: 'snow_fire_pepper',
    name: 'Ice Fire Pepper',
    parentCropA: 'chili',
    parentCropB: 'snow_lotus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'snow_fire_pepper',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 55 },
    discoveryText: 'The flame of chili pepper collides with the frost of snow lotus, creating a world of ice and fire. '
  },
  {
    id: 'winter_corn',
    name: 'winter corn',
    parentCropA: 'corn',
    parentCropB: 'spinach',
    minSweetness: 30,
    minYield: 40,
    resultCropId: 'winter_corn',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 40 },
    discoveryText: 'Corn is not afraid of severe cold, its leaves are as green as pine trees in winter. '
  },
  {
    id: 'amber_yam',
    name: 'Amber potato',
    parentCropA: 'yam',
    parentCropB: 'sweet_potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'amber_yam',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'The nourishing taste of yam blends with the sweetness of sweet potato, and the color is like amber. '
  },
  {
    id: 'twin_blossom',
    name: 'Double Flower',
    parentCropA: 'chrysanthemum',
    parentCropB: 'osmanthus',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'twin_blossom',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 50 },discoveryText: 'Chrysanthemums and sweet-scented osmanthus are competing to bloom, and the two flowers are in full bloom. '
  },
  {
    id: 'mountain_nut',
    name: 'Mountain Peanut',
    parentCropA: 'yam',
    parentCropB: 'peanut',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'mountain_nut',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 35 },
    discoveryText: 'The denseness of yam and the crispness of peanuts collide, a rare treasure in the mountains. '
  },
  {
    id: 'autumn_gem',
    name: 'Qiu Gui Pumpkin',
    parentCropA: 'pumpkin',
    parentCropB: 'osmanthus',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'autumn_gem',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 45 },
    discoveryText: 'The plumpness of pumpkin blends with the fragrance of osmanthus, a golden autumn treasure. '
  },
  {
    id: 'ginger_yam',
    name: 'ginger yam',
    parentCropA: 'ginger',
    parentCropB: 'yam',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'ginger_yam',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 45 },
    discoveryText: 'The pungent warmth of ginger and the nourishment of yam are combined into one, a holy nourishing product in winter. '
  },
  {
    id: 'golden_persimmon',
    name: 'Golden Persimmon',
    parentCropA: 'persimmon',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'golden_persimmon',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'The sweetness of persimmons and the golden color of pumpkin blend together like gold and honey. '
  },
  {
    id: 'chrysanthemum_jujube',
    name: 'Juzao',
    parentCropA: 'chrysanthemum',
    parentCropB: 'jujube',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'chrysanthemum_jujube',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 45 },
    discoveryText: 'The elegance of chrysanthemums and the sweetness of red dates merge into one, with fruits in the flowers. '
  },
  {
    id: 'osmanthus_yam',
    name: 'guishu',
    parentCropA: 'osmanthus',
    parentCropB: 'sweet_potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'osmanthus_yam',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 45 },
    discoveryText: 'The fragrance of osmanthus penetrates into the sweetness of sweet potatoes, filling your mouth with the fragrance of cinnamon. '
  },
  {
    id: 'winter_pumpkin',
    name: 'Winter Pumpkin',
    parentCropA: 'pumpkin',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'winter_pumpkin',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 40 },
    discoveryText: 'The richness of pumpkin is combined with the cold resistance of cabbage, making it a warm food in winter. '
  },
  {
    id: 'emerald_yam',
    name: 'Emerald Yam',
    parentCropA: 'yam',
    parentCropB: 'spinach',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'emerald_yam',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 45 },
    discoveryText: 'The nourishment of yam blends with the greenness of spinach, and the cut surface is as green as emerald. '
  },
  {
    id: 'snow_chrysanthemum',
    name: 'Snow Ju',
    parentCropA: 'chrysanthemum',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 40,
    resultCropId: 'snow_chrysanthemum',
    baseGenetics: { sweetness: 65, yield: 50, resistance: 60 },
    discoveryText: 'The elegance of the chrysanthemum and the purity of the snow lotus merge into one, with petals like snow. '
  },
  {
    id: 'osmanthus_garlic',
    name: 'Guisuan',
    parentCropA: 'osmanthus',
    parentCropB: 'garlic',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'osmanthus_garlic',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 45 },
    discoveryText: 'The fragrance of osmanthus balances the spiciness of garlic, making it overflowing with aroma. '
  },
  {
    id: 'wheat_yam',
    name: 'Wheat Yam',parentCropA: 'yam',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'wheat_yam',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 40 },
    discoveryText: 'The cross-season marriage of yam and winter wheat is rich in nutrients. '
  },
  {
    id: 'cream_peanut',
    name: 'White Peanut',
    parentCropA: 'peanut',
    parentCropB: 'napa_cabbage',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'cream_peanut',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'The crunchiness of peanuts and the simplicity of cabbage are combined into one, and the shell is as white as snow. '
  },
  {
    id: 'garlic_jujube',
    name: 'Garlic dates',
    parentCropA: 'jujube',
    parentCropB: 'garlic',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'garlic_jujube',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 45 },
    discoveryText: 'The sweetness of red dates and the pungency of garlic collide, and the taste is unexpected. '
  },
  {
    id: 'chive_persimmon',
    name: 'leek persimmon',
    parentCropA: 'persimmon',
    parentCropB: 'chives',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'chive_persimmon',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'The sweetness of persimmons and the richness of leeks blend together and can be harvested in three seasons. '
  },
  {
    id: 'mustard_ginger',
    name: 'mustard ginger',
    parentCropA: 'ginger',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'mustard_ginger',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 40 },
    discoveryText: 'The pungent warmth of ginger and the spiciness of mustard are combined into one, a magical treat to ward off the cold. '
  },
  {
    id: 'snow_pumpkin',
    name: 'Snow Pumpkin',
    parentCropA: 'pumpkin',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 45,
    resultCropId: 'snow_pumpkin',
    baseGenetics: { sweetness: 65, yield: 55, resistance: 55 },
    discoveryText: 'The richness of the pumpkin blends with the purity of the snow lotus, the legend of the giant white melon. '
  },
  {
    id: 'jade_white',
    name: 'Baibaicai',
    parentCropA: 'napa_cabbage',
    parentCropB: 'spinach',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'jade_white',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 30 },
    discoveryText: 'The simplicity of cabbage blends with the greenness of spinach, and the leaves are green and translucent. '
  },
  {
    id: 'garlic_cabbage',
    name: 'Garlic cabbage',
    parentCropA: 'garlic',
    parentCropB: 'napa_cabbage',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'garlic_cabbage',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The pungency of garlic and the sweetness of cabbage are combined into one, perfect for winter storage. '
  },
  {
    id: 'evergreen_herb',
    name: 'Evergreen',
    parentCropA: 'spinach',
    parentCropB: 'mustard_green',
    minSweetness: 25,
    minYield: 25,
    resultCropId: 'evergreen_herb',
    baseGenetics: { sweetness: 30, yield: 35, resistance: 35 },
    discoveryText: 'Spinach and mustard greens are not afraid of severe cold and remain green all year round. '
  },
  {
    id: 'wheat_mustard',
    name: 'Wheat mustard',
    parentCropA: 'winter_wheat',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'wheat_mustard',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 35 },
    discoveryText: 'The mellowness of winter wheat blends with the spiciness of mustard, and the noodles are spicy. '
  },
  {
    id: 'allium_king',
    name: 'Hundred Garlic King',
    parentCropA: 'garlic',
    parentCropB: 'chives',
    minSweetness: 30,
    minYield: 30,resultCropId: 'allium_king',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'The king of the allium genus, garlic and leeks, has unparalleled spiciness. '
  },
  {
    id: 'green_wheat',
    name: 'Cui Mai',
    parentCropA: 'spinach',
    parentCropB: 'winter_wheat',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'green_wheat',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 35 },
    discoveryText: 'The green of spinach seeps into the winter wheat, and the green ears of wheat sway in the wind. '
  },
  {
    id: 'chive_mustard',
    name: 'leek mustard',
    parentCropA: 'chives',
    parentCropB: 'mustard_green',
    minSweetness: 25,
    minYield: 25,
    resultCropId: 'chive_mustard',
    baseGenetics: { sweetness: 30, yield: 35, resistance: 35 },
    discoveryText: 'The spicy alliance of leeks and mustard is an appetizer. '
  },
  {
    id: 'jade_bamboo_corn',
    name: 'Jade Bamboo Shoot Stick',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'corn',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'jade_bamboo_corn',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'The crispness of the spring bamboo shoots blends with the sweetness of the corn, and the jade-like cobs are sweet and delicious. '
  },
  {
    id: 'ginger_jade_green',
    name: 'Jiang Cuicai',
    parentCropA: 'cabbage',
    parentCropB: 'ginger',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'ginger_jade_green',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The refreshing taste of green vegetables meets the warm and spicy taste of ginger, which warms the stomach and relieves tiredness. '
  },
  {
    id: 'spicy_sesame',
    name: 'Spicy kernel',
    parentCropA: 'chili',
    parentCropB: 'peanut',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spicy_sesame',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'The heat of the chili collides with the crispness of the peanuts, creating a spicy and crispy flavor that will enchant you. '
  },
  {
    id: 'honey_gourd',
    name: 'honey loofah',
    parentCropA: 'loofah',
    parentCropB: 'peanut',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'honey_gourd',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 30 },
    discoveryText: 'The smoothness of loofah meets the sweetness of peanuts. '
  },
  {
    id: 'golden_peanut_yam',
    name: '花豆',
    parentCropA: 'peanut',
    parentCropB: 'sweet_potato',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'golden_peanut_yam',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'The crispy fragrance of peanuts and the dense blend of sweet potatoes are sweet and delicious. '
  },
  {
    id: 'spice_jujube',
    name: 'Xin Zao',
    parentCropA: 'jujube',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spice_jujube',
    baseGenetics: { sweetness: 40, yield: 35, resistance: 40 },
    discoveryText: 'The sweetness of red dates and the spiciness of garlic are uniquely blended, leaving an endless aftertaste. '
  },
  {
    id: 'bean_eggplant',
    name: 'douqie',
    parentCropA: 'green_bean',
    parentCropB: 'eggplant',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'bean_eggplant',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'The freshness of green beans and the softness of eggplant are combined into one, two treasures in the field. '
  },
  {
    id: 'chrysanthemum_persimmon',
    name: 'Chrysanthemum persimmon',
    parentCropA: 'persimmon',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'chrysanthemum_persimmon',baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'The sweetness of persimmons blends with the fragrance of chrysanthemums, perfect for autumn. '
  },
  {
    id: 'purple_yam',
    name: 'Purple jade sweet potato',
    parentCropA: 'yam',
    parentCropB: 'eggplant',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'purple_yam',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 40 },
    discoveryText: 'The smoothness of yam blends with the purple charm of eggplant, making the whole body glow purple. '
  },
  {
    id: 'snow_lotus_pearl',
    name: 'Snow Lotus Seed',
    parentCropA: 'lotus_seed',
    parentCropB: 'snow_lotus',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'snow_lotus_pearl',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 45 },
    discoveryText: 'The pure heart of lotus seeds and the purity of snow lotus unite into one, the pearl of winter. '
  },
  {
    id: 'melon_tea_fruit',
    name: 'Michaguo',
    parentCropA: 'golden_melon',
    parentCropB: 'tea',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'melon_tea_fruit',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'The sweetness of golden honeydew melon and the elegance of tea are combined at the highest level, the legendary fairy fruit! '
  },
  {
    id: 'dragon_fire',
    name: 'Dragon Fire Pepper',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'ginger',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'dragon_fire',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 60 },
    discoveryText: 'The flames of phoenix pepper collide with the pungent warmth of ginger, as hot as dragon's breath! '
  },
  {
    id: 'celestial_rice',
    name: 'Tianxiangdao',
    parentCropA: 'moonlight_rice',
    parentCropB: 'osmanthus',
    minSweetness: 65,
    minYield: 60,
    resultCropId: 'celestial_rice',
    baseGenetics: { sweetness: 75, yield: 70, resistance: 60 },
    discoveryText: 'The silver glow of the moonlight rice blends with the fragrance of the sweet-scented osmanthus, the fairy rice in the sky! '
  },
  {
    id: 'ice_lotus',
    name: 'Ice Lotus',
    parentCropA: 'frost_garlic',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'ice_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 65 },
    discoveryText: 'The frost of frost, snow, garlic and the pure heart of lotus seeds are one, and the ice lotus blossoms will never wither! '
  },
  {
    id: 'jade_peach_tea',
    name: 'Cui Peach Tea',
    parentCropA: 'jade_tea',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'jade_peach_tea',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'The green of emerald tea blends with the sweetness of peach, the best tea! '
  },
  {
    id: 'golden_dragon',
    name: 'Golden Dragon Fruit',
    parentCropA: 'golden_melon',
    parentCropB: 'phoenix_pepper',
    minSweetness: 70,
    minYield: 65,
    resultCropId: 'golden_dragon',
    baseGenetics: { sweetness: 80, yield: 75, resistance: 65 },
    discoveryText: 'The dignity of the golden honeydew melon collides with the flames of the phoenix pepper, the dragon within the fruit! '
  },
  {
    id: 'moonlight_frost',
    name: 'Yue Shuang Dao',
    parentCropA: 'moonlight_rice',
    parentCropB: 'frost_garlic',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'moonlight_frost',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 65 },
    discoveryText: 'The silver glow of moonlight rice interweaves with the frost of frost, snow and garlic, and the frost blooms under the moon! '
  },
  {
    id: 'jade_golden_melon',
    name: 'Emerald Pumpkin',
    parentCropA: 'jade_tea',
    parentCropB: 'golden_melon',
    minSweetness: 70,
    minYield: 65,
    resultCropId: 'jade_golden_melon',baseGenetics: { sweetness: 80, yield: 70, resistance: 70 },
    discoveryText: 'The green of the jade tea blends with the golden color of the honeydew melon, and the jade is covered with gold! '
  },
  {
    id: 'immortal_flower',
    name: 'Flower Flower',
    parentCropA: 'frost_garlic',
    parentCropB: 'jade_tea',
    minSweetness: 70,
    minYield: 60,
    resultCropId: 'immortal_flower',
    baseGenetics: { sweetness: 85, yield: 70, resistance: 75 },
    discoveryText: 'The frost of frost, snow, garlic and the green of emerald tea blend together, the legendary fairy flower! '
  },
  {
    id: 'dragon_pearl',
    name: 'Dragon Ball',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'moonlight_rice',
    minSweetness: 75,
    minYield: 70,
    resultCropId: 'dragon_pearl',
    baseGenetics: { sweetness: 85, yield: 80, resistance: 70 },
    discoveryText: 'The flames of the phoenix pepper collide with the silvery glow of the moon rice, and the fruit is as round as a dragon ball, a treasure! '
  },
  // --- Added second generation hybrid ---
  {
    id: 'emerald_jade_tea',
    name: 'Jade Tea',
    parentCropA: 'emerald_radish',
    parentCropB: 'tea',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'emerald_jade_tea',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'The green of the jade radish blends with the elegance of the tea leaves, and the fragrance of the green tea is refreshing. '
  },
  {
    id: 'pearl_osmanthus',
    name: 'Guizhu Valley',
    parentCropA: 'pearl_grain',
    parentCropB: 'osmanthus',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'pearl_osmanthus',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'The crystal clearness of Pearl Valley and the fragrance of osmanthus merge into one, and the fragrance of osmanthus overflows. '
  },
  {
    id: 'ruby_fire',
    name: 'Red Pepper',
    parentCropA: 'ruby_bean',
    parentCropB: 'chili',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'ruby_fire',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'The ruddy redness of red beans and the fiery heat of chili peppers collide, like flaming rubies. '
  },
  {
    id: 'golden_corn_king',
    name: 'Golden Harvest King',
    parentCropA: 'golden_corn',
    parentCropB: 'rice',
    minSweetness: 55,
    minYield: 60,
    resultCropId: 'golden_corn_king',
    baseGenetics: { sweetness: 65, yield: 70, resistance: 55 },
    discoveryText: 'The richness of golden corn and the simplicity of rice are combined, the king of grains! '
  },
  {
    id: 'jade_melon_tea',
    name: 'Bi Ming Gua',
    parentCropA: 'jade_melon',
    parentCropB: 'tea',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'jade_melon_tea',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'The emerald green of the jade melon blends with the fragrance of the tea leaves, refreshing and relieving the heat. '
  },
  {
    id: 'twin_golden_bean',
    name: '金双豆',
    parentCropA: 'twin_bean',
    parentCropB: 'peanut',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'twin_golden_bean',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 50 },
    discoveryText: 'The plump combination of the twin beans and the peanut, a golden pair. '
  },
  {
    id: 'peach_rice',
    name: 'peach blossom rice',
    parentCropA: 'peach_blossom_tea',
    parentCropB: 'rice',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'peach_rice',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'The fragrance of peach blossom tea penetrates into the rice, and the cooked rice is tinged with peach powder. '
  },
  {
    id: 'jade_shoot_ginger',
    name: 'Jade Bamboo Shoot Ginger',
    parentCropA: 'jade_shoot',
    parentCropB: 'ginger',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'jade_shoot_ginger',baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'The freshness of Polygonatum odoratum buds and the warmth and spiciness of ginger collide to ward off the cold and warm up the body. '
  },
  {
    id: 'golden_tuber_lotus',
    name: 'Golden Lotus Potato',
    parentCropA: 'golden_tuber',
    parentCropB: 'lotus_root',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'golden_tuber_lotus',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'The golden color of the golden potato blends with the freshness of the lotus root, creating a sweet and waxy fragrance. '
  },
  {
    id: 'frost_chrysanthemum',
    name: 'Frost',
    parentCropA: 'frost_garlic',
    parentCropB: 'chrysanthemum',
    minSweetness: 65,
    minYield: 50,
    resultCropId: 'frost_chrysanthemum',
    baseGenetics: { sweetness: 75, yield: 60, resistance: 70 },
    discoveryText: 'The coldness of frost, snow, garlic and the pride of chrysanthemums merge into one, blooming in the frost. '
  },
  {
    id: 'phoenix_sesame',
    name: 'Fengren',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'sesame',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'phoenix_sesame',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 60 },
    discoveryText: 'The flame of phoenix pepper and the mellow aroma of sesame are blended into one, spicy fairy fruit. '
  },
  {
    id: 'moonlight_lotus',
    name: 'Moon Lotus',
    parentCropA: 'moonlight_rice',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'moonlight_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'The silver glow of moonlight rice blends with the pure heart of lotus seeds, and the white lotus blooms quietly under the moon. '
  },
  {
    id: 'jade_snow',
    name: 'Cui Xue Ya',
    parentCropA: 'jade_tea',
    parentCropB: 'snow_lotus',
    minSweetness: 65,
    minYield: 50,
    resultCropId: 'jade_snow',
    baseGenetics: { sweetness: 75, yield: 60, resistance: 70 },
    discoveryText: 'The green of emerald tea meets the pure white of snow lotus, ice and pure. '
  },
  {
    id: 'golden_pumpkin',
    name: 'Pumpkin King',
    parentCropA: 'golden_melon',
    parentCropB: 'pumpkin',
    minSweetness: 65,
    minYield: 60,
    resultCropId: 'golden_pumpkin',
    baseGenetics: { sweetness: 75, yield: 70, resistance: 60 },
    discoveryText: 'The sweetness of golden honeydew melon collides with the mellowness of pumpkin, and the big golden melon is majestic. '
  },
  {
    id: 'phoenix_corn',
    name: 'Fire Spike',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'corn',
    minSweetness: 55,
    minYield: 60,
    resultCropId: 'phoenix_corn',
    baseGenetics: { sweetness: 65, yield: 70, resistance: 55 },
    discoveryText: 'The flames of the phoenix pepper ignite the ears of corn, and the fiery red kernels are sweet and spicy. '
  },
  {
    id: 'moonlight_yam',
    name: 'Moonlight Potato',
    parentCropA: 'moonlight_rice',
    parentCropB: 'sweet_potato',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'moonlight_yam',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 55 },
    discoveryText: 'The silvery glow of the moonlight rice shines on the sweet potato, and the whole body glows with the soft moonlight. '
  },
  {
    id: 'jade_peanut',
    name: 'Green Kernel Fruit',
    parentCropA: 'jade_tea',
    parentCropB: 'peanut',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'jade_peanut',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'The green of the emerald tea penetrates into the peanut, and the kernel inside the shell is as green as jade. '
  },
  {
    id: 'frost_radish',
    name: 'Frost Jade Carrot',
    parentCropA: 'frost_garlic',
    parentCropB: 'radish',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'frost_radish',baseGenetics: { sweetness: 70, yield: 60, resistance: 65 },
    discoveryText: 'The frost of frost and snow garlic seeps into the radish, and the rhizomes are as crystal clear as ice jade. '
  },
  {
    id: 'golden_jujube',
    name: 'Golden Candied Dates',
    parentCropA: 'golden_melon',
    parentCropB: 'jujube',
    minSweetness: 70,
    minYield: 55,
    resultCropId: 'golden_jujube',
    baseGenetics: { sweetness: 80, yield: 65, resistance: 60 },
    discoveryText: 'The sweetness of golden honeydew melon is infused with red dates, and each piece is full of honey juice. '
  },
  {
    id: 'phoenix_eggplant',
    name: 'flame eggplant',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'eggplant',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'phoenix_eggplant',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 60 },
    discoveryText: 'The flames of the phoenix pepper collide with the purple charm of the eggplant, which is hot and delicious under the purple skin. '
  },
  {
    id: 'moonlight_spinach',
    name: 'Silver Leaf Vegetable',
    parentCropA: 'moonlight_rice',
    parentCropB: 'spinach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'moonlight_spinach',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'The silver glow of moonlight rice soaks into the veins of spinach leaves, and the leaves glow with silver light. '
  },
  {
    id: 'jade_loofah',
    name: 'Cuisuigua',
    parentCropA: 'jade_tea',
    parentCropB: 'loofah',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_loofah',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 50 },
    discoveryText: 'The green color of emerald tea blends into the loofah, and the body of the melon is as green as jade. '
  },
  {
    id: 'frost_winter_wheat',
    name: 'Shuangmai',
    parentCropA: 'frost_garlic',
    parentCropB: 'winter_wheat',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_winter_wheat',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 70 },
    discoveryText: 'The ice of frost, snow and garlic seeps into the winter wheat, and the wheat ears are covered with frost flowers. '
  },
  {
    id: 'golden_sesame',
    name: 'Jinzhi',
    parentCropA: 'golden_melon',
    parentCropB: 'sesame',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'golden_sesame',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 55 },
    discoveryText: 'The golden brilliance of golden honeydew melon is infused with sesame seeds, and the grains are as golden as sand gold. '
  },
  {
    id: 'phoenix_garlic',
    name: 'Fire Garlic',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'garlic',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'phoenix_garlic',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 65 },
    discoveryText: 'The flames of the phoenix pepper burn the garlic, adding more fire to the spiciness. '
  },
  {
    id: 'moonlight_cabbage',
    name: '月白菜',
    parentCropA: 'moonlight_rice',
    parentCropB: 'napa_cabbage',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'moonlight_cabbage',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 55 },
    discoveryText: 'The silvery glow of the moonlight rice shines on the cabbage leaves, and the moon is as white as silk and extremely sweet. '
  },
  {
    id: 'jade_persimmon',
    name: 'Green Persimmon',
    parentCropA: 'jade_tea',
    parentCropB: 'persimmon',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'jade_persimmon',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 55 },
    discoveryText: 'The green color of the emerald tea penetrates into the persimmon, and the emerald flesh of the fruit is sweet and fragrant. '
  },
  {
    id: 'frost_bamboo',
    name: 'ice bamboo shoot',
    parentCropA: 'frost_garlic',
    parentCropB: 'bamboo_shoot',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'frost_bamboo',baseGenetics: { sweetness: 70, yield: 60, resistance: 65 },
    discoveryText: 'The frost of frost and snow garlic seals the delicious flavor of spring bamboo shoots, which is fresh when chilled. '
  },
  {
    id: 'golden_watermelon',
    name: 'Digua',
    parentCropA: 'golden_melon',
    parentCropB: 'watermelon',
    minSweetness: 70,
    minYield: 60,
    resultCropId: 'golden_watermelon',
    baseGenetics: { sweetness: 80, yield: 70, resistance: 60 },
    discoveryText: 'Golden honeydew melon returns to the origin of watermelon, with peak sweetness and the king of melons. '
  },
  {
    id: 'phoenix_peach',
    name: 'Fire Peach',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'phoenix_peach',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 60 },
    discoveryText: 'The flames of the phoenix pepper kiss the peach, red as the flames, sweet and pungent. '
  },
  {
    id: 'moonlight_corn',
    name: '月素',
    parentCropA: 'moonlight_rice',
    parentCropB: 'corn',
    minSweetness: 60,
    minYield: 65,
    resultCropId: 'moonlight_corn',
    baseGenetics: { sweetness: 70, yield: 75, resistance: 55 },
    discoveryText: 'The silvery glow of the moonlight rice shines on the ears of corn, and the warehouse is full of silver ears under the moon. '
  },
  {
    id: 'jade_chive',
    name: 'Cui leek',
    parentCropA: 'jade_tea',
    parentCropB: 'chives',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_chive',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'The green color of the emerald tea is soaked in the leek, and the green color is dripping with spicy fragrance. '
  },
  {
    id: 'frost_pumpkin',
    name: 'Frost Pumpkin',
    parentCropA: 'frost_garlic',
    parentCropB: 'pumpkin',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_pumpkin',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 65 },
    discoveryText: 'The chill of frost, snow and garlic condenses on the pumpkin, and the iced pumpkin is as sweet as honey. '
  },
  {
    id: 'emerald_rice',
    name: 'Cui Li Dao',
    parentCropA: 'emerald_radish',
    parentCropB: 'rice',
    minSweetness: 50,
    minYield: 55,
    resultCropId: 'emerald_rice',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 50 },
    discoveryText: 'The green color of the emerald radish penetrates into the rice grains, and the green rice grains are fragrant. '
  },
  {
    id: 'pearl_peach',
    name: 'Pearl',
    parentCropA: 'pearl_grain',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'pearl_peach',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'The crystal clearness of Pearl Valley blends with the ruddy color of peach, and the fruit is as round as a pearl. '
  },
  {
    id: 'golden_lotus',
    name: 'Golden Lotus',
    parentCropA: 'golden_melon',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'golden_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'The golden glow of the golden honeydew melon shines on the lotus seeds, and the golden lotus blooms sparklingly. '
  },
  {
    id: 'phoenix_broad_bean',
    name: 'Fengdou',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'broad_bean',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'phoenix_broad_bean',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 60 },
    discoveryText: 'The flames of phoenix pepper roast broad beans, a treasure among beans tempered in fire. '
  },
  {
    id: 'moonlight_tea',
    name: 'Moon Bud Tea',
    parentCropA: 'moonlight_rice',
    parentCropB: 'tea',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'moonlight_tea',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },discoveryText: 'The silvery glow of moonlight rice blends with the elegance of tea leaves, and the moon-bud-shaped tea leaves have a long and fragrant fragrance. '
  },
  {
    id: 'jade_rapeseed',
    name: 'Cuijincai',
    parentCropA: 'jade_tea',
    parentCropB: 'rapeseed',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_rapeseed',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'The green of emerald tea blends with the golden of rapeseed, and the emerald gold complements each other. '
  },
  {
    id: 'frost_yam',
    name: 'Frost Yam',
    parentCropA: 'frost_garlic',
    parentCropB: 'yam',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_yam',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 65 },
    discoveryText: 'The chill of frost, snow and garlic seeps into the yam, and the ice cream melts in your mouth. '
  },
  // === Three-generation hybrid crops ===,
  {
    id: 'wind_melon',
    name: '风瓜',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_tea',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'wind_melon',
    baseGenetics: { sweetness: 55, yield: 55, resistance: 45 },
    discoveryText: 'Pumpkin and emerald tea are treasures tempered by wind and rain. '
  },
  {
    id: 'cloud_bean',
    name: 'Yundou',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'phoenix_pepper',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'cloud_bean',
    baseGenetics: { sweetness: 55, yield: 55, resistance: 45 },
    discoveryText: 'Pumpkin and phoenix pepper blend in the breeze, creating a natural charm. '
  },
  {
    id: 'rain_rice',
    name: 'Yudao',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'moonlight_rice',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'rain_rice',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 46 },
    discoveryText: 'Pumpkin and moonlight rice shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'hoar_tuber',
    name: 'Frost Potato',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'frost_garlic',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'hoar_tuber',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 46 },
    discoveryText: 'Pumpkin and frosty garlic transform under the starlight, the essence of scenery. '
  },
  {
    id: 'thunder_green',
    name: 'leicai',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'emerald_radish',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'thunder_green',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 47 },
    discoveryText: 'Pumpkin melons and jade radishes gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'rainbow_fruit',
    name: 'Hongguo',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_shoot',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'rainbow_fruit',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 47 },
    discoveryText: 'Pumpkin melons and jasper bamboo shoots are treasures tempered by wind and rain. '
  },
  {
    id: 'dew_bloom',
    name: 'Dew Flower',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_tuber',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dew_bloom',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 47 },
    discoveryText: 'Pumpkin and golden potato blend together in the breeze, creating a natural charm. '
  },
  {
    id: 'dawn_tea',
    name: 'morning tea',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'peach_blossom_tea',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dawn_tea',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 48 },
    discoveryText: 'Pumpkin and peach blossom tea shower gel cream, transformed by the aura of heaven and earth. '
  },
  {id: 'dusk_shoot',
    name: 'Mu Bamboo',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'ruby_bean',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dusk_shoot',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 48 },
    discoveryText: 'Gourds and red beans transform under the starlight, the essence of scenery. '
  },
  {
    id: 'star_lotus',
    name: 'Xinglian',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'twin_bean',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'star_lotus',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 49 },
    discoveryText: 'Pumpkin and twin beans gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'wind_splendor_wheat',
    name: 'Fenghuamai',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_melon',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'wind_splendor_wheat',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 49 },
    discoveryText: 'Golden melons and jade melons are treasures tempered by wind and rain. '
  },
  {
    id: 'cloud_splendor_sesame',
    name: 'Yunhuazhi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'pearl_grain',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'cloud_splendor_sesame',
    baseGenetics: { sweetness: 59, yield: 59, resistance: 49 },
    discoveryText: 'Pumpkin and Pearl Valley blend together in the breeze, creating a natural charm. '
  },
  {
    id: 'rain_splendor_pepper',
    name: 'Yuhuajiao',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_corn',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'rain_splendor_pepper',
    baseGenetics: { sweetness: 59, yield: 59, resistance: 50 },
    discoveryText: 'Pumpkin and golden corn shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'hoar_splendor_root',
    name: 'Shuanghua Ginseng',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'lotus_tea',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'hoar_splendor_root',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 50 },
    discoveryText: 'Pumpkin and lotus heart tea transform under the starlight, the essence of scenery. '
  },
  {
    id: 'thunder_splendor_sprout',
    name: 'Lei Huaya',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_bamboo',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'thunder_splendor_sprout',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 51 },
    discoveryText: 'Pumpkin melon and purple bamboo eggplant gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'rainbow_splendor_vine',
    name: 'Honghua Vine',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'honey_peach_melon',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'rainbow_splendor_vine',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 51 },
    discoveryText: 'Pumpkin and peach melons are treasures tempered by wind and rain. '
  },
  {
    id: 'dew_splendor_bud',
    name: 'Luhualei',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fire_bean',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'dew_splendor_bud',
    baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Pumpkin and fire beans blend in the breeze, a natural charm. '
  },
  {
    id: 'dawn_splendor_orchid',
    name: 'Chen Hualan',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'silk_bean',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'dawn_splendor_orchid',baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Pumpkin and silk bean shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'dusk_splendor_gourd',
    name: 'Muhua Gourd',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_oil_seed',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'dusk_splendor_gourd',
    baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Pumpkin and double oil seeds transform under the starlight, the essence of scenery. '
  },
  {
    id: 'star_splendor_herb',
    name: 'Xinghuacao',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'lotus_potato',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'star_splendor_herb',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 53 },
    discoveryText: 'Pumpkins and lotus potatoes gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'wind_jade3_chestnut',
    name: 'Feng Cuili',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_pumpkin',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'wind_jade3_chestnut',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 53 },
    discoveryText: 'Pumpkin and emerald pumpkin are treasures tempered by wind and rain. '
  },
  {
    id: 'cloud_jade3_apricot',
    name: 'Yun Cuixing',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'crystal_yam',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'cloud_jade3_apricot',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 54 },
    discoveryText: 'Pumpkin and crystal yam blend in the breeze, creating a natural charm. '
  },
  {
    id: 'rain_jade3_pear',
    name: 'Yucuili',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'osmanthus_tea',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'rain_jade3_pear',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 54 },
    discoveryText: 'Pumpkin and osmanthus tea shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'hoar_jade3_berry',
    name: 'Frostberry',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mountain_bamboo',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'hoar_jade3_berry',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 54 },
    discoveryText: 'Pumpkins and mangosteens transform under the starlight, the essence of scenery. '
  },
  {
    id: 'thunder_jade3_peach_t',
    name: 'Lei Cuitao',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_fruit',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'thunder_jade3_peach_t',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 55 },
    discoveryText: 'Pumpkin melons and golden autumn fruits gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'rainbow_jade3_melon',
    name: 'Rainbow melon',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'nut_potato',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'rainbow_jade3_melon',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 55 },
    discoveryText: 'Pumpkin and peanut potatoes are treasures tempered by wind and rain. '
  },
  {
    id: 'dew_jade3_bean',
    name: 'Lucuidou',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'autumn_bean',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'dew_jade3_bean',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 56 },
    discoveryText: 'Pumpkin and autumn jujube beans blend in the breeze, creating a natural charm. '
  },
  {
    id: 'dawn_jade3_rice',
    name: 'Chen Cuidao',
    parentCropA: 'melon_tea_fruit',parentCropB: 'jujube_blossom',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'dawn_jade3_rice',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 56 },
    discoveryText: 'Pumpkin and jujube peach shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'dusk_jade3_tuber',
    name: 'Mu Cuishu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'ginger_blossom',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'dusk_jade3_tuber',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 56 },
    discoveryText: 'Pumpkin and ginger cauliflower transform under the starlight, the essence of scenery. '
  },
  {
    id: 'star_jade3_green',
    name: 'Xing Cuicai',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fairy_chrysanthemum',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'star_jade3_green',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 57 },
    discoveryText: 'Pumpkin and fairy chrysanthemum gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'wind_aura_fruit',
    name: 'Wind Spirit Fruit',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'imperial_cabbage',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'wind_aura_fruit',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 57 },
    discoveryText: 'Pumpkin and royal cabbage are treasures tempered by wind and rain. '
  },
  {
    id: 'cloud_aura_bloom',
    name: 'Yunlinghua',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spicy_radish',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'cloud_aura_bloom',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Pumpkin and garlic radish blend in the breeze, creating a natural charm. '
  },
  {
    id: 'rain_aura_tea',
    name: 'Yuling Tea',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'snow_tea',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'rain_aura_tea',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Pumpkin and snow tea shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'hoar_aura_shoot',
    name: 'Frost Spirit Bamboo Shoot',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spring_chive',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'hoar_aura_shoot',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Pumpkins and spring leeks transform under the starlight, the essence of scenery. '
  },
  {
    id: 'thunder_aura_lotus',
    name: 'Lei Linglian',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'wheat_potato',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'thunder_aura_lotus',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 59 },
    discoveryText: 'Pumpkin and wheat-sweet potato gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'rainbow_aura_wheat',
    name: 'Honglingmai',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spring_green_peach',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'rainbow_aura_wheat',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 59 },
    discoveryText: 'Pumpkin melons and green peaches are treasures tempered by wind and rain. '
  },
  {
    id: 'dew_aura_sesame',
    name: 'Lingzhi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mustard_bean',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'dew_aura_sesame',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 60 },
    discoveryText: 'Pumpkin and mustard beans blend in the breeze, a natural charm. '
  },
  {id: 'dawn_aura_pepper',
    name: 'Morning Pepper',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'frost_rapeseed',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'dawn_aura_pepper',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 60 },
    discoveryText: 'Pumpkin and frost rape shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'dusk_aura_root',
    name: 'Muling Ginseng',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_melon',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'dusk_aura_root',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 61 },
    discoveryText: 'Pumpkin and amethyst melons transform under the starlight, the essence of scenery. '
  },
  {
    id: 'star_aura_sprout',
    name: 'Xinglingya',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_rice',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'star_aura_sprout',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 61 },
    discoveryText: 'Pumpkin melons and Jinzhi rice gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'wind_glow_vine',
    name: 'Scenery Vine',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_lotus',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'wind_glow_vine',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 61 },
    discoveryText: 'Pumpkin and double lotus are treasures tempered by wind and rain. '
  },
  {
    id: 'cloud_glow_bud',
    name: 'Yun Guanglei',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fire_sesame',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'cloud_glow_bud',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 62 },
    discoveryText: 'Pumpkin and hemp seeds blend together in the breeze, creating a natural charm. '
  },
  {
    id: 'rain_glow_orchid',
    name: 'Yuguanglan',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'silk_corn',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'rain_glow_orchid',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 62 },
    discoveryText: 'Pumpkin and Silk Shower Gel Cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'hoar_glow_gourd',
    name: 'Frost Gourd',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_lotus',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'hoar_glow_gourd',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 63 },
    discoveryText: 'Pumpkin and purple nectar transform under the starlight, the essence of scenery. '
  },
  {
    id: 'thunder_glow_herb',
    name: 'Thunder Light Grass',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'chrysanthemum_melon',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'thunder_glow_herb',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 63 },
    discoveryText: 'Pumpkin and chrysanthemum gather the spirit of mountains and rivers and turn them into treasures. '
  },
  {
    id: 'rainbow_glow_chestnut',
    name: 'Hongguangli',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'pumpkin_rice',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'rainbow_glow_chestnut',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 63 },
    discoveryText: 'Pumpkin and pumpkin rice are treasures tempered by wind and rain. '
  },
  {
    id: 'dew_glow_apricot',
    name: 'Luguangxing',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mountain_lotus',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'dew_glow_apricot',baseGenetics: { sweetness: 71, yield: 71, resistance: 64 },
    discoveryText: 'Pumpkin and mountain lily blend in the breeze, creating a natural charm. '
  },
  {
    id: 'dawn_glow_pear',
    name: 'Morning Pear',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_nut',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'dawn_glow_pear',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 64 },
    discoveryText: 'Pumpkin and double nut shower gel cream, transformed by the aura of heaven and earth. '
  },
  {
    id: 'dusk_glow_berry',
    name: 'Twilightberry',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'sweet_gourd',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'dusk_glow_berry',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 65 },
    discoveryText: 'Pumpkin and sweet loofah transform under the starlight, the essence of scenery. '
  },
  {
    id: 'star_glow_peach_t',
    name: 'Starlight Peach',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_persimmon',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'star_glow_peach_t',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 65 },
    discoveryText: 'Pumpkin melons and purple persimmons gather the spirit of mountains and rivers and turn them into treasures. '
  },
  // === Four generations of hybrid crops ===,
  {
    id: 'moon_hua_melon',
    name: 'Yuehuagua',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_melon',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'moon_hua_melon',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 52 },
    discoveryText: 'Honey tea fruit and pumpkin blend in the sky, blooming brilliantly. '
  },
  {
    id: 'sun_hua_bean',
    name: '日华豆',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_tea',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'sun_hua_bean',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 52 },
    discoveryText: 'Honey tea fruit and emerald tea inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'sky_hua_rice',
    name: 'Tianhuadao',
    parentCropA: 'wind_melon',
    parentCropB: 'phoenix_pepper',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'sky_hua_rice',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Honey tea fruit and phoenix pepper condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'gem_hua_tuber',
    name: 'Yuhua potato',
    parentCropA: 'wind_melon',
    parentCropB: 'moonlight_rice',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'gem_hua_tuber',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Honey tea fruit and moonlight rice bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'prism_hua_green',
    name: 'Liuhua cuisine',
    parentCropA: 'wind_melon',
    parentCropB: 'frost_garlic',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'prism_hua_green',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Honey tea fruit and frosty snow garlic transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'silver_hua_fruit',
    name: 'Yinhuaguo',
    parentCropA: 'wind_melon',
    parentCropB: 'emerald_radish',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'silver_hua_fruit',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 54 },
    discoveryText: 'Honey tea fruit and emerald radish blend in the sky, blooming brilliantly. '
  },
  {
    id: 'verdant_hua_bloom',
    name: 'Cuihuahua',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_shoot',
    minSweetness: 52,
    minYield: 52,resultCropId: 'verdant_hua_bloom',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 54 },
    discoveryText: 'Honey tea fruit and jasper bamboo shoots inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'violet_hua_tea',
    name: 'Zihua Tea',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_tuber',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'violet_hua_tea',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 55 },
    discoveryText: 'Honey tea fruit and golden oil potato condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'scarlet_hua_shoot',
    name: 'Danhua Bamboo Shoot',
    parentCropA: 'wind_melon',
    parentCropB: 'peach_blossom_tea',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'scarlet_hua_shoot',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Honey tea fruit and peach blossom tea bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'azure_hua_lotus',
    name: 'Qinghualian',
    parentCropA: 'wind_melon',
    parentCropB: 'ruby_bean',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'azure_hua_lotus',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Honey tea fruits and red beans transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'moon_shine_wheat',
    name: 'Yuehui Mai',
    parentCropA: 'wind_melon',
    parentCropB: 'twin_bean',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'moon_shine_wheat',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 56 },
    discoveryText: 'Honey tea fruit and twin beans blend together in the sky, blooming brilliantly. '
  },
  {
    id: 'sun_shine_sesame',
    name: 'Rihuizhi',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_melon',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'sun_shine_sesame',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 56 },
    discoveryText: 'Honey tea fruits and jasper melons inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'sky_shine_pepper',
    name: 'Tianhui pepper',
    parentCropA: 'wind_melon',
    parentCropB: 'pearl_grain',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'sky_shine_pepper',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 56 },
    discoveryText: 'Honey tea fruit and pearl valley condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'gem_shine_root',
    name: 'Yuhui Ginseng',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_corn',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'gem_shine_root',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 57 },
    discoveryText: 'Honey tea fruits and golden ears of corn bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'prism_shine_sprout',
    name: 'Liu Huiya',
    parentCropA: 'wind_melon',
    parentCropB: 'lotus_tea',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'prism_shine_sprout',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 57 },
    discoveryText: 'Honey tea fruit and lotus heart tea transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'silver_shine_vine',
    name: 'Yinhui Vine',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_bamboo',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'silver_shine_vine',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 58 },
    discoveryText: 'Honey tea fruit and purple bamboo eggplant blend in the sky and bloom brilliantly. '
  },
  {
    id: 'verdant_shine_bud',
    name: 'Cui Huilei',
    parentCropA: 'wind_melon',
    parentCropB: 'honey_peach_melon',
    minSweetness: 55,minYield: 55,
    resultCropId: 'verdant_shine_bud',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 58 },
    discoveryText: 'Honey tea fruit and peach melon inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'violet_shine_orchid',
    name: 'Purple Huilan',
    parentCropA: 'wind_melon',
    parentCropB: 'fire_bean',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'violet_shine_orchid',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 58 },
    discoveryText: 'Honey tea fruit and fire beans condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'scarlet_shine_gourd',
    name: 'Danhui Gourd',
    parentCropA: 'wind_melon',
    parentCropB: 'silk_bean',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'scarlet_shine_gourd',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 59 },
    discoveryText: 'Honey tea fruit and silk beans bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'azure_shine_herb',
    name: 'Qinghui grass',
    parentCropA: 'wind_melon',
    parentCropB: 'double_oil_seed',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'azure_shine_herb',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 59 },
    discoveryText: 'Honey tea fruit and double oil seeds transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'moon_fortune_chestnut',
    name: '月Ruili',
    parentCropA: 'wind_melon',
    parentCropB: 'lotus_potato',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'moon_fortune_chestnut',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 59 },
    discoveryText: 'Honey tea fruit and lotus potato blend in the sky and bloom brilliantly. '
  },
  {
    id: 'sun_fortune_apricot',
    name: 'Ri Ruixing',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_pumpkin',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'sun_fortune_apricot',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 60 },
    discoveryText: 'Honey tea fruit and emerald pumpkin inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'sky_fortune_pear',
    name: 'Tian Ruili',
    parentCropA: 'wind_melon',
    parentCropB: 'crystal_yam',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'sky_fortune_pear',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 60 },
    discoveryText: 'Honey tea fruit and crystal yam condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'gem_fortune_berry',
    name: 'Yu Rui Berry',
    parentCropA: 'wind_melon',
    parentCropB: 'osmanthus_tea',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'gem_fortune_berry',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 60 },
    discoveryText: 'Honey tea fruit and osmanthus tea bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'prism_fortune_peach_t',
    name: 'Luruitao',
    parentCropA: 'wind_melon',
    parentCropB: 'mountain_bamboo',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'prism_fortune_peach_t',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 61 },
    discoveryText: 'Honey tea fruits and mangosteen potatoes transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'silver_fortune_melon',
    name: 'Yinruigua',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_fruit',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'silver_fortune_melon',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 61 },
    discoveryText: 'Honey tea fruit and golden autumn fruit blend together in the sky, blooming brilliantly. '
  },
  {
    id: 'verdant_fortune_bean',
    name: 'Cui Ruidou',parentCropA: 'wind_melon',
    parentCropB: 'nut_potato',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'verdant_fortune_bean',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 62 },
    discoveryText: 'Honey tea fruit and peanut potatoes inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'violet_fortune_rice',
    name: 'Ziridao',
    parentCropA: 'wind_melon',
    parentCropB: 'autumn_bean',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'violet_fortune_rice',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: 'Honey tea fruit and autumn jujube beans condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'scarlet_fortune_tuber',
    name: 'Dan Shwe Sweet Potato',
    parentCropA: 'wind_melon',
    parentCropB: 'jujube_blossom',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'scarlet_fortune_tuber',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: 'Honey tea fruit and jujube peach bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'azure_fortune_green',
    name: 'Qing Ruicai',
    parentCropA: 'wind_melon',
    parentCropB: 'ginger_blossom',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'azure_fortune_green',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 63 },
    discoveryText: 'Honey tea fruit and ginger cauliflower transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'moon_glory_fruit',
    name: 'Yuexiangguo',
    parentCropA: 'wind_melon',
    parentCropB: 'fairy_chrysanthemum',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'moon_glory_fruit',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 63 },
    discoveryText: 'Honey tea fruit and fairy chrysanthemum blend together in the sky, blooming brilliantly. '
  },
  {
    id: 'sun_glory_bloom',
    name: 'Rixianghua',
    parentCropA: 'wind_melon',
    parentCropB: 'imperial_cabbage',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'sun_glory_bloom',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 63 },
    discoveryText: 'Honey tea fruit and royal cabbage inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'sky_glory_tea',
    name: 'Tianxiang Tea',
    parentCropA: 'wind_melon',
    parentCropB: 'spicy_radish',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'sky_glory_tea',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 64 },
    discoveryText: 'Honey tea fruit and garlic radish condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'gem_glory_shoot',
    name: 'Yuxiang Bamboo Shoot',
    parentCropA: 'wind_melon',
    parentCropB: 'snow_tea',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'gem_glory_shoot',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: 'Honey tea fruit and snow tea bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'prism_glory_lotus',
    name: 'Liu Xianglian',
    parentCropA: 'wind_melon',
    parentCropB: 'spring_chive',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'prism_glory_lotus',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: 'Honey tea fruits and spring leeks transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'silver_glory_wheat',
    name: 'Yinxiangmai',
    parentCropA: 'wind_melon',
    parentCropB: 'wheat_potato',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'silver_glory_wheat',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 65 },
    discoveryText: 'Honey tea fruit and wheat sweet potato blend together in the sky, blooming brilliantly. '
  },
  {id: 'verdant_glory_sesame',
    name: 'Cuixiangzhi',
    parentCropA: 'wind_melon',
    parentCropB: 'spring_green_peach',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'verdant_glory_sesame',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: 'Honey tea fruit and green peach inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'violet_glory_pepper',
    name: 'Purple Xiangjiao',
    parentCropA: 'wind_melon',
    parentCropB: 'mustard_bean',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'violet_glory_pepper',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 66 },
    discoveryText: 'Honey tea fruit and mustard beans condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'scarlet_glory_root',
    name: 'Danxiangshen',
    parentCropA: 'wind_melon',
    parentCropB: 'frost_rapeseed',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'scarlet_glory_root',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 66 },
    discoveryText: 'Honey tea fruit and frost rapeseed bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'azure_glory_sprout',
    name: 'Qingxiangya',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_melon',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'azure_glory_sprout',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 66 },
    discoveryText: 'Honey tea fruits and amethyst melons transform in the moonlight, a gift from heaven. '
  },
  {
    id: 'moon_prism4_vine',
    name: 'Mooncai Vine',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_rice',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'moon_prism4_vine',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 67 },
    discoveryText: 'Honey tea fruit and Jinzhi rice blend in the sky and bloom brilliantly. '
  },
  {
    id: 'sun_prism4_bud',
    name: 'Ricailei',
    parentCropA: 'wind_melon',
    parentCropB: 'double_lotus',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'sun_prism4_bud',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 67 },
    discoveryText: 'Honey tea fruit and double lotus inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'sky_prism4_orchid',
    name: '天彩兰',
    parentCropA: 'wind_melon',
    parentCropB: 'fire_sesame',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'sky_prism4_orchid',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 67 },
    discoveryText: 'Honey tea fruit and hemp seeds condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'gem_prism4_gourd',
    name: 'Jade Gourd',
    parentCropA: 'wind_melon',
    parentCropB: 'silk_corn',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'gem_prism4_gourd',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: 'Honey tea fruits and silk threads bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'prism_prism4_herb',
    name: 'Liucaicao',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_lotus',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'prism_prism4_herb',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: 'The honey tea fruit and purple lotus root are transformed in the moonlight, a gift from heaven. '
  },
  {
    id: 'silver_prism4_chestnut',
    name: 'Yin Cai Li',
    parentCropA: 'wind_melon',
    parentCropB: 'chrysanthemum_melon',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'silver_prism4_chestnut',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },discoveryText: 'Honey tea fruit and chrysanthemum blend together in the sky, blooming brilliantly. '
  },
  {
    id: 'verdant_prism4_apricot',
    name: 'Cuicaixing',
    parentCropA: 'wind_melon',
    parentCropB: 'pumpkin_rice',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'verdant_prism4_apricot',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },
    discoveryText: 'Honey tea fruit and pumpkin rice inherit the essence of the sun and moon, shining in all directions. '
  },
  {
    id: 'violet_prism4_pear',
    name: 'Zicai Li',
    parentCropA: 'wind_melon',
    parentCropB: 'mountain_lotus',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'violet_prism4_pear',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },
    discoveryText: 'Honey tea fruit and mountain lotus condense the aura of heaven and earth, shining brightly. '
  },
  {
    id: 'scarlet_prism4_berry',
    name: 'Dancaiberry',
    parentCropA: 'wind_melon',
    parentCropB: 'double_nut',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'scarlet_prism4_berry',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: 'Honey tea fruit and double nuts bathe in the starlight, a sign of auspiciousness. '
  },
  {
    id: 'azure_prism4_peach_t',
    name: 'Qingcaipao',
    parentCropA: 'wind_melon',
    parentCropB: 'sweet_gourd',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'azure_prism4_peach_t',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: 'Honey tea fruit and sweet loofah transform in the moonlight, a gift from heaven. '
  },
  // === Five generations of hybrid crops ===,
  {
    id: 'precious_light5_melon',
    name: 'Yaoguang Gua',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'precious_light5_melon',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 60 },
    discoveryText: 'The condensed essence of wind melon and honey tea fruit is extremely precious. '
  },
  {
    id: 'rare_light5_bean',
    name: 'Qiong Guangdou',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'dragon_fire',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'rare_light5_bean',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 61 },
    discoveryText: 'Wind melon and dragon fire pepper bloom in the morning light. '
  },
  {
    id: 'magnif_light5_rice',
    name: 'Guiguangdao',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'celestial_rice',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'magnif_light5_rice',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: 'Wind melon and Tianxiang rice gather together with Qiong dew, creating a beautiful scene. '
  },
  {
    id: 'radiant_light5_tuber',
    name: 'Xiguangshu',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'ice_lotus',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'radiant_light5_tuber',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 62 },
    discoveryText: 'The contrast between wind melon and ice lotus is extraordinary. '
  },
  {
    id: 'lustrous_light5_green',
    name: 'Liguangcai',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'jade_peach_tea',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'lustrous_light5_green',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 63 },
    discoveryText: 'The essence of wind melon and green peach tea condensed with coral is a dazzling product. '
  },
  {
    id: 'precious_hua5_fruit',
    name: 'Yaohua fruit',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'golden_dragon',
    minSweetness: 63,minYield: 63,
    resultCropId: 'precious_hua5_fruit',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: 'The condensed essence of wind melon and golden dragon fruit is extremely precious. '
  },
  {
    id: 'rare_hua5_bloom',
    name: 'Qionghuahua',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'moonlight_frost',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'rare_hua5_bloom',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: 'The wind melon and moon frost rice bloom in the morning light. '
  },
  {
    id: 'magnif_hua5_tea',
    name: 'Guihua Tea',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'jade_golden_melon',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'magnif_hua5_tea',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: 'Wind melons and emerald gold melons gather dew, creating a beautiful scene. '
  },
  {
    id: 'radiant_hua5_shoot',
    name: 'Xihua Bamboo Shoot',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'immortal_flower',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'radiant_hua5_shoot',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 66 },
    discoveryText: 'The wind melons and fairy flowers reflect the light of the glass, creating an extraordinary beauty. '
  },
  {
    id: 'lustrous_hua5_lotus',
    name: 'Lihualian',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'dragon_pearl',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'lustrous_hua5_lotus',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 67 },
    discoveryText: 'The essence of wind melon and dragon pearl condensed into coral is a dazzling product. '
  },
  {
    id: 'precious_dewdrop_wheat',
    name: 'Yao Lumai',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'ice_lotus',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'precious_dewdrop_wheat',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: 'The condensed essence of cloud beans and ice lotus is extremely precious. '
  },
  {
    id: 'rare_dewdrop_sesame',
    name: 'Qiong Luzhi',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'jade_peach_tea',
    minSweetness: 67,
    minYield: 67,
    resultCropId: 'rare_dewdrop_sesame',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 68 },
    discoveryText: 'Cloud beans and green peach tea bloom in the morning light. '
  },
  {
    id: 'magnif_dewdrop_pepper',
    name: 'Rose dew pepper',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'golden_dragon',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'magnif_dewdrop_pepper',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 69 },
    discoveryText: 'Cloud beans and golden dragon fruit gather together to create a beautiful scene. '
  },
  {
    id: 'radiant_dewdrop_root',
    name: 'Xi Lu Shen',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'moonlight_frost',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'radiant_dewdrop_root',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: 'The cloud beans and moon frost rice are reflected in the glass light, creating an extraordinary beauty. '
  },
  {
    id: 'lustrous_dewdrop_sprout',
    name: 'Liluya',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'jade_golden_melon',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'lustrous_dewdrop_sprout',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 71 },
    discoveryText: 'The essence of cloud beans and emerald golden melon condensed with coral, a dazzling product. '
  },
  {
    id: 'precious_soul_vine',name: 'Yao Ling Teng',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'immortal_flower',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'precious_soul_vine',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 71 },
    discoveryText: 'The essence of cloud beans and prickly pear flowers is condensed and extremely precious. '
  },
  {
    id: 'rare_soul_bud',
    name: 'Qiong Linglei',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'dragon_pearl',
    minSweetness: 70,
    minYield: 70,
    resultCropId: 'rare_soul_bud',
    baseGenetics: { sweetness: 80, yield: 80, resistance: 72 },
    discoveryText: 'Cloud beans and dragon beads bloom in the morning light. '
  },
  {
    id: 'magnif_soul_orchid',
    name: 'Gui Ling Lan',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'magnif_soul_orchid',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 73 },
    discoveryText: 'Cloud beans and honey tea fruits gather together with dew, creating a beautiful scene. '
  },
  {
    id: 'radiant_soul_gourd',
    name: 'Xi Ling Gourd',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'dragon_fire',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'radiant_soul_gourd',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 74 },
    discoveryText: 'The cloud beans and dragon fire pepper are reflected in the glass light, creating an extraordinary beauty. '
  },
  {
    id: 'lustrous_soul_herb',
    name: 'Li Lingcao',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'celestial_rice',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'lustrous_soul_herb',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 74 },
    discoveryText: 'The essence of cloud beans and heavenly fragrant rice condensed into coral, a dazzling product. '
  },
  {
    id: 'precious_silk5_chestnut',
    name: 'Yaojinli',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'moonlight_frost',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'precious_silk5_chestnut',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 75 },
    discoveryText: 'The condensed essence of rain rice and moon frost rice is extremely precious. '
  },
  {
    id: 'rare_silk5_apricot',
    name: 'Qiongjinxing',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'jade_golden_melon',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'rare_silk5_apricot',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 76 },
    discoveryText: 'Rainy rice and emerald golden melons bloom in the morning light. '
  },
  {
    id: 'magnif_silk5_pear',
    name: 'Pear rose',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'immortal_flower',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'magnif_silk5_pear',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 77 },
    discoveryText: 'Rain, rice and fairy flowers gather together with dew, creating a beautiful scene. '
  },
  {
    id: 'radiant_silk5_berry',
    name: 'Xijinberry',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'dragon_pearl',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'radiant_silk5_berry',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 77 },
    discoveryText: 'The contrast between rain rice and dragon pearl glass is extraordinary. '
  },
  {
    id: 'lustrous_silk5_peach_t',
    name: 'Lijintao',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'lustrous_silk5_peach_t',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 78 },discoveryText: 'The essence of rain rice and honey tea fruit condensed into coral, a dazzling product. '
  },
  // === Sixth generation hybrid crops ===,
  {
    id: 'spirit_wonder_melon',
    name: 'Lingmiaogua',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_melon',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'spirit_wonder_melon',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 65 },
    discoveryText: 'The auras of Yuehua Melon and Fenggua are intertwined, creating a heavenly charm. '
  },
  {
    id: 'fairy_wonder_bean',
    name: 'Xianmiaodou',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_bean',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'fairy_wonder_bean',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 66 },
    discoveryText: 'The sacred flowers of moonflower melon and cloud bean circulate, becoming extraordinary and becoming holy. '
  },
  {
    id: 'holy_wonder_rice',
    name: 'Shengmiaodao',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_rice',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'holy_wonder_rice',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 66 },
    discoveryText: 'Yuehua melon and rain rice are mysterious and truly spiritual products. '
  },
  {
    id: 'divine_wonder_tuber',
    name: 'Shenmiao Potato',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_tuber',
    minSweetness: 67,
    minYield: 67,
    resultCropId: 'divine_wonder_tuber',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 67 },
    discoveryText: 'Moonflower melon and frosty potato are intertwined in a fantasy, full of Zen. '
  },
  {
    id: 'trueth_wonder_green',
    name: 'What a wonderful dish',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_green',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'trueth_wonder_green',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 68 },
    discoveryText: 'Moonflower melons and thunder vegetables are surrounded by fairy spirits and are not stained by dust. '
  },
  {
    id: 'spirit_grace6_fruit',
    name: 'Linghua fruit',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rainbow_fruit',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'spirit_grace6_fruit',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 69 },
    discoveryText: 'The aura of the moonflower melon and the rainbow fruit merge, and the fairy charm is created. '
  },
  {
    id: 'fairy_grace6_bloom',
    name: 'Xianhuahua',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dew_bloom',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'fairy_grace6_bloom',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 69 },
    discoveryText: 'The moonflower melon and the dew flower holy flower circulate, transcending the ordinary and becoming holy. '
  },
  {
    id: 'holy_grace6_tea',
    name: 'Shenghua Tea',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dawn_tea',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'holy_grace6_tea',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 70 },
    discoveryText: 'Moonflower melon and morning tea are magical and truly spiritual products. '
  },
  {
    id: 'divine_grace6_shoot',
    name: 'Shenhua Bamboo Shoot',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dusk_shoot',
    minSweetness: 70,
    minYield: 70,
    resultCropId: 'divine_grace6_shoot',
    baseGenetics: { sweetness: 80, yield: 80, resistance: 71 },
    discoveryText: 'Moonflower melons and twilight bamboo shoots are intertwined in dreams, full of Zen. '
  },
  {
    id: 'trueth_grace6_lotus',
    name: 'True Hualian',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'star_lotus',minSweetness: 71,
    minYield: 71,
    resultCropId: 'trueth_grace6_lotus',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 71 },
    discoveryText: 'Moonflower melon and star lotus are surrounded by fairy spirits and are not stained by dust. '
  },
  {
    id: 'spirit_phantom_wheat',
    name: 'Ling Huan Mai',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_splendor_wheat',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'spirit_phantom_wheat',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 72 },
    discoveryText: 'The aura of Yuehua Melon and Fenghua Wheat converge, creating a heavenly charm. '
  },
  {
    id: 'fairy_phantom_sesame',
    name: 'Xian Huan Zhi',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_splendor_sesame',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'fairy_phantom_sesame',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 73 },
    discoveryText: 'The moonflower melon and cloud flower zhi holy flowers circulate, transcending the ordinary and becoming holy. '
  },
  {
    id: 'holy_phantom_pepper',
    name: 'Holy Fantasy Pepper',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_splendor_pepper',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'holy_phantom_pepper',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 74 },
    discoveryText: 'Moonflower melon and rainflower pepper are magical and truly spiritual products. '
  },
  {
    id: 'divine_phantom_root',
    name: 'Shenhuan Ginseng',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_splendor_root',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'divine_phantom_root',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 74 },
    discoveryText: 'Moonflower melon and frost flower ginseng are intertwined in a dreamy world, full of Zen. '
  },
  {
    id: 'trueth_phantom_sprout',
    name: 'True Fantasy Bud',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_splendor_sprout',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'trueth_phantom_sprout',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 75 },
    discoveryText: 'Moonflower melons and thunderflower buds are surrounded by fairy spirits and are not stained by dust. '
  },
  {
    id: 'spirit_dream_vine',
    name: 'Lingmeng Vine',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rainbow_splendor_vine',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'spirit_dream_vine',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 76 },
    discoveryText: 'The aura of the Moonflower Melon and the Rainbow Vine merge together to create a heavenly charm. '
  },
  {
    id: 'fairy_dream_bud',
    name: 'Xianmennglei',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dew_splendor_bud',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'fairy_dream_bud',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 76 },
    discoveryText: 'The Moonflower Melon and the Luhualei Holy Flower circulate, becoming extraordinary and becoming holy. '
  },
  {
    id: 'holy_dream_orchid',
    name: 'Shengmenglan',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dawn_splendor_orchid',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'holy_dream_orchid',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: 'Moonflower melon and morning flower orchid are mysterious and truly spiritual products. '
  },
  {
    id: 'divine_dream_gourd',
    name: 'Shenmeng Gourd',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dusk_splendor_gourd',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'divine_dream_gourd',baseGenetics: { sweetness: 86, yield: 86, resistance: 78 },
    discoveryText: 'The moonflower melon and the dusk flower gourd are intertwined in fantasy and dreams, full of Zen. '
  },
  {
    id: 'trueth_dream_herb',
    name: 'True Dream Grass',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'star_splendor_herb',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'trueth_dream_herb',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 78 },
    discoveryText: 'Moonflower melon and starflower grass are surrounded by fairies and are not stained by dust. '
  },
  {
    id: 'spirit_zen_chestnut',
    name: 'Lingchan Li',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_jade3_chestnut',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'spirit_zen_chestnut',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: 'The auras of Yuehua Melon and Feng Cuili merge to create a fairy-like charm. '
  },
  {
    id: 'fairy_zen_apricot',
    name: 'Xianchan Xing',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_jade3_apricot',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'fairy_zen_apricot',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 80 },
    discoveryText: 'Moonflower melon and cloud green apricot holy flowers circulate, transcending the ordinary and becoming holy. '
  },
  {
    id: 'holy_zen_pear',
    name: 'Shengchan Pear',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_jade3_pear',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'holy_zen_pear',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: 'Yuehua melon and Yucui pear are mysterious and truly spiritual products. '
  },
  {
    id: 'divine_zen_berry',
    name: 'Shenzenberry',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_jade3_berry',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'divine_zen_berry',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: 'Moonflower melons and frost berries are intertwined in a dreamy, Zen-like atmosphere. '
  },
  {
    id: 'trueth_zen_peach_t',
    name: 'Zhen Zen Peach',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_jade3_peach_t',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'trueth_zen_peach_t',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: 'Moonflower melons and thunder peaches are surrounded by fairy spirits and are not stained by dust. '
  },
  // === Seven generations of hybrid crops ===,
  {
    id: 'draco_song_melon',
    name: 'Longyin Melon',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_hua_melon',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'draco_song_melon',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 72 },
    discoveryText: 'The fusion of the divine power of Yaoguang Melon and Yuehua Melon has the power of a mythical beast. '
  },
  {
    id: 'fenghuang_song_bean',
    name: 'Fengyin Dou',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_hua_bean',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'fenghuang_song_bean',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 73 },
    discoveryText: 'Yaoguang Gua and Rihua Dou, dragons and phoenixes roar, and auspicious beasts come to the world. '
  },
  {
    id: 'qilin_song_rice',
    name: 'Lin Yindao',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_hua_rice',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'qilin_song_rice',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 73 },
    discoveryText: 'Yaoguang melons and Tianhua rice tigers roar in the mountains and forests, and cranes dance for nine days. '
  },
  {
    id: 'crane_song_tuber',name: 'Heyin potato',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_hua_tuber',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'crane_song_tuber',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 74 },
    discoveryText: 'The Yaoguang melon and Yuhua potato are shining brightly, and hundreds of beasts are worshiping them. '
  },
  {
    id: 'tiger_song_green',
    name: 'Huyincai',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_hua_green',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'tiger_song_green',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 75 },
    discoveryText: 'Yaoguanggua and Liuhuacai dragons emerged from the water, shocking all directions. '
  },
  {
    id: 'draco_dance_fruit',
    name: 'Dragon Dance Fruit',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'silver_hua_fruit',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'draco_dance_fruit',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 75 },
    discoveryText: 'The fusion of the divine power of Yaoguang Melon and Yinhua Fruit has the power of a mythical beast. '
  },
  {
    id: 'fenghuang_dance_bloom',
    name: 'Fengwuhua',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'verdant_hua_bloom',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'fenghuang_dance_bloom',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 76 },
    discoveryText: 'Yaoguang melons and green flowers, dragons and phoenixes sing, and auspicious beasts come to the world. '
  },
  {
    id: 'qilin_dance_tea',
    name: 'Linwu Tea',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'violet_hua_tea',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'qilin_dance_tea',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: 'Yaoguang melon and purple tea. Tigers roar in the mountains and forests, and cranes dance for nine days. '
  },
  {
    id: 'crane_dance_shoot',
    name: 'Crane Dancing Bamboo Shoots',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'scarlet_hua_shoot',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'crane_dance_shoot',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: 'The Yaoguang melons and Danhua bamboo shoots shine brightly, and hundreds of animals worship them. '
  },
  {
    id: 'tiger_dance_lotus',
    name: 'Tiger Dance Lotus',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'azure_hua_lotus',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'tiger_dance_lotus',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 78 },
    discoveryText: 'Yaoguang Gua and Qinghua Lotus Dragon came out of the water and shocked all directions. '
  },
  {
    id: 'draco_gleam7_wheat',
    name: 'Longhui Mai',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_shine_wheat',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'draco_gleam7_wheat',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 79 },
    discoveryText: 'The fusion of the divine power of Yaoguang Gua and Yuehui Mai has the power of a divine beast. '
  },
  {
    id: 'fenghuang_gleam7_sesame',
    name: 'Fenghuizhi',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_shine_sesame',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'fenghuang_gleam7_sesame',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: 'Yao Guang Gua and Sun Hui Zhi, dragons and phoenixes sing, and auspicious beasts come to the world. '
  },
  {
    id: 'qilin_gleam7_pepper',
    name: 'Lin Huijiao',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_shine_pepper',
    minSweetness: 79,
    minYield: 79,resultCropId: 'qilin_gleam7_pepper',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 80 },
    discoveryText: 'Yaoguang melons and radiant peppers roar in the mountains and cranes dance for nine days. '
  },
  {
    id: 'crane_gleam7_root',
    name: 'Hehui Ginseng',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_shine_root',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'crane_gleam7_root',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: 'The Yaoguang melon and jade glow are shining brightly, and hundreds of beasts are worshiping. '
  },
  {
    id: 'tiger_gleam7_sprout',
    name: 'Hu Hui Ya',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_shine_sprout',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'tiger_gleam7_sprout',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: 'The Yaoguang Gua and Liuhui Bud dragons came out of the water and shocked all directions. '
  },
  {
    id: 'draco_shadow_vine',
    name: 'Dragon Shadow Vine',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'silver_shine_vine',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'draco_shadow_vine',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: 'The fusion of the divine power of Yaoguang Melon and Yinhui Vine has the power of a divine beast. '
  },
  {
    id: 'fenghuang_shadow_bud',
    name: 'Feng Yinglei',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'verdant_shine_bud',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'fenghuang_shadow_bud',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 83 },
    discoveryText: 'Yao Guangguang and Cui Huilei, dragons and phoenixes roar, and auspicious beasts come to the world. '
  },
  {
    id: 'qilin_shadow_orchid',
    name: 'Linyinglan',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'violet_shine_orchid',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'qilin_shadow_orchid',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: 'Yaoguang melons and purple orchids roar in the mountains, and cranes dance for nine days. '
  },
  {
    id: 'crane_shadow_gourd',
    name: 'Crane Shadow Gourd',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'scarlet_shine_gourd',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'crane_shadow_gourd',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 84 },
    discoveryText: 'The Yaoguang melon and Danhui gourd are shining brightly, and hundreds of beasts are worshiping them. '
  },
  {
    id: 'tiger_shadow_herb',
    name: 'Tiger Shadow Grass',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'azure_shine_herb',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'tiger_shadow_herb',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: 'The Yaoguang Gua and Qinghui Grass Dragons came out of the water and shocked all directions. '
  },
  {
    id: 'draco_roar_chestnut',
    name: 'Long Xiaoli',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_fortune_chestnut',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'draco_roar_chestnut',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: 'The fusion of the divine power of Yaoguang Gua and Yue Ruili has the power of a divine beast. '
  },
  {
    id: 'fenghuang_roar_apricot',
    name: 'Fengxiaoxing',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_fortune_apricot',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'fenghuang_roar_apricot',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },discoveryText: 'The Yaoguang melon and the auspicious apricot, the dragon and the phoenix sing, and the auspicious beast comes to the world. '
  },
  {
    id: 'qilin_roar_pear',
    name: 'Lin Xiaoli',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_fortune_pear',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'qilin_roar_pear',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: 'Yaoguang melon and Tianrui pear. Tigers roar in the mountains and forests, and cranes dance for nine days. '
  },
  {
    id: 'crane_roar_berry',
    name: 'Crane Roaring Berry',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_fortune_berry',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'crane_roar_berry',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: 'The Yaoguang melon and jadeberry are shining brightly, and all kinds of beasts are worshiping them. '
  },
  {
    id: 'tiger_roar_peach_t',
    name: 'Tiger Roaring Peach',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_fortune_peach_t',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'tiger_roar_peach_t',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: 'Yaoguanggua and Liuruitao dragons came out of the water, shocking all directions. '
  },
  // === Eight generations of hybrid crops ===,
  {
    id: 'supreme_origin_melon',
    name: 'Taichu Melon',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_light5_melon',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'supreme_origin_melon',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 78 },
    discoveryText: 'Lingmiao melon and Yaoguang melon condense the energy of heaven and earth, and are full of vitality. '
  },
  {
    id: 'firmament_origin_bean',
    name: 'Dry first beans',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_light5_bean',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'firmament_origin_bean',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: 'Lingmiao Melon and Qiongguang Bean are in harmony with each other, and Yin and Yang are in harmony. '
  },
  {
    id: 'terra_origin_rice',
    name: 'kunchudao',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_light5_rice',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'terra_origin_rice',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 79 },
    discoveryText: 'The primordial power of Lingmiao Melon and Rose Light Rice awakens, and Hunyuan is unified. '
  },
  {
    id: 'primal_origin_tuber',
    name: 'Yuanchu potato',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_light5_tuber',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'primal_origin_tuber',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 80 },
    discoveryText: 'Lingmiao Melon and Sunlight Sweet Potato, the light from the celestial end comes, and everything returns to its original state. '
  },
  {
    id: 'chaos_origin_green',
    name: 'Hunchucai',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_light5_green',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'chaos_origin_green',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 80 },
    discoveryText: 'Lingmiaogua and Liguangcai's vitality has just begun to open up, and Taiyi is manifested. '
  },
  {
    id: 'supreme_vital8_fruit',
    name: 'Tai Ling Guo',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_hua5_fruit',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'supreme_vital8_fruit',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 81 },
    discoveryText: 'Lingmiao melon and Yaohua fruit condense the energy of heaven and earth, and are full of vitality. '
  },
  {
    id: 'firmament_vital8_bloom',
    name: 'Qianlinghua',parentCropA: 'draco_song_melon',
    parentCropB: 'rare_hua5_bloom',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'firmament_vital8_bloom',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: 'Lingmiao melon and Qionghua flower make the heaven and earth harmonious, and the yin and yang are in harmony. '
  },
  {
    id: 'terra_vital8_tea',
    name: 'Kun Ling Tea',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_hua5_tea',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'terra_vital8_tea',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 82 },
    discoveryText: 'The primordial power of Lingmiao Melon and Rose Tea awakens, and Hunyuan is unified. '
  },
  {
    id: 'primal_vital8_shoot',
    name: 'Yuan Ling Bamboo Shoot',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_hua5_shoot',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'primal_vital8_shoot',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: 'Spiritual melons and radiant bamboo shoots, the light from the sky descends, and everything returns to its original state. '
  },
  {
    id: 'chaos_vital8_lotus',
    name: 'Hunlinglian',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_hua5_lotus',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'chaos_vital8_lotus',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: 'The vitality of Lingmiao Melon and Lihua Lotus is beginning to bloom, and Taiyi is manifested. '
  },
  {
    id: 'supreme_glory8_wheat',
    name: 'Taihua Mai',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_dewdrop_wheat',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'supreme_glory8_wheat',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 84 },
    discoveryText: 'Lingmiao Melon and Yaolumai condense the energy of heaven and earth, and are full of vitality. '
  },
  {
    id: 'firmament_glory8_sesame',
    name: 'ganhuazhi',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_dewdrop_sesame',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'firmament_glory8_sesame',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 84 },
    discoveryText: 'Lingmiao Melon and Qiongluzhi are in harmony with each other, and the yin and yang are in harmony. '
  },
  {
    id: 'terra_glory8_pepper',
    name: 'Kun Huajiao',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_dewdrop_pepper',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'terra_glory8_pepper',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 85 },
    discoveryText: 'The primordial power of Lingmiao Melon and Rose Dew Pepper awakens, and Hunyuan is unified. '
  },
  {
    id: 'primal_glory8_root',
    name: 'Yuanhua Ginseng',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_dewdrop_root',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'primal_glory8_root',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: 'The light of the magical melon and the towering sun dew descends, and everything returns to its original state. '
  },
  {
    id: 'chaos_glory8_sprout',
    name: 'Hunhuaya',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_dewdrop_sprout',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'chaos_glory8_sprout',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: 'Lingmiao Gua and Liluya's vitality has just begun to bloom, and Taiyi is manifested. '
  },
  {
    id: 'supreme_zenith_vine',
    name: 'Tai Chi Vine',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_soul_vine',
    minSweetness: 86,
    minYield: 86,resultCropId: 'supreme_zenith_vine',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: 'Lingmiao Melon and Yao Ling Vine condense the energy of heaven and earth, and are full of vitality. '
  },
  {
    id: 'firmament_zenith_bud',
    name: 'ganjilei',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_soul_bud',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'firmament_zenith_bud',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: 'Lingmiao Gua and Qiong Linglei are in perfect harmony, and Yin and Yang are in harmony. '
  },
  {
    id: 'terra_zenith_orchid',
    name: 'Kunjilan',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_soul_orchid',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'terra_zenith_orchid',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: 'The primordial power of Lingmiao Melon and Rose Spirit Orchid awakens, and Hunyuan is unified. '
  },
  {
    id: 'primal_zenith_gourd',
    name: 'Yuanji Gourd',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_soul_gourd',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'primal_zenith_gourd',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: 'The light of Lingmiao Melon and Xi Ling Gourd comes from the sky, and everything returns to its original state. '
  },
  {
    id: 'chaos_zenith_herb',
    name: 'Hunjicao',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_soul_herb',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'chaos_zenith_herb',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: 'The vitality of Lingmiao Melon and Glass Lingcao is beginning to bloom, and Taiyi is manifested. '
  },
  {
    id: 'supreme_core_chestnut',
    name: 'Taiyuanli',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_silk5_chestnut',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'supreme_core_chestnut',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: 'Lingmiao Melon and Yao Jinli condense the energy of heaven and earth, and are full of vitality. '
  },
  {
    id: 'firmament_core_apricot',
    name: 'Qianyuan Xing',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_silk5_apricot',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'firmament_core_apricot',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: 'Lingmiao Melon and Qiongjinxing are in perfect harmony with each other, and the yin and yang are in harmony. '
  },
  {
    id: 'terra_core_pear',
    name: 'Kunyuanli',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_silk5_pear',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'terra_core_pear',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: 'The primordial power of Lingmiao Melon and Rose Gold Pear awakens, and Hunyuan is unified. '
  },
  {
    id: 'primal_core_berry',
    name: 'Yuanyuanberry',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_silk5_berry',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'primal_core_berry',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 91 },
    discoveryText: 'The celestial light of Lingmiao Melon and Xijinberry comes, and everything returns to its original state. '
  },
  {
    id: 'chaos_core_peach_t',
    name: 'Hunyuan Tao',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_silk5_peach_t',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'chaos_core_peach_t',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },discoveryText: 'The vitality of Lingmiao Gua and Li Jintao is beginning to bloom, and Taiyi is manifested. '
  },
  // === Nine generations of hybrid crops ===,
  {
    id: 'vast_meng_melon',
    name: 'Hongmeng Gua',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_wonder_melon',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'vast_meng_melon',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: 'The power of the Longyin Melon and the Lingmiao Melon merge together to transform into a spiritual realm. '
  },
  {
    id: 'ancient_meng_bean',
    name: 'Gumengdou',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_wonder_bean',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'ancient_meng_bean',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: 'The ancient energy of Longyin Melon and Immortal Miao Bean created the world. '
  },
  {
    id: 'infinite_meng_rice',
    name: 'Wumengdao',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_wonder_rice',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'infinite_meng_rice',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: 'The infinite way of Longyin Melon and Holy Miaodao appears, mysterious and mysterious. '
  },
  {
    id: 'primeval_meng_tuber',
    name: 'Hongmengshu',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_wonder_tuber',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'primeval_meng_tuber',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: 'The dragon's chanting melon and the magical potato are so powerful that they transcend all things. '
  },
  {
    id: 'genesis_meng_green',
    name: 'Kaimeng cuisine',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_wonder_green',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'genesis_meng_green',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: 'The first judgment between Longyin Melon and Real Wonderful Vegetable is made by Hongmeng, and the color of heaven and earth changes. '
  },
  {
    id: 'vast_apex9_fruit',
    name: 'Hongjiguo',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_grace6_fruit',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'vast_apex9_fruit',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: 'The power of the Longyin Melon and the Linghua Fruit converge to create a spiritual realm. '
  },
  {
    id: 'ancient_apex9_bloom',
    name: 'Gujihua',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_grace6_bloom',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'ancient_apex9_bloom',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: 'The ancient energy of Longyin Melon and Immortal Flower created the world. '
  },
  {
    id: 'infinite_apex9_tea',
    name: 'Wuji Tea',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_grace6_tea',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'infinite_apex9_tea',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: 'The infinite way of Longyin Melon and Shenghua Tea appears, mysterious and mysterious. '
  },
  {
    id: 'primeval_apex9_shoot',
    name: 'Hongji Bamboo Shoot',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_grace6_shoot',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'primeval_apex9_shoot',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 89 },
    discoveryText: 'The Dragon Chanting Melon and the Divine Flower Bamboo Shoot are so powerful that they transcend all things. '
  },
  {
    id: 'genesis_apex9_lotus',
    name: 'Kai Ji Lian',parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_grace6_lotus',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'genesis_apex9_lotus',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: 'The first judgment between the dragon chanting melon and the true flower lotus made the world change color. '
  },
  {
    id: 'vast_wilder_wheat',
    name: 'Honghuangmai',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_phantom_wheat',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'vast_wilder_wheat',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 90 },
    discoveryText: 'The power of Longyin Melon and Spiritual Fantasy Mai Hongmeng merge together to transform into a spiritual realm. '
  },
  {
    id: 'ancient_wilder_sesame',
    name: 'Guhuangzhi',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_phantom_sesame',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'ancient_wilder_sesame',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 90 },
    discoveryText: 'The ancient Qi of Longyin Melon and Immortal Fantasy Zhi created the world. '
  },
  {
    id: 'infinite_wilder_pepper',
    name: '无野香',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_phantom_pepper',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'infinite_wilder_pepper',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: 'The Wuji way of Longyin Melon and Holy Fantasy Pepper appears, which is mysterious and mysterious. '
  },
  {
    id: 'primeval_wilder_root',
    name: 'Honghuang Ginseng',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_phantom_root',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'primeval_wilder_root',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: 'The dragon's chanting melon and the divine illusion are powerful and transcend all things. '
  },
  {
    id: 'genesis_wilder_sprout',
    name: 'Opening up wasteland',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_phantom_sprout',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'genesis_wilder_sprout',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: 'The dragon chanting melon and the true fantasy bud Hongmeng made the first judgment, and the color of the world changed. '
  },
  {
    id: 'vast_empyrean_vine',
    name: 'Hongtian Teng',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_dream_vine',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'vast_empyrean_vine',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 92 },
    discoveryText: 'The power of Longyin Melon and Lingmeng Vine merge together to transform into a spiritual realm. '
  },
  {
    id: 'ancient_empyrean_bud',
    name: 'Gu Tianlei',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_dream_bud',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'ancient_empyrean_bud',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: 'The ancient Qi of Longyin Gua and Xian Menglei created the world. '
  },
  {
    id: 'infinite_empyrean_orchid',
    name: 'Wutianlan',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_dream_orchid',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'infinite_empyrean_orchid',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: 'The Wuji way of Longyin Gua and Shengmeng Lan appears, which is mysterious and mysterious. '
  },
  {
    id: 'primeval_empyrean_gourd',
    name: 'Hongtian Gourd',
    parentCropA: 'supreme_origin_melon',parentCropB: 'divine_dream_gourd',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'primeval_empyrean_gourd',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: 'The dragon chanting melon and the divine dream gourd are so powerful that they transcend all things. '
  },
  {
    id: 'genesis_empyrean_herb',
    name: 'kaitiancao',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_dream_herb',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'genesis_empyrean_herb',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: 'Dragon chanting melon and true dream grass Hongmeng's first judgment, the world changes color. '
  },
  {
    id: 'vast_spirit9_chestnut',
    name: 'Honglingli',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_zen_chestnut',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'vast_spirit9_chestnut',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: 'The power of Longyin Gua and Lingchan Li Hongmeng merged to form a spiritual realm. '
  },
  {
    id: 'ancient_spirit9_apricot',
    name: 'Gulingxing',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_zen_apricot',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'ancient_spirit9_apricot',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: 'Long Yin Melon and Immortal Zen Apricot's ancient prehistoric energy created the world. '
  },
  {
    id: 'infinite_spirit9_pear',
    name: 'Wulingli',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_zen_pear',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'infinite_spirit9_pear',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: 'The Wuji way of Longyin Gua and Shengchan Pear appears, mysterious and mysterious. '
  },
  {
    id: 'primeval_spirit9_berry',
    name: 'Honglingberry',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_zen_berry',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'primeval_spirit9_berry',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: 'The dragon chanting melon and the divine Zen berry are so powerful that they transcend all things. '
  },
  {
    id: 'genesis_spirit9_peach_t',
    name: 'kailingtao',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_zen_peach_t',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'genesis_spirit9_peach_t',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: 'The first judgment between Longyin Melon and Zhenzen Peach Hongmeng made the world change color. '
  },
  // === Ten generations of hybrid crops ===,
  {
    id: 'creation_change_melon',
    name: 'Good Fortune Melon',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_song_melon',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'creation_change_melon',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: 'The Taichu Melon and the Longyin Melon were created by the power of creation and are eternal products. '
  },
  {
    id: 'eternal_change_bean',
    name: 'Yonghua Bean',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_song_bean',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'eternal_change_bean',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: 'The Taichu Melon and the Feng Yin Bean are destined to return, and everything is renewed. '
  },
  {
    id: 'undying_change_rice',
    name: 'Unchangeable Rice',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_song_rice',minSweetness: 89,
    minYield: 89,
    resultCropId: 'undying_change_rice',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: 'The Taichu Melon and the Linyin Rice are immortal reincarnations and reborn in Nirvana. '
  },
  {
    id: 'heavenly_change_tuber',
    name: 'Tianhuashu',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_song_tuber',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'heavenly_change_tuber',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 91 },
    discoveryText: 'The Taichu Melon and the Crane Yin Potato were created by nature to trick people, and eventually they became the ultimate treasure. '
  },
  {
    id: 'myriad_change_green',
    name: 'Wanhuacai',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_song_green',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'myriad_change_green',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: 'The eternal light of Taichu Melon and Tiger Yincai shines on the heaven and earth. '
  },
  {
    id: 'creation_lasting_fruit',
    name: 'Creating Everlasting Fruit',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_dance_fruit',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'creation_lasting_fruit',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: 'The Taichu Melon and the Dragon Dance Fruit were created by the power of creation and are eternal products. '
  },
  {
    id: 'eternal_lasting_bloom',
    name: 'Eternal Flower',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_dance_bloom',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'eternal_lasting_bloom',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: 'The Taichu melon and the phoenix flower are destined to return, and everything is renewed. '
  },
  {
    id: 'undying_lasting_tea',
    name: 'Bu Heng Tea',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_dance_tea',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'undying_lasting_tea',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: 'Taichu Melon and Linwu Tea are immortal in reincarnation and reborn in Nirvana. '
  },
  {
    id: 'heavenly_lasting_shoot',
    name: 'Tianheng Bamboo Shoot',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_dance_shoot',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'heavenly_lasting_shoot',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: 'The Taichu Melon and the Crane and the Dancing Bamboo Shoots were created by nature and eventually became a treasure. '
  },
  {
    id: 'myriad_lasting_lotus',
    name: 'Wanhenglian',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_dance_lotus',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'myriad_lasting_lotus',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: 'The eternal light of Taichu Melon and Tiger Dance Lotus illuminates the heaven and earth. '
  },
  {
    id: 'creation_timeless_wheat',
    name: 'Making rotten wheat',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_gleam7_wheat',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'creation_timeless_wheat',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: 'The creation power of Taichu Melon and Longhui Wheat is an eternal and immortal product. '
  },
  {
    id: 'eternal_timeless_sesame',
    name: 'Yongxianzhi',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_gleam7_sesame',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'eternal_timeless_sesame',baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: 'Taichu Gua and Feng Huizhi are destined to return, and everything is renewed. '
  },
  {
    id: 'undying_timeless_pepper',
    name: 'immortal pepper',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_gleam7_pepper',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'undying_timeless_pepper',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: 'The Taichu Melon and the Linhui Pepper are immortal in reincarnation and reborn in Nirvana. '
  },
  {
    id: 'heavenly_timeless_root',
    name: 'Tianxian Ginseng',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_gleam7_root',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'heavenly_timeless_root',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: 'The Taichu Melon and the Crane Hui participated in the creation of man, and eventually became a treasure. '
  },
  {
    id: 'myriad_timeless_sprout',
    name: 'Wanxianya',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_gleam7_sprout',
    minSweetness: 94,
    minYield: 94,
    resultCropId: 'myriad_timeless_sprout',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 96 },
    discoveryText: 'The eternal light of Taichu melon and tiger buds shines on the heaven and earth. '
  },
  {
    id: 'creation_destiny_vine',
    name: 'Life-making Vine',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_shadow_vine',
    minSweetness: 94,
    minYield: 94,
    resultCropId: 'creation_destiny_vine',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: 'The creation power of Taichu Melon and Dragon Shadow Vine is an eternal and immortal product. '
  },
  {
    id: 'eternal_destiny_bud',
    name: 'Yongminglei',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_shadow_bud',
    minSweetness: 95,
    minYield: 95,
    resultCropId: 'eternal_destiny_bud',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 97 },
    discoveryText: 'Taichu Gua and Feng Yinglei are destined to return, and everything is renewed. '
  },
  {
    id: 'undying_destiny_orchid',
    name: 'Bu Minglan',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_shadow_orchid',
    minSweetness: 95,
    minYield: 95,
    resultCropId: 'undying_destiny_orchid',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 97 },
    discoveryText: 'Taichu Melon and Lin Yinglan are immortal reincarnations and reborn in Nirvana. '
  },
  {
    id: 'heavenly_destiny_gourd',
    name: 'Destiny Gourd',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_shadow_gourd',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'heavenly_destiny_gourd',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },
    discoveryText: 'The Taichu Melon and the Crane Shadow Gourd play tricks on people and eventually become treasures. '
  },
  {
    id: 'myriad_destiny_herb',
    name: 'Wanmingcao',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_shadow_herb',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'myriad_destiny_herb',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },
    discoveryText: 'The eternal light of Taichu Melon and Tiger Shadow Grass illuminates the heaven and earth. '
  },
  {
    id: 'creation_form_chestnut',
    name: 'Xiangxiang chestnut',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_roar_chestnut',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'creation_form_chestnut',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },discoveryText: 'The creation power of Taichu Melon and Longxiaoli is an eternal and immortal product. '
  },
  {
    id: 'eternal_form_apricot',
    name: 'Yongxiangxing',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_roar_apricot',
    minSweetness: 97,
    minYield: 97,
    resultCropId: 'eternal_form_apricot',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 99 },
    discoveryText: 'Taichu Melon and Fengxiaoxing are destined to return, and everything is renewed. '
  },
  {
    id: 'undying_form_pear',
    name: 'Not like a pear',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_roar_pear',
    minSweetness: 97,
    minYield: 97,
    resultCropId: 'undying_form_pear',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 99 },
    discoveryText: 'Taichu Melon and Lin Xiaoli are immortal reincarnations and reborn in Nirvana. '
  },
  {
    id: 'heavenly_form_berry',
    name: 'Astroberry',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_roar_berry',
    minSweetness: 98,
    minYield: 98,
    resultCropId: 'heavenly_form_berry',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 100 },
    discoveryText: 'The Taichu Melon and the Crane's Roaring Berry confuse people with fate and eventually become a treasure. '
  },
  {
    id: 'myriad_form_peach_t',
    name: 'Wanxiang Tao',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_roar_peach_t',
    minSweetness: 98,
    minYield: 98,
    resultCropId: 'myriad_form_peach_t',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 100 },
    discoveryText: 'The eternal light of Taichu Melon and Tiger Roaring Peach shines on the heaven and earth. '
  }
]

/** Hybrid breed tier (tier) division: based on HYBRID_DEFS array order */
const TIER_COUNTS = [100, 50, 50, 50, 25, 25, 25, 25, 25, 25] // T1..T10
const _tierMap = new Map<string, number>()
let _offset = 0
for (let t = 0; t < TIER_COUNTS.length; t++) {
  for (let i = 0; i < TIER_COUNTS[t]!; i++) {
    const def = HYBRID_DEFS[_offset + i]
    if (def) _tierMap.set(def.id, t + 1)
  }
  _offset += TIER_COUNTS[t]!
}

/** Get the stratum (1-10) of the hybrid breed */
export const getHybridTier = (hybridId: string): number => _tierMap.get(hybridId) ?? 1

/** Find possible hybridization recipes */
export const findPossibleHybrid = (cropIdA: string, cropIdB: string): HybridDef | null => {
  return (
    HYBRID_DEFS.find(
      h => (h.parentCropA === cropIdA && h.parentCropB === cropIdB) || (h.parentCropA === cropIdB && h.parentCropB === cropIdA)
    ) ?? null
  )
}

/** Find the recipe based on the hybrid ID */
export const findPossibleHybridById = (hybridId: string): HybridDef | null => {
  return HYBRID_DEFS.find(h => h.id === hybridId) ?? null
}

/** The probability of the seed making machine producing breeding seeds */
export const getSeedMakerGeneticChance = (farmingLevel: number): number => {
  return 0.3 + farmingLevel * 0.03
}
