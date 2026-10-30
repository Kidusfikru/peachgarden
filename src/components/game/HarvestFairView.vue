<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Wheat :size="14" />
      <span>Agricultural Exhibition</span>
    </h3>

    <!-- Exhibit selection stage -->
    <div v-if="!submitted">
      <p class="text-xs text-muted mb-3">
        Choose from the most backpacks
        <span class="text-accent">5</span>
        exhibits. The higher the quality and value of the item, the more points it will score!
      </p>

      <!-- Selected exhibits -->
      <div class="mb-3">
        <p class="text-xs text-muted mb-1">Selected exhibits ({{ selectedItems.length }} / 5):</p>
        <div v-if="selectedItems.length === 0" class="flex flex-col items-center py-4 text-muted">
          <Package :size="28" class="mb-1.5 opacity-40" />
          <p class="text-xs">No items have been selected</p>
          <p class="text-xs opacity-60">Select an exhibit from the list below</p>
        </div>
        <div v-else class="flex flex-col space-y-1.5">
          <button
            v-for="(sel, i) in selectedItems"
            :key="i"
            class="border border-accent/20 rounded-xs px-2 py-1.5 text-xs flex items-center justify-between hover:border-danger/50 transition-colors"
            :title="'Click to remove'"
            @click="removeSelection(i)"
          >
            <span class="truncate" :class="qualityClass(sel.quality)">{{ getItemById(sel.itemId)?.name }}</span>
            <span class="flex items-center space-x-2 shrink-0 ml-2">
              <span class="text-muted">{{ getItemById(sel.itemId)?.sellPrice }}text</span>
              <span class="text-danger">Remove</span>
            </span>
          </button>
        </div>
      </div>

      <p class="text-xs text-muted mb-1">
        Estimated total score:
        <span class="text-accent">{{ previewScore }}</span>
      </p>

      <!-- Backpack item selection -->
      <div class="mb-3">
        <p class="text-xs text-muted mb-1">Optional items:</p>
        <div v-if="selectableItems.length === 0" class="flex flex-col items-center py-4 text-muted">
          <Package :size="28" class="mb-1.5 opacity-40" />
          <p class="text-xs">There are no exhibitable items in the backpack</p>
          <p class="text-xs opacity-60">Agricultural products, fish, gemstones, etc. can participate in the exhibition</p>
        </div>
        <div v-else class="flex flex-col space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            v-for="item in selectableItems"
            :key="item.itemId + item.quality"
            class="border border-accent/20 rounded-xs px-2 py-1.5 text-xs flex items-center justify-between hover:border-accent/50 transition-colors"
            :disabled="selectedItems.length >= 5"
            @click="addSelection(item)"
          >
            <span class="truncate" :class="qualityClass(item.quality)">{{ getItemById(item.itemId)?.name }}</span>
            <span class="flex items-center space-x-2 shrink-0 ml-2">
              <span class="text-muted">×{{ item.quantity }}</span>
              <span class="text-muted">{{ getItemById(item.itemId)?.sellPrice }}text</span>
            </span>
          </button>
        </div>
      </div>

      <div class="flex space-x-2"><Button class="flex-1" :disabled="selectedItems.length === 0" @click="handleSubmit">Exhibit! </Button>
        <Button class="flex-1 opacity-60 hover:opacity-100" @click="handleQuit">Give up the competition</Button>
      </div>
    </div>

    <!-- Result stage -->
    <div v-else>
      <p class="text-xs text-muted mb-2">The review is over! </p>

      <div class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Final ranking:</p>
        <div
          v-for="(entry, i) in rankings"
          :key="entry.name"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <div>
            <span
              class="mr-2"
              :class="{
                'text-accent': i === 0,
                'text-success': entry.name === 'you'
              }"
            >
              No. {{ i + 1 }}
            </span>
            <span :class="{ 'text-success': entry.name === 'you' }">{{ entry.name }}</span>
          </div>
          <span class="text-muted">{{ entry.score }} points</span>
        </div>
      </div>

      <!-- Exhibit details -->
      <div class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Your exhibit details:</p>
        <div
          v-for="(d, i) in scoreDetails"
          :key="i"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <span :class="qualityClass(d.quality) || 'text-accent'">{{ d.name }}</span>
          <span class="text-muted">{{ d.basePrice }} text × {{ d.multiplier }} = {{ d.score }} points</span>
        </div>
        <div class="flex items-center justify-between text-xs mt-1.5 pt-1 border-t border-accent/20">
          <span class="text-muted">Total score</span>
          <span class="text-accent">{{ playerScore }} points</span>
        </div>
      </div>

      <div class="mb-3 text-xs text-center border border-accent/20 p-2">
        <span v-if="playerRank === 1" class="text-accent">Congratulations on winning the gold medal! Bonus 1000 Wen</span>
        <span v-else-if="playerRank === 2" class="text-success">You won the Silver Award! Bonus 500 Wen</span>
        <span v-else-if="playerRank === 3" class="text-success">You won the Bronze Award! Bonus 200 Wen</span>
        <span v-else class="text-muted">Unfortunately, we did not get a ranking. Come again next year! </span>
      </div>

      <Button class="w-full" @click="handleClaim">Claim rewards</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Wheat, Package } from 'lucide-vue-next'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { getItemById } from '@/data'
  import type { Quality } from '@/types'
  import {
    sfxRewardClaim,
    sfxItemSelect,
    sfxJudging,
    sfxMiniFail,
    sfxRankFirst,
    sfxRankSecond,
    sfxRankThird,
    sfxRankLose
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{
    complete: [prize: number]
  }>()

  const inventoryStore = useInventoryStore()

  const QUALITY_MULTIPLIERS: Record<Quality, number> = {normal: 1,
    fine: 1.25,
    excellent: 1.5,
    Supreme: 2
  }

  interface SelectedItem {
    itemId: string
    quality: Quality
  }

  interface ScoreDetail {
    name: string
    quality: Quality
    basePrice: number
    multiplier: number
    score: number
  }

  interface Participant {
    name: string
    score: number
  }

  const selectedItems = ref<SelectedItem[]>([])
  const submitted = ref(false)
  const rankings = ref<Participant[]>([])
  const scoreDetails = ref<ScoreDetail[]>([])
  const playerScore = ref(0)

  /** Backpack items that can be exhibited (excluding seeds, machines and other non-display items) */
  const selectableItems = computed(() => {
    const exhibitCategories = ['crop', 'fish', 'food', 'processed', 'gem', 'misc']
    return inventoryStore.items.filter(item => {
      const def = getItemById(item.itemId)
      return def && exhibitCategories.includes(def.category)
    })
  })

  /** Preview the currently selected total score */
  const previewScore = computed(() => {
    return selectedItems.value.reduce((sum, sel) => {
      const def = getItemById(sel.itemId)
      if (!def) return sum
      const mult = QUALITY_MULTIPLIERS[sel.quality]
      return sum + Math.round(def.sellPrice * mult)
    }, 0)
  })

  const playerRank = computed(() => {
    const idx = rankings.value.findIndex(e => e.name === 'you')
    return idx === -1 ? 99 : idx + 1
  })

  const qualityClass = (quality: Quality): string => {
    const classes: Record<Quality, string> = {
      normal: '',
      fine: 'text-quality-fine',
      excellent: 'text-quality-excellent',
      supreme: 'text-quality-supreme'
    }
    return classes[quality]
  }

  const addSelection = (item: { itemId: string; quality: Quality }) => {
    if (selectedItems.value.length >= 5) return
    sfxItemSelect()
    selectedItems.value.push({ itemId: item.itemId, quality: item.quality })
  }

  const removeSelection = (index: number) => {
    sfxMiniFail()
    selectedItems.value.splice(index, 1)
  }

  const handleSubmit = () => {
    if (selectedItems.value.length === 0) return
    sfxJudging()

    // Calculate player score details
    const details: ScoreDetail[] = []
    let total = 0
    for (const sel of selectedItems.value) {
      const def = getItemById(sel.itemId)
      if (!def) continue
      const mult = QUALITY_MULTIPLIERS[sel.quality]
      const score = Math.round(def.sellPrice * mult)
      total += score
      details.push({
        name: def.name,
        quality: sel.quality,
        basePrice: def.sellPrice,
        multiplier: mult,
        score
      })
    }
    scoreDetails.value = details
    playerScore.value = total

    // Generate NPC score (600-1200 range)
    const npcs: Participant[] = [
      { name: 'Qiuyue', score: Math.round(600 + Math.random() * 600) },
      { name: 'Chen Bo', score: Math.round(600 + Math.random() * 600) },
      { name: 'Xiaoman', score: Math.round(600 + Math.random() * 600) }
    ]

    const player: Participant = { name: 'you', score: total }
    const all = [...npcs, player]
    all.sort((a, b) => b.score - a.score)
    rankings.value = allsubmitted.value = true

    // Ranking sound effects
    const rank = all.findIndex(e => e.name === 'you') + 1
    setTimeout(() => {
      if (rank === 1) sfxRankFirst()
      else if (rank === 2) sfxRankSecond()
      else if (rank === 3) sfxRankThird()
      else sfxRankLose()
    }, 300)
  }

  const handleQuit = () => {
    emit('complete', 0)
  }

  const handleClaim = () => {
    sfxRewardClaim()
    const prizes: Record<number, number> = { 1: 1000, 2: 500, 3: 200 }
    const prize = prizes[playerRank.value] ?? 0
    emit('complete', prize)
  }
</script>