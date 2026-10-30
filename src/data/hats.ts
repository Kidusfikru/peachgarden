import type { HatDef } from '@/types'

/** All hat definitions */
export const HATS: HatDef[] = [
  // ===== Tier 1: Basic model (purchased at Satin Shop) =====
  {
    id: 'straw_hat',
    name: 'Straw Hat',
    description: 'Lightweight straw hat, reducing physical exertion during farming. ',
    effects: [{ type: 'farming_stamina', value: 0.08 }],
    shopPrice: 200,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 80
  },
  {
    id: 'bamboo_hat',
    name: 'bamboo hat',
    description: 'Bamboo hat protects against sun and rain and reduces physical exertion. ',
    effects: [{ type: 'stamina_reduction', value: 0.05 }],
    shopPrice: 300,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 120
  },

  // ===== Tier 2: Intermediate model (purchased at Satin Shop) =====
  {
    id: 'miner_helmet',
    name: 'Miner's Hat',
    description: 'A leather hat with a lamp holder, greatly reducing the physical strength of mine exploration. ',
    effects: [{ type: 'mining_stamina', value: 0.12 }],
    shopPrice: 800,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 320
  },
  {
    id: 'fisher_hat',
    name: 'Fisherman Hat',
    description: 'Wide-brimmed sun hat for more concentration when fishing. ',
    effects: [
      { type: 'fishing_stamina', value: 0.1 },
      { type: 'fishing_calm', value: 0.05 }
    ],
    shopPrice: 800,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 320
  },

  // ===== Tier 3: Advanced model (synthesized in the blacksmith shop) =====
  {
    id: 'iron_helm',
    name: 'Iron Helmet',
    description: 'A sturdy iron helmet that increases defense and maximum health. ',
    effects: [
      { type: 'defense_bonus', value: 0.1 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    shopPrice: null,
    recipe: [{ itemId: 'iron_bar', quantity: 5 }],
    recipeMoney: 1000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 500
  },
  {
    id: 'scholar_hat',
    name: 'scribe's hat',
    description: 'Elegant scribe's square scarf, increases experience gain. ',
    effects: [{ type: 'exp_bonus', value: 0.1 }],
    shopPrice: null,
    recipe: [{ itemId: 'silk_cloth', quantity: 2 }],
    recipeMoney: 1500,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 600
  },
  {
    id: 'herbalist_hat',
    name: 'pharmacist hat',
    description: 'A wide hat often worn by herb collectors to reduce physical strength during farming and improve crop quality. ',
    effects: [
      { type: 'farming_stamina', value: 0.06 },
      { type: 'crop_quality_bonus', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'herb', quantity: 10 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 800,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 400
  },
  {
    id: 'merchant_hat',
    name: 'Businessman Hat',
    description: 'Silk-faced round hat, a symbol of merchants, increases selling prices and reduces shopping expenses. ',
    effects: [
      { type: 'sell_price_bonus', value: 0.08 },
      { type: 'shop_discount', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'silk_cloth', quantity: 2 }
    ],
    recipeMoney: 2500,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 1200
  },

  // ===== Tier 4: Top model (synthesized in blacksmith shop) =====
  {
    id: 'golden_crown',
    name: 'Golden Crown',
    description: 'The shining golden crown brings good fortune. ',
    effects: [
      { type: 'luck', value: 0.1 },
      { type: 'sell_price_bonus', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },{ itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 3000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 1500
  },
  {
    id: 'dragon_helm',
    name: 'Dragon Horned Helmet',
    description: 'A war helmet inlaid with dragon jade, capable of both offense and defense. ',
    effects: [
      { type: 'attack_bonus', value: 5 },
      { type: 'crit_rate_bonus', value: 0.05 },
      { type: 'defense_bonus', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'iridium_bar', quantity: 3 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 8000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 4000
  },

  // ===== Monster drops =====
  {
    id: 'frost_hood',
    name: 'Frost Hood',
    description: 'The fur peeled off the body of the ice bat is sewn together, exuding a cold air. ',
    effects: [
      { type: 'defense_bonus', value: 0.05 },
      { type: 'stamina_reduction', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Frost layer monster drops',
    sellPrice: 150
  },
  {
    id: 'shadow_mask',
    name: 'Shadow Mask',
    description: 'A mask left by the Shadow Lurker, which can sense the monster's weaknesses when worn. ',
    effects: [
      { type: 'monster_drop_bonus', value: 0.08 },
      { type: 'vampiric', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Shadow layer monster drops',
    sellPrice: 1000
  },
  {
    id: 'void_visor',
    name: 'Void Mask',
    description: 'Forged from the scales of the Abyss Python, it contains the power of the Abyss. ',
    effects: [
      { type: 'attack_bonus', value: 4 },
      { type: 'defense_bonus', value: 0.06 },
      { type: 'crit_rate_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Abyss layer monster drops',
    sellPrice: 1800
  },

  // ===== BOSS drops =====
  {
    id: 'golem_stone_cap',
    name: 'Stone Hat',
    description: 'The core fragments of the mud stone demon are embedded in it, and it is extremely hard. ',
    effects: [
      { type: 'defense_bonus', value: 0.06 },
      { type: 'mining_stamina', value: 0.06 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'First kill of the 20th floor BOSS',
    sellPrice: 300
  },
  {
    id: 'crystal_king_crown',
    name: 'Crystal Crown',
    description: 'The crown left behind after the Crystal King shattered contains pure crystal energy. ',
    effects: [
      { type: 'exp_bonus', value: 0.08 },
      { type: 'luck', value: 0.06 },
      { type: 'crit_rate_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'First kill of the 80th floor BOSS',
    sellPrice: 1500
  },

  // ===== Treasure chest drops =====
  {
    id: 'lucky_cap',
    name: 'Lucky Hat',
    description: 'The strange little hat found in the treasure chest seems to bring good luck. ',
    effects: [
      { type: 'luck', value: 0.04 },
      { type: 'sell_price_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Mine Treasure Chest',
    sellPrice: 250
  },

  // ===== Added new shop hat (Satin Shop) =====
  {
    id: 'lotus_hat',
    name: 'Lotus Hat',
    description: 'A cool hat made of lotus leaves, which reduces overall physical energy consumption. ',
    effects: [{ type: 'stamina_reduction', value: 0.06 }],
    shopPrice: 500,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 200
  },
  {
    id: 'fur_cap',
    name: 'fur hat',
    description: 'Soft animal skin hat, extremely practical in the mines. ',
    effects: [{ type: 'mining_stamina', value: 0.08 },
      { type: 'defense_bonus', value: 0.03 }
    ],
    shopPrice: 600,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 240
  },
  {
    id: 'silk_turban',
    name: 'silk turban',
    description: '华美的丝绸头巾，提升售价并增加送礼好感。 ',
    effects: [
      { type: 'sell_price_bonus', value: 0.05 },
      { type: 'gift_friendship', value: 0.08 }
    ],
    shopPrice: 1000,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Silk Village',
    sellPrice: 400
  },

  // ===== Added new synthetic hat (blacksmith shop) =====
  {
    id: 'jade_hairpin',
    name: 'Emerald Hairpin',
    description: '翡翠打磨的发簪，田间劳作更加轻松。 ',
    effects: [
      { type: 'crop_quality_bonus', value: 0.06 },
      { type: 'farming_stamina', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'jade', quantity: 2 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 600,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 300
  },
  {
    id: 'obsidian_helm',
    name: 'Obsidian Helmet',
    description: '黑曜石铸成的重盔，防御力极强。 ',
    effects: [
      { type: 'defense_bonus', value: 0.12 },
      { type: 'max_hp_bonus', value: 20 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'obsidian', quantity: 2 },
      { itemId: 'iron_bar', quantity: 3 }
    ],
    recipeMoney: 3000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 1500
  },
  {
    id: 'phoenix_crown',
    name: 'Fengguan',
    description: '龙玉镶嵌的华美凤冠，带来好运与悟性。 ',
    effects: [
      { type: 'luck', value: 0.08 },
      { type: 'exp_bonus', value: 0.1 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 6000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 3000
  },

  // ===== New BOSS drops hats =====
  {
    id: 'frost_queen_tiara',
    name: 'Crown of the Ice Queen',
    description: '冰霜女王的冠冕，蕴含寒冰之力，钓鱼格外专注。 ',
    effects: [
      { type: 'fishing_calm', value: 0.08 },
      { type: 'fishing_stamina', value: 0.08 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'First kill of the 40th floor BOSS',
    sellPrice: 500
  },
  {
    id: 'abyss_dragon_horns',
    name: 'Dragon King Horn Crown',
    description: '深渊龙王的角制成的战冠，蕴含毁灭之力。 ',
    effects: [
      { type: 'attack_bonus', value: 8 },
      { type: 'defense_bonus', value: 0.1 },
      { type: 'vampiric', value: 0.05 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '120th floor BOSS first kill',
    sellPrice: 5000
  },

  // ===== New monster drops hat =====
  {
    id: 'lava_helm',
    name: 'Lava Hood',
    description: '火蝠翼膜缝制的耐热兜帽，蕴含灼热之力。 ',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'defense_bonus', value: 0.04 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Lava layer monster drops',
    sellPrice: 350
  },

  // ===== Added hats dropped from treasure chests =====
  {
    id: 'treasure_cap',
    name: 'Gold Digging Hat',
    description: '宝箱中发现的奇特帽子，似乎能吸引更多宝物。 ',
    effects: [
      { type: 'treasure_find', value: 0.05 },
      { type: 'ore_bonus', value: 1 }
    ],shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Mine Treasure Chest',
    sellPrice: 400
  },

  // === Guild exclusive ===
  {
    id: 'guild_war_helm',
    name: 'Guild War Helmet',
    description: 'The battle helmet of an elite member of the Adventurer's Guild, sturdy and majestic. ',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Guild Store',
    sellPrice: 800
  },
  // === Trade exchange ===
  {
    id: 'trade_silk_robe',
    name: 'silk robe',
    description: 'A gorgeous robe made of silk from the Western Regions, which makes you feel refreshed when wearing it. ',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'max_hp_bonus', value: 20 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Trade Points Redemption',
    sellPrice: 750
  },
  // === Bamboo forest beast material production ===
  {
    id: 'wolf_pelt_hood',
    name: 'Wolfskin Hood',
    description: 'A hood sewn with bamboo wolf fur, warm and protective. ',
    effects: [
      { type: 'defense_bonus', value: 0.08 },
      { type: 'max_hp_bonus', value: 10 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'wolf_pelt', quantity: 3 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 800,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 400
  },
  {
    id: 'tiger_pelt_cape',
    name: 'tiger skin cloak',
    description: 'A cloak made of tiger skin and bear skin, capable of both offense and defense, and awe-inspiring. ',
    effects: [
      { type: 'attack_bonus', value: 5 },
      { type: 'defense_bonus', value: 0.06 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'tiger_pelt', quantity: 2 },
      { itemId: 'bear_pelt', quantity: 1 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 2000,
    obtainSource: 'Blacksmith shop synthesis',
    sellPrice: 900
  }
]

/** Get the hat definition based on ID */
export const getHatById = (id: string): HatDef | undefined => {
  return HATS.find(h => h.id === id)
}

/** Hats available for purchase at the Satin Shop */
export const SHOP_HATS: HatDef[] = HATS.filter(h => h.shopPrice !== null)

/** Hats that can be crafted in the blacksmith shop */
export const CRAFTABLE_HATS: HatDef[] = HATS.filter(h => h.recipe !== null)

/** Monsters drop hats (according to mine area) */
export const MONSTER_DROP_HATS: Record<string, { hatId: string; chance: number }[]> = {
  shallow: [],
  frost: [{ hatId: 'frost_hood', chance: 0.015 }],
  lava: [{ hatId: 'lava_helm', chance: 0.015 }],
  crystal: [],
  shadow: [{ hatId: 'shadow_mask', chance: 0.012 }],
  abyss: [{ hatId: 'void_visor', chance: 0.01 }]
}

/** BOSS first kill drops hat */
export const BOSS_DROP_HATS: Record<number, string> = {
  20: 'golem_stone_cap',
  40: 'frost_queen_tiara',
  80: 'crystal_king_crown',
  120: 'abyss_dragon_horns'
}

/** Treasure chests drop hats (according to the mine area) */
export const TREASURE_DROP_HATS: Record<string, { hatId: string; chance: number }[]> = {
  shallow: [{ hatId: 'treasure_cap', chance: 0.05 }],
  frost: [{ hatId: 'treasure_cap', chance: 0.04 }],
  lava: [{ hatId: 'lucky_cap', chance: 0.05 }],
  crystal: [{ hatId: 'lucky_cap', chance: 0.04 }],
  shadow: [],
  abyss: []
}
