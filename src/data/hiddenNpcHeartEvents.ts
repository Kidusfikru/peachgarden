import type { HeartEventDef } from '@/types'

/** Hide NPC heart events (using HeartEventDef format, requiredFriendship corresponds to the fate threshold) */
export const HIDDEN_NPC_HEART_EVENTS: HeartEventDef[] = [
  // ============================================================
  // Dragon Spirit — 3 heart events
  // ============================================================
  {
    id: 'long_ling_heart_1',
    npcId: 'long_ling',
    requiredFriendship: 800,
    title: 'Whispers under the scaly light',
    scenes: [
      {
        text: 'You come to the waterfall to meditate, and a emerald scale light is looming in the water mist. Long Ling's voice sounded in the sound of water:'
      },
      { text: '"You are the first mortal who can hear my voice... No one has approached this pool of water for a hundred years."' },
      {
        text: 'Long Ling's eyes fell on you, seeming to be examining something. ',
        choices: [
          {
            text: '"Why did you choose to live here?"',
            friendshipChange: 30,
            response: '"The intersection of spiritual veins here is where the luck of Taoyuan Township lies. What I protect... is not just this pool of water."'
          },
          {
            text: '"You must be lonely."',
            friendshipChange: 50,
            response: 'Long Ling was silent for a long time, and finally said softly: "...Loneliness exists." The water surface rippled slightly. '
          }
        ]
      }
    ]
  },
  {
    id: 'long_ling_heart_2',
    npcId: 'long_ling',
    requiredFriendship: 1600,
    title: 'Dragon Ball Memories',
    scenes: [
      {
        text: 'The moonlight is particularly bright tonight, and a complete moon is reflected in the water of the waterfall. The dragon spirit's figure appeared completely in the moonlight - an emerald green spirit dragon, elegant and majestic. '
      },
      { text: '"Do you know my real name?" Long Ling asked, with a hint of expectation in his voice. ' },
      { text: '"Thousands of years ago, when I transformed, I had a name... Canglan. It means a slight wave in the sea."' },
      {
        text: 'The dragon spirit held up a slightly luminous bead from the water. "This is an old thing I once hid under my back."',
        choices: [
          {
            text: '"I will cherish it."',
            friendshipChange: 50,
            response: 'Long Ling nodded, and the water surface glowed with gentle light: "You are the only person who makes me willing to take it out."'
          },
          {
            text: 'Take the bead carefully. ',
            friendshipChange: 30,
            response: 'The beads are warm and cool in the hand, and there is a weak pulse inside, like a heartbeat. '
          }
        ]
      }
    ]
  },
  {
    id: 'long_ling_heart_3',
    npcId: 'long_ling',
    requiredFriendship: 2400,
    title: 'The Promise of Canglan',
    scenes: [
      {
        text: 'On a stormy night, the water volume of the waterfall surged. You came in the rain and found that the dragon spirit was using its spiritual power to stabilize the water that was about to burst. '
      },
      {
        text: '"Go away!" Long Ling shouted, but his voice was full of exhaustion, "The spiritual veins are disordered tonight... I can't last long."'
      },
      {
        text: 'You see the dragon spirit's scales begin to dim, and her power is being depleted. ',
        choices: [
          {
            text: 'Rush into the water and hand the spiritual power offering to the dragon spirit. ',
            friendshipChange: 80,
            response: 'Your actions shocked Long Ling. She accepted the offering and her spiritual power slowly recovered. After the storm subsided, she whispered: "...Thank you."'
          },
          {
            text: 'Pray for her on the shore and concentrate on sending your thoughts. ',
            friendshipChange: 60,
            response: 'A warm power surges from your heart, and the dragon spirit senses it. "Your kindness...I received it." The rainstorm gradually stopped. '
          }
        ]
      },
      {
        text: 'After the storm, the dragon spirit appears in front of you in human form for the first time - a woman dressed in green clothes. "From now on, just call me Canglan."'
      }
    ]
  },

  // ============================================================
  // Taoyao — 3 heart events
  // ============================================================
  {
    id: 'tao_yao_heart_1',
    npcId: 'tao_yao',
    requiredFriendship: 800,
    title: '花语',
    scenes: [
      {
        text: 'In the early morning, you find a circle of unknown flowers under the peach tree on the farm. There is still dew on the petals, exuding a faint sweet fragrance. '
      },
      {
        text: 'Taoyao poked her head out from the flowers: "I planted these, do they look good?" Her smile was like spring itself. '
      },
      {
        text: 'She picked a small flower and handed it to you. ',
        choices: [
          {
            text: '"It's beautiful, thank you."',
            friendshipChange: 40,
            response: 'Taoyao smiled even brighter: "As long as you like it. I will plant one every day from now on."'},
          {
            text: 'Put the flower in her ear. ',
            friendshipChange: 60,
            response: 'Taoyao was stunned for a moment, her cheeks flushed like a peach blossom: "You... what are you doing..." But she did not take off the flower. '
          }
        ]
      }
    ]
  },
  {
    id: 'tao_yao_heart_2',
    npcId: 'tao_yao',
    requiredFriendship: 1600,
    title: 'The falling flowers are intentional',
    scenes: [
      {
        text: 'You find Tao Yao sitting alone under the oldest peach tree, petals falling like rain, her figure looming in the rain of flowers. '
      },
      {
        text: '"This tree... is the place where I was born." Her voice was very soft, "It has been three hundred years. Every spring, I will come back here."'
      },
      {
        text: 'You noticed that she was holding a dead leaf in her hand - the only yellow leaf on the peach tree. ',
        choices: [
          {
            text: '"Is the tree sick?"',
            friendshipChange: 30,
            response: '"It's not...it's that my foundation is weakening." She looked at you, "But since you came, this land has become alive again."'
          },
          {
            text: 'Sit next to her silently. ',
            friendshipChange: 50,
            response: 'Taoyao came over and leaned her head gently on your shoulder. The petals fall on your heads like a silent blessing. '
          }
        ]
      }
    ]
  },
  {
    id: 'tao_yao_heart_3',
    npcId: 'tao_yao',
    requiredFriendship: 2400,
    title: 'Heart of Spirit',
    scenes: [
      {
        text: 'On the last day of late spring, you found Tao Yao standing in front of the old peach tree, her hands clasped together, and her whole body exuding a soft light. '
      },
      {
        text: '"I'm doing something very important," she said, her voice trembling. "Pour the last of my spiritual power into this tree... so that it can live another three hundred years."'
      },
      { text: '"But the price is...I may sleep for a long time."' },
      {
        text: 'You feel your heart tighten. ',
        choices: [
          {
            text: 'Hold her hand: "Let me help you share the load."',
            friendshipChange: 80,
            response: 'Your body temperature is transmitted to her through your fingertips. Tao Yao opened her eyes wide - her spiritual power increased instead of decreasing. "It turns out...human thoughts can also become spiritual power."'
          },
          {
            text: '"I will take care of this tree every day."',
            friendshipChange: 60,
            response: 'Taoyao smiled and nodded: "With you here, I feel relieved." She picked a golden peach from the tree and handed it to you, "This is a spiritual peach, it is my heart."'
          }
        ]
      },
      {
        text: 'The old peach tree has regained its vitality, and its branches are covered with flower buds. Tao Yao looked at all this with a satisfied smile on her face: "Thank you for making me no longer lonely."'
      }
    ]
  },

  // ============================================================
  // Moon Rabbit — 3 heart events
  // ============================================================
  {
    id: 'yue_tu_heart_1',
    npcId: 'yue_tu',
    requiredFriendship: 800,
    title: 'The beat of medicine pestle',
    scenes: [
      {
        text: 'There was a tinkling sound coming from the bamboo forest under the moonlight. Following the sound, you find that Moon Rabbit is pounding something with a jade pestle. '
      },
      {
        text: '"Shhh - don't make any noise!" She pricked up her ears (there were really bunny ears under the hat), "I'm making a special medicine."'
      },
      {
        text: 'She hurriedly threw various herbs into the mortar, the rhythm getting faster and faster. ',
        choices: [
          {
            text: 'Help her hold the medicine mortar steady. ',
            friendshipChange: 40,
            response: '"Eh? Your hands are so steady!" Moon Rabbit smiled gratefully, "With your help, this medicine will definitely work."'
          },
          {
            text: 'Click to the beat. ',
            friendshipChange: 50,
            response: 'Yuetu was stunned for a moment, then giggled: "It's so funny when you follow along!" The sound of the medicine pestle turned into a pleasant melody. '
          }
        ]
      }
    ]
  },
  {
    id: 'yue_tu_heart_2',
    npcId: 'yue_tu',
    requiredFriendship: 1600,
    title: 'Secrets of the Moon Palace',
    scenes: [
      {
        text: 'You find Moon Rabbit squatting by the river, staring at the moon in the water in a daze. Her bunny ears drooped and she looked depressed. '
      },
      {
        text: '"Actually... I ran down here secretly." She whispered, "It's so boring in the Moon Palace. Every day I just make medicine, make medicine, make medicine..."'
      },
      {
        text: 'She looked up at the moon in the sky: "But sometimes... I also miss it there."',
        choices: [
          {
            text: '"Isn't it nice here?"',
            friendshipChange: 30,
            response: '"It's very nice here! There are flowers, grass and delicious food!" Her ears stood up, "And...you." She quickly lowered her head, the tips of her ears turned red. '
          },
          {text: '"You can go back and take a look at any time."',
            friendshipChange: 50,
            response: '"Well...but it won't be easy to come down again after you go back." She looked at you, "So I choose to stay here."'
          }
        ]
      }
    ]
  },
  {
    id: 'yue_tu_heart_3',
    npcId: 'yue_tu',
    requiredFriendship: 2400,
    title: 'The Moon Rabbit Who Doesn't Return',
    scenes: [
      {
        text: 'On the Mid-Autumn Festival night, a golden light fell from the sky on the hills outside the village. Tsukito grabbed your sleeve nervously: "They're coming for me..."'
      },
      { text: 'A solemn voice came from the sky: "Jade Rabbit, the Moon Palace needs you to return to your position."' },
      {
        text: 'Yuetu is trembling all over, but the look in her eyes when she looks at you is full of reluctance. ',
        choices: [
          {
            text: '"She has found her home."',
            friendshipChange: 80,
            response: 'Your voice is firm and clear. The sky was silent for a moment, and finally the golden light slowly dissipated. Moon Rabbit hugs you tightly: "Thank you..."'
          },
          {
            text: 'Hold her hand and say nothing. ',
            friendshipChange: 60,
            response: 'Yuetu felt the warmth of your palm, took a deep breath, and shouted to the sky: "I won't go back!" The golden light gradually dissipated. '
          }
        ]
      },
      {
        text: 'The moonlight returned to calm. Moon Rabbit wiped the corners of his eyes: "From now on, this is my moon palace."'
      }
    ]
  },

  // ============================================================
  // Fox Fairy — 3 Heart Events
  // ============================================================
  {
    id: 'hu_xian_heart_1',
    npcId: 'hu_xian',
    requiredFriendship: 800,
    title: 'Foxfire Puzzle',
    scenes: [
      {
        text: 'At dusk, several erratic blue flames appeared at the entrance of the village. The villagers avoided each other, but you were the only one who approached curiously. '
      },
      {
        text: '"Hey, you are quite courageous." The fox fairy walked out from behind the flames, playing with a glass bead in his hand. "How about we play a game?"'
      },
      {
        text: 'He held out three hands - wait, three? You rubbed your eyes, you really only had two hands. There are beads in one hand, and the other is empty. "Guess where the beads are?"',
        choices: [
          {
            text: 'Pointing to his left hand. ',
            friendshipChange: 20,
            response: 'He opened his left hand - empty. Spread out your right hand - it's also empty. The beads appear in your pocket at some point. "Let's play again next time."'
          },
          {
            text: '"The beads are in your sleeves."',
            friendshipChange: 50,
            response: 'Fox Fairy was startled, and then laughed: "Interesting! You are the first person to guess outside the rules." He shook his sleeves, and the beads really fell out. '
          }
        ]
      }
    ]
  },
  {
    id: 'hu_xian_heart_2',
    npcId: 'hu_xian',
    requiredFriendship: 1600,
    title: 'Thousand-Year Covenant',
    scenes: [
      {
        text: 'You found an ancient bronze mirror deep in the mine. When you wipe the dust away, what's reflected in the mirror isn't your face - it's a nine-tailed golden fox. '
      },
      {
        text: '"See? That's me a thousand years ago." The fox fairy's voice came from behind. He didn't smile today, "I didn't know how to speak human language at that time."'
      },
      {
        text: '"Thousands of years of practice, taking human form, learning people's language, and appreciating people's feelings." He looked in the mirror, "But the more human he is, the lonelier he becomes."'
      },
      {
        text: 'You've never seen him look so serious. ',
        choices: [
          {
            text: '"Loneliness is not a bad thing."',
            friendshipChange: 30,
            response: 'Oh?' He raised his eyebrows, 'Tell me about it.' You told him about your loneliness when you first came to Taoyuan Township. After hearing this, he laughed softly: "It seems that we are the same kind."'
          },
          {
            text: '"You are not alone now."',
            friendshipChange: 50,
            response: 'Fox Fairy was silent for a long time, and finally showed a different and sincere smile: "Well, not now."'
          }
        ]
      }
    ]
  },
  {
    id: 'hu_xian_heart_3',
    npcId: 'hu_xian',
    requiredFriendship: 2400,
    title: 'Illusion and Reality',
    scenes: [
      {
        text: 'One night, you dreamed of a golden wilderness. The fox fairy stood in the distance, with nine tails fully unfolded behind him, shining with golden light. '
      },
      { text: '"This is not a dream." He said, "This is my reality, my world."' },
      {
        text: 'He walked towards you: "For a thousand years, I have used illusions to deceive countless people. But in front of you... I don't want to use illusions anymore."'
      },
      {
        text: 'He stretched out his hand. You noticed his hands were shaking slightly. ',
        choices: [
          {
            text: 'Hold his hand. ',
            friendshipChange: 80,response: 'The illusion is shattered and you return to reality. But the Fox Fairy's hand is still in yours - warm and true. "This is the first time that I show my true face in front of mortals."'
          },
          {
            text: '"Whether you are a fox or a human, you are you."',
            friendshipChange: 60,
            response: 'His nine tails slowly closed, the golden light dissipated, and he returned to the cynical boy. But there was a softness in his eyes that he had never seen before. '
          }
        ]
      }
    ]
  },

  // ============================================================
  // Shan Weng — 3 heart events
  // ============================================================
  {
    id: 'shan_weng_heart_1',
    npcId: 'shan_weng',
    requiredFriendship: 800,
    title: 'A game of chess in the mountains',
    scenes: [
      {
        text: 'You have discovered a secret stone chamber deep in the mine. The mountain man sat cross-legged in front of the stone table with a game of chess in front of him. '
      },
      {
        text: '"Here you come? Sit down." He motioned to the stone bench opposite. The chess pieces on the chessboard exude a faint spiritual light. '
      },
      {
        text: '"I have been playing this game for three hundred years." He said, looking at the chessboard. ',
        choices: [
          {
            text: '"With whom?"',
            friendshipChange: 30,
            response: '"With myself." He stroked his beard, "Practice and practice, in the final analysis, is just playing chess with yourself."'
          },
          {
            text: 'Try to make a move. ',
            friendshipChange: 50,
            response: 'The old man looked at the position of your move, and a trace of surprise flashed in his eyes: "Excellent hand. This is the first time in three hundred years that someone has made a move here."'
          }
        ]
      }
    ]
  },
  {
    id: 'shan_weng_heart_2',
    npcId: 'shan_weng',
    requiredFriendship: 1600,
    title: 'The relationship between master and apprentice',
    scenes: [
      {
        text: 'The mountain man will take you to the top of the mountain. In the winter morning, the sea of ​​clouds rolled under your feet, and the sunrise dyed the sky golden red. '
      },
      {
        text: '"I have been practicing cultivation for thousands of years and have seen countless scenery." He took a deep breath, "But this sunrise... feels new every time I see it."'
      },
      {
        text: 'He turned to you: "Little friend, I have a heartfelt request."',
        choices: [
          {
            text: '"Senior, please speak."',
            friendshipChange: 30,
            response: '"Are you willing to be my close disciple? You don't want to learn magic, just how to maintain your health." His eyes were sincere, "I don't want to lose what I have learned."'
          },
          {
            text: 'Salute respectfully. ',
            friendshipChange: 50,
            response: 'The old man smiled happily: "Your character is better than many people who have been practicing for hundreds of years. I recognize you as my disciple."'
          }
        ]
      }
    ]
  },
  {
    id: 'shan_weng_heart_3',
    npcId: 'shan_weng',
    requiredFriendship: 2400,
    title: 'Preach',
    scenes: [
      {
        text: 'On the winter solstice, Shan Weng asks you to meditate in the snow. The wind was biting, but he said: "A calm heart will naturally warm you."'
      },
      {
        text: 'You don't know how long it has been. When you open your eyes, you find that the snow around you has melted - it's the heat radiating from your body. '
      },
      {
        text: '"It's done." The mountain man clapped his hands and laughed, "You have a mortal body, but you can attract the spiritual energy of heaven and earth. You are the most talented person I have ever seen."'
      },
      {
        text: 'He took out a simple gourd from his arms: "This is my personal treasure."',
        choices: [
          {
            text: '"Disciple dare not bear it."',
            friendshipChange: 60,
            response: '"Just take it if you want it!" He stuffed it into your hand, "I don't need it anymore. Having you here is better than any treasure." Tears flashed in his eyes. '
          },
          {
            text: 'Take it solemnly with both hands. ',
            friendshipChange: 80,
            response: '"Okay." The mountain man nodded, "From now on, you will be the mountain guard of Taoyuan Township. I... can finally rest assured."'
          }
        ]
      }
    ]
  },

  // ============================================================
  // Gui Nu — 3 heart events
  // ============================================================
  {
    id: 'gui_nv_heart_1',
    npcId: 'gui_nv',
    requiredFriendship: 800,
    title: 'Loom Sound',
    scenes: [
      {
        text: 'Late at night, you are attracted by the faint sound of a loom to the old well at the entrance of the village. Under the moonlight, a translucent loom appeared out of thin air. '
      },
      {
        text: 'The returned girl sat in front of the loom, her slender fingers shuttled between the silk threads. What she weaves is not cloth—it is moonlight itself. '
      },
      {
        text: 'She noticed you and paused in her movements: "Can you...can you see what I am knitting?"',
        choices: [
          {text: '"Moonlight?"',
            friendshipChange: 40,
            response: 'She smiled softly: "Yes. I weave the moonlight into a dream. Every full moon night, people in Taoyuan Township can have a good dream... I weave it."'
          },
          {
            text: '"It's a beautiful thing."',
            friendshipChange: 50,
            response: 'She lowered her head and said in a very soft voice: "It's been a long time... no one has ever said that the things I knit are beautiful." The silk threads glowed softly in her hands. '
          }
        ]
      }
    ]
  },
  {
    id: 'gui_nv_heart_2',
    npcId: 'gui_nv',
    requiredFriendship: 1600,
    title: 'The direction of my hometown',
    scenes: [
      {
        text: 'Gui Nu is not weaving today. She stood at the entrance of the village, facing north, her figure even more unreal than usual. '
      },
      {
        text: '"I'm looking for the direction of my hometown." She said, her voice like threads in the wind. "But... I have forgotten where my hometown is."'
      },
      {
        text: '"I only remember that there was a very big mulberry tree there, and there was a loom under the tree. Weaving, dyeing, and drying cloth every day... I was still alive at that time."'
      },
      {
        text: 'A silver teardrop fell on the ground and turned into a silver flower. ',
        choices: [
          {
            text: '"This can also be my hometown."',
            friendshipChange: 50,
            response: 'She looked at you, your figure reflected in her silver eyes: "Maybe... you are right. Where there are people, it is hometown."'
          },
          {
            text: 'Silently picked up the silver flower and handed it to her. ',
            friendshipChange: 40,
            response: 'She took the silver flower and held it in her hands. The flower began to glow warmly: "It turns out... this is how it feels to be remembered."'
          }
        ]
      }
    ]
  },
  {
    id: 'gui_nv_heart_3',
    npcId: 'gui_nv',
    requiredFriendship: 2400,
    title: 'Homecoming',
    scenes: [
      {
        text: 'Late in the middle of the winter solstice, you find that Gui Nu's figure is clearer than ever. She stood in the snow, holding a piece of silver brocade in her hands. '
      },
      {
        text: '"It took me a year to weave this." She unfolded the brocade - it was woven with the four seasons scenery of Taoyuan Township, lifelike. '
      },
      {
        text: '"The peach blossoms in spring, the lotus pond in summer, the maple leaves in autumn, the snow in winter...and your figure." Her face turned slightly red. '
      },
      {
        text: 'She handed the brocade to you: "This is woven with all my heart. Please accept it."',
        choices: [
          {
            text: '"This is the most beautiful gift I have ever received."',
            friendshipChange: 80,
            response: 'Gui Nu's eyes were red, but she was smiling: "Thank you. Because of you, I finally found...my home." Her figure became clearer and more real than ever before. '
          },
          {
            text: 'Carefully wrap the brocade around her shoulders. ',
            friendshipChange: 60,
            response: '"You..." her voice trembled, "why don't you keep it to yourself?" You shook your head. Gui Nu whispered: "...Fool." But she wrapped the brocade tightly around herself. '
          }
        ]
      }
    ]
  }
]

/** Get the heart event list based on NPC ID */
export const getHiddenNpcHeartEvents = (npcId: string): HeartEventDef[] => {
  return HIDDEN_NPC_HEART_EVENTS.filter(e => e.npcId === npcId)
}

/** Get the heart event based on the event ID */
export const getHiddenNpcHeartEventById = (eventId: string): HeartEventDef | undefined => {
  return HIDDEN_NPC_HEART_EVENTS.find(e => e.id === eventId)
}