import type { AchievementDef, CommunityBundleDef } from '@/types'

/** Achievements list */
export const ACHIEVEMENTS: AchievementDef[] = [
  // collect
  {
    id: 'collector_10',
    name: 'fledgling',
    description: 'Discover 10 different items. ',
    condition: { type: 'itemCount', count: 10 },
    reward: { money: 200 }
  },
  {
    id: 'collector_30',
    name: 'Naturalist',
    description: 'Discover 30 different items. ',
    condition: { type: 'itemCount', count: 30 },
    reward: { money: 500 }
  },
  {
    id: 'collector_60',
    name: 'Tongjian of all things',
    description: 'Discover 60 different items. ',
    condition: { type: 'itemCount', count: 60 },
    reward: { money: 1500 }
  },
  // farming
  {
    id: 'farmer_50',
    name: 'hardworking farmer',
    description: 'Harvest 50 crops in total. ',
    condition: { type: 'cropHarvest', count: 50 },
    reward: { money: 300 }
  },
  {
    id: 'farmer_200',
    name: 'The Harvest King',
    description: 'Harvested 200 crops in total. ',
    condition: { type: 'cropHarvest', count: 200 },
    reward: { money: 1000, items: [{ itemId: 'compost', quantity: 10 }] }
  },
  // fishing
  {
    id: 'fisher_20',
    name: 'Newbie to fishing',
    description: 'Caught 20 fish in total. ',
    condition: { type: 'fishCaught', count: 20 },
    reward: { money: 200 }
  },
  {
    id: 'fisher_100',
    name: 'fisherman',
    description: 'Caught a total of 100 fish. ',
    condition: { type: 'fishCaught', count: 100 },
    reward: { money: 800 }
  },
  // Mining
  {
    id: 'miner_15',
    name: 'Mine Explorer',
    description: 'Arrived at the 15th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 15 },
    reward: { money: 300 }
  },
  {
    id: 'miner_30',
    name: 'Abyss Miner',
    description: 'Arrived at the 30th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 30 },
    reward: { money: 1000, items: [{ itemId: 'gold_ore', quantity: 10 }] }
  },
  {
    id: 'miner_60',
    name: 'Lava Conqueror',
    description: 'Arrived at the 60th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 60 },
    reward: { money: 2000, items: [{ itemId: 'gold_ore', quantity: 20 }] }
  },
  {
    id: 'miner_120',
    name: 'Abyss Walker',
    description: 'Reach the lowest level of the mine. ',
    condition: { type: 'mineFloor', floor: 120 },
    reward: { money: 5000, items: [{ itemId: 'void_ore', quantity: 10 }] }
  },
  {
    id: 'skull_25',
    name: 'Skeleton Explorer',
    description: 'The Skull Mine has reached the 25th floor. ',
    condition: { type: 'skullCavernFloor', floor: 25 },
    reward: { money: 3000, items: [{ itemId: 'iridium_ore', quantity: 5 }] }
  },
  {
    id: 'skull_100',
    name: 'Abyss Hero',
    description: 'The Skeleton Mine has reached the 100th floor. ',
    condition: { type: 'skullCavernFloor', floor: 100 },
    reward: {
      money: 10000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  // money
  {
    id: 'rich_5000',
    name: 'Well-off Home',
    description: 'Earned 5000 articles in total. ',
    condition: { type: 'moneyEarned', amount: 5000 },
    reward: { money: 500 }
  },
  {
    id: 'rich_20000',
    name: 'The richest man in Taoyuan',
    description: 'A total of 20,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 20000 },
    reward: { money: 2000 }
  },
  // cooking
  {
    id: 'chef_10',
    name: 'Beginning cooking skills',
    description: 'Cook 10 dishes in total. ',
    condition: { type: 'recipesCooked', count: 10 },reward: { money: 300 }
  },
  {
    id: 'chef_50',
    name: 'Gourmet Master',
    description: 'Cook 50 dishes in total. ',
    condition: { type: 'recipesCooked', count: 50 },
    reward: { money: 1000 }
  },
  // skills
  {
    id: 'skill_master',
    name: 'Mastery of skills',
    description: 'Planting skills have reached level 10. ',
    condition: { type: 'skillLevel', skillType: 'farming', level: 10 },
    reward: { money: 2000 }
  },
  // social
  {
    id: 'social_friend',
    name: 'Good popularity',
    description: 'Become "acquainted" with all villagers. ',
    condition: { type: 'npcFriendship', level: 'acquaintance' },
    reward: { money: 500 }
  },
  //Task
  {
    id: 'quest_10',
    name: 'enthusiastic people in the countryside',
    description: 'Complete 10 commissioned tasks in total. ',
    condition: { type: 'questsCompleted', count: 10 },
    reward: { money: 500 }
  },
  {
    id: 'quest_40',
    name: 'Response to all requests',
    description: 'Completed a total of 40 commissioned tasks. ',
    condition: { type: 'questsCompleted', count: 40 },
    reward: { money: 2500 }
  },
  // good impression
  {
    id: 'friend_best',
    name: 'confidant',
    description: 'Become close friends with a villager. ',
    condition: { type: 'npcBestFriend', count: 1 },
    reward: { money: 200 }
  },
  {
    id: 'friend_all_friendly',
    name: 'Friends of Taoyuan',
    description: 'Become friends with all villagers. ',
    condition: { type: 'npcAllFriendly' },
    reward: { money: 1000, items: [{ itemId: 'jade_ring', quantity: 1 }] }
  },
  // Marriage & Children
  {
    id: 'married',
    name: 'Hundred Years of Love',
    description: 'Get married with the person you love. ',
    condition: { type: 'married' },
    reward: { money: 1314 }
  },
  {
    id: 'parent',
    name: 'Family Happiness',
    description: 'Welcoming our first child. ',
    condition: { type: 'hasChild' },
    reward: { money: 520 }
  },
  // Monster kill
  {
    id: 'slayer_50',
    name: 'Demon slayer novice',
    description: 'Kill 50 monsters in total. ',
    condition: { type: 'monstersKilled', count: 50 },
    reward: { money: 300 }
  },
  {
    id: 'slayer_200',
    name: 'Expert in subduing demons',
    description: 'Kill 200 monsters in total. ',
    condition: { type: 'monstersKilled', count: 200 },
    reward: { money: 1000 }
  },
  {
    id: 'slayer_500',
    name: 'Slay Demons',
    description: 'Kill 500 monsters in total. ',
    condition: { type: 'monstersKilled', count: 500 },
    reward: { money: 3000 }
  },
  {
    id: 'slayer_1000',
    name: 'Enemy of All Demons',
    description: 'Kill 1000 monsters in total. ',
    condition: { type: 'monstersKilled', count: 1000 },
    reward: {
      money: 5000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  // ship
  {
    id: 'shipper_10',
    name: 'First entry into business',
    description: 'Shipping 10 different items. ',
    condition: { type: 'shippedCount', count: 10 },
    reward: { money: 300 }
  },
  {
    id: 'shipper_30',
    name: 'Logistics Expert',
    description: 'Shipping 30 different items. ',
    condition: { type: 'shippedCount', count: 30 },
    reward: { money: 1000 }
  },
  {
    id: 'full_shipment',
    name: 'Shipping Complete Inspection',
    description: 'Ship all shippable items. ',
    condition: { type: 'fullShipment' },
    reward: { money: 5000 }
  },
  // Livestock
  {
    id: 'rancher_5',
    name: 'Newbie to animal husbandry',
    description: 'Owns 5 livestock. ',
    condition: { type: 'animalCount', count: 5 },
    reward: { money: 500 }
  },
  {
    id: 'rancher_15',
    name: 'Rancher',description: 'Owns 15 livestock. ',
    condition: { type: 'animalCount', count: 15 },
    reward: { money: 2000 }
  },
  //More money
  {
    id: 'rich_50000',
    name: 'The richest party',
    description: 'A total of 50,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 50000 },
    reward: { money: 3000 }
  },
  {
    id: 'rich_200000',
    name: 'Tao Zhuzhifu',
    description: 'A total of 200,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 200000 },
    reward: { money: 10000 }
  },
  // More Farming & Fishing
  {
    id: 'farmer_500',
    name: 'Farm Tycoon',
    description: 'Harvest 500 crops in total. ',
    condition: { type: 'cropHarvest', count: 500 },
    reward: { money: 2000 }
  },
  {
    id: 'fisher_200',
    name: 'Sea Dragon King',
    description: 'Caught a total of 200 fish. ',
    condition: { type: 'fishCaught', count: 200 },
    reward: { money: 2000 }
  },
  // All skills & all ancestral halls
  {
    id: 'all_skills',
    name: 'Almighty Master',
    description: 'All skills have reached level 10. ',
    condition: { type: 'allSkillsMax' },
    reward: { money: 5000 }
  },
  {
    id: 'all_bundles',
    name: 'Nostalgic Perfection',
    description: 'Complete all ancestral hall tasks. ',
    condition: { type: 'allBundlesComplete' },
    reward: { money: 5000 }
  },
  // More collection & cooking & commissioning & favorability
  {
    id: 'collector_100',
    name: 'Naturalist',
    description: 'Discover 100 different items. ',
    condition: { type: 'itemCount', count: 100 },
    reward: { money: 3000 }
  },
  {
    id: 'chef_100',
    name: 'royal chef',
    description: 'Cook 100 dishes in total. ',
    condition: { type: 'recipesCooked', count: 100 },
    reward: { money: 2000 }
  },
  {
    id: 'quest_80',
    name: 'Knowledge',
    description: 'A total of 80 commissioned tasks have been completed. ',
    condition: { type: 'questsCompleted', count: 80 },
    reward: { money: 3000 }
  },
  {
    id: 'friend_all_best',
    name: 'Friend in the world',
    description: 'Become close friends with 6 villagers. ',
    condition: { type: 'npcBestFriend', count: 6 },
    reward: { money: 3000, items: [{ itemId: 'jade_ring', quantity: 1 }] }
  },
  // collect
  {
    id: 'collector_5',
    name: 'curious baby',
    description: 'Five different items found. ',
    condition: { type: 'itemCount', count: 5 },
    reward: { money: 100 }
  },
  {
    id: 'collector_20',
    name: 'Informed',
    description: 'Discover 20 different items. ',
    condition: { type: 'itemCount', count: 20 },
    reward: { money: 300 }
  },
  {
    id: 'collector_45',
    name: 'Wuhua Tianbao',
    description: '45 different items found. ',
    condition: { type: 'itemCount', count: 45 },
    reward: { money: 800 }
  },
  {
    id: 'collector_80',
    name: 'Encyclopedia',
    description: 'Discover 80 different items. ',
    condition: { type: 'itemCount', count: 80 },
    reward: { money: 2000 }
  },
  {
    id: 'collector_120',
    name: 'All things in heaven and earth',
    description: 'Discover 120 different items. ',
    condition: { type: 'itemCount', count: 120 },
    reward: { money: 5000 }
  },
  {
    id: 'collector_150',
    name: 'omniscient and omnipotent',
    description: 'Discover 150 different items. ',
    condition: { type: 'itemCount', count: 150 },
    reward: {
      money: 8000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },

  // farming
  {
    id: 'farmer_10',
    name: 'Novice farming',
    description: 'Harvest 10 crops in total. ',
    condition: { type: 'cropHarvest', count: 10 },reward: { money: 100 }
  },
  {
    id: 'farmer_100',
    name: 'intensive farming',
    description: 'Harvest 100 crops in total. ',
    condition: { type: 'cropHarvest', count: 100 },
    reward: { money: 500 }
  },
  {
    id: 'farmer_1000',
    name: 'Pastoral Legend',
    description: 'Harvest 1000 crops in total. ',
    condition: { type: 'cropHarvest', count: 1000 },
    reward: { money: 5000, items: [{ itemId: 'iridium_ore', quantity: 5 }] }
  },

  // fishing
  {
    id: 'fisher_5',
    name: 'Riverside Boy',
    description: 'Caught 5 fish in total. ',
    condition: { type: 'fishCaught', count: 5 },
    reward: { money: 100 }
  },
  {
    id: 'fisher_50',
    name: 'Meaning of Diao Weng',
    description: 'Caught 50 fish in total. ',
    condition: { type: 'fishCaught', count: 50 },
    reward: { money: 500 }
  },
  {
    id: 'fisher_500',
    name: 'Fish, dragon and all kinds of changes',
    description: 'Caught a total of 500 fish. ',
    condition: { type: 'fishCaught', count: 500 },
    reward: {
      money: 5000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },

  // money
  {
    id: 'rich_1000',
    name: 'Initial savings',
    description: 'Earned 1000 articles in total. ',
    condition: { type: 'moneyEarned', amount: 1000 },
    reward: { money: 100 }
  },
  {
    id: 'rich_10000',
    name: 'Beautiful clothes and fine food',
    description: 'A total of 10,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 10000 },
    reward: { money: 1000 }
  },
  {
    id: 'rich_100000',
    name: 'Wealthy family',
    description: 'A total of 100,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 100000 },
    reward: { money: 5000 }
  },
  {
    id: 'rich_500000',
    name: 'As rich as a country',
    description: 'A total of 500,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 500000 },
    reward: { money: 15000 }
  },
  {
    id: 'rich_1000000',
    name: 'Golden Mountains and Silver Seas',
    description: 'A total of 1,000,000 articles have been obtained. ',
    condition: { type: 'moneyEarned', amount: 1000000 },
    reward: {
      money: 30000,
      items: [{ itemId: 'prismatic_shard', quantity: 3 }]
    }
  },

  // cooking
  {
    id: 'chef_5',
    name: 'Beginner's cooking',
    description: 'Cook 5 dishes in total. ',
    condition: { type: 'recipesCooked', count: 5 },
    reward: { money: 100 }
  },
  {
    id: 'chef_25',
    name: 'A good hand at the stove',
    description: 'Cook 25 dishes in total. ',
    condition: { type: 'recipesCooked', count: 25 },
    reward: { money: 500 }
  },
  {
    id: 'chef_75',
    name: 'Heir of the God of Cookery',
    description: 'Cook 75 dishes in total. ',
    condition: { type: 'recipesCooked', count: 75 },
    reward: { money: 1500 }
  },

  // delegate
  {
    id: 'quest_5',
    name: 'Helping others',
    description: 'Complete 5 commissioned tasks in total. ',
    condition: { type: 'questsCompleted', count: 5 },
    reward: { money: 200 }
  },
  {
    id: 'quest_20',
    name: 'Messenger',
    description: 'Completed a total of 20 commissioned tasks. ',
    condition: { type: 'questsCompleted', count: 20 },
    reward: { money: 1000 }
  },
  {
    id: 'quest_60',
    name: 'Mission must be achieved',
    description: 'A total of 60 commissioned tasks have been completed. ',
    condition: { type: 'questsCompleted', count: 60 },
    reward: { money: 2000 }
  },
  {
    id: 'quest_100',
    name: 'Know-it-all',
    description: 'Complete a total of 100 commissioned tasks. ',
    condition: { type: 'questsCompleted', count: 100 },reward: { money: 5000, items: [{ itemId: 'dragon_jade', quantity: 1 }] }
  },

  // Monster kill
  {
    id: 'slayer_10',
    name: 'First try',
    description: 'Kill 10 monsters in total. ',
    condition: { type: 'monstersKilled', count: 10 },
    reward: { money: 100 }
  },
  {
    id: 'slayer_100',
    name: 'Eliminating Violence and Peace',
    description: 'Kill 100 monsters in total. ',
    condition: { type: 'monstersKilled', count: 100 },
    reward: { money: 500 }
  },
  {
    id: 'slayer_300',
    name: 'Demon Buster',
    description: 'Kill 300 monsters in total. ',
    condition: { type: 'monstersKilled', count: 300 },
    reward: { money: 2000 }
  },
  {
    id: 'slayer_2000',
    name: 'Unparalleled Demon Hunt',
    description: 'Kill 2000 monsters in total. ',
    condition: { type: 'monstersKilled', count: 2000 },
    reward: { money: 10000, items: [{ itemId: 'dragon_jade', quantity: 2 }] }
  },

  // ship
  {
    id: 'shipper_5',
    name: 'First taste of trade',
    description: 'Shipping 5 different items. ',
    condition: { type: 'shippedCount', count: 5 },
    reward: { money: 100 }
  },
  {
    id: 'shipper_20',
    name: 'Trade Access',
    description: 'Shipping 20 different items. ',
    condition: { type: 'shippedCount', count: 20 },
    reward: { money: 500 }
  },
  {
    id: 'shipper_50',
    name: 'Trade Tycoon',
    description: 'Shipping 50 different items. ',
    condition: { type: 'shippedCount', count: 50 },
    reward: { money: 2000 }
  },

  // Livestock
  {
    id: 'rancher_1',
    name: 'New livestock',
    description: 'Owns 1 livestock. ',
    condition: { type: 'animalCount', count: 1 },
    reward: { money: 100 }
  },
  {
    id: 'rancher_3',
    name: 'small ranch',
    description: 'Owns 3 livestock. ',
    condition: { type: 'animalCount', count: 3 },
    reward: { money: 300 }
  },
  {
    id: 'rancher_10',
    name: 'Animal husbandry expert',
    description: 'Owns 10 livestock. ',
    condition: { type: 'animalCount', count: 10 },
    reward: { money: 1000 }
  },
  {
    id: 'rancher_20',
    name: 'Ranch Legend',
    description: 'Owns 20 livestock. ',
    condition: { type: 'animalCount', count: 20 },
    reward: { money: 3000, items: [{ itemId: 'iridium_ore', quantity: 3 }] }
  },

  // Mine
  {
    id: 'miner_5',
    name: 'First time entering the mine',
    description: 'Arrived at the 5th level of the mine. ',
    condition: { type: 'mineFloor', floor: 5 },
    reward: { money: 100 }
  },
  {
    id: 'miner_45',
    name: 'Frost Mine',
    description: 'Arrived at the 45th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 45 },
    reward: { money: 1500, items: [{ itemId: 'iron_ore', quantity: 15 }] }
  },
  {
    id: 'miner_90',
    name: 'Crystal Cave',
    description: 'Arrived at the 90th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 90 },
    reward: { money: 3000, items: [{ itemId: 'crystal_ore', quantity: 10 }] }
  },
  {
    id: 'miner_100',
    name: 'Hundred-Level Brave',
    description: 'Arrived at the 100th floor of the mine. ',
    condition: { type: 'mineFloor', floor: 100 },
    reward: { money: 4000, items: [{ itemId: 'shadow_ore', quantity: 5 }] }
  },

  // Skeleton Mine
  {
    id: 'skull_10',
    name: 'A Preliminary Exploration of Skeletons',
    description: 'The Skeleton Mine has reached the 10th floor. ',
    condition: { type: 'skullCavernFloor', floor: 10 },
    reward: { money: 1000 }
  },
  {
    id: 'skull_50',
    name: 'Abyss Trek',
    description: 'The Skeleton Mine has reached the 50th floor. ',condition: { type: 'skullCavernFloor', floor: 50 },
    reward: { money: 5000, items: [{ itemId: 'iridium_ore', quantity: 10 }] }
  },
  {
    id: 'skull_75',
    name: 'Underworld Walker',
    description: 'The Skeleton Mine has reached the 75th floor. ',
    condition: { type: 'skullCavernFloor', floor: 75 },
    reward: { money: 8000, items: [{ itemId: 'dragon_jade', quantity: 1 }] }
  },
  {
    id: 'skull_150',
    name: 'Endless Abyss',
    description: 'The Skeleton Mine has reached the 150th floor. ',
    condition: { type: 'skullCavernFloor', floor: 150 },
    reward: {
      money: 20000,
      items: [{ itemId: 'prismatic_shard', quantity: 2 }]
    }
  },

  // good impression
  {
    id: 'friend_best_2',
    name: 'Second and third confidants',
    description: 'Become close friends with 2 villagers. ',
    condition: { type: 'npcBestFriend', count: 2 },
    reward: { money: 500 }
  },
  {
    id: 'friend_best_3',
    name: 'Inseparable Friend',
    description: 'Become close friends with 3 villagers. ',
    condition: { type: 'npcBestFriend', count: 3 },
    reward: { money: 1000 }
  },
  {
    id: 'friend_best_4',
    name: 'Friends from all over the world',
    description: 'Become close friends with 4 villagers. ',
    condition: { type: 'npcBestFriend', count: 4 },
    reward: { money: 2000 }
  },

  // Social (supplementary)
  {
    id: 'social_all_friendly',
    name: 'Wide good relationships',
    description: 'Become "acquainted" with all villagers. ',
    condition: { type: 'npcFriendship', level: 'friendly' },
    reward: { money: 2000 }
  },

  //Skill level
  {
    id: 'farming_5',
    name: 'Farming in the right way',
    description: 'Planting skills have reached level 5. ',
    condition: { type: 'skillLevel', skillType: 'farming', level: 5 },
    reward: { money: 300 }
  },
  {
    id: 'foraging_5',
    name: 'Son of the Forest',
    description: 'The collection skill has reached level 5. ',
    condition: { type: 'skillLevel', skillType: 'foraging', level: 5 },
    reward: { money: 300 }
  },
  {
    id: 'foraging_10',
    name: 'Collection Master',
    description: 'The collection skill has reached level 10. ',
    condition: { type: 'skillLevel', skillType: 'foraging', level: 10 },
    reward: { money: 2000 }
  },
  {
    id: 'fishing_5',
    name: 'Introduction to fishing',
    description: 'Fishing skill reaches level 5. ',
    condition: { type: 'skillLevel', skillType: 'fishing', level: 5 },
    reward: { money: 300 }
  },
  {
    id: 'fishing_10',
    name: 'Fishing Master',
    description: 'Fishing skill reaches level 10. ',
    condition: { type: 'skillLevel', skillType: 'fishing', level: 10 },
    reward: { money: 2000 }
  },
  {
    id: 'mining_5',
    name: 'Ore vein induction',
    description: 'Mining skill reaches level 5. ',
    condition: { type: 'skillLevel', skillType: 'mining', level: 5 },
    reward: { money: 300 }
  },
  {
    id: 'mining_10',
    name: 'Mining Master',
    description: 'Mining skill reaches level 10. ',
    condition: { type: 'skillLevel', skillType: 'mining', level: 10 },
    reward: { money: 2000 }
  },
  {
    id: 'combat_5',
    name: 'First foray into the world',
    description: 'Combat skill reaches level 5. ',
    condition: { type: 'skillLevel', skillType: 'combat', level: 5 },
    reward: { money: 300 }
  },
  {
    id: 'combat_10',
    name: 'Martial Arts Master',
    description: 'Combat skill reaches level 10. ',
    condition: { type: 'skillLevel', skillType: 'combat', level: 10 },
    reward: { money: 2000 }
  },

  //breeding
  {
    id: 'breeding_1',
    name: 'First time involved in breeding',
    description: 'Complete 1 breeding. ',condition: { type: 'breedingsDone', count: 1 },
    reward: { money: 200 }
  },
  {
    id: 'breeding_10',
    name: 'Breeding Apprentice',
    description: 'Complete 10 breedings in total. ',
    condition: { type: 'breedingsDone', count: 10 },
    reward: { money: 500 }
  },
  {
    id: 'breeding_50',
    name: 'Breeding Expert',
    description: 'Complete 50 breeding times in total. ',
    condition: { type: 'breedingsDone', count: 50 },
    reward: { money: 2000 }
  },
  {
    id: 'breeding_200',
    name: 'Master Breeder',
    description: 'Complete 200 breeding times in total. ',
    condition: { type: 'breedingsDone', count: 200 },
    reward: { money: 5000 }
  },
  {
    id: 'hybrid_1',
    name: 'New product is born',
    description: '1 hybrid found. ',
    condition: { type: 'hybridsDiscovered', count: 1 },
    reward: { money: 300 }
  },
  {
    id: 'hybrid_5',
    name: 'Variety Collector',
    description: '5 hybrids found. ',
    condition: { type: 'hybridsDiscovered', count: 5 },
    reward: { money: 800 }
  },
  {
    id: 'hybrid_20',
    name: 'Hybrid Illustrated Book',
    description: '20 hybrids discovered. ',
    condition: { type: 'hybridsDiscovered', count: 20 },
    reward: { money: 2000 }
  },
  {
    id: 'hybrid_50',
    name: 'Variety Master',
    description: '50 hybrids discovered. ',
    condition: { type: 'hybridsDiscovered', count: 50 },
    reward: { money: 5000 }
  },
  {
    id: 'hybrid_100',
    name: 'Ten Thousand Kinds of Picture Catalog',
    description: '100 hybrids discovered. ',
    condition: { type: 'hybridsDiscovered', count: 100 },
    reward: {
      money: 10000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  {
    id: 'tier_3',
    name: 'Three generations of breakthrough',
    description: 'Created three generations of hybrids. ',
    condition: { type: 'hybridTier', tier: 3 },
    reward: { money: 1000 }
  },
  {
    id: 'tier_5',
    name: 'Five generations inheritance',
    description: 'Five generations of hybrids bred. ',
    condition: { type: 'hybridTier', tier: 5 },
    reward: { money: 3000 }
  },
  {
    id: 'tier_7',
    name: 'Seventh Generation Divine Product',
    description: 'Seven generations of hybrids bred. ',
    condition: { type: 'hybridTier', tier: 7 },
    reward: { money: 5000 }
  },
  {
    id: 'tier_10',
    name: 'reach the peak',
    description: 'Ten generations of hybrids bred. ',
    condition: { type: 'hybridTier', tier: 10 },
    reward: {
      money: 15000,
      items: [{ itemId: 'prismatic_shard', quantity: 2 }]
    }
  },

  // Breeding and shipping
  {
    id: 'hybrid_ship_1',
    name: 'Hybrid initial sale',
    description: 'Ship 1 hybrid crop. ',
    condition: { type: 'hybridsShipped', count: 1 },
    reward: { money: 300 }
  },
  {
    id: 'hybrid_ship_5',
    name: 'Improved seeds for export',
    description: 'Shipping 5 hybrid crops. ',
    condition: { type: 'hybridsShipped', count: 5 },
    reward: { money: 800 }
  },
  {
    id: 'hybrid_ship_15',
    name: 'Hybrid Merchant',
    description: 'Shipping 15 hybrid crops. ',
    condition: { type: 'hybridsShipped', count: 15 },
    reward: { money: 2000 }
  },
  {
    id: 'hybrid_ship_30',
    name: 'Circulation of fine seeds',
    description: 'Shipping 30 hybrid crops. ',
    condition: { type: 'hybridsShipped', count: 30 },
    reward: { money: 5000 }
  },
  {
    id: 'hybrid_ship_50',
    name: 'Full Check of Hybrid Shipments',
    description: 'Shipping 50 hybrid crops. ',
    condition: { type: 'hybridsShipped', count: 50 },
    reward: {
      money: 10000,items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  // Museum
  {
    id: 'museum_20',
    name: 'Collection Enthusiast',
    description: 'Donate 20 items to the museum. ',
    condition: { type: 'museumDonations', count: 20 },
    reward: { money: 1000 }
  },
  {
    id: 'museum_36',
    name: 'Museum Star',
    description: 'Donate 36 items to the museum. ',
    condition: { type: 'museumDonations', count: 36 },
    reward: {
      money: 5000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  {
    id: 'museum_40',
    name: 'A Complete Guide to Spiritual Objects',
    description: 'Complete all 40 collections in the museum (including fairy items). ',
    condition: { type: 'museumDonations', count: 40 },
    reward: { money: 8000 }
  },
  //Adventurers Guild
  {
    id: 'guild_5',
    name: 'Monster Hunter',
    description: 'Complete 5 crusade goals. ',
    condition: { type: 'guildGoalsCompleted', count: 5 },
    reward: { money: 1000 }
  },
  {
    id: 'guild_21',
    name: 'Dragon Slaying Warrior',
    description: 'Complete all 21 crusade objectives. ',
    condition: { type: 'guildGoalsCompleted', count: 21 },
    reward: { money: 10000, items: [{ itemId: 'iridium_bar', quantity: 5 }] }
  },
  // Faeries
  {
    id: 'spirit_first',
    name: 'Spiritual awakening',
    description: 'The first fairy was found. ',
    condition: { type: 'hiddenNpcRevealed', count: 1 },
    reward: { money: 500 }
  },
  {
    id: 'spirit_three',
    name: 'Psychic Man',
    description: 'Discovered 3 fairies. ',
    condition: { type: 'hiddenNpcRevealed', count: 3 },
    reward: { money: 2000 }
  },
  {
    id: 'spirit_all',
    name: 'All souls return to their hearts',
    description: 'Discover all 6 fairies. ',
    condition: { type: 'hiddenNpcRevealed', count: 6 },
    reward: {
      money: 5000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }]
    }
  },
  {
    id: 'spirit_bonded',
    name: 'Xianyuan Tianding',
    description: 'Befriended a fairy. ',
    condition: { type: 'hiddenNpcBonded' },
    reward: { money: 1314 }
  },
  {
    id: 'spirit_peach_found',
    name: 'Lingtaoxianwei',
    description: 'Obtain spiritual peach. ',
    condition: { type: 'itemDiscovered', itemId: 'spirit_peach' },
    reward: { money: 300 }
  },
  {
    id: 'moon_herb_found',
    name: 'Yuehua Chucai',
    description: 'Obtain moon grass. ',
    condition: { type: 'itemDiscovered', itemId: 'moon_herb' },
    reward: { money: 300 }
  },
  {
    id: 'dream_silk_found',
    name: 'Dream silk like satin',
    description: 'Obtain dream silk. ',
    condition: { type: 'itemDiscovered', itemId: 'dream_silk' },
    reward: { money: 300 }
  }
]

/** Ancestral Hall Task Board */
export const COMMUNITY_BUNDLES: CommunityBundleDef[] = [
  {
    id: 'spring_bundle',
    name: 'The gift of spring plowing',
    description: 'A collection of spring products. ',
    requiredItems: [
      { itemId: 'cabbage', quantity: 5 },
      { itemId: 'radish', quantity: 5 },
      { itemId: 'bamboo_shoot', quantity: 3 },
      { itemId: 'tea', quantity: 2 }
    ],
    reward: {
      money: 500,
      items: [{ itemId: 'seed_peach', quantity: 3 }],
      description: '500 text + peach seeds × 3'
    }
  },
  {
    id: 'summer_bundle',
    name: 'Midsummer Gift',
    description: 'Summer product collection. ',
    requiredItems: [
      { itemId: 'watermelon', quantity: 3 },
      { itemId: 'rice', quantity: 5 },
      { itemId: 'lotus_root', quantity: 2 },{ itemId: 'chili', quantity: 3 }
    ],
    reward: {
      money: 800,
      items: [{ itemId: 'seed_lotus_seed', quantity: 2 }],
      description: '800 text + lotus seed × 2'
    }
  },
  {
    id: 'autumn_bundle',
    name: 'Golden Autumn Gift',
    description: 'A collection of autumn products. ',
    requiredItems: [
      { itemId: 'pumpkin', quantity: 3 },
      { itemId: 'osmanthus', quantity: 2 },
      { itemId: 'jujube', quantity: 3 },
      { itemId: 'persimmon', quantity: 2 }
    ],
    reward: {
      money: 800,
      items: [{ itemId: 'seed_snow_lotus', quantity: 1 }],
      description: '800 Text + Snow Lotus Seed × 1'
    }
  },
  {
    id: 'winter_bundle',
    name: 'Winter Gift',
    description: 'A collection of winter products. ',
    requiredItems: [
      { itemId: 'winter_bamboo_shoot', quantity: 5 },
      { itemId: 'winter_wheat', quantity: 3 },
      { itemId: 'garlic', quantity: 3 },
      { itemId: 'ginger', quantity: 2 }
    ],
    reward: { money: 1000, description: '1000 Wen' }
  },
  {
    id: 'artisan_bundle',
    name: 'The gift of craftsmanship',
    description: 'A collection of various processed products. ',
    requiredItems: [
      { itemId: 'watermelon_wine', quantity: 1 },
      { itemId: 'pickled_cabbage', quantity: 1 },
      { itemId: 'honey', quantity: 2 },
      { itemId: 'sesame_oil', quantity: 1 },
      { itemId: 'peach_wine', quantity: 1 }
    ],
    reward: { money: 2000, description: '2000 Wen' }
  },
  {
    id: 'friendship_bundle',
    name: 'The Gift of Nostalgia',
    description: 'Build friendly relations with all villagers. ',
    requiredItems: [
      { itemId: 'wintersweet', quantity: 2 },
      { itemId: 'chrysanthemum', quantity: 2 },
      { itemId: 'osmanthus', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  // catch
  {
    id: 'fish_bundle',
    name: 'Catching Gift',
    description: 'A collection of fish catches from various waters. ',
    requiredItems: [
      { itemId: 'crucian', quantity: 3 },
      { itemId: 'carp', quantity: 3 },
      { itemId: 'bass', quantity: 2 },
      { itemId: 'catfish', quantity: 1 }
    ],
    reward: { money: 1000, description: '1000 Wen' }
  },
  {
    id: 'rare_fish_bundle',
    name: 'Precious gift',
    description: 'A rare and rare fish. ',
    requiredItems: [
      { itemId: 'sturgeon', quantity: 1 },
      { itemId: 'mandarin_fish', quantity: 1 },
      { itemId: 'koi', quantity: 1 },
      { itemId: 'eel', quantity: 1 }
    ],
    reward: {
      money: 2500,
      items: [{ itemId: 'iridium_ore', quantity: 3 }],
      description: '2500 Text + Iridium Ore×3'
    }
  },
  // Ore and gemstones
  {
    id: 'ore_bundle',
    name: 'Gift of Ore',
    description: 'Various types of ores collected in the mines. ',
    requiredItems: [
      { itemId: 'copper_ore', quantity: 10 },
      { itemId: 'iron_ore', quantity: 5 },
      { itemId: 'gold_ore', quantity: 3 },
      { itemId: 'quartz', quantity: 3 }
    ],
    reward: { money: 1000, description: '1000 Wen' }
  },
  {
    id: 'gem_bundle',
    name: 'Gift of Treasures',
    description: 'A dazzling collection of gems. ',
    requiredItems: [
      { itemId: 'jade', quantity: 2 },
      { itemId: 'ruby', quantity: 1 },
      { itemId: 'moonstone', quantity: 1 },
      { itemId: 'obsidian', quantity: 1 }
    ],
    reward: {money: 3000,
      items: [{ itemId: 'dragon_jade', quantity: 1 }],
      description: '3000 Wen + Dragon Jade × 1'
    }
  },
  // Livestock products
  {
    id: 'animal_bundle',
    name: 'Gift of the Ranch',
    description: 'A gift from the ranch animals. ',
    requiredItems: [
      { itemId: 'egg', quantity: 5 },
      { itemId: 'milk', quantity: 3 },
      { itemId: 'duck_egg', quantity: 2 },
      { itemId: 'wool', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'egg_bundle',
    name: 'The gift of a hundred eggs',
    description: 'Collect eggs from various rare birds. ',
    requiredItems: [
      { itemId: 'egg', quantity: 3 },
      { itemId: 'duck_egg', quantity: 2 },
      { itemId: 'goose_egg', quantity: 1 },
      { itemId: 'quail_egg', quantity: 2 },
      { itemId: 'silkie_egg', quantity: 1 }
    ],
    reward: { money: 1200, description: '1200 Wen' }
  },
  {
    id: 'milk_bundle',
    name: 'Gift of Dairy',
    description: 'A variety of fresh dairy products. ',
    requiredItems: [
      { itemId: 'milk', quantity: 3 },
      { itemId: 'goat_milk', quantity: 2 },
      { itemId: 'buffalo_milk', quantity: 1 },
      { itemId: 'yak_milk', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  // Processed products
  {
    id: 'wine_bundle',
    name: 'Gift of Fine Wine',
    description: 'A carefully brewed wine. ',
    requiredItems: [
      { itemId: 'watermelon_wine', quantity: 1 },
      { itemId: 'peach_wine', quantity: 1 },
      { itemId: 'jujube_wine', quantity: 1 },
      { itemId: 'osmanthus_wine', quantity: 1 },
      { itemId: 'corn_wine', quantity: 1 }
    ],
    reward: { money: 2500, description: '2500 Wen' }
  },
  {
    id: 'tea_bundle',
    name: 'Tea Ceremony',
    description: 'Taste the fragrant tea of the four seasons. ',
    requiredItems: [
      { itemId: 'green_tea_drink', quantity: 2 },
      { itemId: 'chrysanthemum_tea', quantity: 2 },
      { itemId: 'osmanthus_tea', quantity: 1 },
      { itemId: 'ginseng_tea', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'pickle_bundle',
    name: 'The Gift of Pickling',
    description: 'Various pickled snacks. ',
    requiredItems: [
      { itemId: 'pickled_cabbage', quantity: 2 },
      { itemId: 'pickled_chili', quantity: 2 },
      { itemId: 'pickled_ginger', quantity: 2 },
      { itemId: 'dried_radish', quantity: 2 }
    ],
    reward: { money: 1000, description: '1000 Wen' }
  },
  {
    id: 'smoked_bundle',
    name: 'The gift of smoking',
    description: 'Smoked fish. ',
    requiredItems: [
      { itemId: 'smoked_crucian', quantity: 1 },
      { itemId: 'smoked_carp', quantity: 1 },
      { itemId: 'smoked_bass', quantity: 1 },
      { itemId: 'smoked_eel', quantity: 1 },
      { itemId: 'smoked_sturgeon', quantity: 1 }
    ],
    reward: { money: 2000, description: '2000 Wen' }
  },
  {
    id: 'honey_bundle',
    name: 'Gift of Honey',
    description: 'Sweetness made from hundreds of flowers. ',
    requiredItems: [
      { itemId: 'honey', quantity: 3 },
      { itemId: 'chrysanthemum_honey', quantity: 1 },
      { itemId: 'osmanthus_honey', quantity: 1 },
      { itemId: 'rapeseed_honey', quantity: 1 }
    ],
    reward: { money: 1800, description: '1800文' }
  },
  {id: 'cheese_bundle',
    name: 'Cheese Gift',
    description: 'A variety of cheeses. ',
    requiredItems: [
      { itemId: 'cheese', quantity: 2 },
      { itemId: 'goat_cheese', quantity: 1 },
      { itemId: 'buffalo_cheese', quantity: 1 },
      { itemId: 'yak_cheese', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'bar_bundle',
    name: 'The Gift of Hundred Works',
    description: 'Metal ingots and basic materials. ',
    requiredItems: [
      { itemId: 'copper_bar', quantity: 5 },
      { itemId: 'iron_bar', quantity: 3 },
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'charcoal', quantity: 5 }
    ],
    reward: {
      money: 2000,
      items: [{ itemId: 'iridium_bar', quantity: 1 }],
      description: '2000 Wen + Iridium Ingot × 1'
    }
  },
  //breeding
  {
    id: 'hybrid_spring_bundle',
    name: 'Chunhua Hybrid',
    description: 'Preliminary harvest of spring hybrid crops. ',
    requiredItems: [
      { itemId: 'emerald_radish', quantity: 2 },
      { itemId: 'jade_shoot', quantity: 2 },
      { itemId: 'peach_blossom_tea', quantity: 1 },
      { itemId: 'twin_bean', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'hybrid_summer_bundle',
    name: 'Xia Shi hybrid',
    description: 'The fruit of summer hybrid crops. ',
    requiredItems: [
      { itemId: 'purple_melon', quantity: 2 },
      { itemId: 'golden_rice', quantity: 2 },
      { itemId: 'double_lotus', quantity: 1 },
      { itemId: 'fire_sesame', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'hybrid_autumn_bundle',
    name: 'Autumn Rhyme Hybrid',
    description: 'The taste of a bountiful autumn hybrid crop. ',
    requiredItems: [
      { itemId: 'amber_yam', quantity: 2 },
      { itemId: 'twin_blossom', quantity: 1 },
      { itemId: 'golden_persimmon', quantity: 2 },
      { itemId: 'autumn_gem', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'hybrid_winter_bundle',
    name: 'Winter Tibetan Hybrid',
    description: 'The ultimate winter hybrid crop. ',
    requiredItems: [
      { itemId: 'jade_white', quantity: 2 },
      { itemId: 'garlic_cabbage', quantity: 2 },
      { itemId: 'evergreen_herb', quantity: 2 },
      { itemId: 'allium_king', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 Wen' }
  },
  {
    id: 'hybrid_elite_bundle',
    name: 'Second generation treasure',
    description: 'A rare collection of second generation hybrids. ',
    requiredItems: [
      { itemId: 'melon_tea_fruit', quantity: 1 },
      { itemId: 'dragon_fire', quantity: 1 },
      { itemId: 'celestial_rice', quantity: 1 },
      { itemId: 'ice_lotus', quantity: 1 },
      { itemId: 'golden_dragon', quantity: 1 }
    ],
    reward: {
      money: 5000,
      items: [{ itemId: 'iridium_ore', quantity: 5 }],
      description: '5000 Text + Iridium Ore×5'
    }
  },
  {
    id: 'hybrid_legendary_bundle',
    name: 'Legendary Breed',
    description: 'A masterpiece of high-end hybrids. ',
    requiredItems: [
      { itemId: 'dragon_pearl', quantity: 1 },
      { itemId: 'immortal_flower', quantity: 1 },
      { itemId: 'jade_golden_melon', quantity: 1 },
      { itemId: 'moonlight_frost', quantity: 1 }
    ],
    reward: {money: 8000,
      items: [{ itemId: 'prismatic_shard', quantity: 1 }],
      description: '8000 Text + Prismatic Fragment × 1'
    }
  }
]

export const getAchievementById = (id: string): AchievementDef | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export const getBundleById = (id: string): CommunityBundleDef | undefined => {
  return COMMUNITY_BUNDLES.find(b => b.id === id)
}