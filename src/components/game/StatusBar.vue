<template>
  <div class="border-b border-accent/30 pb-2 md:pb-3 flex flex-col space-y-1">
    <!-- First line: date, time, weather + copper coins -->
    <div class="flex items-center justify-between text-xs md:text-sm">
      <div class="flex items-center space-x-2 md:space-x-3">
        <span class="text-accent font-bold">Taoyuan Township</span>
        <span class="text-muted text-xs max-w-16 truncate">{{ playerStore.playerName }}</span>
        <span class="hidden md:inline">{{ gameStore.year }} year</span>
        <!-- Click on the date to open the calendar directly: Originally it could only be found in the hut, but many people didn't find it after a whole season -->
        <button class="text-text hover:text-accent transition-colors" title="View calendar" @click="showCalendar = true">
          {{ SEASON_NAMES[gameStore.season] }} day {{ gameStore.day }}
          <Calendar :size="11" class="inline text-accent/70" />
        </button>
        <span class="text-muted hidden md:inline">({{ gameStore.weekdayName }})</span>
        <span :class="{ 'text-danger': gameStore.isLateNight }">{{ gameStore.timeDisplay }}</span>
        <span class="text-muted">{{ WEATHER_NAMES[gameStore.weather] }}</span>
      </div>
      <span class="text-accent shrink-0">
        <Coins :size="12" class="inline" />
        {{ playerStore.money }} text
      </span>
    </div>

    <!-- Second line: status bar + audio control -->
    <div class="flex items-center justify-between text-xs flex-wrap">
      <div class="flex items-center space-x-2 md:space-x-4 flex-wrap">
        <!-- Physical strength -->
        <div class="flex items-center space-x-1">
          <span :class="{ 'text-danger stamina-critical': playerStore.isExhausted }">
            <Zap :size="12" class="inline" />
            {{ playerStore.stamina }}/{{ playerStore.maxStamina }}
          </span>
          <div class="w-14 md:w-20 h-2 bg-bg rounded-xs border border-accent/20">
            <div
              class="h-full rounded-xs transition-all duration-300"
              :class="staminaBarColor"
              :style="{ width: playerStore.staminaPercent + '%' }"
            />
          </div>
        </div>
        <!-- HP (displayed in the mine or when injured) -->
        <div v-if="showHpBar" class="flex items-center space-x-1">
          <span
            :class="{
              'text-danger stamina-critical': playerStore.getIsLowHp()
            }"
          >
            <Heart :size="12" class="inline" />
            {{ playerStore.hp }}/{{ playerStore.getMaxHp() }}
          </span>
          <div class="w-12 md:w-16 h-2 bg-bg rounded-xs border border-accent/20">
            <div
              class="h-full rounded-xs transition-all duration-300"
              :class="hpBarColor"
              :style="{ width: playerStore.getHpPercent() + '%' }"
            />
          </div>
        </div>
        <!-- Remaining time -->
        <div class="flex items-center space-x-1">
          <Clock :size="12" class="tinline" />
          <div class="w-12 md:w-16 h-2 bg-bg rounded-xs border border-accent/20">
            <div class="h-full rounded-xs transition-all duration-300" :class="timeBarColor" :style="{ width: timePercent + '%' }" /></div>
        </div>
      </div>
    </div>

    <CalendarModal :open="showCalendar" @close="showCalendar = false" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useGameStore, SEASON_NAMES, WEATHER_NAMES } from '@/stores/useGameStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { DAY_START_HOUR, DAY_END_HOUR } from '@/data/timeConstants'
  import { Zap, Heart, Clock, Coins, Calendar } from 'lucide-vue-next'
  import CalendarModal from '@/components/game/CalendarModal.vue'

  const gameStore = useGameStore()
  const playerStore = usePlayerStore()

  /** Calendar pop-up window */
  const showCalendar = ref(false)

  const staminaBarColor = computed(() => {
    const pct = playerStore.staminaPercent
    if (pct <= 12) return 'bg-danger stamina-critical'
    if (pct <= 35) return 'bg-danger'
    if (pct <= 60) return 'bg-accent'
    return 'bg-success'
  })

  /** Whether the HP bar is displayed: in the mine or the HP is not full */
  const showHpBar = computed(() => {
    return gameStore.currentLocationGroup === 'mine' || playerStore.hp < playerStore.getMaxHp()
  })

  const hpBarColor = computed(() => {
    const pct = playerStore.getHpPercent()
    if (pct <= 25) return 'bg-danger stamina-critical'
    if (pct <= 60) return 'bg-danger'
    return 'bg-success'
  })

  /** Remaining time percentage */
  const timePercent = computed(() => {
    const total = DAY_END_HOUR - DAY_START_HOUR // 20 hours
    const remaining = DAY_END_HOUR - gameStore.hour
    return Math.max(0, Math.round((remaining / total) * 100))
  })

  const timeBarColor = computed(() => {
    if (gameStore.isLateNight) return 'bg-danger'
    if (timePercent.value <= 25) return 'bg-danger'
    if (timePercent.value <= 50) return 'bg-accent'
    return 'bg-success'
  })
</script>

<style scoped>
  /* Stamina bar flashes */
  @keyframes staminaPulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }
  }

  .stamina-critical {
    animation: staminaPulse 1s ease-in-out infinite;
  }
</style>