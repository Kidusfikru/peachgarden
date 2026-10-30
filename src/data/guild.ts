import type { MonsterGoalDef, GuildShopItemDef, GuildDonationDef, GuildLevelDef } from '@/types'

/** Monster crusade target */
export const MONSTER_GOALS: MonsterGoalDef[] = [
  // ===== Shallow layer =====
  {
    monsterId: 'mud_worm',
    monsterName: 'Mudworm',
    zone: 'shallow',
    killTarget: 25,
    reward: { money: 200 },
    description: 'Remove shallow mudworms. '
  },
  {
    monsterId: 'stone_crab',
    monsterName: 'Stone Crab',
    zone: 'shallow',
    killTarget: 25,
    reward: { money: 300 },
    description: 'Destroy the shallow stone crabs. '
  },
  // ===== Frost =====
  {
    monsterId: 'ice_bat',
    monsterName: 'Ice Bat',
    zone: 'frost',
    killTarget: 25,
    reward: { money: 500 },
    description: 'Shoot down the ice bat that knocked down the frost layer. '
  },
  {
    monsterId: 'ghost',
    monsterName: 'Ghost',
    zone: 'frost',
    killTarget: 25,
    reward: { money: 500 },
    description: 'Dispel the ghosts of the frost layer. '
  },
  // ===== Lava =====
  {
    monsterId: 'fire_bat',
    monsterName: 'Firebat',
    zone: 'lava',
    killTarget: 50,
    reward: { money: 800 },
    description: 'Repulse the fire bats in the lava layer. '
  },
  {
    monsterId: 'shadow_warrior',
    monsterName: 'Shadow Warrior',
    zone: 'lava',
    killTarget: 50,
    reward: { money: 1000 },
    description: 'Defeat the Shadow Warrior in the lava layer. '
  },
  // ===== Crystal =====
  {
    monsterId: 'crystal_golem',
    monsterName: 'Crystal Golem',
    zone: 'crystal',
    killTarget: 50,
    reward: { money: 1500 },
    description: 'The golem that shatters the crystal layer. '
  },
  {
    monsterId: 'prism_spider',
    monsterName: 'Prism Spider',
    zone: 'crystal',
    killTarget: 50,
    reward: { money: 1500 },
    description: 'Destroy the prism spiders in the crystal layer. '
  },
  // ===== Shadow =====
  {
    monsterId: 'shadow_lurker',
    monsterName: 'Shadowlurker',
    zone: 'shadow',
    killTarget: 75,
    reward: { money: 2000 },
    description: 'Hunt lurkers in the Shadow Layer. '
  },
  {
    monsterId: 'void_wraith',
    monsterName: 'Void Ghost',
    zone: 'shadow',
    killTarget: 75,
    reward: { money: 2500 },
    description: 'Purify the void ghosts of the shadow layer. '
  },
  // ===== Abyss =====
  {
    monsterId: 'abyss_serpent',
    monsterName: 'Abyss Python',
    zone: 'abyss',
    killTarget: 100,
    reward: { money: 3000 },
    description: 'Destroy the giant python in the abyss. '
  },
  {
    monsterId: 'bone_dragon',
    monsterName: 'Bone Dragon',
    zone: 'abyss',
    killTarget: 100,
    reward: { money: 4000 },
    description: 'Defeat the Bone Dragon in the Abyss. '
  },
  // ===== BOSS =====
  {
    monsterId: 'mud_golem',
    monsterName: 'Mudstone Monster',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 500, items: [{ itemId: 'copper_bar', quantity: 10 }] },
    description: 'Defeat the mudstone monster three times. '
  },
  {
    monsterId: 'frost_queen',
    monsterName: 'Frost Queen',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 800, items: [{ itemId: 'iron_bar', quantity: 10 }] },
    description: 'Defeat the Frost Queen three times. '
  },
  {
    monsterId: 'lava_lord',
    monsterName: 'Lava Lord',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 1500, items: [{ itemId: 'gold_bar', quantity: 10 }] },
    description: 'Defeat the Lava Lord three times. '
  },
  {
    monsterId: 'crystal_king',
    monsterName: 'Crystal King',
    zone: 'boss',
    killTarget: 3,reward: { money: 2500, items: [{ itemId: 'moonstone', quantity: 3 }] },
    description: 'Defeat the Crystal King three times. '
  },
  {
    monsterId: 'shadow_sovereign',
    monsterName: 'Shadow Lord',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 4000, items: [{ itemId: 'obsidian', quantity: 3 }] },
    description: 'Defeat the Shadow Lord three times. '
  },
  {
    monsterId: 'abyss_dragon',
    monsterName: 'Abyss Dragon King',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 6000, items: [{ itemId: 'dragon_jade', quantity: 2 }] },
    description: 'Defeat the Dragon King of the Abyss three times. '
  },
  // ===== Skeleton Mine =====
  {
    monsterId: 'iridium_golem',
    monsterName: 'Iridium Golem',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 3000 },
    description: 'Defeat the Iridium Golem in the Skull Mine. '
  },
  {
    monsterId: 'skull_serpent',
    monsterName: 'Skeleton Flying Snake',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 3000 },
    description: 'Destroy the Skeleton Flying Snake in the Skeleton Mine. '
  },
  {
    monsterId: 'ancient_mummy',
    monsterName: 'Ancient Mummy',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 5000 },
    description: 'Defeat the Ancient Mummy in the Skull Mine. '
  }
]

/** Guild shop items (complementary to Escort Bureau, not duplicated) */
export const GUILD_SHOP_ITEMS: GuildShopItemDef[] = [
  // --- Consumables (purchased with copper coins, no purchase limit) ---
  {
    itemId: 'combat_tonic',
    name: 'Combat Tonic',
    price: 200,
    description: 'Restore 30 HP. '
  },
  {
    itemId: 'adventurer_ration',
    name: 'Adventure Rations',
    price: 350,
    description: 'Restore 25 stamina and 25 HP. ',
    unlockGuildLevel: 2
  },
  {
    itemId: 'fortify_brew',
    name: 'Strengthening Potion',
    price: 500,
    description: 'Restore 60 HP. '
  },
  {
    itemId: 'ironhide_potion',
    name: 'Iron Wall Potion',
    price: 800,
    description: 'Restore all HP. '
  },
  {
    itemId: 'warriors_feast',
    name: 'Feast of the Brave',
    price: 1000,
    description: 'Restore 50 stamina and 50 HP. ',
    unlockGuildLevel: 5
  },
  {
    itemId: 'slayer_charm',
    name: 'Demon Hunting Talisman',
    price: 1500,
    description: 'Monster drop rate +20% (current exploration). ',
    unlockGuildLevel: 3
  },
  {
    itemId: 'stamina_elixir',
    name: 'Energy Potion',
    price: 600,
    description: 'Restore 120 points of physical strength. ',
    unlockGuildLevel: 4
  },
  {
    itemId: 'monster_lure',
    name: 'Monster Bait',
    price: 2000,
    description: 'The number of monsters on this floor is doubled. ',
    unlockGuildLevel: 7
  },
  // --- Equipment (contribution points + materials, purchase limit 1 piece) ---
  {
    itemId: 'guild_cloud_horse',
    name: 'Stepping on the Cloud Horse',
    price: 0,
    contributionCost: 600,
    description: 'A sacred horse domesticated by the guild. Obtain the cloud riding horse variety: it travels very fast and helps you take care of the herd when grazing. ',
    unlockGuildLevel: 8,
    totalLimit: 1,
    horseUpgrade: 'cloud',
    materials: [
      { itemId: 'iridium_bar', quantity: 3 },
      { itemId: 'hay', quantity: 50 }
    ]
  },
  {
    itemId: 'guild_war_ring',
    name: 'Guild Battle Ring',
    price: 0,
    contributionCost: 200,
    description: 'Attack +4, Defense +6%. ',
    unlockGuildLevel: 5,
    totalLimit: 1,
    equipType: 'ring',
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'ruby', quantity: 2 }
    ]
  },
  {
    itemId: 'guild_war_helm',
    name: 'Guild War Helmet',
    price: 0,
    contributionCost: 250,
    description: 'Attack +3, HP +15. ',
    unlockGuildLevel: 6,
    totalLimit: 1,
    equipType: 'hat',
    materials: [{ itemId: 'gold_bar', quantity: 5 },
      { itemId: 'moonstone', quantity: 1 }
    ]
  },
  {
    itemId: 'guild_war_boots',
    name: 'Guild Boots',
    price: 0,
    contributionCost: 250,
    description: 'Attack +2, Defense +5%, Movement Speed +10%. ',
    unlockGuildLevel: 7,
    totalLimit: 1,
    equipType: 'shoe',
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'obsidian', quantity: 1 }
    ]
  },
  {
    itemId: 'guild_war_blade',
    name: 'Guild Glaive',
    price: 0,
    contributionCost: 350,
    description: 'Attack power 36, critical hit rate 10%. ',
    unlockGuildLevel: 9,
    totalLimit: 1,
    equipType: 'weapon',
    materials: [
      { itemId: 'gold_bar', quantity: 10 },
      { itemId: 'dragon_jade', quantity: 1 }
    ]
  },
  // --- Permanent items (purchase with contribution points, daily purchase limit) ---
  {
    itemId: 'guild_badge',
    name: 'Guild Badge',
    price: 0,
    contributionCost: 150,
    description: 'Attack power permanently +3. ',
    unlockGuildLevel: 6,
    weeklyLimit: 10
  },
  {
    itemId: 'life_talisman',
    name: 'Amulet of Life',
    price: 0,
    contributionCost: 200,
    description: 'Maximum health permanently +15. ',
    unlockGuildLevel: 8,
    dailyLimit: 1,
    totalLimit: 100
  },
  {
    itemId: 'defense_charm',
    name: 'Guardian',
    price: 0,
    contributionCost: 180,
    description: 'Defense permanently +3%. ',
    unlockGuildLevel: 7,
    weeklyLimit: 3,
    totalLimit: 10
  },
  {
    itemId: 'lucky_coin',
    name: 'Lucky Copper Coin',
    price: 0,
    contributionCost: 300,
    description: 'Monster drop rate permanently +5%. ',
    unlockGuildLevel: 10,
    weeklyLimit: 3,
    totalLimit: 10
  }
]

/** Donation item list */
export const GUILD_DONATIONS: GuildDonationDef[] = [
  // Ore
  { itemId: 'copper_ore', points: 2 },
  { itemId: 'iron_ore', points: 4 },
  { itemId: 'gold_ore', points: 8 },
  { itemId: 'crystal_ore', points: 12 },
  { itemId: 'shadow_ore', points: 18 },
  { itemId: 'void_ore', points: 25 },
  { itemId: 'iridium_ore', points: 35 },
  // gems
  { itemId: 'quartz', points: 4 },
  { itemId: 'jade', points: 12 },
  { itemId: 'ruby', points: 18 },
  { itemId: 'moonstone', points: 25 },
  { itemId: 'obsidian', points: 35 },
  { itemId: 'dragon_jade', points: 50 },
  { itemId: 'prismatic_shard', points: 80 }
]

/** Guild level table (level 10) */
export const GUILD_LEVELS: GuildLevelDef[] = [
  { level: 1, expRequired: 100 },
  { level: 2, expRequired: 300 },
  { level: 3, expRequired: 600 },
  { level: 4, expRequired: 1000 },
  { level: 5, expRequired: 1500 },
  { level: 6, expRequired: 2200 },
  { level: 7, expRequired: 3000 },
  { level: 8, expRequired: 4000 },
  { level: 9, expRequired: 5500 },
  { level: 10, expRequired: 7500 }
]

/** Passive gain per guild level */
export const GUILD_BONUS_PER_LEVEL = {
  attack: 1, // +1 attack power per level
  maxHp: 5 // +5 maximum health per level
}

/** Find the subjugation target based on the monster ID */
export const getMonsterGoal = (monsterId: string): MonsterGoalDef | undefined => MONSTER_GOALS.find(g => g.monsterId === monsterId)
