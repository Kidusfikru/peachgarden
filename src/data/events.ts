import type { Season } from '@/types'

/** Seasonal event definition */
export interface SeasonEventDef {
  id: string
  name: string
  season: season
  day: number // trigger date
  description: string
  /** Event effect */
  effects: {
    friendshipBonus?: number // All NPC favorability bonus
    moneyReward?: number // Copper coin reward
    itemReward?: { itemId: string; quantity: number }[]
    staminaBonus?: number // Extra stamina recovery
  }
  /** Event copy */
  narrative: string[]
  /**
   * Copywriting exclusively for married players.
   * Some holidays are written as "alone" by default, which will cause drama after the player gets married, so a separate set is provided.
   */
  narrativeMarried?: string[]
  /** Whether it is an interactive festival (with mini-games) */
  interactive?: boolean
  /** Interactive festival type */
  festivalType?:
    | 'fishing_contest'
    | 'harvest_fair'
    | 'dragon_boat'
    | 'lantern_riddle'
    | 'pot_throwing'
    | 'dumpling_making'
    | 'firework_show'
    | 'tea_contest'
    | 'kite_flying'
}

export const SEASON_EVENTS: SeasonEventDef[] = [
  {
    id: 'spring_festival',
    name: 'Spring Plowing Festival',
    season: 'spring',
    day: 8,
    description: 'The whole village celebrates the beginning of spring plowing and prays for a good harvest. ',
    effects: {
      friendshipBonus: 5,
      itemReward: [{ itemId: 'seed_cabbage', quantity: 5 }]
    },
    narrative: [
      'Taoyuan Township's annual spring plowing festival is here! ',
      'The villagers gathered in the square, and Uncle Chen presided over the blessing ceremony. ',
      Liu Niang hung red ribbons on the tree, and the breeze blew like a red cloud. ',
      '"I wish you good weather and good harvest this year!"',
      'Uncle Chen gave some seeds as a blessing. ',
      'All villagers' favorability +5. '
    ]
  },
  {
    id: 'summer_lantern',
    name: 'Lotus Lantern Festival·Fishing Competition',
    season: 'summer',
    day: 15,
    description: 'Lights are put out by the river to pray for blessings, and there is also an exciting fishing competition! ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Beside the clear stream on a summer night, villagers gathered together to put on lanterns. ',
      'Qiuyue prepared various lotus lanterns early. ',
      '"Come on, come on! A fishing competition has been added this year!"',
      'Soft lights drifted on the water, reflecting the stars in the sky. ',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'fishing_contest'
  },
  {
    id: 'autumn_harvest',
    name: 'Harvest Feast·Agricultural Exhibition',
    season: 'autumn',
    day: 22,
    description: 'Compete the harvest to see whose exhibits are the best! ',
    effects: {
      friendshipBonus: 5,
      staminaBonus: 30
    },
    narrative: [
      'Taoyuan Township in autumn is full of harvest atmosphere. ',
      'The villagers gathered in the square with their best harvests. ',
      'Uncle Chen announced: "We will hold an agricultural exhibition this year, and everyone will bring out the best things!"',
      'The sumptuous banquet restored you an additional 30 points of physical strength. ',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'harvest_fair'
  },
  {
    id: 'winter_new_year',
    name: 'New Year's Eve',
    season: 'winter',
    day: 28,
    description: 'Reunion at the end of the year, bidding farewell to the old and welcoming the new. ',
    effects: {
      friendshipBonus: 10,
      moneyReward: 300,
      itemReward: [
        { itemId: 'herb', quantity: 3 },
        { itemId: 'firewood', quantity: 5 }
      ]
    },
    narrative: [
      'The 28th day of winter - New Year's Eve. ',
      'Every household in Taoyuan Township is decorated with lanterns and colorful lights, and smoke is curling up from the kitchens. ',
      'Liu Niang poked her head in the door and said, "It's so deserted to watch the New Year's Eve alone. Let's go to the village chief's house to join in the fun!"',
      'Uncle Chen brought the steaming New Year's Eve dinner, and Mr. Lin handed over a glass of warm wine. ',
      'A Shi awkwardly handed over a red envelope: "...Happy New Year."',
      Qiuyue and Xiaoman set off firecrackers in the yard, and laughter rang through the night sky. ',
      "In the new year, Taoyuan Township will get better and better," Mr. Lin said. ',
      'This is your first New Year spent in Taoyuan Township. ',
      'Received a red envelope of 300 Wen and gifts from villagers. All villagers' favorability +10. '
    ],
    narrativeMarried: [
      'The 28th day of winter - New Year's Eve. ',
      'Every household in Taoyuan Township is decorated with lanterns and colorful lights, and smoke is curling up from the kitchens. ',
      'You and {spouse} posted Spring Festival couplets early in the morning, and a pot of hot soup is simmering on the stove. ',
      'When it got dark, Uncle Chen and Mr. Lin came to visit with wine and food, and the small courtyard was suddenly crowded with people. ',
      'A Shi awkwardly handed over a red envelope: "...Happy New Year."',
      Qiuyue and Xiaoman set off firecrackers in the yard, and laughter rang through the night sky. ',
      "In the new year, Taoyuan Township will get better and better," Mr. Lin said. ',
      '{spouse} leaned next to you and whispered: "Let's spend next year together."',
      'This is your first New Year spent in Taoyuan Township. ','Received a red envelope of 300 Wen and gifts from villagers. All villagers' favorability +10. '
    ]
  },

  // ==================== New holidays (10) ====================

  // --- Passive festival ---
  {
    id: 'yuan_ri',
    name: 'Yuanri',
    season: 'spring',
    day: 1,
    description: 'At the beginning of the new year, everything is updated. ',
    effects: {
      friendshipBonus: 5,
      moneyReward: 300,
      itemReward: [{ itemId: 'seed_cabbage', quantity: 3 }]
    },
    narrative: [
      'The first day of spring - Yuan Day. ',
      'In the early morning in Taoyuan Township, New Year couplets were hung in front of every house. ',
      'Uncle Chen handed over a bowl of rice cakes with a smile: "New year, new atmosphere, you will be better and better after eating rice cakes!"',
      Liu Niang led the villagers to set off firecrackers at the entrance of the village, which was very lively. ',
      'Mr. Lin stood under the peach blossom tree with gentle eyes: "It's another good year."',
      'I received a New Year red envelope of 300 Wen and seeds. All villagers' favorability +5. '
    ]
  },
  {
    id: 'hua_chao',
    name: 'Flower Chao Festival',
    season: 'spring',
    day: 15,
    description: 'Hundred Flowers Birthday, enjoy the flowers and pray for blessings. ',
    effects: {
      friendshipBonus: 5,
      itemReward: [
        { itemId: 'peach', quantity: 3 },
        { itemId: 'seed_chrysanthemum', quantity: 2 }
      ]
    },
    narrative: [
      'The 15th day of spring - Flower Festival. ',
      'The peach blossoms in Taoyuan Township are in full bloom, with petals flying in the wind. ',
      'Qiuyue made a wreath and put it on her head: "Today is Baihua's birthday!"',
      Liu Niang set up an incense table under the flower tree and led everyone to worship the flower god and tie red silk. ',
      'Xiaoman chased butterflies among the flowers, laughing constantly. ',
      'You received peach blossoms and flower seeds. All villagers' favorability +5. '
    ]
  },
  {
    id: 'shang_si',
    name: 'Shangsi outing',
    season: 'spring',
    day: 24,
    description: 'Go on a spring outing and get close to nature. ',
    effects: {
      friendshipBonus: 3,
      staminaBonus: 40,
      itemReward: [{ itemId: 'wild_berry', quantity: 3 }]
    },
    narrative: [
      'The 24th day of spring - Shangsi Festival. ',
      'The whole village went for an outing in the mountains together, where the streams were gurgling and the birds were singing and the flowers were fragrant. ',
      'A Shi smiled rarely and silently washed his hands and prayed by the stream. ',
      'Qiuyue and Xiaoman were making grass rings on the grass, and you joined them. ',
      Mr. Lin picked a basket of wild fruits and distributed them to everyone. The breeze blew on his face and he felt relaxed physically and mentally. ',
      'The outing refreshed you and restored 40 points of physical strength. All villagers' favorability +3. '
    ]
  },
  {
    id: 'zhong_qiu',
    name: 'Mid-Autumn Moon Appreciation',
    season: 'autumn',
    day: 8,
    description: 'The moon is full and people are round, let's enjoy the bright moon together. ',
    effects: {
      friendshipBonus: 8,
      moneyReward: 500,
      itemReward: [{ itemId: 'lotus_seed', quantity: 3 }]
    },
    narrative: [
      'The 8th day of autumn - Mid-Autumn Festival. ',
      'After night falls, a bright moon hangs high in the sky. ',
      'The villagers gathered in the square, and the tables were filled with lotus seed cakes and fruits. ',
      'Uncle Chen was holding a wine pot and chanting a poem to the moon: "I hope that we will live forever and share the beauty of the moon thousands of miles apart."',
      Liu Niang gave everyone a piece of moon cake and a moon-appreciating red envelope. ',
      Qiuyue looked at the moon quietly, seeming to think of something. ',
      "Thank you, I am happy every day in Taoyuan Township." She said softly. ',
      'Received 500 Wen and lotus seeds. All villagers' favorability +8. '
    ]
  },
  {
    id: 'la_ba',
    name: 'Laba Porridge Party',
    season: 'winter',
    day: 8,
    description: 'Cooking Laba rice porridge can dispel cold and warm the stomach. ',
    effects: {
      friendshipBonus: 5,
      staminaBonus: 50,
      itemReward: [{ itemId: 'rice', quantity: 5 }]
    },
    narrative: [
      'The 8th day of winter - Laba Festival. ',
      'It's the twelfth lunar month of winter, but the village fires are burning brightly. ',
      'Uncle Chen started cooking Laba porridge early in the morning, and every household contributed their own ingredients. ',
      'Peanuts, red dates, lotus seeds, rice... a big pot full of porridge is steaming. ',
      Liu Niang smiled and filled a bowl and handed it to you: "If you drink Laba porridge, it will be a good omen for the coming year."',
      'After eating a bowl of hot porridge, I feel warm all over. Recover 50 points of physical strength. ',
      'Rice received. All villagers' favorability +5. '
    ]
  },

  // --- Interactive Festival ---
  {
    id: 'duan_wu',
    name: 'Dragon Boat Race',
    season: 'summer',
    day: 5,
    description: 'Dragon boat race, fight for the first place! ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The fifth day of summer - Dragon Boat Festival. ',
      'The Taoyuan River is very lively, with three dragon boats lined up! ',
      'Uncle Chen stood on the shore and acted as a referee: "Everyone is on his position—get ready—"',
      'Ashi and Xiaoman are already gearing up on the boat. ',
      "Get on the boat! The dragon boat race is about to start!" Qiuyue waves to you. ',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'dragon_boat'
  },
  {
    id: 'qi_xi',
    name: 'Guessing Lantern Riddles on Chinese Valentine's Day',
    season: 'summer',
    day: 22,
    description: 'During the Chinese Valentine's Day, solve lantern riddles skillfully. ',effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 22nd day of summer - Chinese Valentine's Day. ',
      'As night falls, the village square is filled with colorful lanterns. ',
      'There is a lantern riddle tied under each lantern. If you guess it correctly, you will win a prize! ',
      'Zhou Xiucai stroked his beard: "This year's lantern riddles are carefully prepared by me."',
      'Qiuyue's eyes were bright: "Let's see who can guess the most!"',
      'All villagers' favorability +5. '
    ],
    narrativeMarried: [
      'The 22nd day of summer - Chinese Valentine's Day. ',
      'As night falls, the village square is filled with colorful lanterns. ',
      '{spouse} pulls you through the lanterns, forcing you to guess the one at the top. ',
      'Zhou Xiucai stroked his beard: "This year's lantern riddles are carefully prepared by me."',
      'Qiuyue booed: "Those who are married, don't be lazy, let's compete!"',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'lantern_riddle'
  },
  {
    id: 'chong_yang',
    name: 'Double Ninth Festival Tou Hu',
    season: 'autumn',
    day: 15,
    description: 'Climb high on the Double Ninth Festival and compete in pot throwing. ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 15th day of autumn - Double Ninth Festival. ',
      'The autumn air is crisp and clear, and the villagers have set up copper pots for throwing pots in the square. ',
      Mr. Lin smiled and said: "Tossing pots is an ancient and elegant thing. Let's try our skills today."',
      Ah Shi picked up the arrow without saying a word, his eyes serious. ',
      'Xiao Man was eager to try: "I will definitely hit it!"',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'pot_throwing'
  },
  {
    id: 'dong_zhi',
    name: 'Winter Solstice Dumplings',
    season: 'winter',
    day: 15,
    description: 'The winter solstice is as big as the New Year, and dumplings warm the world. ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 15th day of winter - the winter solstice. ',
      'The north wind howls, but the village hall is steaming with steam. ',
      'Uncle Chen made the noodles early: "If you don't bring dumpling bowls during the winter solstice, your ears will freeze off and no one will care!"',
      Liu Niang and Qiuyue were already gathered around the table making stuffings. ',
      "Come on, let's see who can wrap it up quickly and well!" Liu Niang waves to you. ',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'dumpling_making'
  },
  {
    id: 'nian_mo',
    name: 'Year-end Fireworks Party',
    season: 'winter',
    day: 22,
    description: 'The end of the year is approaching and fireworks light up the night sky. ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 22nd day of winter - the year-end fireworks show. ',
      'This is the biggest celebration before New Year's Eve. ',
      'A Shi brought several boxes of fireworks: "...I'll set them off."',
      'Xiao Man jumped up and down excitedly: "Fireworks! Fireworks! My favorite!"',
      'Qiuyue pulls you: "Let's remember these beautiful fireworks together!"',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'firework_show'
  },
  {
    id: 'dou_cha',
    name: 'Tea Fighting Conference',
    season: 'summer',
    day: 18,
    description: 'Meet friends over tea and discuss Taoism over tea! ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 18th day of summer - Tea Fighting Conference. ',
      'On a hot summer day, it's best to drink tea. ',
      Mr. Lin set up a tea table in the square. There was a clear spring and all the tea utensils were available. ',
      '"Good tea requires good water, good fire, and good hands. The word "good" is what I am comparing today."',
      Qiuyue has already polished the tea set, and Ashi has brought the mountain spring water. ',
      Uncle Chen laughed and said, "Come and try your skills to see who can make the best tea!"',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'tea_contest'
  },
  {
    id: 'qiu_yuan',
    name: 'Autumn Kite Festival',
    season: 'autumn',
    day: 18,
    description: 'The autumn air is crisp and the kites are flying! ',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'The 18th day of autumn - Autumn Kite Festival. ',
      'The sky is high and the clouds are clear, it's a good time to fly kites. ',
      'Xiao Man tied up a butterfly kite early in the morning: "Look, look!"',
      Ah Shi silently took out an eagle-shaped kite with fine workmanship. ',
      'Qiuyue blushed and handed over a flower-shaped one: "I... it's my first time to do it."',
      Liu Niang said with a smile: "Let's see whose kite can fly the highest and most steadily!"',
      'All villagers' favorability +5. '
    ],
    interactive: true,
    festivalType: 'kite_flying'
  }
]

/** Get today's events based on season and date */
export const getTodayEvent = (season: Season, day: number): SeasonEventDef | undefined => {
  return SEASON_EVENTS.find(e => e.season === season && e.day === day)
}
