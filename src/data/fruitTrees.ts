import type { FruitTreeDef } from '@/types'

/** Fruit tree definition */
export const FRUIT_TREE_DEFS: FruitTreeDef[] = [
  {
    type: 'peach_tree',
    name: 'peach tree',
    saplingId: 'sapling_peach',
    saplingPrice: 300,
    fruitId: 'tree_peach',
    fruitName: 'fresh peach',
    fruitSeason: 'spring',
    growthDays: 28,
    fruitSellPrice: 60
  },
  {
    type: 'lychee_tree',
    name: 'lychee tree',
    saplingId: 'sapling_lychee',
    saplingPrice: 400,
    fruitId: 'lychee',
    fruitName: 'lychee',
    fruitSeason: 'summer',
    growthDays: 28,
    fruitSellPrice: 80
  },
  {
    type: 'mandarin_tree',
    name: 'Orange Tree',
    saplingId: 'sapling_mandarin',
    saplingPrice: 350,
    fruitId: 'mandarin',
    fruitName: 'orange',
    fruitSeason: 'autumn',
    growthDays: 28,
    fruitSellPrice: 70
  },
  {
    type: 'plum_tree',
    name: 'Plum Tree',
    saplingId: 'sapling_plum',
    saplingPrice: 500,
    fruitId: 'plum_blossom',
    fruitName: 'Plum Blossom',
    fruitSeason: 'winter',
    growthDays: 28,
    fruitSellPrice: 100
  },
  {
    type: 'apricot_tree',
    name: 'apricot tree',
    saplingId: 'sapling_apricot',
    saplingPrice: 350,
    fruitId: 'apricot',
    fruitName: 'apricot',
    fruitSeason: 'spring',
    growthDays: 28,
    fruitSellPrice: 55
  },
  {
    type: 'pomegranate_tree',
    name: 'Pomegranate Tree',
    saplingId: 'sapling_pomegranate',
    saplingPrice: 500,
    fruitId: 'pomegranate',
    fruitName: 'pomegranate',
    fruitSeason: 'summer',
    growthDays: 28,
    fruitSellPrice: 95
  },
  {
    type: 'persimmon_tree',
    name: 'Persimmon Tree',
    saplingId: 'sapling_persimmon',
    saplingPrice: 400,
    fruitId: 'persimmon',
    fruitName: 'fresh persimmon',
    fruitSeason: 'autumn',
    growthDays: 28,
    fruitSellPrice: 85
  },
  {
    type: 'hawthorn_tree',
    name: 'Hawthorn Tree',
    saplingId: 'sapling_hawthorn',
    saplingPrice: 350,
    fruitId: 'hawthorn',
    fruitName: 'Hawthorn',
    fruitSeason: 'winter',
    growthDays: 28,
    fruitSellPrice: 65
  }
]

/** Maximum number of fruit trees */
/** The upper limit of the fruit tree position: take a multiple of 9 to facilitate 3×3 patch planning */
export const MAX_FRUIT_TREES = 9

export const getFruitTreeDef = (type: string): FruitTreeDef | undefined => {
  return FRUIT_TREE_DEFS.find(d => d.type === type)
}