<template>
  <div class="game-panel max-w-xs w-full">
    <Divider title class="!mb-1" label="Devil's Roulette" />

    <!-- Magazine information -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted">Magazine</span>
        <span>
          <span v-for="i in liveRemaining" :key="'l' + i" class="text-danger">•</span>
          <span v-for="i in blankRemaining" :key="'b' + i" class="text-muted">•</span>
          <span class="text-muted ml-1">({{ liveRemaining }} real {{ blankRemaining }} empty)</span>
        </span>
      </div>
      <div class="flex items-center justify-between text-xs mt-0.5">
        <span class="text-muted">Progress</span>
        <span>No. {{ shellIndex + 1 }} / Total {{ shells.length }}</span>
      </div>
    </div>

    <!-- HP display -->
    <div class="flex items-center space-x-3 mb-3">
      <!-- Player HP -->
      <div class="flex-1">
        <div class="flex items-center justify-between text-xs mb-0.5">
          <span :class="isPlayerTurn && !gameOver ? 'text-accent' : 'text-muted'">You</span>
          <span class="text-text">{{ playerHP }}/{{ maxPlayerHP }}</span>
        </div>
        <div class="h-1.5 bg-panel rounded-full overflow-hidden" :class="{ 'buckshot-flash-red': playerHit }">
          <div
            class="h-full transition-all duration-300"
            :class="playerHP > 2 ? 'bg-success' : playerHP > 1 ? 'bg-accent' : 'bg-danger'"
            :style="{ width: (playerHP / maxPlayerHP) * 100 + '%' }"
          />
        </div>
      </div>

      <span class="text-xs text-muted/40">VS</span>

      <!-- Banker HP -->
      <div class="flex-1">
        <div class="flex items-center justify-between text-xs mb-0.5">
          <span :class="!isPlayerTurn && !gameOver ? 'text-danger' : 'text-muted'">Banker</span>
          <span class="text-text">{{ dealerHP }}/{{ maxDealerHP }}</span>
        </div>
        <div class="h-1.5 bg-panel rounded-full overflow-hidden" :class="{ 'buckshot-flash-red': dealerHit }">
          <div
            class="h-full transition-all duration-300"
            :class="dealerHP > 2 ? 'bg-success' : dealerHP > 1 ? 'bg-accent' : 'bg-danger'"
            :style="{ width: (dealerHP / maxDealerHP) * 100 + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Operation button -->
    <div v-if="isPlayerTurn && !gameOver" class="flex space-x-2 mb-3">
      <Button class="flex-1 justify-center" :disabled="animating" @click="shootOpponent">Shoot to the dealer</Button>
      <Button class="flex-1 justify-center" :disabled="animating" @click="shootSelf">Shoot yourself</Button>
    </div>

    <!-- Dealer round prompt -->
    <p v-if="!isPlayerTurn && !gameOver" class="text-xs text-muted/40 text-center mb-3">The banker is thinking...</p>

    <!-- Action log --><div v-if="actionLog.length > 0" class="border border-accent/10 rounded-xs p-2 mb-3 max-h-24 overflow-y-auto">
      <p
        v-for="(log, i) in actionLog"
        :key="i"
        class="text-[10px] leading-relaxed":class="i === actionLog.length - 1 ? 'text-text' : 'text-muted/60'"
      >
        {{ log }}
      </p>
    </div>

    <!-- Result -->
    <template v-if="gameOver">
      <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
        <p class="text-sm" :class="won ? 'text-success' : draw ? 'text-accent' : 'text-danger'">
          {{ won ? 'You won! ' : draw ? 'Draw' : 'You lost...' }}
        </p>
        <p class="text-xs mt-0.5" :class="won ? 'text-success' : draw ? 'text-accent' : 'text-danger'">
          {{
            won
              ? '+' + BUCKSHOT_BET_AMOUNT * BUCKSHOT_WIN_MULTIPLIER + '文'
              : draw
                ? 'refund' + BUCKSHOT_BET_AMOUNT + 'text'
                : '-' + BUCKSHOT_BET_AMOUNT + '文'
          }}
        </p>
      </div>
      <Button class="w-full justify-center" @click="emit('complete', won, draw)">OK</Button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, onMounted } from 'vue'
  import { BUCKSHOT_BET_AMOUNT, BUCKSHOT_WIN_MULTIPLIER, dealerDecide } from '@/data/hanhai'
  import { sfxGunshot, sfxGunEmpty, sfxCasinoWin, sfxCasinoLose } from '@/composables/useAudio'
  import type { BuckshotSetup, ShellType } from '@/types'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'

  const props = defineProps<{ setup: BuckshotSetup }>()
  const emit = defineEmits<{ complete: [won: boolean, draw: boolean] }>()

  // game state
  const shells = ref<ShellType[]>([...props.setup.shells])
  const shellIndex = ref(0)
  const playerHP = ref(props.setup.playerHP)
  const dealerHP = ref(props.setup.dealerHP)
  const maxPlayerHP = props.setup.playerHP
  const maxDealerHP = props.setup.dealerHP
  const playerFirst = Math.random() < 0.5
  const isPlayerTurn = ref(playerFirst)
  const gameOver = ref(false)
  const won = ref(false)
  const draw = ref(false)
  const actionLog = ref<string[]>([])
  const animating = ref(false)

  // hit animation
  const playerHit = ref(false)
  const dealerHit = ref(false)

  const liveRemaining = computed(() => {
    let count = 0
    for (let i = shellIndex.value; i < shells.value.length; i++) {
      if (shells.value[i] === 'live') count++
    }
    return count
  })

  const blankRemaining = computed(() => {
    let count = 0
    for (let i = shellIndex.value; i < shells.value.length; i++) {
      if (shells.value[i] === 'blank') count++
    }
    return count
  })

  const addActionLog = (msg: string) => {
    actionLog.value.push(msg)
  }

  const triggerHitAnim = (target: 'player' | 'dealer') => {
    if (target === 'player') {
      playerHit.value = true
      setTimeout(() => {
        playerHit.value = false
      }, 400)
    } else {dealerHit.value = true
      setTimeout(() => {
        dealerHit.value = false
      }, 400)
    }
  }

  const getCurrentShell = (): ShellType | null => {
    if (shellIndex.value >= shells.value.length) return nullreturn shells.value[shellIndex.value]!
  }

  const consumeShell = () => {
    shellIndex.value++
  }

  const checkGameEnd = () => {
    if (playerHP.value <= 0) {
      gameOver.value = true
      won.value = false
      sfxCasinoLose()
      addActionLog('You fell...')
      return true
    }
    if (dealerHP.value <= 0) {
      gameOver.value = true
      won.value = true
      sfxCasinoWin()
      addActionLog('The dealer has fallen!')
      return true
    }
    if (shellIndex.value >= shells.value.length) {
      // Ammo is used up, compare remaining HP
      if (playerHP.value > dealerHP.value) {
        gameOver.value = true
        won.value = true
        sfxCasinoWin()
        addActionLog('Ammo is out, your health is higher - you win!')
      } else if (playerHP.value < dealerHP.value) {
        gameOver.value = true
        won.value = false
        sfxCasinoLose()
        addActionLog('The ammunition is exhausted, the dealer's health is higher - you lose...')
      } else {
        //Die, refund the bet
        gameOver.value = true
        draw.value = true
        addActionLog('Out of ammunition, same health - draw!')
      }
      return true
    }
    return false
  }

  const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  /** Players shoot each other */
  const shootOpponent = async () => {
    if (animating.value || gameOver.value) return
    animating.value = true
    const shell = getCurrentShell()
    consumeShell()

    if (shell === 'live') {
      sfxGunshot()
      dealerHP.value = Math.max(0, dealerHP.value - 1)
      triggerHitAnim('dealer')
      addActionLog('You shoot at the dealer - live ammunition! The dealer -1HP')
    } else {
      sfxGunEmpty()
      addActionLog('You shoot at the dealer - empty bullet, miss.')
    }

    await nextTick()

    if (!checkGameEnd()) {
      isPlayerTurn.value = false
      await delay(800)
      animating.value = false
      void dealerTurn()
    } else {
      animating.value = false
    }
  }

  /** Player shoots himself */
  const shootSelf = async () => {
    if (animating.value || gameOver.value) return
    animating.value = true
    const shell = getCurrentShell()
    consumeShell()

    if (shell === 'blank') {
      sfxGunEmpty()
      addActionLog('You shoot yourself - blank! Get extra turns.')
      // Extra rounds, no switching
      await delay(400)
      animating.value = false
      if (checkGameEnd()) return
    } else {
      sfxGunshot()
      playerHP.value = Math.max(0, playerHP.value - 1)
      triggerHitAnim('player')
      addActionLog('You shoot yourself - live ammunition! You -1HP')
      await nextTick()

      if (!checkGameEnd()) {
        isPlayerTurn.value = false
        await delay(800)animating.value = false
        void dealerTurn()
      } else {
        animating.value = false
      }
    }
  }

  /** Banker’s round */
  const dealerTurn = async () => {
    if (gameOver.value) return
    animating.value = true

    await delay(800)

    if (shellIndex.value >= shells.value.length) {
      checkGameEnd()
      animating.value = false
      return
    }

    const decision = dealerDecide(shells.value, shellIndex.value, false)
    const shell = getCurrentShell()
    consumeShell()

    if (decision === 'opponent') {
      //shoot playerif (shell === 'live') {
        sfxGunshot()
        playerHP.value = Math.max(0, playerHP.value - 1)
        triggerHitAnim('player')
        addActionLog('The dealer shoots at you - live ammunition! You -1HP')
      } else {
        sfxGunEmpty()
        addActionLog('The dealer shoots at you - empty bullet, missed.')
      }
      await nextTick()

      if (!checkGameEnd()) {
        isPlayerTurn.value = true
        animating.value = false
      } else {
        animating.value = false
      }
    } else {
      // shoot yourself
      if (shell === 'blank') {
        sfxGunEmpty()
        addActionLog('The dealer shoots himself - empty bullet! The dealer gets an extra round.')
        await delay(600)
        if (!checkGameEnd()) {
          await dealerTurn()
        } else {
          animating.value = false
        }
      } else {
        sfxGunshot()
        dealerHP.value = Math.max(0, dealerHP.value - 1)
        triggerHitAnim('dealer')
        addActionLog('The dealer shoots himself - live ammunition! The dealer -1HP')
        await nextTick()

        if (!checkGameEnd()) {
          isPlayerTurn.value = true
          animating.value = false
        } else {
          animating.value = false
        }
      }
    }
  }

  onMounted(() => {
    if (playerFirst) {
      addActionLog('You go first.')
    } else {
      addActionLog('The dealer moves first.')
      void dealerTurn()
    }
  })
</script>

<style scoped>
  .buckshot-flash-red {
    animation: buckshot-hit 0.3s ease-in-out;
  }

  @keyframes buckshot-hit {
    0%,
    100% {
      background-color: rgb(var(--color-panel));
    }
    50% {
      background-color: rgba(195, 64, 67, 0.4);
    }
  }
</style>