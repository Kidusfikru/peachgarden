import type { FarmMapType } from '@/types'

export interface FarmMapDef {
  type: FarmMapType
  name: string
  description: string
  bonus: string
}

export const FARM_MAP_DEFS: FarmMapDef[] = [
  {
    type: 'standard',
    name: 'Taoyuan Grange',
    description: 'The vast plains are most suitable for large-scale planting. ',
    bonus: 'Initially 6×6, can be expanded to 10×10, automatic fertilization in seasons (upgraded with planting level), 15% additional harvest'
  },
  {
    type: 'riverland',
    name: 'Stream Grange',
    description: 'The fields surrounded by rivers are rich in aquatic products. ',
    bonus: 'Fishing experience +25%, fish selling price +10%, daily stream fish catch, fish quality improved on rainy days'
  },
  {
    type: 'forest',
    name: 'Bamboo Forest Farm',
    description: 'In the forest glade, there are many kinds of collected species. ',
    bonus: 'Collection experience +25%, 20% double collection, daily scavenging in the forest'
  },
  {
    type: 'hilltop',
    name: 'Hill Grange',
    description: 'The terraces on the mountainside contain mineral veins. ',
    bonus: 'Mining experience +25%, ore +1, farm surface ore vein'
  },
  {
    type: 'wilderness',
    name: 'Wilderness Grange',
    description: 'Remote wasteland, wild beasts appear at night. ',
    bonus: 'Combat experience +50%, daily ore acquisition, night beast encounters'
  },
  {
    type: 'meadowlands',
    name: 'Meadow Grange',
    description: 'Open pasture, suitable for raising livestock. ',
    bonus: 'Starting chicken coop +2 chickens, friendliness +50%, animals not sick, extra output'
  }
]