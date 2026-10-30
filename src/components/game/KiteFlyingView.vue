<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Wind :size="14" />
      <span>Autumn Kite Festival</span>
    </h3>

    <!-- Preparation -->
    <div v-if="phase === 'ready'">
      <p class="text-xs text-muted mb-3">
        Flying a kite in the autumn wind! The wind will continue to blow the kite to both sides. Click "Pull Left" or "Pull Right" to bring the kite back to the center. Keep the kite in the green zone to score points for 25 seconds!
      </p>
      <Button class="w-full" @click="startGame">Fly a kite! </Button>
    </div>

    <!-- In game -->
    <div v-else-if="phase === 'playing'">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs text-muted">
          Remaining:
          <span class="text-accent">{{ timeLeft }}</span>
          seconds
        </p>
        <p class="text-xs text-muted">
          Score:
          <span class="text-accent">{{ score }}</span>
        </p>
      </div>

      <!-- Wind direction reminder -->
      <div class="text-center mb-2">
        <p class="text-xs" :class="windDirection > 0 ? 'text-success' : 'text-danger'">
          {{ windDirection > 0 ? '→ east wind →' : '← west wind ←' }}
          {{ windLabel }}
        </p>
      </div>

      <!-- Kite position bar -->
      <div class="relative h-10 bg-bg border border-accent/20 mb-3">
        <!-- Safe area (middle 36%) -->
        <div class="absolute top-0 bottom-0 left-[32%] w-[36%] bg-success/10 border-x border-success/30" />
        <!-- Centerline -->
        <div class="absolute top-0 bottom-0 left-1/2 w-px bg-accent/20" />
        <!-- Kite -->
        <div
          class="absolute top-1 bottom-1 flex items-center justify-center"
          :style="{ left: `calc(${kitePosition}% - 10px)`, transition: 'none' }"
        >
          <span class="text-lg" :class="inSafeZone ? 'kite-float' : 'kite-shake'">🪁</span>
        </div>
        <!-- Region label -->
        <div class="absolute bottom-0 w-full flex text-center" style="font-size: 9px">
          <span class="flex-32 text-danger/40">Danger</span>
          <span class="flex-36 text-success/40">Security</span>
          <span class="flex-32 text-danger/40">Danger</span>
        </div>
      </div>

      <!-- Control buttons -->
      <div class="flex space-x-2">
        <Button class="flex-1 py-2" :icon="ArrowLeft" @click="pullLeft">Pull left</Button>
        <Button class="flex-1 py-2" @click="pullRight">
          Pull right
          <ArrowRight :size="14" />
        </Button>
      </div>

      <!-- Tips for continuous and stable extra points -->
      <div v-if="combo >= 3" class="text-center mt-2">
        <p class="text-xs text-accent combo-pulse">Stable flight ×{{ combo }}</p>
      </div>
    </div>

    <!-- Result -->
    <div v-else>
      <p class="text-xs text-muted mb-2">The kite will end! </p>

      <div class="border border-accent/20 p-2 mb-3 text-center">
        <p
          class="text-sm mb-2"
          :class="{
            'text-accent': score >= 200,
            'text-success': score >= 120 && score < 200,
            'text-muted': score < 120
          }"
        >
          {{ score >= 200 ? 'Master of wind control! The kite is as stable as a rock! ' : score >= 120 ? 'Good skills, the kite flies very high. ' : 'The wind is too strong. Let's try our best next time. ' }}
        </p><p class="text-xs text-muted mb-1">The longest continuous stability: {{ maxCombo }} times</p>
        <p class="text-xs mb-1">
          Total score:
          <span class="text-accent">{{ score }}</span>
        </p>
        <p class="text-xs">
          Bonus:
          <span class="text-accent">{{ prize }}</span>
          text
        </p>
      </div>
      <Button class="w-full" @click="handleClaim">Claim rewards</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue'
  import { Wind, ArrowLeft, ArrowRight } from 'lucide-vue-next'
  import {
    sfxGameStart,
    sfxRewardClaim,
    sfxCountdownTick,
    sfxCountdownFinal,
    sfxKitePull,
    sfxWindGust,
    sfxRankFirst,
    sfxRankSecond,
    sfxRankThird
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{ complete: [prize: number] }>()

  type Phase = 'ready' | 'playing' | 'finished'

  const phase = ref<Phase>('ready')
  const score = ref(0)
  const kitePosition = ref(50) // 0-100, 50=center
  const timeLeft = ref(25)
  const windDirection = ref(1) // 1=right, -1=left
  const windStrength = ref(1)
  const combo = ref(0)
  const maxCombo = ref(0)
  const windLabel = ref('Breeze')

  /** Kite speed (unit: %/second), positive = right, negative = left */
  let kiteVelocity = 0
  let rafId: number | null = null
  let lastFrameTime = 0
  let scoreTick = 0 // Accumulated safe zone time (seconds), score every 0.5 seconds
  let countdownTimer: ReturnType<typeof setInterval> | null = null
  let windChangeTimer: ReturnType<typeof setTimeout> | null = null

  const inSafeZone = computed(() => kitePosition.value >= 32 && kitePosition.value <= 68)

  const prize = computed(() => {
    if (score.value >= 200) return 800
    if (score.value >= 120) return 500
    if (score.value >= 60) return 200
    return 50
  })

  /** requestAnimationFrame main loop */
  const gameLoop = (timestamp: number) => {
    if (phase.value !== 'playing') return

    const dt = lastFrameTime === 0 ? 0.016 : Math.min((timestamp - lastFrameTime) / 1000, 0.05)
    lastFrameTime = timestamp

    // Wind force as continuous acceleration (unit: %/second²)
    const windAccel = windDirection.value * windStrength.value * 22
    kiteVelocity += windAccel * dt

    // Random gust: Sudden extra impulse, making the kite unpredictable
    if (Math.random() < dt * 1.5) {
      const gustForce = (Math.random() - 0.4) * windStrength.value * 18
      kiteVelocity += gustForce
    }

    // Damping: the speed naturally decays so that the kite will not accelerate infinitely
    kiteVelocity *= Math.pow(0.95, dt * 60)

    // update location
    kitePosition.value += kiteVelocity * dt
    //Boundary bounce
    if (kitePosition.value <= 0) {
      kitePosition.value = 0
      kiteVelocity = Math.abs(kiteVelocity) * 0.3
    } else if (kitePosition.value >= 100) {
      kitePosition.value = 100
      kiteVelocity = -Math.abs(kiteVelocity) * 0.3
    }

    // Score within the safe zone
    if (inSafeZone.value) {
      combo.value++
      if (combo.value > maxCombo.value) maxCombo.value = combo.value
      scoreTick += dt
      if (scoreTick >= 0.5) {
        scoreTick -= 0.5
        const comboBonus = Math.min(Math.floor(combo.value / 60), 2)score.value += 1 + comboBonus
      }
    } else {
      combo.value = 0
      scoreTick = 0
    }

    rafId = requestAnimationFrame(gameLoop)
  }

  const startGame = () => {
    sfxGameStart()
    score.value = 0
    kitePosition.value = 50
    kiteVelocity = 0
    timeLeft.value = 25
    windDirection.value = Math.random() > 0.5 ? 1 : -1
    windStrength.value = 1.0
    windLabel.value = 'Breeze'
    combo.value = 0
    maxCombo.value = 0
    scoreTick = 0
    lastFrameTime = 0
    phase.value = 'playing'

    //Start RAF main loop
    rafId = requestAnimationFrame(gameLoop)

    // countdown
    countdownTimer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 3 && timeLeft.value > 0) sfxCountdownFinal()
      else if (timeLeft.value > 3) sfxCountdownTick()
      if (timeLeft.value <= 0) {
        endGame()
      }
    }, 1000)

    // Wind direction/wind force changes
    scheduleWindChange()
  }

  const scheduleWindChange = () => {
    const delay = 2000 + Math.random() * 1500
    windChangeTimer = setTimeout(() => {
      if (phase.value !== 'playing') return

      // Possibly change direction (change direction more frequently later)
      const elapsed = 25 - timeLeft.value
      const flipChance = 0.35 + elapsed * 0.01
      if (Math.random() < flipChance) {
        windDirection.value *= -1
        sfxWindGust()
      }

      // Wind force changes and increases over time
      const minStrength = 1.0 + elapsed * 0.1
      const maxStrength = 2.0 + elapsed * 0.15
      windStrength.value = minStrength + Math.random() * (maxStrength - minStrength)

      if (windStrength.value < 2) windLabel.value = 'Breeze'
      else if (windStrength.value < 3.5) windLabel.value = 'Qingfeng'
      else windLabel.value = 'Strong wind'

      scheduleWindChange()
    }, delay) as unknown as ReturnType<typeof setTimeout>
  }

  /** Pull left: apply an impulse to the left */
  const pullLeft = () => {
    if (phase.value !== 'playing') return
    sfxKitePull()
    kiteVelocity -= 42
  }

  /** Pull right: apply an impulse to the right */
  const pullRight = () => {
    if (phase.value !== 'playing') return
    sfxKitePull()
    kiteVelocity += 42
  }

  const endGame = () => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    if (countdownTimer) clearInterval(countdownTimer)
    if (windChangeTimer) clearTimeout(windChangeTimer)
    rafId = null
    countdownTimer = null
    windChangeTimer = null
    phase.value = 'finished'

    // Settlement sound effect
    if (score.value >= 200) sfxRankFirst()
    else if (score.value >= 120) sfxRankSecond()
    else sfxRankThird()
  }

  const handleClaim = () => {
    sfxRewardClaim()
    emit('complete', prize.value)
  }

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    if (countdownTimer) clearInterval(countdownTimer)
    if (windChangeTimer) clearTimeout(windChangeTimer)
  })
</script>

<style scoped>
  .kite-float {
    animation: kite-float 2s ease-in-out infinite;
  }

  @keyframes kite-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  .kite-shake {animation: kite-shake 0.3s ease-in-out infinite;
  }

  @keyframes kite-shake {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-8deg);
    }
    75% {
      transform: rotate(8deg);
    }
  }

  .combo-pulse {
    animation: combo-pulse 0.8s ease-in-out infinite;
  }

  @keyframes combo-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
</style>