import { ref } from 'vue'
import { useGameStore, SEASON_NAMES, WEATHER_NAMES } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useFarmStore, formatExhaustedLog } from '@/stores/useFarmStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { useSaveStore } from '@/stores/useSaveStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { useCookingStore } from '@/stores/useCookingStore'
import { useProcessingStore } from '@/stores/useProcessingStore'
import { useAchievementStore } from '@/stores/useAchievementStore'
import { useAnimalStore } from '@/stores/useAnimalStore'
import { useHomeStore } from '@/stores/useHomeStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useShopStore } from '@/stores/useShopStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useFishingStore } from '@/stores/useFishingStore'
import { useBreedingStore } from '@/stores/useBreedingStore'
import { useHanhaiStore } from '@/stores/useHanhaiStore'
import { useFishPondStore } from '@/stores/useFishPondStore'
import { useTutorialStore } from '@/stores/useTutorialStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { useMiningStore } from '@/stores/useMiningStore'
import { getItemById, getTodayEvent, getNpcById, getCropById, getForageItems, formatFeedUsage } from '@/data'
import { getFertilizerById } from '@/data/processing'
import { FISH } from '@/data/fish'
import { RECIPES } from '@/data/recipes'
import { CAVE_UNLOCK_EARNINGS } from '@/data/buildings'
import { TOOL_NAMES, TIER_NAMES } from '@/data/upgrades'
import { addLog, showFloat } from './useGameLog'
import { getDailyMarketInfo, MARKET_CATEGORY_NAMES } from '@/data/market'
import { showEvent, showFestival, triggerWeddingEvent, triggerPetAdoption, showFarmEvent, showDiscoveryScene } from './useDialogs'
import { sfxSleep, useAudio } from './useAudio'
import { MORNING_NARRATIONS, NARRATIONS_NO_LOSS, MORNING_CHOICE_EVENTS, MORNING_EASTER_EGGS } from '@/data/farmEvents'
import { MORNING_TIPS } from '@/data/tutorials'
import type { MorningEffect } from '@/data/farmEvents'
import router from '@/router'

const NPC_NAME_MAP: Record<string, string> = {
  chen_bo: 'Chen Bo',
  liu_niang: 'Liu Niang',
  a_shi: 'Ashi',
  qiu_yue: 'Autumn Moon',
  lin_lao: 'Lin Lao',
  xiao_man: 'xiaoman',
  chun_lan: 'Chunlan',
  xue_qin: 'Xueqin',
  su_su: 'Susu',
  hong_dou: '红豆',
  dan_qing: 'danqing',
  a_tie: 'Atie',
  yun_fei: 'Yunfei',
  da_niu: '大牛',
  mo_bai: 'Mobai',
  wang_dashen: 'Aunt Wang',
  zhao_mujiang: 'Zhao Mujiang',
  sun_tiejiang: 'Sun Tiejiang',
  zhang_popo: 'Mother Zhang',
  li_yu: 'Li Yuweng',
  zhou_xiucai: 'Zhou Xiucai',
  wu_shen: 'Aunt Wu',
  ma_liu: '马六',
  lao_song: 'Lao Song',
  pang_shen: 'fat aunt',
  a_hua: 'Ahua',
  shi_tou: 'stone',
  hui_niang: 'Hui Niang',lao_lu: 'Lao Lu',
  liu_cunzhang: 'Liu Village Chief',
  qian_niang: 'Qian Niang',
  he_zhanggui: 'He shopkeeper',
  qin_dashu: 'Uncle Qin',
  a_fu: 'Afu'
}const getNpcName = (npcId: string): string => {
  return NPC_NAME_MAP[npcId] ?? npcId
}

/** NPC favorability → recipe unlock mapping (multi-level) */
const NPC_RECIPE_MAP: {
  npcId: string
  level: 'acquaintance' | 'friendly' | 'bestFriend'
  recipeId: string
}[] = [
  // Get acquainted
  { npcId: 'chen_bo', level: 'acquaintance', recipeId: 'radish_soup' },
  { npcId: 'qiu_yue', level: 'acquaintance', recipeId: 'braised_carp' },
  { npcId: 'lin_lao', level: 'acquaintance', recipeId: 'herbal_porridge' },
  { npcId: 'liu_niang', level: 'acquaintance', recipeId: 'osmanthus_cake' },
  { npcId: 'a_shi', level: 'acquaintance', recipeId: 'miner_lunch' },
  { npcId: 'xiao_man', level: 'acquaintance', recipeId: 'sweet_osmanthus_tea' },
  // get to know each other
  { npcId: 'chen_bo', level: 'friendly', recipeId: 'aged_radish_stew' },
  { npcId: 'qiu_yue', level: 'friendly', recipeId: 'maple_grilled_fish' },
  { npcId: 'lin_lao', level: 'friendly', recipeId: 'herbal_pill' },
  { npcId: 'liu_niang', level: 'friendly', recipeId: 'embroidered_cake' },
  { npcId: 'a_shi', level: 'friendly', recipeId: 'deep_mine_stew' },
  { npcId: 'xiao_man', level: 'friendly', recipeId: 'wild_berry_jam' },
  // best friend
  { npcId: 'chen_bo', level: 'bestFriend', recipeId: 'farmers_feast' },
  { npcId: 'qiu_yue', level: 'bestFriend', recipeId: 'autumn_moon_feast' },
  { npcId: 'lin_lao', level: 'bestFriend', recipeId: 'longevity_soup' },
  { npcId: 'liu_niang', level: 'bestFriend', recipeId: 'lovers_pastry' },
  { npcId: 'a_shi', level: 'bestFriend', recipeId: 'forgemasters_meal' },
  { npcId: 'xiao_man', level: 'bestFriend', recipeId: 'spirit_fruit_wine' },
  // NEW: Animal product related recipes
  { npcId: 'da_niu', level: 'friendly', recipeId: 'goat_milk_soup' },
  { npcId: 'da_niu', level: 'bestFriend', recipeId: 'truffle_fried_rice' },
  { npcId: 'lin_lao', level: 'bestFriend', recipeId: 'antler_soup' },
  { npcId: 'chen_bo', level: 'bestFriend', recipeId: 'camel_milk_tea' }
]

/** Wedding recipe mapping */
const MARRIAGE_RECIPE_MAP: Record<string, string> = {
  liu_niang: 'phoenix_cake',
  a_shi: 'molten_hotpot',
  qiu_yue: 'moonlight_sashimi',
  chun_lan: 'tea_banquet',
  xue_qin: 'snow_plum_soup',
  su_su: 'silk_dumpling',
  hong_dou: 'drunken_chicken',
  dan_qing: 'scholars_porridge',
  a_tie: 'ironforge_stew',
  yun_fei: 'hunters_roast',
  da_niu: 'ranch_milk_soup',
  mo_bai: 'moonlit_tea_rice'
}

/** Holiday recipe mapping */
const FESTIVAL_RECIPE_MAP: Record<string, string> = {
  spring_festival: 'spring_roll',
  summer_lantern: 'lotus_lantern_cake',
  autumn_harvest: 'harvest_feast',
  winter_new_year: 'new_year_dumpling',
  yuan_ri: 'nian_gao',
  hua_chao: 'hua_gao',
  shang_si: 'qing_tuan',
  zhong_qiu: 'yue_bing',
  la_ba: 'la_ba_zhou',
  duan_wu: 'dragon_boat_zongzi',
  qi_xi: 'qiao_guo',chong_yang: 'chrysanthemum_wine',
  dong_zhi: 'jiaozi',
  nian_mo: 'tangyuan',
  dou_cha: 'dou_cha_yin',
  qiu_yuan: 'zhi_yuan_gao'
}

/** Favorability level hierarchy sequence */
const LEVEL_ORDER = ['stranger', 'acquaintance', 'friendly', 'bestFriend'] as const

/** Check whether the favorability reaches the specified level */const meetsLevel = (current: string, required: 'acquaintance' | 'friendly' | 'bestFriend'): boolean => {
  return LEVEL_ORDER.indexOf(current as (typeof LEVEL_ORDER)[number]) >= LEVEL_ORDER.indexOf(required)
}

/** Legendary fish ID list */
const LEGENDARY_FISH_IDS = ['dragonfish', 'golden_turtle', 'river_dragon', 'abyss_leviathan', 'jade_dragon']

/** Check NPC friendliness, skill level, marriage unlock recipe */
const checkRecipeUnlocks = () => {
  const npcStore = useNpcStore()
  const cookingStore = useCookingStore()
  const skillStore = useSkillStore()

  // NPC multi-level favorability recipes
  for (const entry of NPC_RECIPE_MAP) {
    const level = npcStore.getFriendshipLevel(entry.npcId)
    if (meetsLevel(level, entry.level)) {
      if (cookingStore.unlockRecipe(entry.recipeId)) {
        const levelName = entry.level === 'acquaintance' ? 'acquaintance' : entry.level === 'friendly' ? 'acquaintance' : 'best friend'
        addLog(`${getNpcName(entry.npcId)}(${levelName}) sent a new recipe!`)
      }
    }
  }

  //wedding recipes
  const spouse = npcStore.getSpouse()
  if (spouse) {
    const marriageRecipe = MARRIAGE_RECIPE_MAP[spouse.npcId]
    if (marriageRecipe) {
      if (cookingStore.unlockRecipe(marriageRecipe)) {
        const spouseName = getNpcName(spouse.npcId)
        addLog(`${spouseName} taught you a new recipe!`)
      }
    }
    // Universal wedding recipe: Peacock Feast
    if (cookingStore.unlockRecipe('peacock_feast')) {
      addLog(`Married life unlocks a new recipe: Peacock Feast!`)
    }
  }

  // Skill recipes
  for (const recipe of RECIPES) {
    if (recipe.requiredSkill) {
      const skill = skillStore.getSkill(recipe.requiredSkill.type)
      if (skill.level >= recipe.requiredSkill.level) {
        if (cookingStore.unlockRecipe(recipe.id)) {
          addLog(`Skill upgrade unlocks new recipe: ${recipe.name}!`)
        }
      }
    }
  }

  // Item acquisition and unlocking recipes (Hanhai)
  const inventoryStore = useInventoryStore()
  const ITEM_RECIPE_MAP: { itemId: string; recipeId: string; name: string }[] = [
    { itemId: 'hanhai_spice', recipeId: 'spiced_lamb', name: 'Spice Roasted Lamb' },
    {
      itemId: 'hanhai_silk',
      recipeId: 'silk_dumpling_deluxe',
      name: 'Silk Road Dumplings'
    },
    {
      itemId: 'hanhai_cactus',
      recipeId: 'desert_cactus_soup',
      name: 'Cactus Soup'
    },
    { itemId: 'hanhai_date', recipeId: 'date_cake', name: 'date cake' }
  ]
  for (const entry of ITEM_RECIPE_MAP) {
    if (inventoryStore.hasItem(entry.itemId)) {
      if (cookingStore.unlockRecipe(entry.recipeId)) {addLog(`got new recipe: ${entry.name}!`)
      }
    }
  }
}

/** Check achievements to unlock recipes */
const checkAchievementRecipes = () => {
  const achievementStore = useAchievementStore()
  const cookingStore = useCookingStore()
  const npcStore = useNpcStore()
  const s = achievementStore.stats

  const checks: { condition: boolean; recipeId: string; message: string }[] = [
    {
      condition: s.totalFishCaught >= 1,
      recipeId: 'first_catch_soup',
      message: 'First time fishing'
    },
    {
      condition: s.totalCropsHarvested >= 100,
      recipeId: 'bountiful_porridge',
      message: 'Harvest a hundred crops'
    },
    {
      condition: s.highestMineFloor >= 30,
      recipeId: 'miners_glory',
      message: 'Mine exploration'},
    {
      condition: s.totalRecipesCooked >= 20,
      recipeId: 'chef_special',
      message: 'Cooking Master'
    },
    {
      condition:
        (['chen_bo', 'liu_niang', 'a_shi', 'qiu_yue', 'lin_lao', 'xiao_man'] as const).filter(id =>
          meetsLevel(npcStore.getFriendshipLevel(id), 'friendly')
        ).length >= 3,
      recipeId: 'social_tea',
      message: 'social master'
    },
    {
      condition: s.totalFishCaught >= 20,
      recipeId: 'anglers_platter',
      message: 'A good fisherman'
    },
    {
      condition: LEGENDARY_FISH_IDS.some(id => achievementStore.isDiscovered(id)),
      recipeId: 'legendary_feast',
      message: 'Legend Hunter'
    },
    {
      condition: s.highestMineFloor >= 50,
      recipeId: 'abyss_stew',
      message: 'Exploring the Abyss'
    },
    {
      condition: achievementStore.discoveredCount >= 50,
      recipeId: 'collectors_banquet',
      message: 'Collection Master'
    }
  ]

  for (const check of checks) {
    if (check.condition) {
      if (cookingStore.unlockRecipe(check.recipeId)) {
        addLog(`[Achievement Recipe]${check.message} unlocked a new recipe!`)
      }
    }
  }
}

/** Apply seasonal event effects */
const applyEventEffects = (event: { id: string; name: string; description: string; effects: any }) => {
  const playerStore = usePlayerStore()
  const npcStore = useNpcStore()
  const inventoryStore = useInventoryStore()
  const effects = event.effects

  if (effects.friendshipBonus) {
    for (const state of npcStore.npcStates) {
      state.friendship += effects.friendshipBonus
    }
  }
  if (effects.moneyReward) {
    playerStore.earnMoney(effects.moneyReward)
    showFloat(`+${effects.moneyReward}text`, 'accent')
  }
  if (effects.staminaBonus) {
    playerStore.restoreStamina(effects.staminaBonus)
    showFloat(`+${effects.staminaBonus}physical power`, 'success')
  }
  if (effects.itemReward) {
    for (const item of effects.itemReward) {
      inventoryStore.addItem(item.itemId, item.quantity)
    }
  }
  addLog(`[${event.name}]${event.description}`)

  // Holiday recipes unlocked
  const cookingStore = useCookingStore()
  const festivalRecipe = FESTIVAL_RECIPE_MAP[event.id]if (festivalRecipe) {
    if (cookingStore.unlockRecipe(festivalRecipe)) {
      addLog(`Festival event unlocks new recipes!`)
    }
  }
}

// ==================== Morning random events ====================

/** Apply morning effect */
const applyMorningEffect = (effect?: MorningEffect) => {
  if (!effect) return
  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const npcStore = useNpcStore()
  const farmStore = useFarmStore()

  switch (effect.type) {
    case 'loseCrop': {
      const growing = farmStore.plots.filter(p => p.state === 'growing' || p.state === 'harvestable')
      if (growing. length > 0) {
        const target = growing[Math.floor(Math.random() * growing.length)]!
        const cropName = getCropById(target.cropId ?? '')?.name ?? 'crop'
        target.state = 'tilled'
        target.cropId = null
        target.growthDays = 0
        target.watered = false
        target.harvestCount = 0
        target.seedGenetics = nulladdLog(`A plant ${cropName} was spoiled.`)
      }
      break
    }
    case 'gainItem':
      inventoryStore.addItem(effect.itemId, effect.qty)
      break
    case 'gainMoney':
      playerStore.earnMoney(effect.amount)
      break
    case 'gainFriendship':
      for (const s of npcStore.npcStates) {
        s.friendship += effect.amount
      }
      break
  }
}

/** Rolling dice: random events in the morning */
const rollMorningEvent = ():
  | { type: 'narration'; message: string; effect?: MorningEffect }
  | { type: 'choice'; event: (typeof MORNING_CHOICE_EVENTS)[number] }
  | { type: 'easter'; message: string; effect?: MorningEffect }
  | null => {
  const roll = Math.random()

  // 95% nothing happens
  if (roll >= 0.05) return null

  // 0.2% easter egg (roll < 0.002)
  if (roll < 0.002) {
    const egg = MORNING_EASTER_EGGS[Math.floor(Math.random() * MORNING_EASTER_EGGS.length)]!
    return { type: 'easter', message: egg.message, effect: egg.effect }
  }

  // 0.8% option event (roll < 0.01)
  if (roll < 0.01) {
    const event = MORNING_CHOICE_EVENTS[Math.floor(Math.random() * MORNING_CHOICE_EVENTS.length)]!
    return { type: 'choice', event }
  }

  // 4% thief/animal narration
  const farmStore = useFarmStore()
  const hasCrops = farmStore.plots.some(p => p.state === 'growing' || p.state === 'harvestable')
  const pool = hasCrops ? MORNING_NARRATIONS : NARRATIONS_NO_LOSS
  const narration = pool[Math.floor(Math.random() * pool.length)]!
  return {
    type: 'narration',
    message: narration.message,
    effect: narration.effect
  }
}

/** Daily settlement processing */
/** Settlement instructions for the latest fainting; GameLayout pops up a window to inform the player after reading it, and is responsible for clearing it */
export const lastPassOutNotice = ref<string | null>(null)

export const handleEndDay = () => {
  sfxSleep()

  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()const inventoryStore = useInventoryStore()
  const saveStore = useSaveStore()
  const npcStore = useNpcStore()
  const cookingStore = useCookingStore()
  const processingStore = useProcessingStore()
  const achievementStore = useAchievementStore()
  const animalStore = useAnimalStore()
  const homeStore = useHomeStore()
  const questStore = useQuestStore()
  const skillStore = useSkillStore()
  const tutorialStore = useTutorialStore()

  // Newbie guide: record low physical strength mark (before dailyReset)
  if (playerStore.stamina < 20) tutorialStore.setFlag('staminaWasLow')

  // recovery mode
  // Pass out just to see if I can make it to 2am. Reducing physical strength to zero does not count - that is what the player has spent on himself.
  // As long as you can still walk home and sleep, you shouldn't be deducted money; otherwise, "exhausted → go home → wake up with 10% less copper coins" makes no sense.
  let recoveryMode: 'normal' | 'late' | 'passout'
  if (gameStore.hour >= 26) {
    recoveryMode = 'passout'
  } else if (gameStore.hour >= 24) {
    recoveryMode = 'late'
  } else {
    recoveryMode = 'normal'
  }

  // Forced exit from the mine: regardless of whether the player is exploring or not, the mine status will be reset after sleeping/fainting
  const miningStore = useMiningStore()
  if (miningStore.isExploring) {
    miningStore.leaveMine()
  }

  const pestResult = farmStore.dailyUpdate(gameStore.isRainy)
  processingStore.dailyUpdate()

  // Breeding station progress update
  const breedingStore = useBreedingStore()
  breedingStore.dailyUpdate()

  // Ring effect: Accelerated crop growthconst ringGrowthBonus = inventoryStore.getRingEffectValue('crop_growth_bonus')
  const walletGrowthBonus = useWalletStore().getCropGrowthBonus()
  if (ringGrowthBonus > 0) {
    for (const plot of farmStore.plots) {
      if ((plot.state === 'growing' || plot.state === 'planted') && plot.watered) {
        plot.growthDays += ringGrowthBonus
        const crop = getCropById(plot.cropId!)
        if (crop) {
          const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
          const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowthBonus
          const effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
          if (plot.growthDays >= effectiveDays) {
            plot.state = 'harvestable'
          }
        }
      }
    }
  }

  // Additional effects of Green Rain: accelerated growth of crops + accelerated growth of wild trees
  if (gameStore.weather === 'green_rain') {
    for (const plot of farmStore.plots) {
      if ((plot.state === 'growing' || plot.state === 'planted') && plot.watered) {
        plot.growthDays += 0.5
        const crop = getCropById(plot.cropId!)
        if (crop) {
          const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
          const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowthBonusconst effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
          if (plot.growthDays >= effectiveDays) {
            plot.state = 'harvestable'
          }
        }
      }
    }
    for (const tree of farmStore.wildTrees) {
      if (!tree.mature) {
        tree.growthDays += 1
      }
    }
    addLog('Green rain moistens the earth, and crops and trees grow faster!')
  }

  // Tool upgrade progress
  const upgradeResult = inventoryStore.dailyUpgradeUpdate()
  if (upgradeResult?.completed) {
    addLog(`Xiaoman completed the upgrade of ${TOOL_NAMES[upgradeResult.toolType]}! It is now ${TIER_NAMES[upgradeResult.targetTier]} level.`)
  }

  // Crow attack (before other routine processing); crows are chased away while dog guards house
  const guardDog = animalStore.hasPetAbility('guard') ? animalStore.pet : null
  if (guardDog) {
    if (animalStore.dogScaresOffCrow()) addLog(`${guardDog.name} drove away the crow.`)
  } else {
    const crowResult = farmStore.crowAttack()
    if (crowResult.attacked) {
      addLog(`Crows attacked your farm and one ${crowResult.cropName} plant was eaten! Put a scarecrow to protect the crops.`)
    }
  }

  // Pest log
  if (pestResult.newInfestations > 0) {
    addLog(
      `Pests are coming! The ${pestResult.newInfestations} plot of land has been infested by pests. ${farmStore.scarecrows > 0 ? 'Scarecrows reduce pest risk. ' : 'Placing scarecrows can reduce the probability of insect infestation. '}`
    )
  }
  if (pestResult.pestDeaths > 0) {
    addLog(`${pestResult.pestDeaths} crops died due to insect pests lasting too long! Timely pest control can save crops.`)
  }

  // weed log
  if (pestResult.newWeeds > 0) {
    addLog(
      `The weeds are spreading! Weeds have grown in ${pestResult.newWeeds}. ${farmStore.scarecrows > 0 ? 'Scarecrows suppress the spread of weeds. ' : 'Placing scarecrows can reduce weeds. '}`
    )
  }
  if (pestResult.weedDeaths > 0) {
    addLog(`${pestResult.weedDeaths} crops were suffocated by weeds! Timely weeding can save crops.`)
  }

  // Random events in the morning (narration about stealing vegetables); the dog was stopped from ruining the crops while guarding the house.
  const morningEvent = rollMorningEvent()
  if (morningEvent) {
    if (morningEvent.type === 'choice') {
      showFarmEvent(morningEvent.event)} else if (guardDog && morningEvent.effect?.type === 'loseCrop') {
      addLog(`${guardDog.name} guarded the crops.`)
    } else {
      addLog(morningEvent.message)
      applyMorningEffect(morningEvent.effect)
    }
  }

  // Giant crop inspection
  const giantCrops = farmStore.checkGiantCrops()
  for (const gc of giantCrops) {
    addLog(`The giant ${gc.cropName} appears! The 3×3 crops merge into a giant crop!`)
  }

  // Feeding employees are fed with the default feed every morning and paid in the morning (see morning work below);// Only livestock that have not been fed that day (such as newly purchased ones) are fed here. Must be executed before animalStore.dailyUpdate to ensure that the feeding status takes effect
  const feedHelper = npcStore.hiredHelpers.find(h => h.task === 'feed')
  let helperFeedSuccess = false
  if (feedHelper) {
    const result = animalStore.feedAll()
    if (result. fedCount > 0) {
      addLog(`${getNpcById(feedHelper.npcId)?.name ?? 'Helper'} supplemented ${result.fedCount} livestock (${formatFeedUsage(result.used)}).`)
    }
    helperFeedSuccess = result.noFeedCount === 0
  }

  const spouse = npcStore.getSpouse()
  let spouseFedSuccess = false
  if (spouse && !helperFeedSuccess) {
    const bonusChanceEve = spouse.friendship >= 2500 ? 0.1 : 0
    if (Math.random() < 0.4 + bonusChanceEve) {
      const result = animalStore.feedAll()
      const spouseNameEve = getNpcById(spouse.npcId)?.name ?? 'spouse'
      if (result. fedCount > 0) {
        addLog(`${spouseNameEve} helped you feed ${result.fedCount} livestock (${formatFeedUsage(result.used)}).`)
        spouseFedSuccess = result.noFeedCount === 0
      } else if (result.noFeedCount > 0) {
        addLog(`${spouseNameEve} wants to help you feed your livestock, but there is not enough feed.`)
      }
    }
  }

  // Confidant daily bonus (before dailyReset)
  const zhiji = npcStore.getZhiji()
  if (zhiji) {
    const zhijiDef = getNpcById(zhiji.npcId)
    const zhijiName = zhijiDef?.name ?? 'confidant'
    const bonusChance2 = zhiji.friendship >= 2500 ? 0.15 : 0

    switch (zhiji.npcId) {
      case 'a_shi':
        if (Math.random() < 0.3 + bonusChance2) {
          const ores = ['copper_ore', 'iron_ore', 'gold_ore']
          const ore = ores[Math.floor(Math.random() * ores.length)]!
          const qty = 1 + Math.floor(Math.random() * 3)
          inventoryStore.addItem(ore, qty)
          addLog(`${zhijiName} sent ${qty}${getItemById(ore)?.name ?? 'ore'}.`)
        }
        break
      case 'dan_qing':
        if (Math.random() < 0.2 + bonusChance2) {
          for (const s of npcStore.npcStates) {
            if (s.npcId !== zhiji.npcId) s.friendship += 5
          }
          addLog(`${zhijiName} said a few nice words for you in the village. (+5 favorability in the village)`)
        }
        break
      case 'a_tie':
        if (Math.random() < 0.3 + bonusChance2) {
          const mats = ['iron_ore', 'copper_ore', 'charcoal']
          const mat = mats[Math.floor(Math.random() * mats.length)]!
          inventoryStore.addItem(mat, 2)
          addLog(`${zhijiName} sent some blacksmithing materials.`)
        }
        break
      case 'yun_fei':
        if (Math.random() < 0.3 + bonusChance2) {
          const items2 = ['wild_mushroom', 'herb', 'pine_cone']
          const item2 = items2[Math.floor(Math.random() * items2.length)]!
          inventoryStore.addItem(item2)addLog(`${zhijiName} brought back ${getItemById(item2)?.name ?? 'thing'} from the mountains.`)
        }break
      case 'da_niu':
        if (Math.random() < 0.3 + bonusChance2) {
          const result2 = animalStore.feedAll()
          if (result2.fedCount > 0) addLog(`${zhijiName} helped you feed ${result2.fedCount} livestock (${formatFeedUsage(result2.used)}).`)
        }
        break
      case 'mo_bai':
        if (Math.random() < 0.25 + bonusChance2) {
          playerStore.restoreStamina(15)
          addLog(`${zhijiName} played a soothing piano sound, and you feel better. (+15 physical strength)`)
        }
        break
      case 'liu_niang':
        if (Math.random() < 0.2 + bonusChance2) {
          for (const s of npcStore.npcStates) {
            if (s.npcId !== zhiji.npcId) s.friendship += 5
          }
          addLog(`${zhijiName} said good things for you in the village. (+5 favorability in the village)`)
        }
        break
      case 'qiu_yue':
        if (Math.random() < 0.3 + bonusChance2) {
          const fish = ['crucian', 'carp', 'grass_carp', 'bass']
          const f = fish[Math.floor(Math.random() * fish.length)]!
          inventoryStore.addItem(f)
          addLog(`${zhijiName} sent a ${getItemById(f)?.name ?? 'fish'}.`)
        }
        break
      case 'chun_lan':
        if (Math.random() < 0.25 + bonusChance2) {
          inventoryStore.addItem('green_tea_drink')
          addLog(`${zhijiName} brought a pot of good tea.`)
        }
        break
      case 'xue_qin':
        if (Math.random() < 0.15 + bonusChance2) {
          inventoryStore.addItem('bamboo')
          addLog(`${zhijiName} sent a bundle of bamboo.`)
        }
        break
      case 'su_su':
        if (Math.random() < 0.25 + bonusChance2) {
          const cloths = ['cloth', 'silk_cloth', 'felt']
          const c = cloths[Math.floor(Math.random() * cloths.length)]!
          inventoryStore.addItem(c)
          addLog(`${zhijiName} sent a piece of ${getItemById(c)?.name ?? 'cloth'}.`)
        }
        break
      case 'hong_dou':
        if (Math.random() < 0.3 + bonusChance2) {
          const wines = ['peach_wine', 'jujube_wine', 'corn_wine']
          const w = wines[Math.floor(Math.random() * wines.length)]!
          inventoryStore.addItem(w)
          addLog(`${zhijiName} sent a pot of ${getItemById(w)?.name ?? 'wine'}.`)
        }
        break
    }
  }

  npcStore.dailyReset()
  cookingStore.dailyReset()
  const hanhaiStore = useHanhaiStore()
  hanhaiStore.resetDailyBets()
  //Commercial sales settlement
  if (hanhaiStore.unlocked) {
    hanhaiStore.dailyTradeUpdate()
  }

  // Fair daily processing
  const hiddenNpcStore = useHiddenNpcStore()
  const discoveryTriggered = hiddenNpcStore.checkDiscoveryConditions()
  for (const { npcId, step } of discoveryTriggered) {
    if (step.logMessage) addLog(step.logMessage)
    if (step.scenes.length > 0) showDiscoveryScene(npcId, step)
  }
  hiddenNpcStore.dailyReset()
  const newAbilities = hiddenNpcStore.checkAbilityUnlocks()
  for (const a of newAbilities) {addLog(`[Xianyuan]${a.name}：${a.description}`)
    //Permanent effect: Maximum physical strength +20
    if (a.id === 'shan_weng_3') {
      playerStore.addBonusMaxStamina(20)
    }
  }// Fix old saves: ensure activated shan_weng_3 stamina bonus is applied correctly
  if (hiddenNpcStore.isAbilityActive('shan_weng_3')) {
    const expected = 20
    if (playerStore.bonusMaxStamina < expected) {
      playerStore.addBonusMaxStamina(expected - playerStore.bonusMaxStamina)
    }
  }

  // === Evening settlement (old date) ===

  // Shipping box settlement
  const shopStore = useShopStore()
  const shippingIncome = shopStore.processShippingBox()
  if (shippingIncome > 0) {
    playerStore.earnMoney(shippingIncome)
    addLog(`Shipping box settlement: Income ${shippingIncome} text.`)
  }

  // Commission is updated daily (settlement on the day: countdown decrement, expiration processing)
  const expiredQuests = questStore.dailyUpdate()
  for (const eq of expiredQuests) {
    addLog(`Delegation "${eq.description}" has expired.`)
  }

  // Main task progress check
  questStore.updateMainQuestProgress()

  // === Date advancement ===
  const { seasonChanged, oldSeason } = gameStore.nextDay()

  // === Morning settlement (new date) ===

  // Refresh Hanhai rotating products (use new date, refresh on the first day of each week or when loading for the first time)
  if (hanhaiStore.unlocked && (gameStore.day % 7 === 1 || hanhaiStore.weeklyRotatingStock.length === 0)) {
    hanhaiStore.refreshRotatingStock()
  }

  // animal output
  const animalResult = animalStore.dailyUpdate()
  if (animalResult.products.length > 0) {
    for (const p of animalResult.products) {
      inventoryStore.addItem(p.itemId, 1, p.quality)
    }
    addLog(`Animals produced ${animalResult.products.length} products.`)
  }
  if (animalResult.died.length > 0) {
    addLog(`${animalResult.died.join(', ')} died due to long-term hunger or serious illness...`)
  }
  if (animalResult.gotSick.length > 0) {
    addLog(`${animalResult.gotSick.join(', ')} is sick due to hunger! Please feed as soon as possible.`)
  }
  if (animalResult.healed.length > 0) {
    addLog(`${animalResult.healed.join(', ')} restored health after eating.`)
  }

  // Morning feeding (dailyUpdate has been reset by wasFed): Feeding employees will feed in the morning work below; when there are no employees, the spouse who fed last night will continue to feed
  if (spouse && spouseFedSuccess && !npcStore.hiredHelpers.some(h => h.task === 'feed')) {
    const result = animalStore.feedAll()
    if (result. fedCount > 0) {
      addLog(`${getNpcById(spouse.npcId)?.name ?? 'Spouse'} fed ${result.fedCount} livestock early in the morning (${formatFeedUsage(result.used)}).`)
    }
  }

  // Morning work: hired workers feeding/watering/harvesting/weeding/collecting processed products
  const helperMorningResult = npcStore.processDailyHelpers(['feed', 'water', 'harvest', 'weed', 'collect'])for (const msg of helperMorningResult.messages) addLog(msg)

  // Morning job: Spouse watering/cooking/harvesting
  if (spouse) {
    const spouseDef = getNpcById(spouse.npcId)
    const spouseName = spouseDef?.name ?? 'spouse'
    const bonusChance = spouse.friendship >= 2500 ? 0.1 : 0
    const highBond = spouse.friendship >= 3000 ? 0.15 : 0

    // Watering: 50% + bonus + highBond, 3-6 pieces
    if (Math.random() < 0.5 + bonusChance + highBond) {
      const unwatered = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered)
      const count = Math.min(unwatered.length, 3 + Math.floor(Math.random() * 4))
      for (let i = 0; i < count; i++) farmStore.waterPlot(unwatered[i]!.id)
      if (count > 0) addLog(`${spouseName} helped you water ${count} pieces of land early in the morning.`)
    }

    // Cooking: 30% + bonus (favorability >= 2000)
    if (spouse.friendship >= 2000 && Math.random() < 0.3 + bonusChance) {const foods = ['food_rice_ball', 'food_congee', 'food_steamed_bun', 'food_honey_tea', 'food_stir_fry', 'food_dumpling']
      const food = foods[Math.floor(Math.random() * foods.length)]!
      inventoryStore.addItem(food)
      addLog(`${spouseName} made a meal early in the morning ${getItemById(food)?.name ?? 'food'}.`)
    }

    // Harvest: 30% (favorability >= 3000), up to 3 yuan, no harvest when the backpack is full
    if (spouse.friendship >= 3000 && !inventoryStore.isFull && Math.random() < 0.3 + bonusChance) {
      const harvestable = farmStore.plots.filter(p => p.state === 'harvestable')
      const harvestCount = Math.min(harvestable.length, 3)
      let harvested = 0
      // After the multiple crops are harvested, the plot is cleared and recorded separately.
      const exhaustedNames: string[] = []
      for (let i = 0; i < harvestCount; i++) {
        if (inventoryStore.isFull) break
        const hResult = farmStore.harvestPlot(harvestable[i]!.id)
        if (hResult.cropId) {
          // Land level: extra +1 per level, same as the main output of normal quality
          inventoryStore.addItem(hResult.cropId, 1 + hResult.bonus, 'normal')
          harvested++
          if (hResult.exhausted) exhaustedNames.push(getCropById(hResult.cropId)?.name ?? hResult.cropId)
        }
      }
      if (harvested > 0) addLog(`${spouseName} helped you harvest crops from ${harvested} piece of land early this morning.`)
      if (exhaustedNames.length > 0) addLog(formatExhaustedLog(exhaustedNames))
    }
  }

  //Incubator update
  const incubatorResult = animalStore.dailyIncubatorUpdate()
  if (incubatorResult.hatched) {
    addLog(`The egg in the chicken coop incubator hatched an ${incubatorResult.hatched.name}!`)
  }

  // Barn Incubator Update
  const barnIncubatorResult = animalStore.dailyBarnIncubatorUpdate()
  if (barnIncubatorResult.hatched) {
    addLog(`The egg in the barn incubator hatched a ${barnIncubatorResult.hatched.name}!`)
  }//Daily updates on pets: cats insects catching and picking up objects
  const petResult = animalStore.dailyPetUpdate()
  const petName = animalStore.pet?.name ?? 'Pet'
  if (petResult.pestsCleared > 0) {
    addLog(`${petName} caught ${petResult.pestsCleared} pests.`)
  }
  if (petResult.item) {
    addLog(`${petName} retrieved ${getItemById(petResult.item)?.name ?? petResult.item}.`)
  }

  // Fish pond updated daily
  const fishPondStore = useFishPondStore()
  if (fishPondStore.pond.built) {
    const pondResult = fishPondStore.dailyUpdate()
    for (const p of pondResult.products) {
      inventoryStore.addItem(p.itemId, 1, p.quality)
    }
    if (pondResult.products.length > 0) {
      addLog(`The fish pond produced ${pondResult.products.length} pieces of aquatic products.`)
    }
    if (pondResult.died.length > 0) {
      addLog(`${pondResult.died.join(', ')} died due to serious illness...`)
    }
    if (pondResult.gotSick.length > 0) {
      addLog(`${pondResult.gotSick.join(', ')} is sick! Please treat in time.`)
    }
    if (pondResult.bred) {
      addLog(`Fish pond breeding successful, new ${pondResult.bred} was born!`)
    }
    if (pondResult.breedingFailed) {
      addLog(`${pondResult.breedingFailed}.`)
    }
  }

  // Crab pot baiting labor settlement (before harvesting)
  const helperBaitResult = npcStore.processDailyHelpers(['bait'])
  for (const msg of helperBaitResult.messages) addLog(msg)

  // Crab pot harvest
  const fishingStore = useFishingStore()
  const crabPotHarvest = fishingStore.collectCrabPots()
  if (crabPotHarvest. length > 0) {const names = crabPotHarvest.map(c => c.name).join(', ')
    addLog(`The crab pot caught ${names}.`)
  }

  //Cave output
  if (homeStore.caveChoice !== 'none') {
    homeStore.caveDaysActive++
  }
  const caveProducts = homeStore.dailyCaveUpdate()
  for (const p of caveProducts) {
    inventoryStore.addItem(p.itemId, p.quantity, p.quality)
    const itemDef = getItemById(p.itemId)
    const qualityLabel =
      p.quality === 'normal' ? '' : p.quality === 'fine' ? '(High Quality)' : p.quality === 'excellent' ? '(Excellent)' : '(Excellent)'
    const qtyText = p.quantity > 1 ? `${p.quantity}` : ''
    addLog(`${qtyText}${itemDef?.name ?? p.itemId}${qualityLabel} was found in the cave.`)
  }

  //Fruit tree update
  const fruitResult = farmStore.dailyFruitTreeUpdate(gameStore.season)
  for (const f of fruitResult.fruits) {
    inventoryStore.addItem(f.fruitId, 1, f.quality)
  }
  if (fruitResult.fruits.length > 0) {
    addLog(`The fruit tree produced ${fruitResult.fruits.length} fruits.`)
  }

  // Wild trees update
  const wildTreeResult = farmStore.dailyWildTreeUpdate()
  for (const p of wildTreeResult.products) {
    inventoryStore.addItem(p.productId)
  }
  if (wildTreeResult.products.length > 0) {
    addLog(`The fat collector harvested ${wildTreeResult.products.map(p => p.productName).join(', ')}.`)
  }

  // Greenhouse update
  if (homeStore.greenhouseUnlocked) {farmStore.greenhouseDailyUpdate()
  }

  // Wine cellar update
  if (homeStore.farmhouseLevel >= 3) {
    const cellarResult = homeStore.dailyCellarUpdate()
    for (const r of cellarResult.upgraded) {
      const name = getItemById(r.itemId)?.name ?? r.itemId
      addLog(`The value of ${name} in the wine cellar has increased by +${homeStore.cellarValuePerCycle} text (a total of +${r.addedValue} text)`)
      if (r.upgradeCount >= 16 && r.upgradeCount % 16 === 0) {
        addLog(`${name} has become aged${r.upgradeCount / 16} years!`)
      }
    }
  }

  //Wallet unlock check
  const walletStore = useWalletStore()
  const newWalletItems = walletStore.checkAndUnlock()
  for (const name of newWalletItems) {
    addLog(`Wallet item unlocked: ${name}!`)
  }

  //Wedding countdown
  const weddingResult = npcStore.dailyWeddingUpdate()
  if (weddingResult.weddingToday && weddingResult.npcId) {
    const weddingNpcDef = getNpcById(weddingResult.npcId)
    addLog(`Today is your special day with ${weddingNpcDef?.name ?? 'Sweetheart'}!`)
    triggerWeddingEvent(weddingResult.npcId)
  }

  //Daily updates during pregnancy
  const pregResult = npcStore.dailyPregnancyUpdate()
  if (pregResult.born) {
    const qMsg =
      pregResult.born.quality === 'healthy' ? 'Healthy! ' : pregResult.born.quality === 'premature' ? 'Although the baby was born prematurely, it was safe and sound. ' : ''
    addLog(`${pregResult.born.name} is born! Congratulations! ${qMsg}`)
  }
  if (pregResult.stageChanged) {
    const stageLabels: Record<string, string> = {
      early: 'early',
      mid: 'mid',
      late: 'late',
      ready: 'waiting period'
    }
    addLog(`Enter ${stageLabels[pregResult.stageChanged.to]} during pregnancy. Remember to take care of your spouse.`)
  }
  if (pregResult.miscarriage) {
    addLog('Unfortunately... new life could not be ushered in this time. Both parties will need some time to recover.')
  }

  //Children's growth (born children)
  for (const milestone of npcStore.dailyChildUpdate()) addLog(milestone)

  // NPC proposes to have a child (no automatic confirmation, player will respond after returning home)
  if (npcStore.checkChildProposal()) {
    npcStore.triggerChildProposal()const spouseDef2 = getNpcById(npcStore.getSpouse()?.npcId ?? '')
    addLog(`${spouseDef2?.name ?? 'Spouse'} seems to have something to say to you...`)
  }

  // Generate delegate for new day (after nextDay, with new season and new date)
  questStore.generateDailyQuests(gameStore.season, gameStore.day)

  // Generate a special order every 7 days (day 7/14/21/28, gradient increasing)
  const specialOrderDays: Record<number, number> = {
    7:1,
    14:2,
    21:3,
    28:4
  }
  const tier = specialOrderDays[gameStore.day]
  if (tier && !questStore.specialOrder) {
    questStore.generateSpecialOrder(gameStore.season, tier)
  }

  // If it rains on the new day, water all crops immediately (let the player see the watered status)
  if (gameStore.isRainy) {for (const plot of farmStore.plots) {
      if (plot.state === 'planted' || plot.state === 'growing') {
        plot.watered = true
        plot.unwateredDays = 0
      }
    }
  }

  const bedHour = gameStore.hour
  const { moneyLost, recoveryPct } = playerStore.dailyReset(recoveryMode, bedHour)

  // Daily reward for fairy bonding (must be after dailyReset, otherwise stamina_restore will be overwritten)
  const bondMessages = hiddenNpcStore.dailyBondBonus()
  for (const msg of bondMessages.messages) addLog(msg)

  let summary: string
  if (recoveryMode === 'passout') {
    summary =
      moneyLost > 0
        ? `You collapsed from exhaustion... Someone took you home. The ${moneyLost} text is lost. Only 50% of physical strength will be restored the next day. `
        : `You collapsed due to exhaustion... Only 50% of your physical strength will be restored the next day. `
    // Record the fainting instructions and notify the player through the GameLayout pop-up window to avoid "waking up and missing money inexplicably"
    lastPassOutNotice.value = summary
  } else if (recoveryMode === 'late') {
    const pct = Math.round(recoveryPct * 100)
    summary = `You stayed up very late and went to bed...only ${pct}% of your physical strength was restored the next day. `
  } else {
    summary = 'A wonderful day is over. '
  }

  addLog(summary)

  // Season change processing
  if (seasonChanged) {
    const { witheredCount, reclaimedCount } = farmStore.onSeasonChange(gameStore.season)
    addLog(`—— Season change: ${SEASON_NAMES[oldSeason]}→${SEASON_NAMES[gameStore.season]} ——`)
    if (witheredCount > 0) {
      addLog(`${witheredCount} crops that are not adapted to the new season have withered...`)
    }
    if (reclaimedCount > 0) {
      addLog(`${reclaimedCount} pieces of abandoned farmland are covered with weeds.`)
    }
    if (oldSeason === 'winter' && gameStore.season === 'spring') {
      addLog('The new year has begun! The farm has been somewhat deserted after a winter and needs to be reclaimed.')
    }
    farmStore.fruitTreeSeasonUpdate(oldSeason === 'winter')

    // Taoyuan Farm: Automatic fertilization during seasonal changes (off by default, can be turned on in settings)
    if (gameStore.farmMapType === 'standard' && useSettingsStore().autoFertilizeOnSeasonChange) {
      const { count: fertCount,fertilizerName } = farmStore.applyFertileSoil(skillStore.getSkill('farming').level)
      if (fertCount > 0) {
        addLog(`The fertile soil of Taoyuan nourishes the earth, and ${fertCount} pieces of farmland are obtained by ${fertilizerName}.`)
      }
    }

    // Beginner's Guide: Recording Season Change Marks
    tutorialStore.setFlag('justChangedSeason')
  }

  // lightning
  if (gameStore.weather === 'stormy') {
    const strike = farmStore.lightningStrike()
    if (strike.absorbed) {
      inventoryStore.addItem('battery')
      addLog('The lightning rod absorbed a bolt of lightning! Obtained a battery pack.')} else if (strike.hit) {
      addLog(`A bolt of lightning struck your farm during a thunderstorm, and a ${strike.cropName} plant was destroyed! Build a lightning rod to protect it.`)
    }
  }

  if (gameStore.isRainy) {
    addLog('It rains today, the crops will be watered automatically.')
  }

  // weather forecast
  addLog(`Tomorrow’s weather forecast: ${WEATHER_NAMES[gameStore.tomorrowWeather]}`)

  // Season change countdown reminder (morning of days 25-27)if (!seasonChanged && gameStore.day >= 25 && gameStore.day <= 27) {
    const daysLeft = 28 - gameStore.day
    const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
    const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
    let cropAtRisk = 0
    for (const plot of farmStore.plots) {
      if ((plot.state === 'planted' || plot.state === 'growing' || plot.state === 'harvestable') && plot.cropId) {
        const crop = getCropById(plot.cropId)
        if (crop && !crop.season.includes(nextSeason)) cropAtRisk++
      }
    }
    if (cropAtRisk > 0) {
      addLog(`There are still ${daysLeft} days before the season change, and the ${cropAtRisk} crop is not adapted to the ${SEASON_NAMES[nextSeason]} season and will wither by then.`)
      showFloat(`Countdown to season change ${daysLeft} days!${cropAtRisk} crops will wither`, 'danger')
    } else {
      addLog(`There are ${daysLeft} days until the season change.`)
    }
  }

  // Today's Quote
  const marketInfo = getDailyMarketInfo(gameStore.year, gameStore.seasonIndex, gameStore.day, shopStore.getRecentShipping())
  const booms = marketInfo.filter(m => m.trend === 'boom')
  const crashes = marketInfo.filter(m => m.trend === 'crash')
  if (booms. length > 0) {
    addLog(`Today’s market price: ${booms.map(b => MARKET_CATEGORY_NAMES[b.category]).join(', ')} The price has soared! `)
  }
  if (crashes. length > 0) {
    addLog(`Today’s quotation: ${crashes.map(c => MARKET_CATEGORY_NAMES[c.category]).join(', ')}The price plummeted.`)
  }

  // Beginner's Guide: Morning Tips (Year 1 only)
  // Note: nextDay() has been executed at this time, gameStore.day is the date of the new day
  // For example, after the player ends day 1, gameStore.day === 2 (morning of day 2)
  if (tutorialStore.enabled && gameStore.year === 1) {
    const conditions: Record<string, () => boolean> = {
      earlyFirstDay: () => gameStore.day === 2 && gameStore.season === 'spring',
      allWasteland: () => farmStore.plots.every(p => p.state === 'wasteland') && gameStore.day > 2,
      tilledNoPlanted: () =>
        farmStore.plots.some(p => p.state === 'tilled') &&
        !farmStore.plots.some(p => p.state === 'planted' || p.state === 'growing' || p.state === 'harvestable'),
      plantedUnwatered: () =>
        farmStore.plots.some(p => (p.state === 'planted' || p.state === 'growing') && !p.watered) && !gameStore.isRainy,
      hasHarvestable: () => farmStore.plots.some(p => p.state === 'harvestable'),harvestedNeverSold: () => achievementStore.stats.totalCropsHarvested > 0 && achievementStore.stats.totalMoneyEarned === 0,
      earlyGame: () => gameStore.day <= 4 && gameStore.season === 'spring',
      staminaWasLow: () => tutorialStore.getFlag('staminaWasLow'),
      neverVisitedShop: () => !tutorialStore.hasPanelVisited('shop'),
      neverFished: () => achievementStore.stats.totalFishCaught === 0 && gameStore.day >= 4,
      neverMined: () => achievementStore.stats.highestMineFloor === 0 && gameStore.day >= 6,
      neverTalkedNpc: () => npcStore.npcStates.every(n => n.friendship === 0) && gameStore.day >= 3,
      neverCheckedQuests: () => !tutorialStore.hasPanelVisited('quest') && gameStore.day >= 5,
      neverCooked: () => achievementStore.stats.totalRecipesCooked === 0 && gameStore.day >= 8,firstRainyDay: () => gameStore.isRainy && !tutorialStore.getFlag('seenRain'),
      justChangedSeason: () => tutorialStore.getFlag('justChangedSeason'),
      hasCropNoSprinkler: () =>
        farmStore.plots.some(p => p.state === 'growing') && farmStore.sprinklers.length === 0 && gameStore.day >= 11,
      neverHadAnimal: () => animalStore.animals.length === 0 && gameStore.day >= 15
    }
    for (const tip of MORNING_TIPS) {
      if (tutorialStore.isTipShown(tip.id)) continue
      const check = conditions[tip.conditionKey]
      if (check && check()) {
        addLog(tip.message)
        tutorialStore.markTipShown(tip.id)
        if (tip.conditionKey === 'firstRainyDay') tutorialStore.setFlag('seenRain')
        if (tip.conditionKey === 'justChangedSeason') tutorialStore.setFlag('seenSeasonChange')
        break // Only display one item per day
      }
    }
    // Clear temporary mark
    tutorialStore.setFlag('justChangedSeason', false)
    tutorialStore.setFlag('staminaWasLow', false)
  }

  //recipe unlock
  checkRecipeUnlocks()

  // seasonal events
  const event = getTodayEvent(gameStore.season, gameStore.day)
  if (event) {
    applyEventEffects(event)
    if (event.interactive && event.festivalType) {
      showFestival(event.festivalType)
    } else {
      const { startFestivalBgm } = useAudio()
      startFestivalBgm(gameStore.season)
    }
    // Replace dynamic placeholders in narrative
    const ORDINALS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    const yearStr = gameStore.year <= 10 ? ORDINALS[gameStore.year - 1]! : String(gameStore.year)
    const resolved = {
      ...event,
      narrative: event.narrative.map(line => line.replace('{year}', yearStr))
    }
    showEvent(resolved)
  }

  // Achievements check
  const newAchievements = achievementStore.checkAchievements()
  for (const a of newAchievements) {
    addLog(`[Achievement achieved]${a.name}!${a.reward.money ? `Get ${a.reward.money} text`: ''}`)
    showFloat(`Achievement: ${a.name}`, 'accent')
  }

  //Achievement recipe unlocked
  checkAchievementRecipes()

  //Cave unlock checkif (!homeStore.caveUnlocked && achievementStore.stats.totalMoneyEarned >= CAVE_UNLOCK_EARNINGS) {
    homeStore.unlockCave()
    addLog('Your accumulated income has attracted attention...The cave behind the village has been opened for you! Go to the facilities panel to select the purpose of the cave.')
  }

  // ===== Grange special effects =====

  // Wilderness Grange: Passive Ore (enhancement) + Night Beast Encounter
  if (gameStore.farmMapType === 'wilderness') {
    const orePool = ['copper_ore', 'iron_ore', 'gold_ore']
    const randomOre = orePool[Math.floor(Math.random() * orePool.length)]!
    const qty = 2 + Math.floor(Math.random() * 2) // 2-3
    inventoryStore.addItem(randomOre, qty)
    const oreDef = getItemById(randomOre)
    addLog(`${qty}${oreDef?.name ?? randomOre} found in the wilderness.`)

    // Night beast encounter (25% probability)
    if (Math.random() < 0.25) {
      const combatLevel = skillStore.getSkill('combat').level
      const winRate = Math.min(0.95, 0.5 + combatLevel * 0.05)
      if (Math.random() < winRate) {
        const lootPool = ['copper_ore', 'iron_ore', 'quartz', 'jade', 'gold_ore']
        const loot = lootPool[Math.floor(Math.random() * lootPool.length)]!const lootQty = 1 + Math.floor(Math.random() * 2)
        inventoryStore.addItem(loot, lootQty)
        skillStore.addExp('combat', 15)
        const lootName = getItemById(loot)?.name ?? loot
        addLog(`A wild beast invaded at night! You fought it off and captured ${lootQty}${lootName}.`)
      } else {
        const damage = 5 + Math.floor(Math.random() * 11) // 5-15
        playerStore.takeDamage(damage)
        const crops = farmStore.plots.filter(p => p.state === 'growing' || p.state === 'harvestable')
        if (crops. length > 0) {
          const target = crops[Math.floor(Math.random() * crops.length)]!
          const cropName = getCropById(target.cropId ?? '')?.name ?? 'crop'
          farmStore.removeCrop(target.id)
          addLog(`A wild beast invaded at night! You failed to stop it, you suffered ${damage} points of injury, and a ${cropName} plant was destroyed.`)
        } else {
          addLog(`A wild beast invaded at night! You failed to stop it and suffered ${damage} points of injury.`)
        }
      }
    }
  }

  // Bamboo Forest Farm: Daily Collecting Things in the Forest
  if (gameStore.farmMapType === 'forest') {
    const foragePool = getForageItems(gameStore.season)
    const commonForage = foragePool.filter(f => f.chance >= 0.1)
    if (commonForage. length > 0) {
      const count = 1 + (Math.random() < 0.4 ? 1 : 0) // 1-2
      const gathered: string[] = []
      for (let i = 0; i < count; i++) {
        const item = commonForage[Math.floor(Math.random() * commonForage.length)]!
        const quality = skillStore.rollForageQuality()
        inventoryStore.addItem(item.itemId, 1, quality)
        skillStore.addExp('foraging', item.expReward)
        gathered.push(getItemById(item.itemId)?.name ?? item.itemId)}
      addLog(`${gathered.join('and')} was found in the bamboo forest.`)
    }
  }

  // Hill Grange: Surface mineral vein generation
  if (gameStore.farmMapType === 'hilltop') {
    if (!gameStore.surfaceOrePatch && Math.random() < 0.35) {
      const year = gameStore.year
      const orePool = year >= 2 ? ['copper_ore', 'iron_ore', 'gold_ore'] : ['copper_ore', 'iron_ore']
      const oreId = orePool[Math.floor(Math.random() * orePool.length)]!
      const qty = 3 + Math.floor(Math.random() * 3) // 3-5
      gameStore.surfaceOrePatch = { oreId, quantity: qty }
      const oreName = getItemById(oreId)?.name ?? 'ore'
      addLog(`A ${oreName} vein was found on the hill!`)
    }
  }

  // Stream Grange: Fish are generated in the stream
  if (gameStore.farmMapType === 'riverland') {
    const seasonFish = FISH.filter(f => (f.location ?? 'creek') === 'creek' && f.season.includes(gameStore.season as any))
    if (seasonFish. length > 0) {
      const isRainy = gameStore.isRainy
      const catchCount = isRainy ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)
      const catches: {
        fishId: string
        quality: 'normal' | 'fine' | 'excellent' | 'supreme'
      }[] = []
      for (let i = 0; i < catchCount; i++) {
        const fish = seasonFish[Math.floor(Math.random() * seasonFish.length)]!
        const quality: 'normal' | 'fine' = Math.random() < 0.15 ? 'fine' : 'normal'
        catches.push({ fishId: fish.id, quality })
      }
      const MAX_CREEK_CATCH = 10const merged = [...gameStore.creekCatch, ...catches].slice(0, MAX_CREEK_CATCH)
      gameStore.creekCatch = merged
      addLog(`There are fish jumping in the stream, go to the farm panel to collect the fish.`)
    }
  }

  //Pet adoption trigger (starting from the 7th day of the first year in spring, checking every day until adoption)
  if (gameStore.day >= 7 && gameStore.year === 1 && gameStore.season === 'spring' && !animalStore.pet) {
    triggerPetAdoption()
  }

  // Return to the farm page (to prevent you from continuing to operate on pages such as shops)
  void router.push({ name: 'farm' })

  //Auto archive
  saveStore.autoSave()
}

export const useEndDay = () => {
  return { handleEndDay }
}