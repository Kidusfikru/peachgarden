import type {
  HanhaiShopItemDef,
  RouletteOutcome,
  CricketDef,
  PokerSuit,
  PokerRank,
  PokerCard,
  PokerHandType,
  PokerHandResult,
  TexasStreet,
  TexasTierId,
  TexasTierDef,
  PokerActionType,
  ShellType,
  TradeShopUpgradeDef,
  TradeExchangeItemDef
} from '@/types'

/** Hanhai Station fixed products (available every week) */
export const HANHAI_FIXED_ITEMS: HanhaiShopItemDef[] = [
  {
    itemId: 'hanhai_cactus_seed',
    name: 'Cactus Seed',
    price: 500,
    description: 'Special plant seeds from the Western Regions. ',
    weeklyLimit: 5
  },
  {
    itemId: 'hanhai_date_seed',
    name: 'Red Date Seed',
    price: 400,
    description: 'Fruit tree seeds brought by the Silk Road. ',
    weeklyLimit: 5
  },
  {
    itemId: 'hanhai_map',
    name: 'Treasure Map',
    price: 1000,
    description: 'A map marking a treasure somewhere in the wasteland. ',
    weeklyLimit: 1
  },
  {
    itemId: 'mega_bomb_recipe',
    name: 'Giant Bomb Recipe',
    price: 5000,
    description: 'A secret recipe that is said to be able to explode an entire layer of mines. ',
    weeklyLimit: 1
  }
]

/** Hanhai Station rotating product pool (4 items are randomly selected and put on the shelves every week) */
export const HANHAI_ROTATING_POOL: HanhaiShopItemDef[] = [
  {
    itemId: 'hanhai_spice',
    name: 'Western Spice',
    price: 300,
    description: 'Exotic spices, great for cooking. ',
    weeklyLimit: 3
  },
  {
    itemId: 'hanhai_silk',
    name: 'Silk',
    price: 800,
    description: 'Delicate and smooth fine silk. ',
    weeklyLimit: 2
  },
  {
    itemId: 'hanhai_turquoise',
    name: 'Turquoise',
    price: 600,
    description: 'A precious gemstone special to the Western Regions. ',
    weeklyLimit: 2
  },
  {
    itemId: 'hanhai_incense',
    name: 'Hanhai Agarwood',
    price: 500,
    description: 'Precious spices from the Western Regions, great gifts. ',
    weeklyLimit: 2
  },
  {
    itemId: 'hanhai_carpet',
    name: 'Flying Carpet Fragment',
    price: 1200,
    description: 'Fragments of the legendary flying carpet, a precious collection. ',
    weeklyLimit: 1
  },
  {
    itemId: 'hanhai_amber',
    name: 'Gobi Amber',
    price: 450,
    description: 'Natural amber from the Gobi Desert. ',
    weeklyLimit: 3
  },
  {
    itemId: 'hanhai_dried_fruit',
    name: 'Western Region Dried Fruit',
    price: 200,
    description: 'Sweet exotic dried fruit, restores physical strength. ',
    weeklyLimit: 5
  },
  {
    itemId: 'hanhai_pottery',
    name: 'Painted Pottery',
    price: 350,
    description: 'Exquisite painted pottery from the Western Regions, a great gift. ',
    weeklyLimit: 2
  },
  {
    itemId: 'hanhai_saddle_leather',
    name: 'saddle leather',
    price: 700,
    description: 'The finest Western harness leather. ',
    weeklyLimit: 2
  },
  {
    itemId: 'hanhai_lapis',
    name: 'Lapis Lazuli',
    price: 550,
    description: 'Dark blue precious stone. ',
    weeklyLimit: 2
  }
]

/** Compatible with old codes: merge all products in the fixed + rotation pool */
export const HANHAI_SHOP_ITEMS: HanhaiShopItemDef[] = [...HANHAI_FIXED_ITEMS, ...HANHAI_ROTATING_POOL]

/** Generate this week’s rotating products based on year + season + week number (deterministic pseudo-random) */
export const getWeeklyRotatingItems = (year: number, seasonIndex: number, day: number): HanhaiShopItemDef[] => {
  const weekNumber = Math.ceil(day / 7)
  const seed = year * 10000 + seasonIndex * 100 + weekNumber
  // Simple deterministic random: seed-based shuffling
  const pool = [...HANHAI_ROTATING_POOL]
  let s = seed
  for (let i = pool.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7ffffffff
    const j = s % (i + 1)
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool.slice(0, 4)
}

/** Roulette odds */
export const ROULETTE_OUTCOMES: RouletteOutcome[] = [
  { label: 'empty', multiplier: 0, chance: 72 },{ label: 'double', multiplier: 2, chance: 18 },
  { label: 'Triple', multiplier: 3, chance: 7 },
  { label: 'five times', multiplier: 5, chance: 3 }
]

/** Roulette betting position */
export const ROULETTE_BET_TIERS = [100, 500, 1000] as const

/** Dice betting amount */
export const DICE_BET_AMOUNT = 200

/** Maximum number of gambles per day */
export const MAX_DAILY_BETS = 10

/** The cost required to unlock Hanhai */
export const HANHAI_UNLOCK_COST = 100000

/** Randomly select roulette results based on probability */
export const spinRoulette = (): RouletteOutcome => {
  let roll = Math.random() * 100
  for (const outcome of ROULETTE_OUTCOMES) {
    roll -= outcome.chance
    if (roll <= 0) return outcome
  }
  return ROULETTE_OUTCOMES[0]!
}

/** Dice game: roll size */
export const rollDice = (): {
  dice1: number
  dice2: number
  total: number
  isBig: boolean
} => {
  const dice1 = Math.floor(Math.random() * 6) + 1
  const dice2 = Math.floor(Math.random() * 6) + 1
  const total = dice1 + dice2
  return { dice1, dice2, total, isBig: total >= 7 }
}

// ==================== Guess the cup ====================

/** Guess cup betting amount */
export const CUP_BET_AMOUNT = 250

/** Cup guessing multiplier */
export const CUP_WIN_MULTIPLIER = 3

/** Cup guessing game: under which cup the ball is hidden */
export const playCupRound = (): { correctCup: number } => {
  return { correctCup: Math.floor(Math.random() * 3) }
}

// ==================== Cricket Fighting ====================

/** Cricket fighting betting amount */
export const CRICKET_BET_AMOUNT = 300

/** Cricket fighting odds */
export const CRICKET_WIN_MULTIPLIER = 2.5

/** Optional cricket */
export const CRICKETS: CricketDef[] = [
  { id: 'general', name: 'General', description: 'Strong physique, capable of both offense and defense. ' },
  { id: 'ironhead', name: 'ironhead', description: 'The head is as iron as iron and is good at head-on confrontation. ' },
  { id: 'dragonfly', name: 'Qinglong', description: 'The movement is flexible and unexpected. ' }
]

/** Cricket fight: Both sides throw strength, and the one with the higher score wins */
export const fightCricket = (): {
  playerPower: number
  opponentPower: number
} => {
  const playerPower = Math.floor(Math.random() * 10) + 1
  const opponentPower = Math.floor(Math.random() * 10) + 1
  return { playerPower, opponentPower }
}

// ==================== Treasure Hunt ====================

/** Flop betting amount */
export const CARD_BET_AMOUNT = 150

/** Flop winning odds */
export const CARD_WIN_MULTIPLIER = 2.5

/** Total number of flops */
export const CARD_TOTAL = 5

/** Number of treasure cards in the flop */
export const CARD_TREASURE_COUNT = 2

/** Flop game: generate treasure card position */
export const dealCards = (): { treasures: number[] } => {
  const positions = [0, 1, 2, 3, 4]
  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j]!, positions[i]!]
  }
  return { treasures: positions.slice(0, CARD_TREASURE_COUNT) }
}

// ==================== Hanhai Poker ====================

/** Session configuration */
export const TEXAS_TIERS: TexasTierDef[] = [
  {
    id: 'beginner',
    name: 'Novice Field',
    entryFee: 200,
    blind: 10,
    rake: 20,
    minMoney: 500,
    rounds: 3
  },
  {
    id: 'normal',
    name: 'Normal field',
    entryFee: 500,
    blind: 25,
    rake: 50,
    minMoney: 2000,
    rounds: 5
  },
  {
    id: 'expert',
    name: 'Master Field',
    entryFee: 2000,
    blind: 100,
    rake: 200,
    minMoney: 10000,
    rounds: 8
  }
]/** Get event configuration based on ID */
export const getTexasTier = (id: TexasTierId): TexasTierDef => TEXAS_TIERS.find(t => t.id === id)!

/** Suit display symbol */
export const SUIT_LABELS: Record<PokerSuit, string> = {
  spade: '\u2660',
  heart: '\u2665',
  diamond: '\u2666',
  club: '\u2663'
}

/** Points display */
export const RANK_LABELS: Record<number, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
}

/** Chinese name of card type */
export const HAND_LABELS: Record<PokerHandType, string> = {
  royal_flush: 'Royal Flush',
  straight_flush: 'straight flush',
  four_kind: 'four',
  full_house: 'Gourd',
  flush: 'flush',
  straight: 'shunzi',
  three_kind: 'three',
  two_pair: 'two pairs',
  one_pair: 'a pair',
  high_card: 'High card'
}

/** Card type priority (the bigger, the stronger) */
const HAND_TYPE_RANK: Record<PokerHandType, number> = {
  high_card: 0,
  one_pair: 1,
  two_pair: 2,
  three_kind: 3,
  straight: 4,
  flush: 5,
  full_house: 6,
  four_kind: 7,
  straight_flush: 8,
  royal_flush: 9
}

const ALL_SUITS: PokerSuit[] = ['spade', 'heart', 'diamond', 'club']
const ALL_RANKS: PokerRank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

/** Create and shuffle (Fisher-Yates) */
export const createShuffledDeck = (): PokerCard[] => {
  const deck: PokerCard[] = []
  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      deck.push({ suit, rank })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j]!, deck[i]!]
  }
  return deck
}

/** Evaluate the card type of 5 cards */
export const evaluateHand = (cards: PokerCard[]): PokerHandResult => {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank)
  const ranks = sorted.map(c => c.rank)

  // Check for flush
  const isFlush = sorted.every(c => c.suit === sorted[0]!.suit)

  // Check for a straight
  let isStraight = false
  let straightHighRank = ranks[0]!

  // Ordinary straight
  if (ranks[0]! - ranks[4]! === 4 && new Set(ranks).size === 5) {
    isStraight = true
  }
  // A-2-3-4-5 small straight
  if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
    isStraight = true
    straightHighRank = 5 // A is the smallest
  }

  // Count frequency
  const freq = new Map<number, number>()
  for (const r of ranks) {
    freq.set(r, (freq.get(r) ?? 0) + 1)
  }
  const counts = [...freq.values()].sort((a, b) => b - a)
  // Sort by frequency in descending order, same frequency by rank in descending order
  const groupedRanks = [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]).map(e => e[0])

  // Determine card type
  let type: PokerHandType
  let compareRanks: number[]

  if (isFlush && isStraight && ranks[0] === 14 && ranks[1] === 13) {
    type = 'royal_flush'
    compareRanks = [14]
  } else if (isFlush && isStraight) {
    type = 'straight_flush'
    compareRanks = [straightHighRank]
  } else if (counts[0] === 4) {
    type = 'four_kind'
    compareRanks = groupedRanks
  } else if (counts[0] === 3 && counts[1] === 2) {
    type = 'full_house'
    compareRanks = groupedRanks
  } else if (isFlush) {
    type = 'flush'
    compareRanks = ranks} else if (isStraight) {
    type = 'straight'
    compareRanks = [straightHighRank]
  } else if (counts[0] === 3) {
    type = 'three_kind'
    compareRanks = groupedRanks
  } else if (counts[0] === 2 && counts[1] === 2) {
    type = 'two_pair'
    compareRanks = groupedRanks
  } else if (counts[0] === 2) {
    type = 'one_pair'
    compareRanks = groupedRanks
  } else {
    type = 'high_card'
    compareRanks = ranks
  }

  return {
    type,
    typeRank: HAND_TYPE_RANK[type],
    ranks: compareRanks,
    label: HAND_LABELS[type]
  }
}

/** Generate all C(n,5) combinations from n sheets */
const combinations5 = (cards: PokerCard[]): PokerCard[][] => {
  const result: PokerCard[][] = []
  const n = cards.length
  for (let i = 0; i < n - 4; i++) {
    for (let j = i + 1; j < n - 3; j++) {
      for (let k = j + 1; k < n - 2; k++) {
        for (let l = k + 1; l < n - 1; l++) {
          for (let m = l + 1; m < n; m++) {
            result.push([cards[i]!, cards[j]!, cards[k]!, cards[l]!, cards[m]!])
          }
        }
      }
    }
  }
  return result
}

/** Compare two hands: >0 = a wins, <0 = b wins, 0 = draw */
export const compareHands = (a: PokerHandResult, b: PokerHandResult): number => {
  if (a.typeRank !== b.typeRank) return a.typeRank - b.typeRank
  for (let i = 0; i < Math.min(a.ranks.length, b.ranks.length); i++) {
    if (a.ranks[i]! !== b.ranks[i]!) return a.ranks[i]! - b.ranks[i]!
  }
  return 0
}

/** Select the best 5 card types from 7 cards */
export const evaluateBestHand = (cards: PokerCard[]): PokerHandResult => {
  const combos = combinations5(cards)
  let best = evaluateHand(combos[0]!)
  for (let i = 1; i < combos.length; i++) {
    const hand = evaluateHand(combos[i]!)
    if (compareHands(hand, best) > 0) {
      best=hand
    }
  }
  return best
}

/** Deal a game of Hanhai Poker */
export const dealTexas = (): {
  playerHole: PokerCard[]
  dealerHole: PokerCard[]
  community: PokerCard[]
} => {
  const deck = createShuffledDeck()
  return {
    playerHole: [deck[0]!, deck[1]!],
    dealerHole: [deck[2]!, deck[3]!],
    community: [deck[4]!, deck[5]!, deck[6]!, deck[7]!, deck[8]!]
  }
}

/** Banker AI decision-making */
export const texasDealerAI = (
  dealerHole: PokerCard[],
  community: PokerCard[],
  street: TexasStreet,
  pot: number,
  dealerStack: number,
  playerBet: number,
  dealerBet: number,
  playerAllIn: boolean,
  blind: number
): { action: PokerActionType; amount: number } => {
  const toCall = playerBet - dealerBet

  //Evaluate current card strength
  const visibleCards = [...dealerHole, ...community]
  let strength = 0 // 0=weak 1=medium 2=strong
  if (visibleCards.length >= 5) {
    const hand = evaluateBestHand(visibleCards)
    if (hand.typeRank >= 3)
      strength = 2 // Santiao+
    else if (hand.typeRank >= 1) strength = 1 // pair +
  } else if (visibleCards.length >= 2) {
    // preflop: simple evaluation of hands
    const r1 = dealerHole[0]!.rank
    const r2 = dealerHole[1]!.rank
    const paired = r1 === r2
    const highCard = Math.max(r1, r2) >= 11
    const suited = dealerHole[0]!.suit === dealerHole[1]!.suitif (paired || (highCard && suited)) strength = 2
    else if (highCard || suited) strength = 1
  }

  // Player is all-in → can only follow or fold
  if (playerAllIn) {
    if (toCall <= 0) return { action: 'check', amount: 0 }
    if (strength >= 1 || toCall <= pot * 0.3) return { action: 'call', amount: toCall }
    return Math.random() < 0.3 ? { action: 'call', amount: toCall } : { action: 'fold', amount: 0 }
  }

  // No need to follow
  if (toCall <= 0) {
    if (strength >= 2 && Math.random() < 0.6) {
      const raiseAmt = Math.min(blind * (street === 'preflop' ? 2 : 3), dealerStack)
      return raiseAmt > 0 ? { action: 'raise', amount: raiseAmt } : { action: 'check', amount: 0 }
    }
    if (strength >= 1 && Math.random() < 0.3) {
      const raiseAmt = Math.min(blind * 2, dealerStack)
      return raiseAmt > 0 ? { action: 'raise', amount: raiseAmt } : { action: 'check', amount: 0 }
    }
    return { action: 'check', amount: 0 }
  }

  // Need to follow
  const potOdds = toCall / (pot + toCall)

  if (strength >= 2) {
    // Strong hand: call or raise
    if (Math.random() < 0.4 && dealerStack > toCall + blind) {
      const raiseAmt = toCall + Math.min(blind * 2, dealerStack - toCall)
      return { action: 'raise', amount: raiseAmt }
    }
    return { action: 'call', amount: toCall }
  }

  if (strength >= 1) {
    // Medium hands: Most call, big bets may fold
    if (potOdds > 0.5 && street === 'river') {
      return Math.random() < 0.5 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
    }
    return { action: 'call', amount: toCall }
  }

  // weak hand
  if (potOdds > 0.4) {
    return Math.random() < 0.7 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
  }
  return Math.random() < 0.3 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
}

// ==================== Devil's Roulette ====================

/** Devil’s Roulette Bet Amount */
export const BUCKSHOT_BET_AMOUNT = 400

/** Devil’s Roulette winning odds */
export const BUCKSHOT_WIN_MULTIPLIER = 3

/** Initial HP of both parties */
export const BUCKSHOT_PLAYER_HP = 2
export const BUCKSHOT_DEALER_HP = 2

/** Number of live ammunition */
export const BUCKSHOT_LIVE_COUNT = 4

/** Number of empty bombs */
export const BUCKSHOT_BLANK_COUNT = 4

/** Generate magazine (shuffle the order) */
export const loadShotgun = (): ShellType[] => {
  const shells: ShellType[] = []
  for (let i = 0; i < BUCKSHOT_LIVE_COUNT; i++) shells.push('live')
  for (let i = 0; i < BUCKSHOT_BLANK_COUNT; i++) shells.push('blank')
  // Fisher-Yates
  for (let i = shells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shells[i], shells[j]] = [shells[j]!, shells[i]!]
  }
  return shells
}

/** Banker AI decision-making */
export const dealerDecide = (shells: ShellType[], currentIndex: number, knowsCurrent: boolean): 'self' | 'opponent' => {
  if (knowsCurrent) {
    return shells[currentIndex] === 'blank' ? 'self' : 'opponent'
  }
  // Count remaining ammunition
  let liveLeft = 0
  let blankLeft = 0
  for (let i = currentIndex; i < shells.length; i++) {
    if (shells[i] === 'live') liveLeft++
    else blankLeft++
  }
  return blankLeft > liveLeft ? 'self' : 'opponent'
}

// === Trade system ===/** Tongtong store upgrade definition */
export const TRADE_SHOP_UPGRADES: TradeShopUpgradeDef[] = [
  {
    level: 1,
    name: 'Stall',
    maxSlots: 2,
    sellDays: 3,
    cost: 0,
    materialCost: []
  },
  {
    level: 2,
    name: 'shop',
    maxSlots: 3,
    sellDays: 3,
    cost: 20000,
    materialCost: [
      { itemId: 'wood', quantity: 150 },
      { itemId: 'iron_bar', quantity: 5 }
    ]
  },
  {
    level: 3,
    name: 'Big Shop',
    maxSlots: 4,
    sellDays: 2,
    cost: 50000,
    materialCost: [
      { itemId: 'wood', quantity: 250 },
      { itemId: 'gold_bar', quantity: 5 }
    ]
  },
  {
    level: 4,
    name: 'Business Firm',
    maxSlots: 5,
    sellDays: 2,
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 400 },
      { itemId: 'gold_bar', quantity: 15 }
    ]
  },
  {
    level: 5,
    name: 'Chamber of Commerce',
    maxSlots: 6,
    sellDays: 1,
    cost: 200000,
    materialCost: [
      { itemId: 'wood', quantity: 500 },
      { itemId: 'iridium_bar', quantity: 3 }
    ]
  }
]

/** Points redeemed for goods */
export const TRADE_EXCHANGE_ITEMS: TradeExchangeItemDef[] = [
  {
    itemId: 'trade_star_fragment',
    name: 'Star Fragment',
    pointsCost: 50,
    description: 'Rare material, used for advanced crafting. ',
    weeklyLimit: 3
  },
  // { itemId: 'trade_golden_coconut', name: 'Golden Coconut', pointsCost: 80, description: 'Open to get random rare items. ', weeklyLimit: 2 },
  // { itemId: 'trade_desert_totem', name: 'Desert Totem', pointsCost: 30, description: 'Immediately teleport to Hanhai (no time consumed). ', weeklyLimit: 5 },
  {
    itemId: 'trade_spice_bundle',
    name: 'Spice Gift Pack',
    pointsCost: 40,
    description: 'Obtain Western Spices ×5. ',
    weeklyLimit: 3
  },
  {
    itemId: 'trade_turquoise_pendant',
    name: 'turquoise pendant',
    pointsCost: 120,
    description: 'Accessory, attack +2, defense +3%. ',
    totalLimit: 1,
    equipType: 'ring'
  },
  {
    itemId: 'trade_silk_robe',
    name: 'silk robe',
    pointsCost: 150,
    description: 'Hat, attack +3, HP +20. ',
    totalLimit: 1,
    equipType: 'hat'
  },
  {
    itemId: 'trade_desert_blade',
    name: 'Desert Scimitar',
    pointsCost: 200,
    description: 'Weapon, attack 40, critical hit 8%. ',
    totalLimit: 1,
    equipType: 'weapon'
  },
  {
    itemId: 'trade_steppe_horse',
    name: 'Prairie Horse',
    pointsCost: 400,
    description: 'A good horse in the vast sea. Get the steppe horse breed: travel faster and with less effort. ',
    totalLimit: 1,
    isHorseUpgrade: 'steppe'
  },
  {
    itemId: 'trade_prosperity_seal',
    name: 'Tongshang Golden Seal',
    pointsCost: 300,
    description: 'Purse bag items, gain +20% trade points. ',
    totalLimit: 1,
    isWalletItem: true
  }
]

/** Points calculation: Item selling price transferred to reseller points */
export const TRADE_QUALITY_MULTIPLIER: Record<string, number> = {
  normal: 1.0,
  fine: 1.25,
  excellent: 1.5,
  Supreme: 2.0
}

export const calcTradePoints = (sellPrice: number, quality: string): number => {
  const multiplier = TRADE_QUALITY_MULTIPLIER[quality] ?? 1.0
  return Math.ceil(sellPrice * multiplier * 0.1)
}
