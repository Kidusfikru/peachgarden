<template>
  <RouterView />
  <!-- APK exit confirmation pop-up -->
  <Transition name="panel-fade">
    <div
      v-if="showExitConfirm"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      @click.self="showExitConfirm = false"
    >
      <div class="game-panel max-w-xs w-full text-center">
        <p class="text-sm text-accent mb-3">Are you sure you want to exit the game? </p>
        <p class="text-xs text-muted mb-4">Unsaved progress will be lost. </p>
        <div class="flex justify-center space-x-3">
          <button class="btn" @click="showExitConfirm = false">Cancel</button>
          <button class="btn btn-danger" @click="exitApp">Exit</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import {Capacitor} from '@capacitor/core'
  import {App as CapApp} from '@capacitor/app'
  import { useGameStore, SEASON_NAMES } from '@/stores/useGameStore'
  import { _registerDayLabelGetter } from '@/composables/useGameLog'

  const showExitConfirm = ref(false)

  // The number of days label of the log: registered at startup, the log written in the main menu (new game, file loading) also has a date
  const gameStore = useGameStore()
  _registerDayLabelGetter(() => `${gameStore.year} year ${SEASON_NAMES[gameStore.season]} day ${gameStore.day}`)

  const exitApp = () => {
    CapApp.exitApp()
  }

  onMounted(() => {
    if (!import.meta.env.DEV) {
      document.body.classList.add('select-none')
    }

    // Capacitor Android return key interception
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', () => {
        if (showExitConfirm.value) {
          showExitConfirm.value = false
        } else {
          showExitConfirm.value = true
        }
      })
    }
  })
</script>