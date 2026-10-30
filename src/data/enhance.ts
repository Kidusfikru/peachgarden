import type { EnhanceCostDef, EquipmentEffectType } from '@/types'

/** Maximum level of equipment enhancement */
export const MAX_ENHANCE_LEVEL = 10

/** The effect bonus of each level of enhancement: the effect is doubled at +10 */
export const ENHANCE_BONUS_PER_LEVEL = 0.1

/** Strengthening cost (level is the target level), success rate 100% */
export const ENHANCE_COSTS: EnhanceCostDef[] = [
  { level: 1, money: 1000, materials: [{ itemId: 'iron_bar', quantity: 3 }] },
  { level: 2, money: 2000, materials: [{ itemId: 'iron_bar', quantity: 5 }] },
  { level: 3, money: 4000, materials: [{ itemId: 'iron_bar', quantity: 8 }] },
  { level: 4, money: 8000, materials: [{ itemId: 'gold_bar', quantity: 3 }] },
  { level: 5, money: 15000, materials: [{ itemId: 'gold_bar', quantity: 5 }] },
  { level: 6, money: 25000, materials: [{ itemId: 'gold_bar', quantity: 8 }] },
  { level: 7, money: 40000, materials: [{ itemId: 'iridium_bar', quantity: 3 }] },
  { level: 8, money: 60000, materials: [{ itemId: 'iridium_bar', quantity: 5 }] },
  { level: 9, money: 90000, materials: [{ itemId: 'iridium_bar', quantity: 8 }] },
  {
    level: 10,
    money: 150000,
    materials: [
      { itemId: 'iridium_bar', quantity: 10 },
      { itemId: 'prismatic_shard', quantity: 1 }
    ]
  }
]

/** The cost to upgrade to the target level, if it exceeds the range, return null */
export const getEnhanceCost = (targetLevel: number): EnhanceCostDef | null => ENHANCE_COSTS.find(c => c.level === targetLevel) ?? null

/** Regularity enhancement level: Default / out-of-bounds / non-digits all converge to 0-10 */
export const normalizeEnhanceLevel = (level: number | undefined): number => {
  const value = Math.floor(level ?? 0)
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(value, MAX_ENHANCE_LEVEL)
}

/** Strengthening multiplier: 1 + 0.1 × level */
export const getEnhanceMultiplier = (level: number | undefined): number => 1 + ENHANCE_BONUS_PER_LEVEL * normalizeEnhanceLevel(level)

/** Enhanced weapon attack power (rounded) */
export const getEnhancedAttack = (baseAttack: number, level: number | undefined): number =>
  Math.round(baseAttack * getEnhanceMultiplier(level))

/** Effects calculated in integers (attack, life, ore number), rounded after amplification */
const INTEGER_EFFECT_TYPES = new Set<EquipmentEffectType>(['attack_bonus', 'max_hp_bonus', 'ore_bonus'])

/** The effect value of a single piece of equipment is amplified according to the enhancement level */
export const scaleEffectValue = (type: EquipmentEffectType, value: number, level: number | undefined): number => {
  const scaled = value * getEnhanceMultiplier(level)
  return INTEGER_EFFECT_TYPES.has(type) ? Math.round(scaled) : scaled
}

/**
 * Superposition upper limit: These effects are calculated based on "1 - value". After strengthening, the total cannot exceed the upper limit.
 * Otherwise, there will be negative price, negative time consumption, and negative damage. The upper limit is higher than the maximum superposition value without strengthening, and does not affect the original balance.
 */
export const EQUIPMENT_EFFECT_CAPS: Partial<Record<EquipmentEffectType, number>> = {
  defense_bonus: 0.8,
  stamina_reduction: 0.9,
  farming_stamina: 0.9,
  mining_stamina: 0.9,
  fishing_stamina: 0.9,
  fishing_calm: 0.9,
  shop_discount: 0.9,
  travel_speed: 0.9
}

/** Apply stacking limit */
export const capEffectTotal = (type: EquipmentEffectType, total: number): number => {
  const cap = EQUIPMENT_EFFECT_CAPS[type]
  return cap === undefined ? total : Math.min(total, cap)
}

/** Equipment display name: Enhanced with "+N" */
export const formatEnhanceName = (name: string, level: number | undefined): string => {const value = normalizeEnhanceLevel(level)
  return value > 0 ? `${name}+${value}` : name
}

/** Equipment effect name */
export const EQUIPMENT_EFFECT_NAMES: Record<EquipmentEffectType, string> = {
  attack_bonus: 'Attack power',
  crit_rate_bonus: 'Crit rate',
  defense_bonus: 'damage reduction',
  vampire: 'vampiric',
  max_hp_bonus: 'Maximum HP',
  stamina_reduction: 'Stamina consumption reduction',
  mining_stamina: 'Mining stamina reduced',
  farming_stamina: 'Farming stamina reduced',
  fishing_stamina: 'Fishing stamina reduced',
  crop_quality_bonus: 'Crop quality',
  crop_growth_bonus: 'Crop growth acceleration',
  fish_quality_bonus: 'Fish quality',
  fishing_calm: 'Fish comfort',
  sell_price_bonus: 'selling price bonus',
  shop_discount: 'shop discount',
  gift_friendship: 'Gift-giving favor',
  monster_drop_bonus: 'Monster drop',
  exp_bonus: 'Experience bonus',
  treasure_find: 'Treasure chest discovery rate',
  ore_bonus: 'Extra ore',
  luck: 'lucky',
  travel_speed: 'Travel acceleration'
}

/** Effect numerical display: attack, life, ore are integers, and the rest are percentages (retaining one decimal place) */
export const formatEquipmentEffectValue = (type: EquipmentEffectType, value: number): string =>
  INTEGER_EFFECT_TYPES.has(type) ? `+${value}` : `+${Math.round(value * 1000) / 10}%`