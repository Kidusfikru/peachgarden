import type { FishDef, FishingLocation } from '@/types'

/** Fishing location definition */
export const FISHING_LOCATIONS: {
  id: FishingLocation
  name: string
  description: string
}[] = [
  { id: 'creek', name: 'Stream', description: 'The clear creek next to the village is suitable for novice fishing. ' },
  { id: 'pond', name: 'pond', description: 'A quiet pond in the village, the water is as calm as a mirror. ' },
  { id: 'river', name: 'River', description: 'The fast river has bigger fish. ' },
  {
    id: 'mine',
    name: 'Underground river in mine',
    description: 'In the underground water area deep in the mine, fish are not affected by the seasons. '
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'The deep pool under the waterfall in the mountains can only be harvested by experts. '
  },
  {
    id: 'swamp',
    name: 'swamp',
    description: 'The wetlands outside Taoyuan Township are home to strange aquatic creatures. '
  }
]

/** Definition of all fish (60 species) */
export const FISH: FishDef[] = [
  // ==================== Creek — 15 types ====================
  {
    id: 'crucian',
    name: 'crucian carp',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 15,
    description: 'The most common freshwater fish, a good partner for beginners. ',
    location: 'creek',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.02
  },
  {
    id: 'carp',
    name: 'carp',
    season: ['spring', 'summer'],
    weather: ['sunny'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'A fish often seen by the stream on a sunny day. ',
    location: 'creek',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.03
  },
  {
    id: 'silver_carp',
    name: 'silver carp',
    season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 20,
    description: 'Common Silver Carp. ',
    location: 'creek',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.03
  },
  {
    id: 'ice_fish',
    name: 'ice fish',
    season: ['winter'],
    weather: ['snowy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Small fish in icy waters. ',
    location: 'creek',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'dragonfish',
    name: 'Arowana',
    season: ['summer'],
    weather: ['stormy'],
    difficulty: 'legendary',
    sellPrice: 500,
    description: 'A legendary fish that only appears in storms. ',
    location: 'creek',
    miniGameSpeed: 5.0,
    miniGameDirChange: 0.1
  },
  // Add new stream
  {
    id: 'minnow',
    name: 'white striped fish',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 10,
    description: 'The most inconspicuous stream fish, found in groups of twos and threes. ',
    location: 'creek',
    miniGameSpeed: 0.6,
    miniGameDirChange: 0.02
  },
  {
    id: 'creek_chub',
    name: 'Xigeyu',
    season: ['spring', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 18,
    description: 'A nimble little fish in the stream. ',
    location: 'creek',
    miniGameSpeed: 1.3,
    miniGameDirChange: 0.04
  },
  {
    id: 'loach',
    name: 'Loach',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'easy',
    sellPrice: 22,
    description: 'Stream loach active after rain. ',
    location: 'creek',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.05
  },
  {
    id: 'rainbow_trout',
    name: 'Rainbow Trout',
    season: ['spring', 'summer'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 45,
    description: 'Trout shining in colorful colors in the sun. ',
    location: 'creek',miniGameSpeed: 2.2,
    miniGameDirChange: 0.05
  },
  {
    id: 'creek_perch',
    name: 'Creek',
    season: ['autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Creek bass in late autumn stream. ',
    location: 'creek',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'stone_loach',
    name: 'Grouper',
    season: ['summer'],
    weather: ['sunny', 'windy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'A striped fish hiding in the crevices of rocks in the stream. ',
    location: 'creek',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'creek_shrimp',
    name: 'Xijia',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 30,
    description: 'Small shrimp in clear stream. ',
    location: 'creek',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.06
  },
  {
    id: 'creek_salmon',
    name: 'brook trout',
    season: ['autumn'],
    weather: ['rainy', 'windy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Brook salmon migrating in autumn. ',
    location: 'creek',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'golden_perch',
    name: 'Golden Bass',
    season: ['summer'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 110,
    description: 'Rare golden bass, valuable. ',
    location: 'creek',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.05
  },
  {
    id: 'creek_king',
    name: 'Xiba',
    season: ['spring', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 140,
    description: 'The king of the stream, with great strength. ',
    location: 'creek',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.04
  },

  // ==================== Pond — 10 types ====================
  {
    id: 'grass_carp',
    name: 'grass carp',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 40,
    description: 'A large freshwater fish. ',
    location: 'pond',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'koi',
    name: 'Koi',
    season: ['spring'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 120,
    description: 'Gorgeous koi, very precious. ',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.08
  },
  {
    id: 'golden_carp',
    name: 'Golden Carp',
    season: ['spring'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 150,
    description: 'Shining golden carp. ',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  {
    id: 'golden_turtle',
    name: 'Golden Tortoise',
    season: ['autumn'],
    weather: ['sunny'],
    difficulty: 'legendary',
    sellPrice: 450,
    description: 'The legendary tortoise carrying golden armor is said to be blessed by those who see it. ',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.12
  },
  // Add new pond
  {
    id: 'pond_snail',
    name: 'Snail',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 12,
    description: 'Snails at the bottom of the pond. ',
    location: 'pond',
    miniGameSpeed: 0.5,
    miniGameDirChange: 0.01
  },
  {
    id: 'crucian_pond',
    name: 'Tang crucian carp',season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 18,
    description: 'A plump crucian carp in the pond. ',
    location: 'pond',
    miniGameSpeed: 0.9,
    miniGameDirChange: 0.02
  },
  {
    id: 'red_tail',
    name: 'Redtail Fish',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'An ornamental fish with a bright red tail fin. ',
    location: 'pond',
    miniGameSpeed: 1.1,
    miniGameDirChange: 0.03
  },
  {
    id: 'lotus_carp',
    name: 'Lotus Carp',
    season: ['summer'],
    weather: ['sunny', 'rainy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Carp swimming among lotus leaves. ',
    location: 'pond',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.06
  },
  {
    id: 'pond_turtle',
    name: 'turtle',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Pond turtle basking in the sun. ',
    location: 'pond',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.02
  },
  {
    id: 'moon_fish',
    name: 'Moonlight Fish',
    season: ['autumn'],
    weather: ['windy'],
    difficulty: 'normal',
    sellPrice: 75,
    description: 'A silver-white fish that surfaces when the autumn wind blows. ',
    location: 'pond',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.05
  },

  // ==================== River — 12 types ====================
  {
    id: 'bass',
    name: 'bass',
    season: ['autumn'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'A delicious fish that appears in the autumn rain. ',
    location: 'river',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.04
  },
  {
    id: 'catfish',
    name: 'catfish',
    season: ['summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 45,
    description: 'Catfish active on rainy days. ',
    location: 'river',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.05
  },
  {
    id: 'sturgeon',
    name: 'sturgeon',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 130,
    description: 'A huge ancient fish species. ',
    location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'mandarin_fish',
    name: 'Osmanthus fish',
    season: ['autumn'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 70,
    description: 'Delicious sweet mandarin fish. ',
    location: 'river',
    miniGameSpeed: 2.3,
    miniGameDirChange: 0.05
  },
  // Jianghe added
  {
    id: 'green_fish',
    name: 'Herring',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 28,
    description: 'A large freshwater fish common in rivers. ',
    location: 'river',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.02
  },
  {
    id: 'bighead_carp',
    name: 'Bighead Carp',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 30,
    description: 'Bighead carp with a big head and round body. ',
    location: 'river',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.02
  },
  {
    id: 'pike',
    name: 'Butterfish',
    season: ['summer'],
    weather: ['sunny', 'windy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'A ferocious freshwater predator. ',location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'knife_fish',
    name: 'Knifefish',
    season: ['spring'],
    weather: ['windy', 'rainy'],
    difficulty: 'normal',
    sellPrice: 75,
    description: 'Shaped like a knife, it migrates during spring floods. ',
    location: 'river',
    miniGameSpeed: 2.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'river_crab',
    name: 'River Crab',
    season: ['autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 80,
    description: 'The crabs are fat in autumn and full of yellow paste. ',
    location: 'river',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.07
  },
  {
    id: 'river_eel',
    name: 'River Eel',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 100,
    description: 'Eels active in the river on a rainy night. ',
    location: 'river',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.07
  },
  {
    id: 'chinese_sturgeon',
    name: 'Chinese sturgeon',
    season: ['spring', 'autumn'],
    weather: ['rainy', 'stormy'],
    difficulty: 'hard',
    sellPrice: 180,
    description: 'Rare large migratory fish. ',
    location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'river_dragon',
    name: '江龙',
    season: ['summer'],
    weather: ['stormy'],
    difficulty: 'legendary',
    sellPrice: 550,
    description: 'The legendary giant fish that jumped out of the river during the storm. ',
    location: 'river',
    miniGameSpeed: 5.5,
    miniGameDirChange: 0.05
  },

  // ==================== Mine — 8 types ====================
  {
    id: 'cave_loach',
    name: 'Mine Loach',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 35,
    description: 'Loach in the underground water of the mine. ',
    location: 'mine',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.05
  },
  {
    id: 'cave_blindfish',
    name: 'Cave blind fish',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'hard',
    sellPrice: 100,
    description: 'Rare blind fish deep in the mine. ',
    location: 'mine',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  // Add new mine
  {
    id: 'glowfish',
    name: 'fluorescent fish',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'A small fish that glows in the dark. ',
    location: 'mine',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'stone_crab',
    name: 'Stone Crab',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 30,
    description: 'A small crab that lives among the rocks in the mine. ',
    location: 'mine',
    miniGameSpeed: 0.7,
    miniGameDirChange: 0.02
  },
  {
    id: 'crystal_shrimp',
    name: 'Crystal Shrimp',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'The mine shrimp is completely transparent, like crystal. ',
    location: 'mine',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.06
  },
  {
    id: 'lava_snail',
    name: 'Lava Snail',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 70,description: 'A heat-resistant snail close to the lava layer. ',
    location: 'mine',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.03
  },
  {
    id: 'shadow_fish',
    name: 'Shadow Fish',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'hard',
    sellPrice: 120,
    description: 'The shadow fish that haunts the Shadow Rift. ',
    location: 'mine',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.08
  },
  {
    id: 'abyss_leviathan',
    name: 'Abyss Python',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'legendary',
    sellPrice: 800,
    description: 'No one can see the full extent of the ancient beast in the deepest part of the mine. ',
    location: 'mine',
    miniGameSpeed: 4.5,
    miniGameDirChange: 0.15
  },

  // ==================== Waterfall — 8 types ====================
  {
    id: 'eel',
    name: 'eel',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 85,
    description: 'Slippery eels, difficult to catch. ',
    location: 'waterfall',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.08
  },
  // Add new waterfall
  {
    id: 'mountain_minnow',
    name: 'shanxiyu',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 20,
    description: 'Little fish by the waterfall pool. ',
    location: 'waterfall',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.03
  },
  {
    id: 'rock_fish',
    name: 'Rockfish',
    season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Fish hidden among the rocks of the waterfall. ',
    location: 'waterfall',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'waterfall_crab',
    name: 'shanxi crab',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Crab in the crevice below the waterfall. ',
    location: 'waterfall',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'torrent_fish',
    name: 'Riptide Fish',
    season: ['spring', 'summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'A strong fish that swims backwards in rapids. ',
    location: 'waterfall',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'flying_fish',
    name: 'flying fish',
    season: ['summer'],
    weather: ['windy'],
    difficulty: 'normal',
    sellPrice: 70,
    description: 'A strange fish that can jump out of the water and glide in the wind. ',
    location: 'waterfall',
    miniGameSpeed: 3.0,
    miniGameDirChange: 0.07
  },
  {
    id: 'rock_eel',
    name: 'rock eel',
    season: ['autumn', 'winter'],
    weather: ['rainy', 'snowy'],
    difficulty: 'hard',
    sellPrice: 130,
    description: 'A giant eel entrenched in a cave deep in a waterfall. ',
    location: 'waterfall',
    miniGameSpeed: 3.0,
    miniGameDirChange: 0.04
  },
  {
    id: 'jade_dragon',
    name: 'Cuilong',
    season: ['spring'],
    weather: ['rainy'],
    difficulty: 'legendary',
    sellPrice: 600,
    description: 'A green spiritual dragon that appears in the waterfall in the spring rain. ',
    location: 'waterfall',
    miniGameSpeed: 4.5,
    miniGameDirChange: 0.07
  },

  // ==================== swamp — 7 types ====================
  {
    id: 'giant_salamander',
    name: 'Bayu',
    season: ['winter'],weather: ['snowy'],
    difficulty: 'legendary',
    sellPrice: 300,
    description: 'A legendary mysterious creature that only appears in winter snow. ',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.1
  },
  // Add new swamp
  {
    id: 'mud_loach',
    name: 'Swamp Loach',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 15,
    description: 'A loach rolling in the mud. ',
    location: 'swamp',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.04
  },
  {
    id: 'swamp_frog',
    name: 'frog fish',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'normal',
    sellPrice: 35,
    description: 'A strange creature that is half frog and half fish. ',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.08
  },
  {
    id: 'yellow_eel',
    name: 'Eel',
    season: ['summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Eels emerging from mud holes after rain. ',
    location: 'swamp',
    miniGameSpeed: 2.3,
    miniGameDirChange: 0.05
  },
  {
    id: 'snapping_turtle',
    name: 'snap turtle',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'A grumpy swamp turtle. ',
    location: 'swamp',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'swamp_catfish',
    name: 'marsh catfish',
    season: ['spring', 'summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Giant catfish deep in the swamp. ',
    location: 'swamp',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'miasma_fish',
    name: 'Miasma Fish',
    season: ['autumn', 'winter'],
    weather: ['rainy', 'windy'],
    difficulty: 'hard',
    sellPrice: 110,
    description: 'A strange fish that appears in the deep swamp filled with miasma. ',
    location: 'swamp',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  {
    id: 'ancient_newt',
    name: 'Ancient Salamander',
    season: ['spring', 'winter'],
    weather: ['snowy', 'rainy'],
    difficulty: 'hard',
    sellPrice: 160,
    description: 'A salamander said to have lived in swamps since ancient times. ',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.08
  }
]

/** Get fish based on ID */
export const getFishById = (id: string): FishDef | undefined => {
  return FISH.find(f => f.id === id)
}

/** Get the fish that can be caught in the current season, weather and location */
export const getAvailableFish = (season: string, weather: string, location?: FishingLocation): FishDef[] => {
  return FISH.filter(f => {
    const seasonMatch = f.season.includes(season as any)
    const weatherMatch = f.weather.includes('any') || f.weather.includes(weather as any)
    const locationMatch = !location || (f.location ?? 'creek') === location
    return seasonMatch && weatherMatch && locationMatch
  })
}
