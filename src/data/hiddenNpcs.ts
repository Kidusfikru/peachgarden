import type { HiddenNpcDef } from '@/types/hiddenNpc'

/** Definition of all hidden NPCs (fairies) */
export const HIDDEN_NPCS: HiddenNpcDef[] = [
  // ============================================================
  // 1. Dragon Spirit — Hidden Abyss Dragon Spirit
  // ============================================================
  {
    id: 'long_ling',
    name: '龙灵',
    trueName: 'Canglan',
    gender: 'female',
    title: 'Qianyuan Dragon Spirit',
    Origin: 'The green dragon has been lurking in the deep pool of the back mountain waterfall for thousands of years. It is said that Taoyuan Township has lived here since the beginning of the village. The scales occasionally appear in the rain and are regarded as guardian spirits by the villagers. ',
    personality: 'quiet, profound, simple and solemn',
    discoverySteps: [
      {
        id: 'long_ling_rumor',
        phase: 'rumor',
        conditions: [{ type: 'fishCaught', fishId: 'jade_dragon' }],
        scenes: [
          {
            text: 'You look carefully at the green arowana in your hand, its scales glowing unusually in the rain. A thought flashed through my mind - was this really just a fish? '
          },
          { text: 'A low roar came from the waterfall in the distance, which seemed to be mixed with some kind of... call. ' }
        ],
        logMessage: '[Xianyuan] The scales of the green dragon fish have a strange luster, and there seems to be spiritual energy surging deep in the waterfall...'
      },
      {
        id: 'long_ling_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'weather', weather: 'rainy' },
          { type: 'timeRange', minHour: 20, maxHour: 24 },
          { type: 'location', panel: 'fishing' }
        ],
        scenes: [
          {
            text: 'On a rainy spring night, you were fishing alone by the waterfall. Ripples suddenly appeared on the water. '
          },
          {
            text: 'A green snake-shaped figure flashed past behind the curtain of the waterfall, and its scales shone like broken jade on the water. '
          },
          {
            text: 'You rubbed your eyes, the water surface has returned to calm. But there is still a faint aroma of ambergris in the air. '
          }
        ],
        logMessage: '[Xianyuan] In the waterfall on a spring rainy night, a green figure flashed away...'
      },
      {
        id: 'long_ling_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'weather', weather: 'rainy' },
          { type: 'location', panel: 'fishing' },
          { type: 'item', itemId: 'dragon_jade', quantity: 1 }
        ],
        scenes: [
          {
            text: 'You hold the dragon jade and come to the waterfall. The jade suddenly emits a soft green light, echoing some kind of power in the waterfall. '
          },
          {
            text: 'The waterfall slowly parted, and a woman in green clothes walked out from behind the water curtain. Her long hair fell like a waterfall, and her eyes were deep emerald green. '
          },
          {
            text: '"Jade Holder...what do you want?" Her voice was as clear as running water, carrying thousands of years of precipitation. ',
            choices: [
              {
                text: 'I just followed the inspiration. ',
                friendshipChange: 80,
                response: 'She nodded slightly: "Pure heart, very good." A trace of tenderness flashed in her green pupils. '
              },
              {
                text: 'Excuse me...are you the legendary dragon spirit? ',
                friendshipChange: 40,
                response: '"Long Ling? That's a mortal's name. My name is Canglan." She said calmly, without any offense in her tone. '
              },
              {
                text: 'Is this dragon jade yours? ',
                friendshipChange: 60,
                response: 'She stretched out her hand to touch the jade stone, and ripples appeared on her fingertips: "This thing is destined to me. So does the person who holds it..."'
              }
            ]
          },
          {
            text: 'After speaking, her figure turned into mist and disappeared among the waterfalls. But you know she'll show up again. '
          }
        ],
        logMessage: '[Xianyuan] Behind the water curtain of the waterfall, Long Ling Canglan appeared for the first time. '
      },
      {
        id: 'long_ling_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_2_4' },
          { type: 'skill', skillType: 'fishing', minLevel: 5 }
        ],
        scenes: [{ text: 'When you come to the waterfall again, the dragon spirit is waiting by the water. ' },
          {
            text: '"Your obsession... no, it's your sincerity, moved me." She tilted her head slightly, revealing tiny emerald scales in her long hair. '
          },
          { text: '"My name is Canglan. From now on, if you want to meet me, just come here."' }
        ],
        logMessage: '[Xianyuan] Long Ling Canglan is willing to associate with you. '
      }
    ],
    resonantOfferings: ['dragon_jade', 'prismatic_shard', 'moonstone'],
    pleasedOfferings: ['jade_dragon', 'ruby', 'jade', 'obsidian', 'quartz'],
    repelledOfferings: ['charcoal', 'trash', 'wood'],
    dialogues: {
      wary: ['"Mortals... don't get too close."', '"The depths of the waterfall are not the place you should be."'],
      curious: ['"You're here again... it's interesting."', '"The water here has become much clearer recently. Are you taking care of the stream?"'],
      trusting: ['"{player}, the sound of rain today is very nice."', '"Sitting by the water with you, time seems to have returned to a thousand years ago."'],
      devoted: ['"You are the first mortal in thousands of years that I am willing to wait for."', '"{player}...I no longer want to return to the abyss."'],
      eternal: ['"The name of Canglan has only been told to you by one person."', '"Between heaven and earth, only you and me are the paradise."']
    },
    interactionType: 'meditation',
    bondable: true,
    courtshipItemId: 'dragon_scale_charm',
    bondItemId: 'dragon_pearl',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['long_ling_heart_1', 'long_ling_heart_2', 'long_ling_heart_3'],
    courtshipDialogues: [
      "You hand me the Dragon Scale Pendant...I understand." A faint emerald blush appeared on her cheeks. ',
      '"Although I don't understand the thoughts of mortals, I... don't hate them."',
      '{player}, can you sit a little longer today?"'
    ],
    courtshipCraftCost: [
      { itemId: 'dragon_jade', quantity: 5 },
      { itemId: 'moonstone', quantity: 8 },
      { itemId: 'gold_bar', quantity: 5 }
    ],
    bondCraftCost: [
      { itemId: 'dragon_jade', quantity: 8 },
      { itemId: 'prismatic_shard', quantity: 5 },
      { itemId: 'moonstone', quantity: 10 },
      { itemId: 'gold_bar', quantity: 8 }
    ],
    bondBonuses: [
      { type: 'weather_control', chance: 0.3 },
      { type: 'fish_attraction', chance: 0.5 }
    ],
    bondHorseBreed: 'divine',
    abilities: [
      {
        id: 'long_ling_1',
        affinityRequired: 800,
        name: 'Longze',
        description: 'The quality of waterfall fishing is improved by one level',
        passive: { type: 'quality_boost', value: 1 }
      },
      {
        id: 'long_ling_2',
        affinityRequired: 1500,
        name: 'Call Rain',
        description: 'Rain probability +15%',
        passive: { type: 'luck', value: 15 }
      },
      {
        id: 'long_ling_3',
        affinityRequired: 2200,
        name: 'Dragon Eye',
        description: 'Legendary fish catch rate +20%',
        passive: { type: 'luck', value: 20 }
      }
    ],
    manifestationDay: { season: 'spring', day: 14 }
  },

  // ============================================================
  // 2. Taoyao — Taolin Hualing
  // ============================================================
  {
    id: 'tao_yao',
    name: 'Taoyao',
    trueName: 'Zhuohua',
    gender: 'female',
    title: 'Taolinhualing',
    origin: 'Flower essence born from the oldest peach tree in Taoyuan Township, clothed with fallen petals and drank with morning dew. It is said that Taoyuan Township is called "Taoyuan" because she protects it here. ',
    personality: 'lively, smart and innocent',
    discoverySteps: [
      {
        id: 'tao_yao_rumor',
        phase: 'rumor',
        conditions: [{ type: 'skill', skillType: 'farming', minLevel: 4 }],
        scenes: [
          { text: 'When you are working on the farm in the early morning, a burst of unseasonable peach blossom petals floats in front of you. ' },
          { text: 'A tiny laugh seemed to come from the petals, as light as a wind chime. ' }
        ],
        logMessage: '[Xianyuan] There seems to be a whisper in the peach petals, is it the illusion of the wind...'
      },{
        id: 'tao_yao_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'timeRange', minHour: 6, maxHour: 8 },
          { type: 'location', panel: 'farm' }
        ],
        scenes: [
          {
            text: 'In the early morning of spring, the morning fog has not yet dispersed. You see a slender figure among the fruit trees, reaching out to touch the branches of the peach tree. '
          },
          {
            text: 'She seems to have noticed your gaze, and looked back - a face as delicate as petals, which instantly turned into flying flowers and disappeared. '
          }
        ],
        logMessage: '[Xianyuan] Beside the fruit tree in the morning mist, the phantom of fluttering petals flashed away. '
      },
      {
        id: 'tao_yao_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'peach', quantity: 1 },
          { type: 'item', itemId: 'honey', quantity: 1 },
          { type: 'day', day: 14 }
        ],
        scenes: [
          {
            text: 'On the night of the full moon, you brought peaches and honey to the largest peach tree. The moonlight shines on the branches, and the petals dance without wind. '
          },
          {
            text: 'A girl walked out of the tree trunk, with skin as white as petals and a peach blossom in her hair that would never fade. '
          },
          {
            text: '"Hehe, it's finally here!" She said with a smile, "I smell something sweet, is it for me?"',
            choices: [
              {
                text: 'Yes, this is a gift for you. ',
                friendshipChange: 80,
                response: 'She took the peaches and honey with a cheer: "That's great! I like sweet things the most!"'
              },
              {
                text: 'Are you... a peach tree spirit? ',
                friendshipChange: 40,
                response: '"Hua Ling! Taolin Hua Ling!" She puffed up her cheeks and corrected, "Just call her Tao Yao."'
              },
              {
                text: 'Have you been watching me farm? ',
                friendshipChange: 60,
                response: 'She looked away shyly: "I, I didn't look at it all the time...just occasionally. You are very serious about farming."'
              }
            ]
          },
          { text: 'The moonlight faded, and the peach blossoms turned into petals and drifted away: "Next time the moon is full, come and play with me!"' }
        ],
        logMessage: '[Xianyuan] Under the peach tree under the full moon, Hualing Taoyao appeared for the first time. '
      },
      {
        id: 'tao_yao_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_1_5' },
          { type: 'skill', skillType: 'farming', minLevel: 5 }
        ],
        scenes: [
          { text: 'When you walked into the farm, Taoyao was already sitting on the branch, swinging her legs, waiting for you. ' },
          {
            text: '"I've thought about it!" She jumped down from the tree, her skirt raising a petal, "My name is Zhuohua, and I am the guardian spirit of this peach forest."'
          },
          {
            text: '"Whenever you come in the future, I will be there!" Her smile was as bright as spring itself. '
          }
        ],
        logMessage: '[Xianyuan] Taolin Hua Ling Zhuohua is willing to associate with you. '
      }
    ],
    resonantOfferings: ['peach', 'osmanthus', 'honey'],
    pleasedOfferings: ['chrysanthemum', 'tea', 'green_tea_drink', 'osmanthus_wine', 'peach_wine'],
    repelledOfferings: ['charcoal', 'iron_ore', 'copper_ore'],
    dialogues: {
      wary: ['"Who are you...don't touch the peach tree!"', '"Humph, all humans can only chop down trees..."'],
      curious: ['"You come to water every day, you are so diligent!"', '"Hehe, you have a leaf on your head."'],
      trusting: ['"{player}, the sunshine is so comfortable today~"', '"The flowers bloom particularly well when I am with you."'],
      devoted: ['"{player}... You know, flower spirits are not supposed to be attracted to people."', '"But when I think of you, the flowers bloom by themselves."'],
      eternal: ['"The Zhuohua blooms only for you."', '"For thousands of years, as long as this peach forest exists, I will be by your side."']
    },
    interactionType: 'ritual',
    bondable: true,
    courtshipItemId: 'blossom_crown',
    bondItemId: 'eternal_blossom',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['tao_yao_heart_1', 'tao_yao_heart_2', 'tao_yao_heart_3'],courtshipDialogues: [
      'Taoyao took the flower crown and put it on her head with a blushing face: "Does this mean... seeking fate?"',
      '{player}, a butterfly landed on your shoulder today, it must be a good sign!"',
      '"I secretly cast a spell on your peach tree, and it will bear the sweetest fruit tomorrow."'
    ],
    courtshipCraftCost: [
      { itemId: 'peach', quantity: 25 },
      { itemId: 'honey', quantity: 15 },
      { itemId: 'osmanthus', quantity: 15 },
      { itemId: 'jade', quantity: 5 }
    ],
    bondCraftCost: [
      { itemId: 'peach', quantity: 50 },
      { itemId: 'honey', quantity: 25 },
      { itemId: 'chrysanthemum', quantity: 25 },
      { itemId: 'prismatic_shard', quantity: 3 },
      { itemId: 'moonstone', quantity: 8 }
    ],
    bondBonuses: [{ type: 'crop_blessing', chance: 0.2 }],
    abilities: [
      {
        id: 'tao_yao_1',
        affinityRequired: 600,
        name: '花泽',
        description: 'Fruit trees yield +1 each time',
        passive: { type: 'quality_boost', value: 1 }
      },
      {
        id: 'tao_yao_2',
        affinityRequired: 1200,
        name: 'Spring Breath',
        description: 'Spring crops grow 15% faster',
        passive: { type: 'exp_boost', value: 15 }
      },
      {
        id: 'tao_yao_3',
        affinityRequired: 2000,
        name: 'Lingtao',
        description: 'The peach tree has a probability of producing spiritual peaches',
        passive: { type: 'luck', value: 10 }
      }
    ],
    manifestationDay: { season: 'spring', day: 3 }
  },

  // ============================================================
  // 3. Moon Rabbit — Jade Rabbit that makes medicine
  // ============================================================
  {
    id: 'yue_tu',
    name: 'Moon Rabbit',
    trueName: 'Suwen',
    gender: 'female',
    title: 'Pounding Medicine Jade Rabbit',
    origin: 'The Jade Rabbit sneaked down from the Moon Palace and turned into a girl with rabbit ears, carrying a jade pestle with her. It is said that she had finished pounding the medicinal materials for the Moon Palace and came to the human world only after she was extremely bored. ',
    personality: 'curious, lively, greedy for herbs',
    discoverySteps: [
      {
        id: 'yue_tu_rumor',
        phase: 'rumor',
        conditions: [{ type: 'skill', skillType: 'foraging', minLevel: 7 }],
        scenes: [
          {
            text: 'Your gathering skills have reached perfection. Today while collecting herbs, I found a strange jade fragment, which looked like part of some kind of utensil. '
          },
          { text: 'The fragment glowed silvery white under the moonlight, with a rabbit pattern vaguely engraved on it. ' }
        ],
        logMessage: '[Xianyuan] I found a fragment of a jade pestle while collecting herbs, with rabbit patterns engraved on it, and it shone brightly under the moonlight...'
      },
      {
        id: 'yue_tu_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'day', day: 14 },
          { type: 'timeRange', minHour: 20, maxHour: 24 },
          { type: 'weather', weather: 'sunny' },
          { type: 'location', panel: 'forage' }
        ],
        scenes: [
          {
            text: 'On a full moon night, the moon shines like silver over the bamboo forest. You hear a rhythmic sound of "dong, dong, dong" coming from the distance. '
          },
          {
            text: 'Looking through the sound, a small white figure under the moonlight was doing something. The two long ears on top of her head bounced. '
          },
          {
            text: 'As if aware of your gaze, the figure disappeared deep into the bamboo forest, leaving only a few scattered herbs. '
          }
        ],
        logMessage: '[Xianyuan] In the bamboo forest under the full moon, white shadows flashed and herbs were scattered on the ground. '
      },
      {
        id: 'yue_tu_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ginseng', quantity: 1 },
          { type: 'item', itemId: 'herb', quantity: 5 },
          { type: 'location', panel: 'forage' }
        ],
        scenes: [
          {
            text: 'You came to the bamboo forest with ginseng and herbs. Just as I put down the herbs, a voice came from above -'
          },
          {text: '"Ginseng! It's ginseng!" A girl with rabbit ears jumped down from the bamboo, staring at the medicinal materials in your hand with bright eyes. '
          },
          {
            text: '"Give it, give it to me! I'm tired of the medicine from the Moon Palace, only the herbs from the human world smell good!" She stretched out her hand, her tail wagging excitedly. ',
            choices: [
              {
                text: 'All for you. ',
                friendshipChange: 80,
                response: '"Really! You are a good person!" She turned around holding the herbs, "My name is Yue Rabbit, and I will help you make the medicine from now on!"'
              },
              {
                text: 'Are you from the Moon Palace? ',
                friendshipChange: 40,
                response: '"Shh——!" She raised a finger in panic, "Don't tell Sister Chang'e! I ran out secretly!"'
              },
              {
                text: 'What are you going to do with these? ',
                friendshipChange: 60,
                response: '"Pound the medicine! Pounding the herbs into powder can cure many diseases." She shook the jade pestle in her hand and smiled proudly. '
              }
            ]
          },
          {
            text: 'The Moon Rabbit jumped up and disappeared into the moonlight holding the herbs, leaving a faint scent of herbs in the air. '
          }
        ],
        logMessage: '[Xianyuan] I met the Jade Rabbit who sneaked down from the Moon Palace in the bamboo forest. '
      },
      {
        id: 'yue_tu_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_2_4' },
          { type: 'skill', skillType: 'foraging', minLevel: 7 }
        ],
        scenes: [
          { text: 'You come to the bamboo forest again. Moon Rabbit is sitting on the stone, with a row of small medicine bottles in front of him. ' },
          {
            text: '"Ah! You're here!" She jumped up happily, her ears twitching, "My name is Su Wen, and I am the Jade Rabbit of the Moon Palace."'
          },
          {
            text: '"Sister Chang'e said that the world is not fun, that's not true! There are many good-smelling herbs here, and you!"'
          }
        ],
        logMessage: '[Xianyuan] Yuetu Suwen has decided to stay in Taoyuan Township. '
      }
    ],
    resonantOfferings: ['ginseng', 'herb', 'tea', 'green_tea_drink'],
    pleasedOfferings: ['wild_mushroom', 'truffle', 'chrysanthemum', 'osmanthus_wine'],
    repelledOfferings: ['quartz', 'charcoal', 'trash'],
    dialogues: {
      wary: ['"Don't, don't come close! I have a jade pestle!"', '"Are you here to capture me and take me back to the Moon Palace..."'],
      curious: ['"You smell like a lot of herbs!"', '"What is this flower? It smells so good!"'],
      trusting: ['"{player}, I made a new medicine today, do you want to try it?"', '"It's the most fun to collect medicine with you, you don't have to work alone."'],
      devoted: ['"{player}... Even if sister Chang'e comes to pick me up, I don't want to go back."', '"No matter how beautiful the Moon Palace is, it won't be without you."'],
      eternal: ['"Suwen will only make medicine for {player} in this life."', '"You are my world, brighter than the moon."']
    },
    interactionType: 'music',
    bondable: true,
    courtshipItemId: 'jade_mortar',
    bondItemId: 'moon_elixir',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['yue_tu_heart_1', 'yue_tu_heart_2', 'yue_tu_heart_3'],
    courtshipDialogues: [
      'Yuetu took the jade pestle, and his ears instantly turned red: "This, this is...well, I accept it."',
      '"{player}, I made new herbal balls, they taste so good, you must try them!"',
      '"When I look at the moon with you, I won't miss the Moon Palace."'
    ],
    courtshipCraftCost: [
      { itemId: 'moonstone', quantity: 8 },
      { itemId: 'jade', quantity: 5 },
      { itemId: 'ginseng', quantity: 5 },
      { itemId: 'herb', quantity: 50 }
    ],
    bondCraftCost: [
      { itemId: 'ginseng', quantity: 10 },
      { itemId: 'snow_lotus', quantity: 8 },
      { itemId: 'moonstone', quantity: 10 },
      { itemId: 'prismatic_shard', quantity: 3 }
    ],
    bondBonuses: [{ type: 'stamina_restore', amount: 15 }],
    abilities: [
      {
        id: 'yue_tu_1',
        affinityRequired: 500,
        name: 'Lingcai',
        description: 'Double the number of herbs collected',
        passive: { type: 'quality_boost', value: 2 }
      },
      {
        id: 'yue_tu_2',affinityRequired: 1000,
        name: 'Yaoyin',
        description: 'The effect of tea and medicine +50%',
        passive: { type: 'exp_boost', value: 50 }
      },
      {
        id: 'yue_tu_3',
        affinityRequired: 1800,
        name: 'Yuehua',
        description: 'Probability of collecting moon grass',
        passive: { type: 'luck', value: 8 }
      }
    ],
    manifestationDay: { season: 'autumn', day: 14 }
  },

  // ============================================================
  // 4. Fox Fairy — Nine-tailed Fox
  // ============================================================
  {
    id: 'hu_xian',
    name: 'Fox Fairy',
    trueName: 'Unnamed',
    gender: 'male',
    title: 'Nine-tailed Fox',
    origin: 'The vixen who has been practicing for thousands of years is both good and evil. He is good at illusions and transformations. He often takes on different appearances and wanders around the world. He likes to collect rare treasures. ',
    personality: 'cunning, funny, both good and evil',
    discoverySteps: [
      {
        id: 'hu_xian_rumor',
        phase: 'rumor',
        conditions: [{ type: 'money', minAmount: 100000 }],
        scenes: [
          { text: 'There was an unsigned letter in front of the door this morning, with only one sentence written on it——' },
          { text: '"At dusk, walk to a crowded place. Interesting things are waiting for you."' },
          { text: 'Turn the letter over, and on the back there is a fox that seems to be smiling but not smiling. ' }
        ],
        logMessage: '[Xianyuan] received a mysterious letter with a drawing of a fox...'
      },
      {
        id: 'hu_xian_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'timeRange', minHour: 17, maxHour: 19 },
          { type: 'location', panel: 'village' }
        ],
        scenes: [
          { text: 'At dusk, you take a walk in the village. The afterglow dyes everything golden. ' },
          {
            text: 'There was a strange young man in the crowd. His appearance was too handsome to be ordinary, and he had a meaningful smile on his lips. '
          },
          {
            text: 'You want to get closer to see clearly, but he has disappeared. Only a crystal red bead fell on the place where he stood. '
          }
        ],
        logMessage: '[Xianyuan] In the village at dusk, a strange and beautiful man disappeared in a flash. '
      },
      {
        id: 'hu_xian_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ruby', quantity: 1 },
          { type: 'item', itemId: 'jade', quantity: 1 }
        ],
        scenes: [
          { text: 'You bring the gems to the entrance of the village. That young man suddenly appears behind you——' },
          {
            text: '"Hey, you found me." He smiled and snapped his fingers, and nine fluffy tails appeared behind him. '
          },
          {
            text: '"Come, answer my three questions. If you answer them correctly, you will meet the real fox fairy." He raised three fingers. \n"The first question: What is more when divided more?"',
            choices: [
              {
                text: 'Happy. ',
                friendshipChange: 80,
                response: '"Not bad, good, spiritual." He nodded with satisfaction, and one of his tails lit up. '
              },
              {
                text: 'Gold? ',
                friendshipChange: 20,
                response: '"Vulgar." He shook his head and sighed, but still gave you a chance. '
              },
              {
                text: 'Trouble. ',
                friendshipChange: 40,
                response: '"Yeah... that's true. But I prefer optimistic answers."'
              }
            ]
          },
          {
            text: '"Interesting." He put away his tail and turned into an ordinary young man. "You are more interesting than I thought. See you later."'
          }
        ],
        logMessage: 'After the [Xianyuan] riddle challenge, the fox fairy finally revealed his true appearance. '
      },
      {
        id: 'hu_xian_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'mineFloor', minFloor: 50 },
          { type: 'item', itemId: 'fox_bead', quantity: 1 }
        ],
        scenes: [
          {
            text: 'You return to the village with the fox beads you found deep in the mine. The young man was already leaning against the tree and waiting. '
          },{ text: '"You found my fox bead." He reached out and took it, the bead shining red in his palm. ' },
          {
            text: '"It seems that fate is destined. I am from the spirit fox clan, you can call me...Fox Fairy. Real name? I will tell you after I know more about it."'
          }
        ],
        logMessage: '[Xianyuan] After returning the fox bead, the fox fairy is willing to associate with you. '
      }
    ],
    resonantOfferings: ['prismatic_shard', 'ruby', 'jade'],
    pleasedOfferings: ['obsidian', 'gold_ore', 'peach_wine', 'jujube_wine'],
    repelledOfferings: ['quartz', 'wood', 'bamboo'],
    dialogues: {
      wary: ['"Don't think that just any mortal can see the Fox Fairy."', '"You're lucky, but that's all."'],
      curious: ['"What interesting thing did you do today? Tell me."', '"The most boring thing in the world is the same thing, don't let me down."'],
      trusting: ['"{player}, you are an interesting human being."', '"Do you want to see me do a trick?" A small cluster of fox fire flashed from his fingertips. '],
      devoted: ['"For thousands of years, I have never stopped for one person. You are the first."', '{player}...You remind me of myself when I was a little fox, pure and sincere."'],
      eternal: ['"My true name was only spoken in your ears."', '"Under the Nine Tails, I will only protect you."']
    },
    interactionType: 'dreamwalk',
    bondable: true,
    courtshipItemId: 'fox_flame_lantern',
    bondItemId: 'fox_spirit_bead',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['hu_xian_heart_1', 'hu_xian_heart_2', 'hu_xian_heart_3'],
    courtshipDialogues: [
      'The fox fairy took the fox fire lantern, a flash of surprise flashed in her eyes and then she smiled: "Are you... seeking fate from a fox?"',
      '"{player}, I had a dream about you tonight. What was it? Secret."',
      '"I used to think that human beings were pitifully short. Now I feel that...it is precisely because of their shortness that they are particularly precious."'
    ],
    courtshipCraftCost: [
      { itemId: 'ruby', quantity: 8 },
      { itemId: 'gold_bar', quantity: 8 },
      { itemId: 'moonstone', quantity: 5 }
    ],
    bondCraftCost: [
      { itemId: 'ruby', quantity: 12 },
      { itemId: 'gold_bar', quantity: 12 },
      { itemId: 'moonstone', quantity: 8 },
      { itemId: 'prismatic_shard', quantity: 3 }
    ],
    bondBonuses: [{ type: 'sell_bonus', percent: 15 }],
    abilities: [
      {
        id: 'hu_xian_1',
        affinityRequired: 700,
        name: 'Fox Eyes',
        description: 'Store price reduced by 5%',
        passive: { type: 'sell_bonus', value: 5 }
      },
      {
        id: 'hu_xian_2',
        affinityRequired: 1400,
        name: 'Spirit Detective',
        description: 'Increase the probability of additional drops in the mine',
        passive: { type: 'luck', value: 15 }
      },
      {
        id: 'hu_xian_3',
        affinityRequired: 2100,
        name: 'phantom quotient',
        description: 'The Traveling Merchant has 1 more rare item',
        passive: { type: 'luck', value: 10 }
      }
    ],
    manifestationDay: { season: 'autumn', day: 7 }
  },

  // ============================================================
  // 5. Shan Weng - Herb-gathering fairy
  // ============================================================
  {
    id: 'shan_weng',
    name: 'shanweng',
    trueName: 'Qingxu',
    gender: 'male',
    title: 'Herb-collecting Immortal',
    origin: 'The old immortal who followed the hermits who built the village in Taoyuan Township to practice here has been hiding in the mountains all year round to collect medicine, holding elixirs in gourds and accompanied by pines and waves. ',
    personality: 'detached and indifferent, unsmiling',
    discoverySteps: [
      {
        id: 'shan_weng_rumor',
        phase: 'rumor',
        conditions: [
          { type: 'mineFloor', minFloor: 50 },
          { type: 'skill', skillType: 'mining', minLevel: 8 }
        ],
        scenes: [
          {
            text: 'Deep in the mine, you found a yellowed ancient book with "Qingxu Cultivation Manual" written on the cover. '
          },
          {
            text: 'Turn over the first page: "After five hundred years in the mountain, the elixir becomes nine times. Under the Taoyuan, where the spiritual energy of the earth's veins is most abundant, I will stay here."'
          }
        ],
        logMessage: '[Xianyuan] An ancient practice manual was found deep in the mine...'},
      {
        id: 'shan_weng_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'winter' },
          { type: 'weather', weather: 'sunny' },
          { type: 'location', panel: 'mining' }
        ],
        scenes: [
          { text: 'Deep in the mine in winter, you hear a distant sound of flute, desolate and simple. ' },
          {
            text: 'Following the sound of the flute, you vaguely see a white-haired old man sitting cross-legged next to the mineral vein, surrounded by a light golden aura. '
          },
          {
            text: 'You take a step forward, and the gravel beneath your feet makes a sound. When the old man opened his eyes, you felt a surge of awe-inspiring energy coming towards your face, and in a blink of an eye, he had disappeared. '
          }
        ],
        logMessage: '[Xianyuan] Deep in the mine, a white-haired old man was practicing, and he disappeared in a flash. '
      },
      {
        id: 'shan_weng_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ginseng', quantity: 1 },
          { type: 'item', itemId: 'snow_lotus', quantity: 1 }
        ],
        scenes: [
          {
            text: 'You entered the mine with ginseng and snow lotus, and the spiritual energy was obviously stronger than usual. The old man was sitting in front of the cave wall, with a bronze alchemy furnace in front of him. '
          },
          { text: '"Coming." His voice was low and calm, as if he had anticipated your visit. ' },
          {
            text: '"Young man, why did you go deep into the mine?" He opened one eye, and light flashed in his cloudy pupils. ',
            choices: [
              {
                text: 'To become stronger. ',
                friendshipChange: 60,
                response: '"It's okay. Be ambitious, but don't be too obsessed." He nodded. '
              },
              {
                text: 'To explore the unknown. ',
                friendshipChange: 80,
                response: 'Okay. The desire for knowledge is the foundation of spiritual practice.' He gave a rare look of approval. '
              },
              {
                text: 'To make money. ',
                friendshipChange: 20,
                response: '"..." He was silent for a long time and shook his head, "Ordinary people. But honesty is rare."'
              }
            ]
          },
          {
            text: '"Go. When you are really ready, come back here." He closed his eyes, and the spiritual energy around him surged again. '
          }
        ],
        logMessage: '[Xianyuan] I met an old immortal cultivator deep in the mine. '
      },
      {
        id: 'shan_weng_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_3_5' },
          { type: 'skill', skillType: 'mining', minLevel: 8 }
        ],
        scenes: [
          { text: 'You come to the depths of the mine again, and the old immortal is making tea. A pot of tea and two cups. ' },
          { text: '"Sit." He pointed to the stone opposite. This is the first time he invites you. ' },
          {
            text: 'My name is Qingxu, and I have been practicing here for more than five hundred years. Since we are destined, it doesn't hurt to come and sit here occasionally.' He picked up the tea cup and raised the corners of his mouth slightly. '
          }
        ],
        logMessage: '[Xianyuan] Xianweng Qingxu invites you to drink tea together, and fate begins here. '
      }
    ],
    resonantOfferings: ['ginseng', 'snow_lotus', 'antler_velvet'],
    pleasedOfferings: ['herb', 'iron_ore', 'gold_ore', 'copper_ore', 'tea'],
    repelledOfferings: ['trash', 'wood', 'driftwood'],
    dialogues: {
      wary: ['"Practitioners don't like to be disturbed."', '"The murderous aura in you is too strong, please calm down before coming back."'],
      curious: ['"Well, the aura in the mine is a little different today."', '"Your physique... is better than that of ordinary mortals."'],
      trusting: ['"{player}, come and play a game of chess with me."', '"The most important thing in practice is to avoid impatience. You are calmer today than yesterday."'],
      devoted: ['"For the first time in five hundred years, I feel that someone is worthy of passing on the mantle."', '{player}, you are no longer just a mortal."'],
      eternal: ['"My way is your way."', '"Qingxu will not accept any disciples in his life, but you... are the exception among exceptions."']
    },
    interactionType: 'cultivation',
    bondable: true,
    courtshipItemId: 'cultivation_jade',
    bondItemId: 'immortal_gourd',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['shan_weng_heart_1', 'shan_weng_heart_2', 'shan_weng_heart_3'],courtshipDialogues: [
      'The immortal man took over the cultivation jade pendant and was silent for a long time: "...I accept this intention."',
      '{player}, you did a good job in today's homework. Come, have a cup of hot tea."',
      '"You know, I was young five hundred years ago. At that time... forget it, let's not talk about it."'
    ],
    courtshipCraftCost: [
      { itemId: 'jade', quantity: 8 },
      { itemId: 'gold_bar', quantity: 8 },
      { itemId: 'ginseng', quantity: 5 }
    ],
    bondCraftCost: [
      { itemId: 'ginseng', quantity: 10 },
      { itemId: 'antler_velvet', quantity: 8 },
      { itemId: 'iridium_bar', quantity: 5 },
      { itemId: 'moonstone', quantity: 8 }
    ],
    bondBonuses: [{ type: 'spirit_shield', staminaSave: 20, hpBonus: 30 }],
    abilities: [
      {
        id: 'shan_weng_1',
        affinityRequired: 600,
        name: 'Gathering Qi',
        description: 'Mining physical consumption -15%',
        passive: { type: 'stamina_save', value: 15 }
      },
      {
        id: 'shan_weng_2',
        affinityRequired: 1200,
        name: 'spiritual vein',
        description: 'Probability of finding rare herbs in the mines',
        passive: { type: 'luck', value: 12 }
      },
      {
        id: 'shan_weng_3',
        affinityRequired: 2000,
        name: 'Golden elixir',
        description: 'Maximum physical strength permanent +20',
        passive: { type: 'max_stamina', value: 20 }
      }
    ],
    manifestationDay: { season: 'winter', day: 1 }
  },

  // ============================================================
  // 6. Gui Nu — Dream Weaving Gui Nu
  // ============================================================
  {
    id: 'gui_nv',
    name: 'guinu',
    trueName: 'Jingui',
    gender: 'female',
    title: 'Dream Weaver Returns to the Girl',
    origin: 'The obsession of a homesick weaver girl. The cloth she weaved during her lifetime was unparalleled in the world, and her soul remained with her after her death, continuing to weave with silk threads and moonlight, just to weave a way home. ',
    personality: 'gentle, melancholy, restrained and affectionate',
    discoverySteps: [
      {
        id: 'gui_nv_rumor',
        phase: 'rumor',
        conditions: [{ type: 'npcFriendship', npcId: 'su_su', minFriendship: 2000 }],
        scenes: [
          {
            text: 'Susu seemed a little uneasy today: "{player}, have you ever...heard the sound of the loom at night?"'
          },
          {
            text: '"From the old house next to my house, every night when the moonlight is bright, there will be a creaking sound... It seems like someone is weaving."'
          },
          {
            text: '"I went to see it, but there was nothing inside. But the sound... is real." There was uneasiness in Susu's eyes. '
          }
        ],
        logMessage: '[Xianyuan] Susu said that she could hear the sound of looms at night, but there was no one in the old house...'
      },
      {
        id: 'gui_nv_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'timeRange', minHour: 22, maxHour: 24 },
          { type: 'item', itemId: 'silk', quantity: 1 },
          { type: 'location', panel: 'village' }
        ],
        scenes: [
          {
            text: 'The village is completely silent late at night. When you passed by the old house, you heard that sound - squeak, squeak. '
          },
          {
            text: 'Through the window lattice, an ancient loom is running by itself in the moonlight, with silver-white silk threads flying in the air. '
          },
          {
            text: 'You see a vague figure of a woman sitting in front of the loom, her tears turning into silver threads and blending into the cloth. '
          },
          {
            text: 'The silk in your hands glows slightly, echoing the threads on the loom. The figure looked back, but then disappeared like smoke. '
          }
        ],
        logMessage: '[Xianyuan] In the old house late at night, the shadow of a weaver girl is weaving under the moonlight...'
      },
      {
        id: 'gui_nv_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'season', season: 'winter' },
          { type: 'item', itemId: 'silk', quantity: 3 },
          { type: 'item', itemId: 'moonstone', quantity: 1 }],
        scenes: [
          {
            text: 'On a winter night, you walked into the old house with silk and moonstone. The loom is empty, but you place silk and moonstone on it. '
          },
          {
            text: 'Silver-white light pours out from the moonstone, and the silk thread wraps itself around the weaving shaft. The loom started to run, and a figure condensed and took shape from the light. '
          },
          {
            text: 'A woman with a delicate face sat in front of the loom, tears still lingering on her face. She looked at you and said softly: "You... can you see me?"',
            choices: [
              {
                text: 'I can see you. are you crying? ',
                friendshipChange: 80,
                response: 'She was startled for a moment and wiped the tears from her eyes: "No one...has spoken to me for a long time."'
              },
              {
                text: 'Who are you? Why weave here? ',
                friendshipChange: 60,
                response: '"I'm weaving a way home." She said softly, "But... I have forgotten where home is."'
              },
              {
                text: 'Susu is very worried about you. ',
                friendshipChange: 40,
                response: '"That tailor girl?" She smiled slightly, "Her skills are very good, just like mine back then."'
              }
            ]
          },
          {
            text: 'Before dawn, her figure faded again: "If you are willing... come and knit with me for a while tomorrow."'
          }
        ],
        logMessage: '[Xianyuan] In front of the loom in the old house, the dream-weaver girl is finally willing to speak. '
      },
      {
        id: 'gui_nv_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'npcFriendship', npcId: 'su_su', minFriendship: 3500 },
          { type: 'questComplete', questId: 'main_2_4' }
        ],
        scenes: [
          {
            text: 'You came to the old house to accompany Weaver Girl for many days in a row. Tonight, her figure is clearer than ever. '
          },
          {
            text: '"Your company reminds me of many things." She put down the shuttle and left the loom for the first time and walked to you. '
          },
          {
            text: '"My name is Jin Gui. The word "Gui" means return to my hometown." She smiled softly, "Maybe... this is my home."'
          }
        ],
        logMessage: '[Xianyuan] The dream-weaver girl Jin Gui is no longer obsessed with the way home and chooses to stay in Taoyuan. '
      }
    ],
    resonantOfferings: ['silk', 'wool', 'moonstone'],
    pleasedOfferings: ['alpaca_wool', 'rabbit_foot', 'cloth'],
    repelledOfferings: ['quartz', 'charcoal', 'copper_ore'],
    dialogues: {
      wary: ['"..." She lowered her head and weaved, unwilling to say more. ', '"Aren't you... afraid of me?"'],
      curious: ['"The moonlight is very good today." Her weaving speed slowed down. ', '"You're here...sit down."'],
      trusting: ['"{player}, look, this is my new knitting pattern. Do you think it looks good?"', '"When I was talking to you, I almost forgot that I was not a living person."'],
      devoted: ['"{player}...If I could, I would like to knit you a piece of clothing that will never wear out."', '"You make me feel that even obsession can be turned into something beautiful."'],
      eternal: ['"The silk threads of Jingui are woven only for you."', '"There is no need to go home. Home is wherever you are."']
    },
    interactionType: 'dreamwalk',
    bondable: true,
    courtshipItemId: 'silver_thread_ring',
    bondItemId: 'starlight_loom',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['gui_nv_heart_1', 'gui_nv_heart_2', 'gui_nv_heart_3'],
    courtshipDialogues: [
      Gui Nu took the silver ring, her fingers trembling slightly: "Is this... for me? A living person is willing to be with me..." She didn't finish her sentence, her eyes were red. ',
      '"{player}, I weaved a starry sky in your dream today. Do you see it?"',
      '"Sometimes I wonder if it's because I met you that I didn't disappear."'
    ],
    courtshipCraftCost: [
      { itemId: 'silk', quantity: 25 },
      { itemId: 'moonstone', quantity: 8 },
      { itemId: 'gold_bar', quantity: 5 }
    ],
    bondCraftCost: [
      { itemId: 'silk', quantity: 50 },
      { itemId: 'moonstone', quantity: 12 },
      { itemId: 'prismatic_shard', quantity: 5 },
      { itemId: 'gold_bar', quantity: 8 }
    ],
    bondBonuses: [{ type: 'animal_blessing', chance: 0.25 }],
    abilities: [
      {
        id: 'gui_nv_1',
        affinityRequired: 500,name: 'Weaving speed',
        description: 'Cloth processing time-30%',
        passive: { type: 'exp_boost', value: 30 }
      },
      {
        id: 'gui_nv_2',
        affinityRequired: 1100,
        name: 'Mengsi',
        description: 'Probability of loom producing dream silk',
        passive: { type: 'luck', value: 8 }
      },
      {
        id: 'gui_nv_3',
        affinityRequired: 1900,
        name: 'Lingfu',
        description: 'Animal favor gain +25%',
        passive: { type: 'exp_boost', value: 25 }
      }
    ],
    manifestationDay: { season: 'winter', day: 21 }
  }
]

/** Get hidden NPC definition based on ID */
export const getHiddenNpcById = (id: string): HiddenNpcDef | undefined => HIDDEN_NPCS.find(n => n.id === id)