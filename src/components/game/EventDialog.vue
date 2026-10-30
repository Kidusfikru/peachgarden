<template>
  <div class="fixed inset-0 bg-bg/90 flex items-center justify-center z-50 p-8">
    <div class="game-panel max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <h2 class="text-accent text-sm mb-4">{{ event.name }}</h2>
      <div class="space-y-2 mb-4">
        <p
          v-for="(line, i) in displayedLines"
          :key="i"
          class="text-xs leading-relaxed"
          :class="{ 'text-muted': i < displayedLines.length - 1 }"
        >
          {{ line }}
        </p>
      </div>
      <div class="flex justify-center">
        <Button v-if="!allLinesShown" class="w-full" @click="showNextLine">Continue</Button>
        <Button v-else class="w-full" @click="emit('close')">Close</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { SeasonEventDef } from '@/data/events'
  import { useGameStore } from '@/stores/useGameStore'
  import { useNpcStore } from '@/stores/useNpcStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { getNpcById } from '@/data/npcs'
  import Button from '@/components/game/Button.vue'

  const props = defineProps<{
    event: SeasonEventDef
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const gameStore = useGameStore()
  const npcStore = useNpcStore()
  const playerStore = usePlayerStore()

  /** Spouse name (empty if unmarried) */
  const spouseName = computed(() => {
    const spouse = npcStore.getSpouse()
    return spouse ? (getNpcById(spouse.npcId)?.name ?? '') : ''
  })

  /** If you are married and the festival provides a getting married version, use the getting married version copy instead */
  const narrative = computed(() => {
    if (spouseName.value && props.event.narrativeMarried) return props.event.narrativeMarried
    return props.event.narrative
  })

  /** Replace text placeholder */
  const fill = (line: string): string =>
    line
      .replace(/\{year\}/g, String(gameStore.year))
      .replace(/\{player\}/g, playerStore.playerName)
      .replace(/\{title\}/g, playerStore.honorific)
      .replace(/\{spouse\}/g, spouseName.value || 'family member')

  const lineIndex = ref(1)

  const displayedLines = computed(() => narrative.value.slice(0, lineIndex.value).map(fill))
  const allLinesShown = computed(() => lineIndex.value >= narrative.value.length)

  const showNextLine = () => {
    if (lineIndex.value < narrative.value.length) {
      lineIndex.value++
    }
  }
</script>