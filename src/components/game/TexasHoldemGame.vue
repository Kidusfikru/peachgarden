<template>
  <div class="game-panel max-w-sm w-full">
    <Divider title class="!mb-1">Hanhai Poker · {{ tier.name }}</Divider>
    <div class="flex items-center justify-center space-x-2 mb-2">
      <span class="text-xs text-muted">{{ currentRound }}/{{ tier.rounds }} hand</span>
      <span class="text-xs text-muted">Entrance fee {{ tier.entryFee }}text</span>
      <span class="text-xs text-muted">pump {{ tier.rake }}文</span>
    </div>

    <!-- Pot + Street -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-muted">{{ streetLabel }}</span>
      <span class="text-xs text-accent">Pot: {{ pot }}</span>
    </div>

    <!-- Community card -->
    <div class="mb-2">
      <p class="text-xs text-muted mb-1">Community cards</p>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentCommunity"
          :key="i"
          class="poker-card"
          :class="{
            'poker-card-hidden': !isCommunityVisible(i),
            'poker-card-red': isCommunityVisible(i) && isRedSuit(card.suit),
            'poker-card-reveal': isCommunityVisible(i)
          }"
        >
          <template v-if="isCommunityVisible(i)">
            <span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span>
            <span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
          </template>
          <template v-else>?</template>
        </span>
      </div>
    </div>

    <!-- Player hand + chips -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted">Your hand</span>
        <span class="text-xs">Chips: {{ playerStack }}</span>
      </div>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentPlayerHole"
          :key="i"
          class="poker-card poker-card-reveal"
          :class="{ 'poker-card-red': isRedSuit(card.suit) }"
        >
          <span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span>
          <span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
        </span>
      </div>
      <p v-if="playerHandResult" class="text-xs text-center mt-1 text-accent">
        {{ playerHandResult.label }}
      </p>
    </div>

    <!-- Dealer's hand + chips -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted">Dealer's hand</span>
        <span class="text-xs">Chips: {{ dealerStack }}</span>
      </div>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentDealerHole"
          :key="i"
          class="poker-card"
          :class="{
            'poker-card-hidden': !showDealerCards,
            'poker-card-red': showDealerCards && isRedSuit(card.suit),
            'poker-card-reveal': showDealerCards
          }"
        >
          <template v-if="showDealerCards"><span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span><span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
          </template>
          <template v-else>?</template>
        </span>
      </div>
      <p v-if="dealerHandResult" class="text-xs text-center mt-1 text-accent">
        {{ dealerHandResult.label }}
      </p>
    </div>

    <!-- Operation button -->
    <div v-if="!handOver && isPlayerTurn && !animating" class="flex flex-wrap space-x-1 mb-2">
      <template v-if="toCall <= 0">
        <Button class="flex-1 justify-center" @click="doCheck">Check</Button>
        <Button
          v-if="!dealerAllIn && playerStack >= tier.blind * 2"
          class="flex-1 justify-center"
          @click="doRaise(playerBetRound + tier.blind * 2)"
        >
          Add {{ tier.blind * 2 }}
        </Button>
        <Button
          v-if="!dealerAllIn && playerStack >= tier.blind * 4"
          class="flex-1 justify-center"
          @click="doRaise(playerBetRound + tier.blind * 4)"
        >
          Add {{ tier.blind * 4 }}
        </Button>
      </template>
      <template v-else>
        <Button class="flex-1 justify-center" @click="doCall">Follow {{ toCall }}</Button>
        <Button v-if="!dealerAllIn && playerStack > toCall" class="flex-1 justify-center" @click="doRaise(dealerBetRound + tier.blind * 2)">
          raise {{ toCall + tier.blind * 2 }}
        </Button>
      </template>
      <Button v-if="!dealerAllIn" class="flex-1 justify-center" @click="doAllIn">All in</Button>
      <Button class="flex-1 justify-center text-danger" @click="doFold">Discard</Button>
    </div>

    <!-- The banker is thinking -->
    <p v-if="!handOver && !isPlayerTurn && animating" class="text-xs text-muted/40 text-center mb-2">The banker is thinking...</p>

    <!-- Log -->
    <div class="border border-accent/10 rounded-xs p-2 mb-2 max-h-24 overflow-y-auto" ref="logRef">
      <p v-for="(msg, i) in actionLog" :key="i" class="text-xs text-muted leading-relaxed">
        {{ msg }}
      </p>
    </div>

    <!-- Final Settlement -->
    <template v-if="sessionOver && finalResult">
      <div class="border border-accent/10 rounded-xs p-3 text-center mb-2">
        <p class="text-sm" :class="finalResult.won ? 'text-success' : finalResult.draw ? 'text-accent' : 'text-danger'">
          {{ finalResult.won ? 'You win! ' : finalResult.draw ? 'No profit, no loss' : 'You lose...' }}
        </p>
        <p class="text-xs mt-0.5" :class="finalResult.netProfit >= 0 ? 'text-success' : 'text-danger'">
          {{ finalResult.netProfit >= 0 ? '+' + finalResult.netProfit + '文' : finalResult.netProfit + '文' }}
        </p>
        <p class="text-xs text-muted mt-0.5">Dealer tip {{ tier.rake }} text</p>
        <p class="text-xs text-muted mt-0.5">Total {{ currentRound }} hands · Final chips {{ playerStack }}</p>
      </div>
      <Button class="w-full justify-center" @click="emit('complete', playerStack, tier.name)">OK</Button></template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'import { SUIT_LABELS, RANK_LABELS, evaluateBestHand, compareHands, texasDealerAI, dealTexas } from '@/data/hanhai'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { sfxChipBet, sfxFoldCards, sfxCardFlip, sfxCasinoWin, sfxCasinoLose } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import type { TexasSetup, TexasStreet, PokerSuit, PokerHandResult, PokerCard } from '@/types'

  const playerStore = usePlayerStore()

  const props = defineProps<{ setup: TexasSetup }>()
  const emit = defineEmits<{
    complete: [finalChips: number, tierName: string]
  }>()

  const tier = props.setup.tier

  // === Multi-hand management ===
  const currentRound = ref(1)
  const currentPlayerHole = ref<PokerCard[]>(props.setup.playerHole)
  const currentDealerHole = ref<PokerCard[]>(props.setup.dealerHole)
  const currentCommunity = ref<PokerCard[]>(props.setup.community)

  // === Single hand status ===
  const street = ref<TexasStreet>('preflop')
  const playerStack = ref(tier.entryFee)
  const dealerStack = ref(tier.entryFee)
  const pot = ref(0)
  const playerBetRound = ref(0)
  const dealerBetRound = ref(0)
  const isPlayerTurn = ref(true)
  const animating = ref(false)
  const handOver = ref(false)
  const handResult = ref<'won' | 'draw' | 'lost' | null>(null)
  const playerFolded = ref(false)
  const dealerFolded = ref(false)
  const playerAllIn = ref(false)
  const dealerAllIn = ref(false)
  const showDealerCards = ref(false)
  const playerHandResult = ref<PokerHandResult | null>(null)
  const dealerHandResult = ref<PokerHandResult | null>(null)
  const sessionOver = ref(false)
  const finalResult = ref<{
    won: boolean
    draw: boolean
    netProfit: number
  } | null>(null)
  const totalInvested = ref(0) // Cumulative off-site investment (excluding initial admission fee)
  const actionLog = ref<string[]>([])
  const logRef = ref<HTMLElement | null>(null)

  const toCall = computed(() => Math.max(0, dealerBetRound.value - playerBetRound.value))

  const streetLabel = computed(() => {
    const labels: Record<TexasStreet, string> = {
      preflop: 'preflop',
      flop: 'Flop',
      turn: 'turn card',
      river: 'river card',
      showdown: 'showdown'
    }
    return labels[street.value]
  })

  const isRedSuit = (suit: PokerSuit) => suit === 'heart' || suit === 'diamond'

  const isCommunityVisible = (index: number) => {
    if (street.value === 'showdown') return true
    if (index < 3) return street.value === 'flop' || street.value === 'turn' || street.value === 'river'
    if (index === 3) return street.value === 'turn' || street.value === 'river'
    return street.value === 'river'
  }

  const visibleCommunity = computed(() => {
    const s = street.value
    if (s === 'preflop') return []if (s === 'flop') return currentCommunity.value.slice(0, 3)
    if (s === 'turn') return currentCommunity.value.slice(0, 4)
    return currentCommunity.value.slice(0, 5)
  })

  const addActionLog = (msg: string) => {
    actionLog.value.push(msg)void nextTick(() => {
      if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight
    })
  }

  /** Move chips from one side to the pot */
  const betFromPlayer = (amount: number) => {
    const actual = Math.min(amount, playerStack.value)
    playerStack.value -= actual
    playerBetRound.value += actual
    if (playerStack.value <= 0) playerAllIn.value = true
    return actual
  }

  const betFromDealer = (amount: number) => {
    const actual = Math.min(amount, dealerStack.value)
    dealerStack.value -= actual
    dealerBetRound.value += actual
    if (dealerStack.value <= 0) dealerAllIn.value = true
    return actual
  }

  /** Collect bets for this round into the pot (process unequal all-in and return excess chips) */
  const collectBets = () => {
    const pBet = playerBetRound.value
    const dBet = dealerBetRound.value
    const matched = Math.min(pBet, dBet)
    pot.value += matched * 2

    //Return excess chips
    if (pBet > matched) {
      const refund = pBet - matched
      playerStack.value += refund
    }
    if (dBet > matched) {
      const refund = dBet-matched
      dealerStack.value += refund
    }

    playerBetRound.value = 0
    dealerBetRound.value = 0
  }

  /** Enter the next street */
  const advanceStreet = () => {
    collectBets()
    const order: TexasStreet[] = ['preflop', 'flop', 'turn', 'river', 'showdown']
    const idx = order.indexOf(street.value)
    if (idx >= 3 || street.value === 'river') {
      doShowdown()
      return
    }
    street.value = order[idx + 1]!
    sfxCardFlip()
    addActionLog(`—— ${streetLabel.value} ——`)

    if (playerAllIn.value || dealerAllIn.value) {
      setTimeout(() => advanceStreet(), 600)
      return
    }

    isPlayerTurn.value = true
  }

  /** Check if this round is over */
  const checkRoundEnd = (playerActed: boolean) => {
    const pBet = playerBetRound.value
    const dBet = dealerBetRound.value
    // The bets match, or the party with the smaller bet is all-in (cannot add more)
    const settled = pBet === dBet || (pBet < dBet && playerAllIn.value) || (dBet < pBet && dealerAllIn.value)

    if (settled) {
      advanceStreet()
      return
    }

    // Still need the other party to act
    if (playerActed) {
      isPlayerTurn.value = false
      animating.value = true
      setTimeout(() => dealerTurn(), 800)
    } else {
      isPlayerTurn.value = true
      animating.value = false
    }
  }

  // === Player operations ===

  const doCheck = () => {
    sfxChipBet()
    addActionLog('You checked')
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doCall = () => {
    const amount = betFromPlayer(toCall.value)
    sfxChipBet()addActionLog(`You followed ${amount}`)
    checkRoundEnd(true)
  }

  const doRaise = (total: number) => {
    const needed = total - playerBetRound.value
    const amount = betFromPlayer(needed)
    sfxChipBet()
    addActionLog(`You add ${amount}`)
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doAllIn = () => {
    const amount = betFromPlayer(playerStack.value)
    sfxChipBet()
    addActionLog(`You go all-in ${amount}`)playerAllIn.value = true
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doFold = () => {
    sfxFoldCards()
    addActionLog('You fold')
    playerFolded.value = true
    collectBets()
    endHand('lost')
  }

  // === Banker AI ===

  const dealerTurn = () => {
    const decision = texasDealerAI(
      currentDealerHole.value,
      visibleCommunity.value,
      street.value,
      pot.value + playerBetRound.value + dealerBetRound.value,
      dealerStack.value,
      playerBetRound.value,
      dealerBetRound.value,
      playerAllIn.value,
      tier.blind
    )

    if (decision.action === 'fold') {
      sfxFoldCards()
      addActionLog('The dealer folds')
      dealerFolded.value = true
      collectBets()
      animating.value = false
      endHand('won')
      return
    }

    if (decision.action === 'check') {
      sfxChipBet()
      addActionLog('The dealer checks')
      animating.value = false
      checkRoundEnd(false)
      return
    }

    if (decision.action === 'call') {
      const callAmt = playerBetRound.value - dealerBetRound.value
      const amount = betFromDealer(callAmt)
      sfxChipBet()
      addActionLog(`The dealer calls ${amount}`)
      animating.value = false
      checkRoundEnd(false)
      return
    }

    if (decision.action === 'allin') {
      const amount = betFromDealer(dealerStack.value)
      sfxChipBet()
      addActionLog(`Dealer goes all-in ${amount}`)
      dealerAllIn.value = true
      animating.value = false
      if (dealerBetRound.value > playerBetRound.value && !playerAllIn.value) {
        isPlayerTurn.value = true
      } else {
        checkRoundEnd(false)
      }
      return
    }

    // raise
    const amount = betFromDealer(decision.amount)
    sfxChipBet()
    addActionLog(`Dealer raises ${amount}`)
    animating.value = false
    isPlayerTurn.value = true
  }

  // === Showdown ===

  const doShowdown = () => {
    street.value = 'showdown'
    showDealerCards.value = true
    sfxCardFlip()
    addActionLog('—— Showdown ——')

    const allCards = currentCommunity.value
    const pHand = evaluateBestHand([...currentPlayerHole.value, ...allCards])
    const dHand = evaluateBestHand([...currentDealerHole.value, ...allCards])
    playerHandResult.value = pHand
    dealerHandResult.value = dHand

    addActionLog(`you: ${pHand.label}`)
    addActionLog(`Dealer: ${dHand.label}`)

    const cmp = compareHands(pHand, dHand)const result = cmp > 0 ? 'won' : cmp === 0 ? 'draw' : 'lost'

    setTimeout(() => endHand(result), 800)
  }

  // === Single-hand settlement ===

  const endHand = (result: 'won' | 'draw' | 'lost') => {
    handOver.value = true
    if (dealerFolded.value || playerFolded.value) {
      showDealerCards.value = true
    }

    // Chip settlement: winner takes the pot
    if (result === 'won') {
      playerStack.value += pot.value
      sfxCasinoWin()
      addActionLog(`You won this hand! Get the pot ${pot.value}`)
    } else if (result === 'draw') {
      const half = Math.floor(pot.value / 2)
      playerStack.value += halfdealerStack.value += pot.value - half
      addActionLog(`Tie, pot split`)
    } else {
      dealerStack.value += pot.value
      sfxCasinoLose()
      addActionLog(`You lose this hand, the dealer gets the pot ${pot.value}`)
    }
    pot.value = 0
    handResult.value = result

    // Check whether all hands have been played, or the player chips + off-site funds are not enough to continue.
    const playerBroke = playerStack.value <= 0 && playerStore.money <= 0
    if (playerBroke || currentRound.value >= tier.rounds) {
      endSession()
    } else {
      // There are still lots left, automatically start the next hand
      setTimeout(() => startNextHand(), 1000)
    }
  }

  // === Start next move ===

  const startNextHand = () => {
    currentRound.value++
    const deal = dealTexas()
    currentPlayerHole.value = deal.playerHole
    currentDealerHole.value = deal.dealerHole
    currentCommunity.value = deal.community
    sfxCardFlip()

    // When the banker's chips are insufficient, the entrance fee will be added to the amount
    if (dealerStack.value < tier.blind * 2) {
      const refill = tier.entryFee - dealerStack.value
      dealerStack.value = tier.entryFee
      addActionLog(`Dealer replenishes chips ${refill}`)
    }

    // When the player's chips are insufficient, they will be replenished from off-site funds.
    if (playerStack.value < tier.blind * 2) {
      const needed = tier.entryFee - playerStack.value
      const canAfford = Math.min(needed, playerStore.money)
      if (canAfford > 0) {
        playerStore.spendMoney(canAfford)
        playerStack.value += canAfford
        totalInvested.value += canAfford
        addActionLog(`Add chips from off-site ${canAfford}`)
      }
    }

    //Reset one-handed status
    street.value = 'preflop'
    pot.value = 0
    playerBetRound.value = 0
    dealerBetRound.value = 0
    isPlayerTurn.value = true
    animating.value = false
    handOver.value = false
    handResult.value = null
    playerFolded.value = false
    dealerFolded.value = false
    playerAllIn.value = false
    dealerAllIn.value = false
    showDealerCards.value = false
    playerHandResult.value = null
    dealerHandResult.value = null

    // place blind bet
    betFromPlayer(tier.blind)
    betFromDealer(tier.blind)
    collectBets()addActionLog(`—— No. ${currentRound.value} hand ——`)
    addActionLog(`Both parties place blind bets ${tier.blind}`)
    addActionLog('—— Preflop——')
    isPlayerTurn.value = true
  }

  // === Settlement of the entire game ===

  const endSession = () => {
    sessionOver.value = true
    // netProfit: Final chips - initial admission fee - off-site replenishment (excluding rake, which has been deducted in the store)
    const net = playerStack.value - tier.entryFee - totalInvested.value
    const won = net > 0
    const draw = net === 0

    finalResult.value = { won, draw, netProfit: net }

    if (won) {
      addActionLog(`The game is over! You win! Net profit ${net}`)
    } else if (draw) {
      addActionLog(`End of session! No profit, no loss`)
    } else {
      addActionLog(`The game is over! You lost...Net loss ${Math.abs(net)}`)
    }
  }

  // === initialization ===

  onMounted(() => {
    betFromPlayer(tier.blind)
    betFromDealer(tier.blind)
    collectBets()
    addActionLog(`—— Hand 1 ——`)
    addActionLog(`Both parties place blind bets ${tier.blind}`)
    addActionLog('—— Preflop——')
    isPlayerTurn.value = true
  })
</script>

<style scoped>
  .poker-card {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;width: 2.5rem;
    height: 3rem;
    border: 1px solid rgba(200, 164, 92, 0.3);
    border-radius: 2px;
    font-weight: bold;
    transition: all 0.3s;
  }

  .poker-card-suit {
    position: absolute;
    top: 2px;
    left: 3px;
    font-size: 0.55rem;
    line-height: 1;
  }

  .poker-card-rank {
    font-size: 0.85rem;
    line-height: 1;
  }

  .poker-card-hidden {
    background: rgba(200, 164, 92, 0.08);
    color: var(--color-muted);
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }

  .poker-card-reveal {
    background: rgba(232, 228, 217, 0.08);
    color: rgb(var(--color-text));
    animation: poker-flip 0.4s ease;
  }

  .poker-card-red {
    color: var(--color-danger);
  }

  @keyframes poker-flip {
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
</style>