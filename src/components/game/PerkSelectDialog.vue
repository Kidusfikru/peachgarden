<template>
  <!-- z-[80]: The pop-up windows for mine exploration (z-50), combat (z-60), and props (z-70) must be covered, otherwise the upgrade time in the mine will not be available -->
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[80]">
    <div class="game-panel max-w-md w-full">
      <h3 class="text-accent text-sm mb-2">{{ SKILL_NAMES[skillType] }} has reached {{ level }}! </h3>
      <p class="text-xs text-muted mb-4">Choose a specialization direction:</p>

      <div class="flex flex-col space-y-3">
        <button
          v-for="option in options"
          :key="option.id"
          class="btn text-xs text-left flex flex-col space-y-1 py-3"
          @click="handleSelect(option.id)"
        >
          <span class="text-accent">{{ option.name }}</span>
          <span class="text-muted">{{ option.description }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { SkillType, SkillPerk5, SkillPerk10 } from '@/types'
  import { useSkillStore } from '@/stores/useSkillStore'

  const props = defineProps<{
    skillType: SkillType
    level: 5 | 10
  }>()

  const emit = defineEmits<{
    select: [perk: SkillPerk5 | SkillPerk10]
  }>()

  const skillStore = useSkillStore()

  const SKILL_NAMES: Record<SkillType, string> = {
    farming: 'farming',
    foraging: 'Collection',
    fishing: 'fishing',
    mining: 'mining',
    combat: 'combat'
  }

  interface PerkOption {
    id: SkillPerk5 | SkillPerk10
    name: string
    description: string
  }

  const PERK5_OPTIONS: Record<SkillType, PerkOption[]> = {
    farming: [
      { id: 'harvester', name: 'Harvester', description: 'Crop selling price +10%' },
      { id: 'rancher', name: 'Herdsman', description: 'Animal product sales +20%' }
    ],
    foraging: [
      {
        id: 'lumberjack',
        name: 'Woodcutter',
        description: '25% chance of obtaining additional wood when collecting'
      },
      { id: 'herbalist', name: 'Herbalist', description: 'Probability of collecting items +20%' }
    ],
    fishing: [
      { id: 'fisher', name: 'fisherman', description: 'Fish price +25%' },
      { id: 'trapper', name: 'Trapper', description: 'Success rate +15% when struggling' }
    ],
    mining: [
      { id: 'miner', name: 'miner', description: '50% probability of ore +1' },
      { id: 'geologist', name: 'Geologist', description: 'The probability of rare ores has been greatly increased' }
    ],
    combat: [
      { id: 'fighter', name: 'fighter', description: 'Injury -15%, +25 maximum health' },
      { id: 'defender', name: 'Guardian', description: 'Restore 5HP when defending' }
    ]
  }

  /** Lv10 specializations are grouped according to Lv5 branches */
  const PERK10_BRANCHES: Record<SkillType, Record<string, PerkOption[]>> = {
    farming: {
      harvester: [
        { id: 'artisan', name: 'Artisan', description: 'Sale price of processed products +25%' },
        { id: 'intensive', name: 'intensive farming', description: '20% chance of double harvesting' }
      ],
      rancher: [
        { id: 'coopmaster', name: 'Rancher', description: 'Animal intimacy gain +50%' },
        { id: 'shepherd', name: 'Shepherd', description: 'The quality of animal products has been improved by one level' }
      ]
    },
    foraging: {
      lumberjack: [
        { id: 'forester', name: 'Lumberjack', description: 'You will definitely get extra wood when collecting' },
        { id: 'tracker', name: 'tracker', description: 'Get 1 additional item each time you collect' }
      ],
      herbalist: [
        { id: 'botanist', name: 'Botanist', description: 'The collected items must be of high quality' },{ id: 'alchemist', name: 'Alchemist', description: 'Food recovery +50%' }
      ]
    },
    fishing: {
      fisher: [
        { id: 'angler', name: 'Fishing Master', description: 'The appearance rate of legendary fish has been greatly increased' },
        { id: 'aquaculture', name: 'Aquatic product dealer', description: 'Fish price +50%' }
      ],
      trapper: [
        { id: 'mariner', name: 'sailor', description: 'The quality of the fish caught is at least excellent' },
        { id: 'luremaster', name: 'Bait Master', description: 'Lure effect doubled' }
      ]
    },
    mining: {
      miner: [
        { id: 'prospector', name: 'Prospector', description: '15% chance of double ore' },
        { id: 'blacksmith', name: 'Blacksmith', description: 'Metal ore selling price +50%' }
      ],
      geologist: [
        {
          id: 'excavator',
          name: 'digger',
          description: '30% chance of not consuming bombs when using them'
        },
        {
          id: 'mineralogist',
          name: 'Gemologist',
          description: 'Defeat monsters and drop additional ores'
        }
      ]
    },
    combat: {
      fighter: [
        { id: 'warrior', name: 'Warrior', description: '+40 maximum health' },
        { id: 'brute', name: 'Brute', description: 'Attack damage +25%' }
      ],
      defender: [
        { id: 'acrobat', name: 'Acrobat', description: '25% chance to dodge and counterattack' },
        { id: 'tank', name: 'Heavy Armor', description: 'Reduce damage by 70% when defending' }
      ]
    }
  }

  const options = computed<PerkOption[]>(() => {
    if (props.level === 5) return PERK5_OPTIONS[props.skillType]
    // Lv10: Determine the branch based on the specialization selected at Lv5
    const perk5 = skillStore.getSkill(props.skillType).perk5
    if (perk5) {
      const branches = PERK10_BRANCHES[props.skillType]
      return branches[perk5] ?? []
    }
    return []
  })

  const handleSelect = (perkId: SkillPerk5 | SkillPerk10) => {
    emit('select', perkId)
  }
</script>