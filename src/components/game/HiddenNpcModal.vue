<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="game-panel max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <!-- Head -->
      <div class="flex justify-between items-start mb-2">
        <div>
          <p class="text-sm text-accent">
            {{ npcDef.name }}
            <span class="text-xs text-muted ml-0.5">{{ npcDef.title }}</span>
            <span v-if="state.bonded" class="text-[10px] text-accent border border-accent/30 rounded-xs px-1 ml-1">Already bonded</span>
            <span v-else-if="state.courting" class="text-[10px] text-accent/70 border border-accent/20 rounded-xs px-1 ml-1">Seeking fate</span>
          </p>
          <p class="text-[10px] text-muted/60 mt-0.5">
            {{ npcDef.personality }}
          </p>
          <p v-if="showTrueName" class="text-[10px] text-accent/60 mt-0.5">True name: {{ npcDef.trueName }}</p>
        </div>
        <Button @click="emit('close')">Close</Button>
      </div>

      <!-- Fate Diamond Bar -->
      <div class="border border-accent/10 rounded-xs p-2 mb-2">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center space-x-px">
            <Diamond
              v-for="d in 12"
              :key="d"
              :size="10"
              class="flex-shrink-0"
              :class="state.affinity >= d * 250 ? 'text-accent' : 'text-muted/20'"
              :fill="state.affinity >= d * 250 ? 'currentColor' : 'none'"
            />
          </div>
          <span class="text-xs" :class="affinityLevelColor">
            {{ state.affinity }}
            <span class="text-muted/40">/3000</span>
          </span>
        </div>
        <div class="flex items-center space-x-1.5 flex-wrap">
          <span class="text-[10px] border rounded-xs px-1" :class="affinityLevelColor">
            {{ AFFINITY_LEVEL_NAMES[hiddenNpcStore.getAffinityLevel(npcId)] }}
          </span>
          <span
            class="text-[10px] border rounded-xs px-1 flex items-center space-x-0.5"
            :class="state.interactedToday ? 'text-muted/40 border-muted/10' : 'text-success border-success/30'"
          >
            <span>{{ state.interactedToday ? 'Interacted today' : 'Interactive' }}</span>
          </span>
          <span
            class="text-[10px] border rounded-xs px-1 flex items-center space-x-0.5"
            :class="state.offeredToday ? 'text-muted/40 border-muted/10' : 'text-accent border-accent/30'"
          >
            <span>Offer {{ state.offersThisWeek }}/3</span>
          </span>
          <span v-if="hiddenNpcStore.isManifestationDay(npcId)" class="text-[10px] text-accent border border-accent/30 rounded-xs px-1">
            Apparition Day! Offering ×3
          </span>
        </div>
      </div>

      <!-- Dialogue -->
      <div v-if="dialogueText" class="game-panel mb-3 text-xs">
        <p class="text-accent mb-1">「{{ npcDef.name }}」</p>
        <p>{{ dialogueText }}</p>
      </div>

      <!-- Unique interaction --><div class="mb-3">
        <Button class="w-full" :disabled="state.interactedToday || state.specialInteractionCooldown > 0" @click="handleInteraction">
          {{ INTERACTION_NAMES[npcDef.interactionType] }}
          <span v-if="state.specialInteractionCooldown > 0" class="text-muted ml-1">(cooling {{ state.specialInteractionCooldown }} days)</span>
        </Button>
      </div>

      <!-- Fate-seeking/fate-making panel -->
      <div v-if="npcDef.bondable" class="border border-accent/20 rounded-xs p-2 mb-3">
        <p class="text-xs text-accent/80 mb-1.5 flex items-center space-x-1">
          <Diamond :size="12" />
          <span>Xianyuan</span>
        </p>
        <template v-if="state.bonded">
          <p class="text-[10px] text-accent/60 mb-1">Eternal Immortal Fate ◆</p>
          <Button class="w-full text-danger border-danger/40" @click="showDissolveConfirm = true">DissolveConfirm (10,000 texts)</Button>
        </template>
        <template v-else-if="state.courting">
          <p class="text-[10px] text-accent/60 mb-1">Seeking fate ◇</p>
          <div class="flex flex-col space-y-0.5 mb-1.5">
            <span
              class="text-[10px] flex items-center space-x-0.5"
              :class="state.affinity >= npcDef.bondThreshold ? 'text-success' : 'text-muted/50'"
            >
              <CircleCheck v-if="state.affinity >= npcDef.bondThreshold" :size="10" />
              <Circle v-else :size="10" />
              Fate≥{{ npcDef.bondThreshold }}
              <span class="text-muted/40">— current {{ state.affinity }}</span>
            </span>
            <span
              class="text-[10px] flex items-center space-x-0.5"
              :class="hasCombinedItem(npcDef.bondItemId) ? 'text-success' : 'text-muted/50'"
            >
              <CircleCheck v-if="hasCombinedItem(npcDef.bondItemId)" :size="10" />
              <Circle v-else :size="10" />
              Holds {{ getItemById(npcDef.bondItemId)?.name ?? npcDef.bondItemId }}
            </span>
          </div>
          <!-- Making bonding items -->
          <div v-if="!hasCombinedItem(npcDef.bondItemId)" class="border border-accent/10 rounded-xs p-1.5 mb-1.5">
            <p class="text-[10px] text-muted/60 mb-1">Make {{ getItemById(npcDef.bondItemId)?.name }}:</p>
            <div class="flex flex-col space-y-0.5 mb-1">
              <span
                v-for="cost in npcDef.bondCraftCost"
                :key="cost.itemId"
                class="text-[10px]"
                :class="getCombinedItemCount(cost.itemId) >= cost.quantity ? 'text-success' : 'text-muted/50'"
              >
                {{ getItemById(cost.itemId)?.name ?? cost.itemId }} ×{{ cost.quantity }}
                <span class="text-muted/30">(holds {{ getCombinedItemCount(cost.itemId) }})</span>
              </span>
            </div>
            <Button class="w-full" :disabled="!canCraftBond" @click="handleCraft('bond')">Make</Button>
          </div>
          <Button class="w-full text-accent border-accent/40" :disabled="!canBond" @click="handleBond">Getting married</Button>
        </template><template v-else>
          <div class="flex flex-col space-y-0.5 mb-1.5">
            <span
              class="text-[10px] flex items-center space-x-0.5"
              :class="state.affinity >= npcDef.courtshipThreshold ? 'text-success' : 'text-muted/50'"
            >
              <CircleCheck v-if="state.affinity >= npcDef.courtshipThreshold" :size="10" />
              <Circle v-else :size="10" />
              Fate≥{{ npcDef.courtshipThreshold }}
              <span class="text-muted/40">— current {{ state.affinity }}</span>
            </span>
            <span
              class="text-[10px] flex items-center space-x-0.5"
              :class="hasCombinedItem(npcDef.courtshipItemId) ? 'text-success' : 'text-muted/50'"
            >
              <CircleCheck v-if="hasCombinedItem(npcDef.courtshipItemId)" :size="10" />
              <Circle v-else :size="10" />
              Holds {{ getItemById(npcDef.courtshipItemId)?.name ?? npcDef.courtshipItemId }}
            </span>
          </div>
          <!-- Making items for seeking luck -->
          <div v-if="!hasCombinedItem(npcDef.courtshipItemId)" class="border border-accent/10 rounded-xs p-1.5 mb-1.5">
            <p class="text-[10px] text-muted/60 mb-1">Make {{ getItemById(npcDef.courtshipItemId)?.name }}:</p>
            <div class="flex flex-col space-y-0.5 mb-1">
              <span
                v-for="cost in npcDef.courtshipCraftCost"
                :key="cost.itemId"
                class="text-[10px]"
                :class="getCombinedItemCount(cost.itemId) >= cost.quantity ? 'text-success' : 'text-muted/50'"
              >
                {{ getItemById(cost.itemId)?.name ?? cost.itemId }} ×{{ cost.quantity }}
                <span class="text-muted/30">(holds {{ getCombinedItemCount(cost.itemId) }})</span>
              </span>
            </div>
            <Button class="w-full" :disabled="!canCraftCourtship" @click="handleCraft('courtship')">Make</Button>
          </div>
          <Button class="w-full text-accent border-accent/40" :disabled="!canCourt" @click="handleCourt">Seeking fate</Button>
        </template>
      </div>

      <!-- Confirmation of broken relationship -->
      <div v-if="showDissolveConfirm" class="game-panel mb-3 border-accent/40">
        <p class="text-xs text-danger mb-2">Are you sure you want to end your relationship with {{ npcDef.name }}? (Cost 10,000 Wen)</p>
        <div class="flex space-x-2">
          <Button class="text-danger" @click="handleDissolve">Confirm</Button>
          <Button @click="showDissolveConfirm = false">Cancel</Button>
        </div>
      </div>

      <!-- Ability list -->
      <div v-if="npcDef.abilities.length > 0" class="mb-3">
        <p class="text-xs text-muted mb-1">Xianyuan ability:</p>
        <div class="flex flex-col space-y-0.5">
          <div
            v-for="ability in npcDef.abilities"
            :key="ability.id"
            class="text-[10px] border border-accent/10 rounded-xs px-2 py-0.5 flex items-center justify-between"
            :class="state.unlockedAbilities.includes(ability.id) ? 'text-accent' : 'text-muted/40'"
          ><span>{{ ability.name }} — {{ ability.description }}</span>
            <span v-if="state.unlockedAbilities.includes(ability.id)" class="text-success">Activated</span>
            <span v-else>Fate {{ ability.affinityRequired }}</span>
          </div>
        </div>
      </div>

      <!-- Worshiping Area -->
      <div>
        <p class="text-xs text-muted mb-2">Enshrinement</p>
        <template v-if="state.offeredToday">
          <div class="flex flex-col items-center justify-center py-6 text-muted">
            <Diamond :size="32" class="mb-2" />
            <p class="text-xs">It has been worshipped today. </p>
          </div>
        </template>
        <template v-else-if="state.offersThisWeek >= 3">
          <div class="flex flex-col items-center justify-center py-6 text-muted">
            <Diamond :size="32" class="mb-2" />
            <p class="text-xs">The number of offerings this week has been reached. </p>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-1 max-h-40 overflow-y-auto">
            <div
              v-for="item in offerableItems"
              :key="`${item.itemId}_${item.quality ?? 'normal'}`"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleOffer(item.itemId, item.quality)"
            >
              <span class="flex items-center space-x-1">
                <span class="text-xs" :class="qualityTextClass(item.quality)">
                  {{ getItemById(item.itemId)?.name }}
                </span>
                <span
                  v-if="getOfferingPreference(npcId, item.itemId) !== 'neutral'"
                  class="text-[10px]"
                  :class="OFFERING_PREF_CLASS[getOfferingPreference(npcId, item.itemId)]"
                >
                  {{ OFFERING_PREF_LABELS[getOfferingPreference(npcId, item.itemId)] }}
                </span>
              </span>
              <Diamond :size="12" class="text-muted" />
            </div>
          </div>
          <div v-if="offerableItems.length === 0" class="flex flex-col items-center justify-center py-6 text-muted">
            <Package :size="32" class="mb-2" />
            <p class="text-xs">No items</p>
          </div>
        </template>
      </div>

      <!--Backstory -->
      <div class="mt-3 border-t border-accent/10 pt-2">
        <p class="text-[10px] text-muted/50 leading-relaxed">
          {{ npcDef.origin }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Diamond, Package, Circle, CircleCheck } from 'lucide-vue-next'
  import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { getHiddenNpcById } from '@/data/hiddenNpcs'
  import { getItemById } from '@/data'
  import { INTERACTION_NAMES } from '@/types/hiddenNpc'
  import type { AffinityLevel } from '@/types/hiddenNpc'import type { Quality } from '@/types'
  import {
    doOffering,
    doSpecialInteraction,
    doCourting,
    doBond,
    doDissolve,
    getOfferingPreference,
    OFFERING_PREF_LABELS,
    OFFERING_PREF_CLASS,
    OFFERING_PREF_ORDER
  } from '@/composables/useHiddenNpcActions'
  import { triggerHeartEvent } from '@/composables/useDialogs'
  import { getCombinedItemCount, getGiftableStacks, hasCombinedItem } from '@/composables/useCombinedInventory'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import Button from '@/components/game/Button.vue'

  const props = defineProps<{
    npcId: string
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const hiddenNpcStore = useHiddenNpcStore()
  const gameStore = useGameStore()

  const npcDef = computed(() => getHiddenNpcById(props.npcId)!)
  const state = computed(() => hiddenNpcStore.getHiddenNpcState(props.npcId)!)

  const AFFINITY_LEVEL_NAMES: Record<AffinityLevel, string> = {
    wary: 'wary',
    curious: 'curious',
    trusting: 'trust',
    devoted: 'devout',
    eternal: 'eternal'
  }

  const affinityLevelColor = computed(() => {
    const level = hiddenNpcStore.getAffinityLevel(props.npcId)
    switch (level) {
      case 'wary':
        return 'text-muted'
      case 'curious':
        return 'text-water'
      case 'trusting':
        return 'text-success'
      case 'devoted':
        return 'text-accent'
      case 'eternal':
        return 'text-accent'
    }
  })

  const showTrueName = computed(() => state.value.affinity >= 2500)

  const dialogueText = ref<string | null>(null)

  const showDissolveConfirm = ref(false)

  const canCourt = computed(() => {
    const s = state.value
    const d = npcDef.value
    if (!d.bondable || s.courting || s.bonded) return false
    if (s.affinity < d.courtshipThreshold) return false
    if (!hasCombinedItem(d.courtshipItemId)) return false
    const existingBond = hiddenNpcStore.hiddenNpcStates.find(st => st.bonded || st.courting)
    if (existingBond && existingBond.npcId !== props.npcId) return false
    return true
  })

  const canCraftCourtship = computed(() => {
    const d = npcDef.value
    return d.courtshipCraftCost.every(c => getCombinedItemCount(c.itemId) >= c.quantity)
  })

  const canCraftBond = computed(() => {
    const d = npcDef.value
    return d.bondCraftCost.every(c => getCombinedItemCount(c.itemId) >= c.quantity)
  })

  const canBond = computed(() => {
    const s = state.value
    const d = npcDef.value
    if (!s.courting || s.bonded) return false
    if (s.affinity < d.bondThreshold) return false
    if (!hasCombinedItem(d.bondItemId)) return false
    return true
  })

  const qualityTextClass = (q: Quality, fallback = ''): string => {
    if (q === 'fine') return 'text-quality-fine'
    if (q === 'excellent') return 'text-quality-excellent'
    if (q === 'supreme') return 'text-quality-supreme'
    return fallback
  }

  /** Items that can be offered: total backpack + warehouse (except seeds) */const offerableItems = computed(() => {
    return getGiftableStacks().sort(
      (a, b) =>
        (OFFERING_PREF_ORDER[getOfferingPreference(props.npcId, a.itemId)] ?? 2) -
        (OFFERING_PREF_ORDER[getOfferingPreference(props.npcId, b.itemId)] ?? 2)
    )
  })

  /** Check for heart events and trigger */
  const checkAndTriggerHeartEvent = () => {
    const heartEvent = hiddenNpcStore.checkHeartEvent(props.npcId)
    if (heartEvent) {
      triggerHeartEvent(heartEvent)
    }
  }

  /** Check whether the day needs to end due to time advancement */
  const checkPassout = () => {
    if (gameStore.isPastBedtime) {
      addLog('Too late, you returned home exhausted.')
      emit('close')
      handleEndDay()
    }
  }

  const handleInteraction = () => {
    const success = doSpecialInteraction(props.npcId)
    if (success) {
      const level = hiddenNpcStore.getAffinityLevel(props.npcId)
      const dialogues = npcDef.value.dialogues[level]
      dialogueText.value = dialogues[Math.floor(Math.random() * dialogues.length)] ?? null
      checkAndTriggerHeartEvent()
      checkPassout()
    }
  }

  const handleOffer = (itemId: string, quality: Quality) => {
    const success = doOffering(props.npcId, itemId, quality)
    if (success) {
      checkAndTriggerHeartEvent()
      checkPassout()
    }
  }

  const handleCraft = (type: 'courtship' | 'bond') => {
    const result = hiddenNpcStore.craftSpiritItem(props.npcId, type)
    if (!result.success) {
      addLog(result.message)
      return
    }
    addLog(`Made ${type === 'courtship' ? getItemById(npcDef.value.courtshipItemId)?.name : getItemById(npcDef.value.bondItemId)?.name}.`)
  }

  const handleCourt = () => {
    doCourting(props.npcId)
  }

  const handleBond = () => {
    doBond(props.npcId)
  }

  const handleDissolve = () => {
    doDissolve(props.npcId)
    showDissolveConfirm.value = false
  }
</script>