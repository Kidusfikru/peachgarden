<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Ship :size="14" />
      <span>Dragon Boat Races</span>
    </h3>

    <!-- Preparation phase -->
    <div v-if="phase === 'ready'">
      <p class="text-xs text-muted mb-3">Three dragon boats are ready to go! Click the "Paddle" button like crazy to make the dragon boat move forward and see who can row the farthest in 10 seconds! </p>
      <Button class="w-full" @click="startCountdown">Start the game! </Button>
    </div>

    <!-- Countdown -->
    <div v-else-if="phase === 'countdown'" class="text-center py-6">
      <p class="text-xs text-muted mb-3">Preparation——</p>
      <div class="countdown-num text-accent text-2xl">{{ countdownNum }}</div>
    </div>

    <!-- In competition -->
    <div v-else-if="phase === 'racing'">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs text-muted">
          <Timer :size="12" class="inline -mt-0.5" />
          remaining time
        </p>
        <p class="text-sm font-bold" :class="timeLeft <= 3 ? 'text-danger time-pulse' : 'text-accent'">{{ timeLeft }}s</p>
      </div>

      <!-- Track -->
      <div class="border border-accent/20 p-2 mb-3">
        <div v-for="(boat, i) in boats" :key="i" class="mb-2 last:mb-0">
          <div class="flex items-center space-x-2 mb-0.5">
            <span class="text-xs w-14" :class="boatColor(i)">
              {{ boat.name }}
            </span>
            <span class="text-xs text-muted flex-1 text-right">{{ boat.progress }}m</span>
          </div>
          <!-- Track Strip -->
          <div class="h-5 bg-bg border relative overflow-hidden" :class="i === 0 ? 'border-accent/40' : 'border-accent/15'">
            <!-- finish line -->
            <div class="absolute top-0 bottom-0 right-0 w-px border-r border-dashed border-accent/30" />
            <!-- Progress -->
            <div
              class="h-full transition-all duration-100 flex items-center justify-end pr-0.5"
              :class="boatTrackClass(i)"
              :style="{
                width: `${Math.min(100, (boat.progress / raceGoal) * 100)}%`
              }"
            >
              <Ship :size="12" class="relative z-10" :class="{ 'boat-rock': i === 0 && rowing }" />
            </div>
            <!-- Water ripples -->
            <div class="wave-bg absolute inset-0 pointer-events-none opacity-15" />
          </div>
        </div>
      </div>

      <!-- Paddle button + click count -->
      <div class="flex items-center space-x-2">
        <Button class="flex-1 py-3 text-sm active:!bg-accent active:!text-bg paddle-btn" :icon="Zap" @click="paddle">Paddle! </Button>
        <div class="text-center min-w-12">
          <p class="text-accent text-sm font-bold">{{ clickCount }}</p>
          <p class="text-xs text-muted leading-none">times</p>
        </div>
      </div>
    </div>

    <!-- End -->
    <div v-else>
      <p class="text-xs text-muted mb-2">The game is over! Final ranking:</p>

      <div class="border border-accent/20 mb-3">
        <div
          v-for="(entry, i) in rankings"
          :key="entry.name"class="flex items-center justify-between text-xs px-2 py-1.5 border-b border-accent/10 last:border-0"
          :class="{ 'bg-accent/5': entry.name === 'you' }"
        >
          <div class="flex items-center space-x-2">
            <span class="w-5 flex justify-center" :class="rankColor(i)">
              <Trophy v-if="i === 0" :size="12" />
              <Medal v-else-if="i === 1" :size="12" />
              <Award v-else :size="12" />
            </span>
            <span :class="{ 'text-accent': entry.name === 'you' }">{{ entry.name }}</span>
          </div>
          <span class="text-muted">{{ entry.progress }}m</span>
        </div>
      </div>

      <div class="border border-accent/20 p-2 mb-3 text-center">
        <span v-if="playerRank === 1" class="text-accent text-xs finish-flash">Congratulations on winning the championship! Bonus 800 Wen</span>
        <span v-else-if="playerRank === 2" class="text-success text-xs">You won second place! Bonus 400 Wen</span>
        <span v-else class="text-muted text-xs">Won the third place. Bonus 200 Wen</span>
      </div>

      <Button class="w-full" @click="handleClaim">Claim rewards</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue'
  import { Ship, Zap, Timer, Trophy, Medal, Award } from 'lucide-vue-next'
  import {
    sfxGameStart,
    sfxRewardClaim,
    sfxCountdownTick,
    sfxCountdownFinal,
    sfxPaddle,
    sfxRankFirst,
    sfxRankSecond,
    sfxRankThird
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{ complete: [prize: number] }>()

  type Phase = 'ready' | 'countdown' | 'racing' | 'finished'
  const phase = ref<Phase>('ready')

  const raceGoal = 100
  const raceDuration = 10

  interface Boat {
    name: string
    Progress: number
  }

  const boats = ref<Boat[]>([
    { name: 'you', progress: 0 },
    { name: 'Ashi Team', progress: 0 },
    { name: 'Xiaomanqiu', progress: 0 }
  ])

  const timeLeft = ref(raceDuration)
  const rowing = ref(false)
  const rankings = ref<Boat[]>([])
  const countdownNum = ref(3)
  const clickCount = ref(0)

  let raceTimer: ReturnType<typeof setInterval> | null = null
  let countdownTimer: ReturnType<typeof setInterval> | null = null
  let rowingTimeout: ReturnType<typeof setTimeout> | null = null
  let cdTimeout: ReturnType<typeof setTimeout> | null = null

  const playerRank = computed(() => {
    const idx = rankings.value.findIndex(b => b.name === 'you')
    return idx === -1 ? 3 : idx + 1
  })

  const boatColor = (i: number) => {
    if (i === 0) return 'text-accent'
    if (i === 1) return 'text-danger'
    return 'text-success'
  }

  const boatTrackClass = (i: number) => {
    if (i === 0) return 'bg-accent/50'
    if (i === 1) return 'bg-danger/30'
    return 'bg-success/30'
  }

  const rankColor = (i: number) => {
    if (i === 0) return 'text-accent'
    if (i === 1) return 'text-success'
    return 'text-muted'
  }

  const startCountdown = () => {
    sfxGameStart()
    phase.value = 'countdown'countdownNum.value = 3

    const tick = () => {
      if (countdownNum.value <= 1) {
        startRace()
        return
      }
      sfxCountdownTick()
      countdownNum.value--
      cdTimeout = setTimeout(tick, 800)
    }
    cdTimeout = setTimeout(tick, 800)
  }

  const startRace = () => {
    phase.value = 'racing'
    timeLeft.value = raceDuration
    clickCount.value = 0

    // NPC rows automatically
    raceTimer = setInterval(() => {
      boats.value[1]!.progress += Math.floor(Math.random() * 4) + 2
      boats.value[2]!.progress += Math.floor(Math.random() * 4) + 2
    }, 500)

    // countdown
    countdownTimer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 3 && timeLeft.value > 0) sfxCountdownFinal()
      else if (timeLeft.value > 3) sfxCountdownTick()
      if (timeLeft.value <= 0) {
        endRace()
      }
    }, 1000)
  }

  const paddle = () => {
    if (phase.value !== 'racing') return
    sfxPaddle()
    boats.value[0]!.progress += 3
    clickCount.value++
    rowing.value = true
    if (rowingTimeout) clearTimeout(rowingTimeout)
    rowingTimeout = setTimeout(() => {
      rowing.value = false
    }, 150)
  }

  const endRace = () => {
    if (raceTimer) clearInterval(raceTimer)
    if (countdownTimer) clearInterval(countdownTimer)
    raceTimer = null
    countdownTimer = null

    const sorted = [...boats.value].sort((a, b) => b.progress - a.progress)
    rankings.value = sorted
    phase.value = 'finished'

    // Play sound effects by ranking
    const rank = rankings.value.findIndex(b => b.name === 'you') + 1
    if (rank === 1) sfxRankFirst()
    else if (rank === 2) sfxRankSecond()
    else sfxRankThird()
  }

  const handleClaim = () => {
    sfxRewardClaim()
    const prizes: Record<number, number> = { 1: 800, 2: 400, 3: 200 }
    emit('complete', prizes[playerRank.value] ?? 200)
  }

  onUnmounted(() => {
    if (raceTimer) clearInterval(raceTimer)
    if (countdownTimer) clearInterval(countdownTimer)
    if (rowingTimeout) clearTimeout(rowingTimeout)
    if (cdTimeout) clearTimeout(cdTimeout)
  })
</script>

<style scoped>
  .countdown-num {
    animation: countdown-pop 0.8s ease-out;
  }

  @keyframes countdown-pop {
    0% {
      transform: scale(2);
      opacity: 0;
    }
    30% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .time-pulse {
    animation: time-pulse 0.5s ease-in-out infinite;
  }

  @keyframes time-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .boat-rock {
    animation: boat-rock 0.15s ease-in-out;
  }

  @keyframes boat-rock {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-2px) rotate(-5deg);
    }
    75% {
      transform: translateY(1px) rotate(3deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  .wave-bg {background: repeating-linear-gradient(90deg, transparent, transparent 8px, var(--color-accent) 8px, var(--color-accent) 9px);
    animation: wave 2s linear infinite;
  }

  @keyframes wave {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-18px);
    }
  }

  .paddle-btn:active {
    transform: scale(0.95);
  }

  .finish-flash {
    animation: finish-flash 0.6s ease-in-out 3;
  }

  @keyframes finish-flash {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>