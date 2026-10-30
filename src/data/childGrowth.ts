import type { ChildStage } from '@/types'

/**
 *Children’s growth line.
 *
 * Originally, the child only had the stage field that silently turned pages in the background, and the player could not feel anything except the name.
 * Three things are added here: milestone events when stages are crossed, different interactive content at each stage, and output that can help when you grow up.
 */

/** Chinese names of each stage */
export const CHILD_STAGE_NAMES: Record<ChildStage, string> = {
  baby: 'swaddling',
  toddler: 'toddler',
  child: 'child',
  teen: 'teenager'
}

/** The starting days of each stage (when daysOld is reached, the stage will be entered) */
export const CHILD_STAGE_DAYS: Record<ChildStage, number> = {
  baby: 0,
  toddler: 14,
  child: 28,
  teen: 56
}

/** Phase sequence */
export const CHILD_STAGE_ORDER: ChildStage[] = ['baby', 'toddler', 'child', 'teen']

/** Milestone copy when entering a new stage, {name} is the name of the child, {spouse} is the name of the spouse */
export const CHILD_MILESTONES: Record<ChildStage, string[]> = {
  baby: ['{name} is born. A small, wrinkled mass that clutches your fingers and refuses to let go. '],
  toddler: [
    '{name} stood up holding on to the door frame today, took three wobbly steps, then sat down on the ground, grinning. ',
    '{name} called out for the first time. {spouse} heard it at the stove and dropped the spatula. '
  ],
  child: [
    '{name} can run all over the yard. You found him in the henhouse this morning, holding a frightened hen in his arms and looking proud of himself. ',
    '{name} has learned to dress herself, although she still tied two buttons wrong. ',
    '{name} followed you to the field for a while, squatting on the edge of the ridge to pull weeds in a dignified manner. Most of the things he pulled out were seedlings. '
  ],
  teen: [
    '{name} is a head taller than last year. Today I took the initiative and said, "Mom, Dad, I can do the work in the fields too."',
    '{name} has been going to the village school recently. When he comes back, he will recite a few lines of poetry to you. If he reads it wrong, no one will be allowed to correct him. ',
    '{name} polished the farm tools and arranged them neatly. {spouse} said, this child is up to you. '
  ]
}

/** Daily interactive copywriting at each stage */
export const CHILD_INTERACTIONS: Record<ChildStage, string[]> = {
  baby: [
    '{name} was sleeping soundly, her little fists clenched by her face. You gently tucked him in. ',
    'You picked up {name} and shook it. He babbling twice and fell asleep again. ',
    '{name} is awake, looking at you with his dark eyes, and he smiles as he looks at you. '
  ],
  toddler: [
    '{name} rushed over and hugged your legs, raising his head to be hugged by you. ',
    'You teach {name} to count, and he starts to get confused when he counts to three. He is very satisfied with it. ',
    '{name} solemnly puts a stone into your hand, as if giving a great treasure. ',
    'You and {name} chased chickens around the yard, and he gasped with laughter. '
  ],
  child: [
    '{name} pulls you to look at the "house" he built in the corner - three bricks and one tile. ',
    'You told {name} a story, and after hearing it, he said, "Then tell another one tomorrow."',
    '{name} had a fight with Shitou today, and when he came back he insisted that it didn't hurt. You wiped his knees. ',
    '{name} asked you: "Mom and dad, what's it like on the other side of the mountain?" You couldn't answer for the moment. ',
    'You play with {name} by the stream for a while. His best score was four. '
  ],
  teen: [
    '{name} took the initiative to fill the water tank for you, wiped his sweat and said: "It's nothing."',
    'You and {name} sat on the threshold and talked for a while. He has an idea of ​​his own now. ',
    '{name} said he wanted to learn a trade and asked you who has the best job in the village. ',
    '{name} will write down the pests he saw in the field today on a piece of paper for you. The writing is neater than yours. ',
    'You found that {name} was secretly practicing the farm work you taught her, and her movements were already very good. '
  ]
}

/** Small things that children/teenagers occasionally bring back */
export const CHILD_GIFT_POOL: Record<ChildStage, string[]> = {
  baby: [],
  toddler: ['pine_cone', 'wild_berry'],
  child: ['wood', 'herb', 'pine_cone', 'wild_berry', 'clay'],
  teen: ['wood', 'herb', 'bamboo', 'wild_mushroom', 'copper_ore', 'clay']
}

/** The probability of bringing something back at each stage */
export const CHILD_GIFT_CHANCE: Record<ChildStage, number> = {
  baby: 0,
  toddler: 0.08,
  child: 0.15,
  teen: 0.25
}

/** The number of plots that the teenager can help water every day */
export const TEEN_HELP_PLOTS = 3

/** Calculate the stage based on the number of days */
export const getChildStageByAge = (daysOld: number): ChildStage => {
  if (daysOld >= CHILD_STAGE_DAYS.teen) return 'teen'
  if (daysOld >= CHILD_STAGE_DAYS.child) return 'child'
  if (daysOld >= CHILD_STAGE_DAYS.toddler) return 'toddler'
  return 'baby'
}

/** Get a milestone copy */
export const pickMilestone = (stage: ChildStage): string => {
  const pool = CHILD_MILESTONES[stage]
  return pool[Math.floor(Math.random() * pool.length)] ?? ''
}

/** Get an interactive copy */
export const pickInteraction = (stage: ChildStage): string => {
  const pool = CHILD_INTERACTIONS[stage]
  return pool[Math.floor(Math.random() * pool.length)] ?? ''
}

/** Fill in the placeholders in the copy */export const fillChildText = (text: string, childName: string, spouseName: string): string => {
  return text.replace(/\{name\}/g, childName).replace(/\{spouse\}/g, spouseName || 'your partner')
}