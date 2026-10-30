// === Morning random event data ===
// Design concept: not a system, but "a narration in the morning"

/** Effect type */
export type MorningEffect =
  | { type: 'loseCrop' }
  | { type: 'gainItem'; itemId: string; qty: number }
  | { type: 'gainMoney'; amount: number }
  | { type: 'gainFriendship'; amount: number }

/** Thief/animal narration (4%) */
export interface MorningNarration {
  message: string
  effect?: MorningEffect
}

/** Events with options (0.8%) */
export interface MorningChoiceEvent {
  id: string
  message: string
  choices: {
    label: string
    result: string
    effect?: MorningEffect
  }[]
}

/** Easter egg narration (0.2%) */
export interface MorningEasterEgg {
  message: string
  effect?: MorningEffect
}

// ==================== 4% Thief/Animal Narration (25) ====================

export const MORNING_NARRATIONS: MorningNarration[] = [
  // —— Slight loss ——
  {
    message: 'Something took a bite out of the vegetables in the field, leaving a series of small paw prints next to it. ',
    effect: { type: 'loseCrop' }
  },
  {
    message: 'A crow took away a newly ripe fruit and crowed twice proudly on the branch. ',
    effect: { type: 'loseCrop' }
  },
  {
    message: 'A plant in the field was uprooted and thrown aside, as if it had been done by a wild boar. ',
    effect: { type: 'loseCrop' }
  },
  {
    message: 'A seedling in the corner was trampled by someone, and there are still hoof prints on the ground. ',
    effect: { type: 'loseCrop' }
  },
  // —— Slight gains ——
  {
    message: 'It seems that someone picked a handful of wild vegetables, but left three pennies at the door. ',
    effect: { type: 'gainMoney', amount: 3 }
  },
  {
    message: 'There is a small straw basket outside the fence. There are a few herbs in it. I don't know who left it. ',
    effect: { type: 'gainItem', itemId: 'herb', qty: 1 }
  },
  {
    message: 'There is a small bundle of bamboo neatly beside the firewood pile behind the house. Probably some kind woodcutter. ',
    effect: { type: 'gainItem', itemId: 'bamboo', qty: 2 }
  },
  //——Pure narration——
  { message: 'There are a few rabbit hairs hanging on the fence. It seems that there are uninvited guests at night. ' },
  { message: 'A wild cat was taking a nap on the ridge of the field. It looked like it had been sleeping all night. ' },
  { message: 'I found a pile of nut shells hidden by squirrels on the edge of the vegetable patch. They seem to like your farm very much. ' },
  { message: 'I went out early in the morning and found a string of small footprints on the ground extending from the vegetable field to the outside of the fence. ' },
  { message: 'A hedgehog has made its home in the compost heap and seems very happy with its current home. ' },
  { message: 'The scarecrow on the edge of the field is crooked, as if it was hit by something. Probably a wild deer passing by at night. ' },
  { message: 'A few scattered feathers were found next to the well. It may be that pheasants came to drink the water. ' },
  { message: 'There is an owl squatting on the roof, tilting its head to look at you. As soon as you move, it flies away. ' },
  { message: 'There is a small hole beside the field, which looks like it was dug by a field mouse. Fortunately, the crops were not harmed. ' },
  { message: 'The morning fog has cleared, a spider web hangs on the fence, and the dewdrops sparkle in the sun. ' },
  { message: 'A few sparrows were arguing under the eaves, not knowing what they were fighting about. ' },
  { message: 'There are a few more tadpoles in the ditch. It seems that frogs also like your farm. ' },
  { message: 'There is a gecko lying on a big rock at the edge of the field, basking in the sun motionless. ' },
  { message: 'The wind blew a scent of sweet-scented osmanthus from someone's yard. ' },
  { message: 'Your scarecrow is even more crooked. Maybe it was secretly active at night. ' },
  { message: 'A dragonfly landed on your hoe early in the morning, its wings so thin that they were transparent. ' },
  { message: 'A group of ants is carrying something across the field. The line is so long that it can't be seen at the end. ' },
  { message: 'There is a small bird's nest in the corner of the farm. It seems that some birds are planning to make their home here. ' }
]

/** A subset of pure narration (without loseCrop), used for empty farm fallback */
export const NARRATIONS_NO_LOSS: MorningNarration[] = MORNING_NARRATIONS.filter(n => !n.effect || n.effect.type !== 'loseCrop')

// ==================== 0.8% events with options (15 items) ====================

export const MORNING_CHOICE_EVENTS: MorningChoiceEvent[] = [
  {
    id: 'injured_bird',
    message: 'In the early morning, you find an injured bird on the edge of the field. It looks at you with eyes like black beans. ',
    choices: [
      {
        label: 'bandage the wound and let it rest for a while',
        result: 'You carefully bandaged the bird's wings. When the villagers heard about this, they all praised you for your kindness. ',
        effect: { type: 'gainFriendship', amount: 10 }
      },
      {
        label: 'Put it back into the bush',
        Result: 'The little bird flapped its wings and flew away. It called twice before leaving, as if to say thank you. '
      }
    ]
  },
  {
    id: 'hungry_traveler',
    message: 'A traveler came outside the farm. He looked tired and hungry. ',
    choices: [
      {
        label: 'Invite him to a meal',Result: 'After the traveler has eaten, he is very grateful. Before leaving, he took out a handful of herbs from his bag and gave them to you. ',
        effect: { type: 'gainItem', itemId: 'herb', qty: 3 }
      },
      {
        label: 'Show him the way to the village',
        result: 'The traveler bowed to you and walked along the path to the village. '
      }
    ]
  },
  {
    id: 'stealing_child',
    message: 'A child was secretly pulling radishes in your field. When he saw you coming out, he was so frightened that he froze. ',
    choices: [
      {
        label: 'Give him a few more',
        Result: 'The child took the dish with a red face, bowed and ran away. Later, his mother came to express her gratitude. ',
        effect: { type: 'gainFriendship', amount: 15 }
      },
      {
        label: 'Pretend not to see',
        result: 'You turned around and went back to the house, hearing a rustling sound behind you, and then the sound of retreating footsteps. '
      }
    ]
  },
  {
    id: 'mysterious_cat',
    message: 'A black cat that I had never seen before was squatting in the field, with a pine cone neatly placed in front of it. ',
    choices: [
      {
        label: 'accept the pinecones',
        result: 'You bent down to pick up the pinecones, and the black cat meowed and slowly disappeared into the morning mist. ',
        effect: { type: 'gainItem', itemId: 'pine_cone', qty: 1 }
      },
      {
        label: 'touch its head',
        Result: 'The black cat purred a few times, rubbed your hand, and then climbed over the wall and left. '
      }
    ]
  },
  {
    id: 'old_man_fishing',
    message: 'A white-bearded old man was fishing in the ditch next to your farm. When he saw you coming out, he smiled and said hello. ',
    choices: [
      {
        label: 'Sit down and chat for a while',
        result: 'The old man talked a lot about farming. You feel benefited a lot. ',
        effect: { type: 'gainFriendship', amount: 8 }
      },
      {
        label: 'Make him a cup of tea',
        result: 'The old man drank the tea happily and left some fish in the bucket for you before leaving. ',
        effect: { type: 'gainMoney', amount: 50 }
      }
    ]
  },
  {
    id: 'lost_dog',
    message: 'A dirty puppy is curled up at your door. It looks like it has been lost for a long time. ',
    choices: [
      {
        label: 'give it a bath and feed it some food',
        result: 'The puppy is wagging its tail and licking your hand. It stayed at your house for a day and was taken away by its owner in the evening. The owner left some money to express his gratitude. ',
        effect: { type: 'gainMoney', amount: 30 }
      },
      {
        label: 'Take it to the village to find its owner',
        result: 'You took the puppy around the village and quickly found its owner. Everyone says you are enthusiastic. ',
        effect: { type: 'gainFriendship', amount: 8 }
      }
    ]
  },
  {
    id: 'herb_woman',
    message: 'An old woman carrying a bamboo basket passed by and asked you if she could ask for a bowl of water. ',
    choices: [
      {
        label: 'Give her a bowl of water',
        Result: 'The old lady drank the water and said thank you. Before leaving, she grabbed a handful of herbs from the bamboo basket and gave them to you. ',
        effect: { type: 'gainItem', itemId: 'herb', qty: 2 }
      },
      {
        label: 'Ask her to rest',
        result: 'The old woman sat for a while, talking about the good intentions of young people. You vaguely feel that she is kind-hearted. ',
        effect: { type: 'gainFriendship', amount: 5 }
      }
    ]
  },
  {
    id: 'fox_standoff',
    message: 'A fox is squatting in the vegetable field with something in its mouth. It doesn't run away when you come out. It just stares at you. ',
    choices: [
      {
        label: 'Wave it away',
        result: 'The fox ran away slowly. You checked around and found that there was no damage to the vegetable patch. '
      },
      {
        label: 'Throw a piece of cake to it',
        result: 'The fox dropped what was in his mouth, picked up the cake and ran away. You pick it up and see that it is a pine cone. ',
        effect: { type: 'gainItem', itemId: 'pine_cone', qty: 1 }
      }
    ]
  },
  {
    id: 'broken_fence',
    message: 'Something made a hole in the fence, and a few hares were grazing leisurely in the field. ',
    choices: [
      {
        label: 'Mend the fence first',
        result: 'You spent some time patching up the fence. The hares ran out of the gap in panic. '
      },
      {
        label: 'Look what they eat',
        result: 'The rabbits are gnawing on the weeds and not touching the crops. You smiled and let them go. Instead, they help you get rid of some weeds. '
      }
    ]
  },
  {
    id: 'rain_mushroom',
    message: 'It rained last night, and a few mushrooms appeared on the edge of the field. ',
    choices: [
      {
        label: 'pick some',
        Result: 'You recognized these edible wild mushrooms and picked a few. ',
        effect: { type: 'gainItem', itemId: 'wild_mushroom', qty: 2 }
      },
      { label: 'Leave them alone', result: 'You decided to let them grow. Maybe there will be more in a few days. ' }
    ]
  },
  {
    id: 'painting_visitor',message: 'A young man carrying a drawing board is standing at the edge of the field, drawing your farm. ',
    choices: [
      {
        label: 'Go and have a look',
        result: 'The painting is quite good. The young man said that the scenery here inspired him very much, and gave you a few copper coins to express his gratitude. ',
        effect: { type: 'gainMoney', amount: 20 }
      },
      {
        label: 'Send him a cup of tea',
        result: 'The young man took the tea gratefully. He said he would send the painting back to you. You've been looking forward to it for a while. ',
        effect: { type: 'gainFriendship', amount: 5 }
      }
    ]
  },
  {
    id: 'snake_shed',
    message: 'A complete snake slough was found beside the ditch, so thin that it was almost transparent. ',
    choices: [
      {
        label: 'put it away',
        result: 'The old man said that snake shedding is a good sign. You hang it under the eaves and feel good. '
      },
      {
        label: 'Put it back where it was',
        result: 'You put the snake's slough away, turn around and leave. Things in nature should stay in nature. '
      }
    ]
  },
  {
    id: 'wild_bee_nest',
    message: 'There is a small beehive on the old tree behind the house, and several bees are buzzing and busy. ',
    choices: [
      {
        label: 'Leave them alone',
        result: 'Bees are good for pollinating crops. You decide to make peace with them. '
      },
      {
        label: 'Carefully take some honey',
        result: 'You smoked a small piece of honey. It's not much, but it tastes sweet. ',
        effect: { type: 'gainItem', itemId: 'honey', qty: 1 }
      }
    ]
  },
  {
    id: 'stone_buddha',
    message: 'When digging the ground, I dug out a fist-sized stone. If you look closely, it looks like a small Buddha statue. ',
    choices: [
      {
        label: 'Wipe it clean and put it on the edge of the field',
        result: 'You clean the small Buddha statue and put it away. The villagers passing by said this was a good fortune and everyone's luck was better. ',
        effect: { type: 'gainFriendship', amount: 10 }
      },
      {
        label: 'Put it away and sell it',
        result: 'You take it to the antique dealer in the village and exchange it for some copper plates. ',
        effect: { type: 'gainMoney', amount: 66 }
      }
    ]
  },
  {
    id: 'bamboo_shoots',
    message: 'After last night's rain, a few bamboo shoots sprouted from the roots of the fence. ',
    choices: [
      {
        label: 'dig out',
        result: 'Fresh bamboo shoots must be good for cooking. ',
        effect: { type: 'gainItem', itemId: 'bamboo', qty: 3 }
      },
      {
        label: 'Let them grow',
        result: 'You decide to let the bamboo shoots grow. Before long, there will be a few more bamboos here. '
      }
    ]
  }
]

// ==================== 0.2% Easter Eggs (10 items) ====================

export const MORNING_EASTER_EGGS: MorningEasterEgg[] = [
  {
    message: 'When digging the ground, an ancient copper coin was dug out. The writing on it was blurred, but it was vaguely shiny. ',
    effect: { type: 'gainItem', itemId: 'ancient_coin', qty: 1 }
  },
  {
    message: 'A golden butterfly is flying in the field, circling you three times and then flying towards the distant mountains. It is said that those who see it will have good luck. '
  },
  {
    message: 'It seemed like there was a rain of petals at night, and the whole farm was filled with a light floral fragrance. No one can tell where the flowers come from. '
  },
  {
    message: 'You saw your reflection at the bottom of the well, but the reflection seemed to smile at you. Probably because he didn't wake up. '
  },
  {
    message: 'I opened the door early in the morning and found a bouquet of unknown wild flowers placed at the door, neatly tied with straw ropes. No one knows who put it there. ',
    effect: { type: 'gainMoney', amount: 88 }
  },
  {
    message: 'A white crane flew from the sky, stopped in your field for a moment, and then fluttered away. The ancients said that the white crane is the mount of the immortal. '
  },
  {
    message: 'This morning, all the crops seem to be a little fresher than yesterday. Maybe it's your imagination, maybe not. '
  },
  {
    message: 'You found a copper plate from nowhere under your pillow. Thinking about it carefully, I seemed to have a dream about the God of Wealth last night. ',
    effect: { type: 'gainMoney', amount: 66 }
  },
  {
    message: 'The Scarecrow is facing a different direction today. Are you sure it wasn't placed like this yesterday? ...Are you sure? '
  },
  {
    message: 'Before dawn, you heard a few flutes playing in the distance. They were too melodious to be played by mortals. When you open the door and look, there is nothing. '
  }
]
