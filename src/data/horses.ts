/**
 *Horse breed.
 *
 * It turns out that there is only one kind of horse, which only affects the speed of travel. There is no reward for raising the favorability level.
 * Here are three grades: ordinary horses can be bought directly, good horses must be exchanged through rare channels,
 * And let the favorability factor really play a role - a horse that is familiar with its owner will have less effort to travel, and it will also help to gather the livestock when grazing.
 */
export type HorseBreed = 'common' | 'steppe' | 'cloud' | 'divine'

export interface HorseBreedDef {
  id: HorseBreed
  name: string
  description: string
  /** Travel time multiplier, the lower, the faster */
  travelTimeMultiplier: number
  /** Travel stamina consumption multiplier */
  travelStaminaMultiplier: number
  /** The triggering probability of additional output for each livestock when grazing */
  graceBonusChance: number
  /** Obtaining method description */
  sourceHint: string
}

export const HORSE_BREEDS: HorseBreedDef[] = [
  {
    id: 'common',
    name: 'Tuma',
    description: 'A common packhorse in the village, with a docile temperament, it is better to rush than to walk. ',
    travelTimeMultiplier: 0.7,
    travelStaminaMultiplier: 0.5,
    graceBonusChance: 0.05,
    sourceHint: 'Stable purchase'
  },
  {
    id: 'steppe',
    name: 'Prairie Horse',
    description: 'A good horse brought by the Hanhai Caravan, with excellent endurance. ',
    travelTimeMultiplier: 0.55,
    travelStaminaMultiplier: 0.4,
    graceBonusChance: 0.12,
    sourceHint: 'Hanhai Commerce Points Redemption'
  },
  {
    id: 'cloud',
    name: 'Stepping on the Cloud Horse',
    description: 'It is said that he can walk on clouds and have wind under his hooves. ',
    travelTimeMultiplier: 0.4,
    travelStaminaMultiplier: 0.3,
    graceBonusChance: 0.2,
    sourceHint: 'Adventurers Guild High Level Bounty'
  },
  {
    id: 'divine',
    name: 'Dragon Horse',
    description: 'According to legend, he was transformed from a dragon species, which understands human nature and knows the way home. ',
    travelTimeMultiplier: 0.3,
    travelStaminaMultiplier: 0.2,
    graceBonusChance: 0.3,
    sourceHint: 'Given by Immortal Fate·Dragon Spirit'
  }
]

export const getHorseBreed = (id: HorseBreed | undefined): HorseBreedDef => {
  return HORSE_BREEDS.find(b => b.id === id) ?? HORSE_BREEDS[0]!
}

/**
 * The bonus coefficient of favorability to the horse's ability (0~1).
 * When the character is full of favor, an additional 10% reduction in time and stamina will be provided, and the probability of grazing assistance will be increased.
 */
export const getHorseBondFactor = (friendship: number): number => {
  return Math.min(1, Math.max(0, friendship / 1000))
}

/** The upper limit of additional time reduction brought by the horse's favor */
export const HORSE_BOND_TIME_BONUS = 0.1

/** The upper limit of additional physical strength reduction brought by the horse's favor */
export const HORSE_BOND_STAMINA_BONUS = 0.15

/** The upper limit of the probability of additional grazing assistance brought by the horse's favor */
export const HORSE_BOND_GRAZE_BONUS = 0.15