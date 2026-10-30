import type { EquipmentEffectType } from '@/types'

/** Set reward level */
export interface SetBonusLevel {
  count: 2 | 3 | 4
  effects: { type: EquipmentEffectType; value: number }[]
  description: string
}

/** Equipment set definition */
export interface EquipmentSetDef {
  id: string
  name: string
  description: string
  pieces: {
    weapon?: string
    ring: string
    hat: string
    shoes: string
  }
  bonuses: SetBonusLevel[]
}

export const EQUIPMENT_SETS: EquipmentSetDef[] = [
  // === Early stage (available in store) ===
  {
    id: 'miner_set',
    name: 'Miner Set',
    description: 'Standard equipment for professional miners',
    pieces: { ring: 'miners_ring', hat: 'miner_helmet', shoe: 'miner_boots' },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'ore_bonus', value: 1 }],
        description: 'Ore bonus +1'
      },
      {
        count: 3,
        effects: [{ type: 'mining_stamina', value: 0.1 }],
        description: 'Mining physical consumption -10%'
      }
    ]
  },
  {
    id: 'fisher_set',
    name: 'Fisherman Suit',
    description: 'A seasoned fisherman's outfit',
    pieces: { ring: 'anglers_ring', hat: 'fisher_hat', shoe: 'fishing_waders' },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'fish_quality_bonus', value: 0.1 }],
        description: 'Fish quality +10%'
      },
      {
        count: 3,
        effects: [{ type: 'fishing_calm', value: 0.1 }],
        description: 'Fishing stability +10%'
      }
    ]
  },

  // === Mid-term (blacksmith shop synthesis) ===
  {
    id: 'merchant_set',
    name: 'Merchant Suit',
    description: 'Business Outfits for a Smart Businessman',
    pieces: {
      ring: 'merchants_ring',
      hat: 'merchant_hat',
      shoe: 'merchant_boots'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'sell_price_bonus', value: 0.05 }],
        description: 'Sale price +5%'
      },
      {
        count: 3,
        effects: [{ type: 'shop_discount', value: 0.08 }],
        description: 'Store discount +8%'
      }
    ]
  },
  {
    id: 'harvest_set',
    name: 'Harvest Set',
    description: 'Peasant attire during the harvest season',
    pieces: {
      ring: 'harvest_moon_ring',
      hat: 'jade_hairpin',
      shoe: 'silk_slippers'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'crop_growth_bonus', value: 0.1 }],
        description: 'Crop growth +10%'
      },
      {
        count: 3,
        effects: [{ type: 'crop_quality_bonus', value: 0.1 }],
        description: 'Crop quality +10%'
      }
    ]
  },
  {
    id: 'dragon_warrior_set',
    name: 'War Dragon Suit',
    description: 'Warrior armor named after dragon',
    pieces: {
      ring: 'warlord_ring',
      hat: 'dragon_helm',
      shoe: 'dragon_scale_boots'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'attack_bonus', value: 3 }],
        description: 'Attack +3'
      },
      {
        count: 3,
        effects: [{ type: 'crit_rate_bonus', value: 0.1 }],
        description: 'Crit rate +10%'
      }
    ]
  },
  {
    id: 'obsidian_set',
    name: 'Obsidian suit',
    description: 'Heavy armor forged from obsidian',
    pieces: {
      ring: 'stalwart_ring',
      hat: 'obsidian_helm',
      shoe: 'obsidian_greaves'
    },
    bonuses: [
      {
        count: 2,effects: [{ type: 'max_hp_bonus', value: 20 }],
        description: 'Maximum HP+20'
      },
      {
        count: 3,
        effects: [{ type: 'defense_bonus', value: 0.1 }],
        description: 'Defense +10%'
      }
    ]
  },
  {
    id: 'phoenix_set',
    name: 'Phoenix Suit',
    description: 'Phoenix Nirvana brings good fortune',
    pieces: {
      ring: 'fortune_ring',
      hat: 'phoenix_crown',
      shoe: 'phoenix_boots'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'luck', value: 0.05 }],
        description: 'Lucky +5%'
      },
      {
        count: 3,
        effects: [{ type: 'exp_bonus', value: 0.15 }],
        description: 'Experience bonus +15%'
      }
    ]
  },

  // === Later (dropped by BOSS/dropped by monster) ===
  {
    id: 'shadow_set',
    name: 'Shadow Suit',
    description: 'Assassin's equipment sneaking in the shadows',
    pieces: {
      ring: 'shadow_ring',
      hat: 'shadow_mask',
      shoe: 'shadow_striders'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'vampiric', value: 0.05 }],
        description: 'Vampire +5%'
      },
      {
        count: 3,
        effects: [{ type: 'monster_drop_bonus', value: 0.15 }],
        description: 'Drop rate +15%'
      }
    ]
  },
  {
    id: 'frost_queen_set',
    name: 'Ice Queen Suit',
    description: 'Relic of the Frost Queen',
    pieces: {
      ring: 'frost_queen_circlet',
      hat: 'frost_queen_tiara',
      shoe: 'frost_queen_slippers'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'fishing_calm', value: 0.1 }],
        description: 'Fishing stability +10%'
      },
      {
        count: 3,
        effects: [{ type: 'monster_drop_bonus', value: 0.1 }],
        description: 'Drop rate +10%'
      }
    ]
  },
  {
    id: 'dragon_king_set',
    name: 'Dragon King Suit',
    description: 'The Supreme Legacy of the Dragon King of the Abyss',
    pieces: {
      ring: 'abyss_dragon_ring',
      hat: 'abyss_dragon_horns',
      shoe: 'abyss_dragon_treads'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'attack_bonus', value: 5 }],
        description: 'Attack +5'
      },
      {
        count: 3,
        effects: [
          { type: 'vampiric', value: 0.08 },
          { type: 'defense_bonus', value: 0.08 }
        ],
        description: 'Vampire +8%, Defense +8%'
      }
    ]
  },

  // === Bamboo Forest Hunter (synthesized from bamboo forest beast materials) ===
  {
    id: 'forest_hunter_set',
    name: 'Bamboo Hunter Set',
    description: 'Hunter equipment made from the skin and bones of bamboo forest beasts',
    pieces: {
      ring: 'wolf_fang_pendant',
      hat: 'wolf_pelt_hood',
      shoe: 'bear_pelt_boots'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'attack_bonus', value: 3 }],
        description: 'Attack +3'
      },
      {
        count: 3,
        effects: [
          { type: 'crit_rate_bonus', value: 0.08 },
          { type: 'monster_drop_bonus', value: 0.1 }
        ],
        description: 'Crit rate +8%, drop rate +10%'
      }
    ]
  },
  {
    id: 'beast_king_set',
    name: 'Beast King Suit',
    description: 'The trophies of the King of Bamboo Forest, showing the glory of the hunter',
    pieces: {
      ring: 'tiger_fang_ring',
      hat: 'tiger_pelt_cape',
      shoe: 'bear_pelt_boots'
    },
    bonuses: [
      {
        count: 2,effects: [{ type: 'attack_bonus', value: 5 }],
        description: 'Attack +5'
      },
      {
        count: 3,
        effects: [
          { type: 'vampiric', value: 0.06 },
          { type: 'defense_bonus', value: 0.08 }
        ],
        description: 'Vampire +6%, Defense +8%'
      }
    ]
  },

  // === Guild exclusive ===
  {
    id: 'guild_champion_set',
    name: 'Guild Warrior Set',
    description: 'Exclusive equipment for elite warriors of the Adventurers Guild',
    pieces: {
      weapon: 'guild_war_blade',
      ring: 'guild_war_ring',
      hat: 'guild_war_helm',
      shoe: 'guild_war_boots'
    },
    bonuses: [
      {
        count: 2,
        effects: [{ type: 'attack_bonus', value: 3 }],
        description: 'Attack +3'
      },
      {
        count: 3,
        effects: [
          { type: 'defense_bonus', value: 0.08 },
          { type: 'max_hp_bonus', value: 20 }
        ],
        description: 'Defense +8%, HP +20'
      },
      {
        count: 4,
        effects: [
          { type: 'vampiric', value: 0.08 },
          { type: 'crit_rate_bonus', value: 0.05 }
        ],
        description: 'Vampire +8%, critical hit rate +5%'
      }
    ]
  }
]

/** Find the suit according to the equipment ID */
export const getSetByPieceId = (defId: string): EquipmentSetDef | undefined => {
  return EQUIPMENT_SETS.find(s => s.pieces.weapon === defId || s.pieces.ring === defId || s.pieces.hat === defId || s.pieces.shoe === defId)
}