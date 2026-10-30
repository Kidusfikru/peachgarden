<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="game-panel max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <h3 class="text-accent text-sm mb-3">{{ event.title }}</h3>

      <!-- Played scene -->
      <div v-for="(scene, i) in playedScenes" :key="i" class="mb-3">
        <p class="text-xs leading-relaxed">{{ r(scene.text) }}</p>
        <p v-if="scene.chosenResponse" class="text-xs text-accent mt-1 ml-2">→ {{ r(scene.chosenResponse) }}</p>
      </div>

      <!-- Current scene -->
      <div v-if="currentScene">
        <p class="text-xs leading-relaxed mb-3">{{ r(currentScene.text) }}</p>

        <!-- Selection -->
        <div v-if="currentScene.choices && !hasChosen" class="space-y-2 mt-3">
          <Button v-for="(choice, ci) in currentScene.choices" :key="ci" class="w-full text-left" @click="handleChoice(choice)">
            {{ r(choice.text) }}
          </Button>
        </div>

        <!-- Response after selection -->
        <p v-if="choiceResponse" class="text-xs text-accent mt-2 ml-2">→ {{ r(choiceResponse) }}</p>

        <!-- Continue button (without selection or after selection) -->
        <Button v-if="!currentScene.choices || hasChosen" class="mt-3" @click="nextScene">
          {{ isLastScene ? 'End' : 'Continue' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { HeartEventDef, HeartEventScene } from '@/types'
  import Button from '@/components/game/Button.vue'
  import { usePlayerStore } from '@/stores/usePlayerStore'

  const props = defineProps<{
    event: HeartEventDef
  }>()

  const emit = defineEmits<{
    close: [friendshipChanges: { npcId: string; amount: number }[]]
  }>()

  const playerStore = usePlayerStore()

  /** Replace {player} / {title} placeholders in the conversation */
  const r = (text: string): string => text.replace(/\{player\}/g, playerStore.playerName).replace(/\{title\}/g, playerStore.honorific)

  const currentIndex = ref(0)
  const playedScenes = ref<{ text: string; chosenResponse?: string }[]>([])
  const hasChosen = ref(false)
  const choiceResponse = ref<string | null>(null)
  const friendshipChanges = ref<{ npcId: string; amount: number }[]>([])

  const currentScene = computed<HeartEventScene | null>(() => {
    return props.event.scenes[currentIndex.value] ?? null
  })

  const isLastScene = computed(() => {
    return currentIndex.value >= props.event.scenes.length - 1
  })

  const handleChoice = (choice: { text: string; friendshipChange: number; response: string }) => {
    hasChosen.value = true
    choiceResponse.value = choice.response
    if (choice.friendshipChange !== 0) {
      friendshipChanges.value.push({
        npcId: props.event.npcId,
        amount: choice.friendshipChange
      })
    }
  }

  const nextScene = () => {
    //Archive the current scene
    playedScenes.value.push({
      text: currentScene.value?.text ?? '',
      chosenResponse: choiceResponse.value ?? undefined
    })

    if (isLastScene.value) {emit('close', friendshipChanges.value)
      return
    }

    currentIndex.value++
    hasChosen.value = false
    choiceResponse.value = null
  }
</script>