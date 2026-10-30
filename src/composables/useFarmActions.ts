import { ref } from 'vue'
import { useAchievementStore } from '@/stores/useAchievementStore'
import { useBreedingStore } from '@/stores/useBreedingStore'
import { useCookingStore } from '@/stores/useCookingStore'
import { useFarmStore, formatExhaustedLog } from '@/stores/useFarmStore'
import { useGameStore } from '@/stores/useGameStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useShopStore } from '@/stores/useShopStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { getCropById, getItemById } from '@/data'
import { getFertilizerById } from '@/data/processing'
import { ACTION_TIME_COSTS } from '@/data/timeConstants'
import type { Quality, ItemCategory } from '@/types'
import type { SeedGenetics } from '@/types/breeding'
import type { FertilizerType } from '@/types/processing'
import { shouldReturnBreedingSeed, generateGeneticsId } from '@/data/breeding'
import { addLog, showFloat } from './useGameLog'
import { handleEndDay } from './useEndDay'
import { sfxDig, sfxPlant, sfxWater, sfxHarvest, sfxLevelUp, sfxBuy, sfxCoin } from './useAudio'

export const QUALITY_NAMES: Record<Quality, string> = {
  normal: 'normal',
  fine: 'excellent',
  excellent: 'Exquisite',
  supreme: 'superior'
}

/** Fairy fate: crop blessing (crop_blessing) probability quality +1 */
const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
export const applyCropBlessing = (quality: Quality): Quality => {
  const bondBonus = useHiddenNpcStore().getBondBonusByType('crop_blessing')
  if (bondBonus?.type === 'crop_blessing' && Math.random() < bondBonus.chance) {
    const idx = QUALITY_ORDER.indexOf(quality)
    if (idx < QUALITY_ORDER.length - 1) return QUALITY_ORDER[idx + 1]!
  }
  return quality
}

//Module level singleton state
const selectedSeed = ref<{ cropId: string; quality?: Quality } | null>(null)

/** Click to process the plot: plowing/planting/watering/harvesting */
export const handlePlotClick = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const achievementStore = useAchievementStore()

  const plot = farmStore.plots[plotId]
  if (!plot) return

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  if (plot.state === 'wasteland') {
    if (!inventoryStore.isToolAvailable('hoe')) {
      addLog('The hoe is being upgraded and cannot be cultivated.')
      return
    }
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,Math.floor(
        3*
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - ringFarmReduction) *
          (1 - ringGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Insufficient physical strength, unable to cultivate.')
      return
    }
    farmStore.tillPlot(plotId)
    sfxDig()
    showFloat(`-${cost}stamina`, 'danger')
    addLog(`You have reclaimed a piece of wasteland. (-${cost}Stamina)`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'tilled' && selectedSeed.value) {
    const cropDef = getCropById(selectedSeed.value.cropId)
    if (!cropDef) return
    if (!inventoryStore.hasItem(cropDef.seedId)) {
      addLog(`There is no ${cropDef.name} seed.`)
      return
    }
    const plantQuality = selectedSeed.value.quality
    const cropFarmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cropRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const cropRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,
      Math.floor(
        3*
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - cropFarmingBuff) *
          (1 - cropRingFarmReduction) *
          (1 - cropRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Insufficient physical strength, unable to sow.')
      return
    }
    inventoryStore.removeItem(cropDef.seedId, 1, plantQuality)
    farmStore.plantCrop(plotId, cropDef.id)
    sfxPlant()
    showFloat(`-${cost}stamina`, 'danger')
    addLog(`${cropDef.name} is planted. (-${cost} physical strength)`)
    // Planting Alert: Crops may not mature this season
    const daysLeft = 28 - gameStore.day
    if (cropDef.growthDays > daysLeft) {
      const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
      const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
      if (!cropDef.season.includes(nextSeason)) {
        showFloat(`${cropDef.name} needs ${cropDef.growthDays} days, only ${daysLeft} days left in this season!`, 'danger')
        addLog(`Note: ${cropDef.name} needs ${cropDef.growthDays} days to mature, but there are only ${daysLeft} days left in this season, and it will wither after the season changes.`)
      }
    }
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant)
    if (tr.message) addLog(tr.message)if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'planted' || plot.state === 'growing') {
    if (!inventoryStore.isToolAvailable('wateringCan')) {
      addLog('The kettle is being upgraded and cannot be watered.')
      return
    }
    if (plot. watered) {
      addLog('This land has been watered today.')
      return
    }
    const crop = getCropById(plot.cropId!)
    const baseCost = crop?.deepWatering ? 3 : 2
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0 const waterRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const waterRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,
      Math.floor(
        baseCost *
          inventoryStore.getToolStaminaMultiplier('wateringCan') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - waterRingFarmReduction) *
          (1 - waterRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Insufficient physical strength, unable to water.')
      return
    }
    farmStore.waterPlot(plotId)
    skillStore.addExp('farming', 2)
    sfxWater()
    showFloat(`-${cost}stamina`, 'water')
    addLog(`Watering completed. (-${cost}Stamina)`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.water)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'harvestable') {
    if (!inventoryStore.isToolAvailable('scythe')) {
      addLog('The sickle is being upgraded and cannot be harvested.')
      return
    }
    // Harvesting with the sickle does not consume stamina
    // Read fertilizer information before harvest clearing
    const plotFertilizer = plot.fertilizer
    const result = farmStore.harvestPlot(plotId)
    const cropId = result.cropId
    const genetics = result.genetics
    if (cropId) {
      const cropDef = getCropById(cropId)
      const fertDef = plotFertilizer ? getFertilizerById(plotFertilizer) : null
      const ringCropQualityBonus = inventoryStore.getRingEffectValue('crop_quality_bonus')
      const allSkillsBuff = cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0
      let quality = skillStore.rollCropQualityWithBonus((fertDef?.qualityBonus ?? 0) + ringCropQualityBonus, allSkillsBuff)
      quality = applyCropBlessing(quality)
      // Intensive farming talent: 20% probability of double harvest
      const intensiveDouble = skillStore.getSkill('farming').perk10 === 'intensive' && Math.random() < 0.2
      // Breeding yield bonus: yield/100 × 30% probability of double harvest
      const yieldDouble = genetics && !intensiveDouble && Math.random() < (genetics.yield / 100) * 0.3
      // Taoyuan Grange: 15% probability of additional harvestconst standardDouble = !intensiveDouble && !yieldDouble && gameStore.farmMapType === 'standard' && Math.random() < 0.15
      //Plot level: extra +1 per level (same crop, same quality)
      const harvestQty = (intensiveDouble || yieldDouble || standardDouble ? 2 : 1) + result.bonus
      inventoryStore.addItem(cropId, harvestQty, quality)
      achievementStore.discoverItem(cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(cropId, harvestQty)
      const { leveledUp, newLevel } = skillStore.addExp('farming', 10)
      const qualityLabel = quality !== 'normal' ? `(${QUALITY_NAMES[quality]})` : ''
      sfxHarvest()
      const qtyLabel = harvestQty > 1 ? `×${harvestQty}` : ''
      showFloat(`+${cropDef?.name ?? cropId}${qtyLabel}${qualityLabel}`, 'success')
      let msg = `Harvested ${cropDef?.name ?? cropId}${qtyLabel}${qualityLabel}! `
      if (intensiveDouble) msg += 'Intensive farming, double harvest! 'if (yieldDouble) msg ​​+= 'Breeding yield bonus, double harvest! '
      if (standardDouble) msg += ' Peachland fertile soil, extra harvest! '
      // Breeding sweetness bonus: extra copper coins
      if (genetics && genetics.sweetness > 0 && cropDef) {
        const bonusMoney = Math.floor((cropDef.sellPrice * harvestQty * genetics.sweetness) / 200)
        if (bonusMoney > 0) {
          usePlayerStore().earnMoney(bonusMoney)
          msg += `Sweetness bonus+${bonusMoney}text`
          showFloat(`+${bonusMoney}文`, 'accent')
        }
      }
      //Hybrid record
      if (genetics?.isHybrid && genetics.hybridId) {
        useBreedingStore().recordHybridGrown(genetics.hybridId)
      }
      // Breeding seed recycling
      if (genetics && shouldReturnBreedingSeed(quality)) {
        const returned: SeedGenetics = {
          ...genetics,
          id: generateGeneticsId()
        }
        if (useBreedingStore().addToBox(returned)) {
          msg += ' The breeding seeds have been recovered. '
        } else {
          msg += 'The seed box is full and the breeding seeds are lost! '
        }
      }
      if (leveledUp) {
        msg += ` Farming has been upgraded to ${newLevel}! `
        sfxLevelUp()
      }
      addLog(msg)
      if (result.exhausted) addLog(formatExhaustedLog([cropDef?.name ?? cropId]))
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.harvest)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    }
  }
}

/** Purchase seeds from the store */
export const handleBuySeed = (seedId: string) => {
  const shopStore = useShopStore()
  const walletStore = useWalletStore()
  const seed = shopStore.availableSeeds.find(s => s.seedId === seedId)
  if (!seed) return
  const discount = walletStore.getShopDiscount()
  const actualPrice = Math.floor(seed.price * (1 - discount))
  if (shopStore.buySeed(seedId)) {
    sfxBuy()
    showFloat(`-${actualPrice}文`, 'danger')addLog(`Purchased ${seed.cropName} seeds. (-${actualPrice} text)`)
  } else {
    addLog('Insufficient copper coins or the backpack is full.')
  }
}

/** Sell items through the store (addedValue: the added value of the stack of aged wine to be sold) */
export const handleSellItem = (itemId: string, quality: Quality, addedValue: number = 0) => {
  const shopStore = useShopStore()
  const itemDef = getItemById(itemId)
  if (!itemDef) return
  const earned = shopStore.sellItem(itemId, 1, quality, addedValue)
  if (earned > 0) {
    sfxCoin()
    showFloat(`+${earned}文`, 'accent')
    addLog(`Sold ${itemDef.name}. (+${earned}text)`)
  }
}

/** Sell the entire quantity of the specified item */
export const handleSellItemAll = (itemId: string, quantity: number, quality: Quality, addedValue: number = 0) => {
  const shopStore = useShopStore()
  const itemDef = getItemById(itemId)
  if (!itemDef || quantity <= 0) return
  const earned = shopStore.sellItem(itemId, quantity, quality, addedValue)
  if (earned > 0) {
    sfxCoin()
    showFloat(`+${earned}文`, 'accent')
    addLog(`Sold ${itemDef.name}×${quantity}. (+${earned} text)`)
  }
}

/** Sell all sellable items in the backpack with one click */
export const handleSellAll = (filterCategories?: ItemCategory[]) => {
  const shopStore = useShopStore()
  const inventoryStore = useInventoryStore()
  let totalEarned = 0
  let totalCount = 0const allowed = filterCategories && filterCategories.length > 0 ? new Set(filterCategories) : null
  // Snapshot the current items that can be sold (to avoid modifying the array during traversal)
  const sellable = inventoryStore.items
    .filter(inv => {
      const def = getItemById(inv.itemId)
      return def && def.category !== 'seed' && !def.protected && !inv.locked && (!allowed || allowed.has(def.category))
    })
    .map(inv => ({
      itemId: inv.itemId,
      quantity: inv.quantity,
      quality: inv.quality,
      addedValue: inv.addedValue ?? 0
    }))
  for (const item of sellable) {
    const earned = shopStore.sellItem(item.itemId, item.quantity, item.quality, item.addedValue)
    if (earned > 0) {
      totalEarned += earned
      totalCount += item.quantity
    }
  }
  if (totalEarned > 0) {
    sfxCoin()
    showFloat(`+${totalEarned}文`, 'accent')
    addLog(`Sold ${totalCount} items with one click. (+${totalEarned} text)`)
  }
}

/** One-click watering (watering all unwatered plots, automatically stopping when physical strength is insufficient) */
export const handleBatchWater = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('wateringCan')) {
    addLog('The kettle is being upgraded and cannot be watered.')
    return
  }

  if (gameStore.isPastBedtime) {addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered)
  if (targets.length === 0) {
    addLog('No plots need watering.')
    return
  }

  let watered = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  for (const plot of targets) {
    const crop = getCropById(plot.cropId!)
    const baseCost = crop?.deepWatering ? 3 : 2
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        baseCost *
          inventoryStore.getToolStaminaMultiplier('wateringCan') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.waterPlot(plot.id)
    skillStore.addExp('farming', 2)
    watered++
  }

  if (watered > 0) {
    sfxWater()
    addLog(`The ${watered} piece of land was watered with one click.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchWater * inventoryStore.getToolStaminaMultiplier('wateringCan'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient physical strength, unable to water.')
  }
}

/** One-click reclamation (reclaim all wasteland, automatically stop when physical strength is insufficient) */
export const handleBatchTill = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore() const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('hoe')) {
    addLog('The hoe is being upgraded and cannot be cultivated.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.state === 'wasteland')
  if (targets.length === 0) {
    addLog('There is no wasteland to be reclaimed.')
    return
  }

  let tilled = 0
  const tillRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const tillRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        3*
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - tillRingFarmReduction) *(1 - tillRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.tillPlot(plot.id)
    tilled++
  }

  if (tilled > 0) {
    sfxDig()
    addLog(`Reclaimed ${tilled} pieces of wasteland with one click.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill * inventoryStore.getToolStaminaMultiplier('hoe'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient physical strength, unable to cultivate.')
  }
}

/** One-click harvesting (harvest all mature crops without consuming physical energy) */
export const handleBatchHarvest = () => {
  const gameStore = useGameStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const achievementStore = useAchievementStore()

  if (!inventoryStore.isToolAvailable('scythe')) {
    addLog('The sickle is being upgraded and cannot be harvested.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  let harvested = 0
  const harvestedCrops: string[] = []

  // Harvest the giant crop first
  const giantGroups = new Set<number>()
  for (const plot of farmStore.plots) {
    if (plot.state === 'harvestable' && plot.giantCropGroup !== null) {
      giantGroups.add(plot.giantCropGroup)
    }
  }
  for (const groupId of giantGroups) {
    const groupPlot = farmStore.plots.find(p => p.giantCropGroup === groupId && p.state === 'harvestable')
    if (!groupPlot) continue
    const result = farmStore.harvestGiantCrop(groupPlot.id)
    if (result) {
      const cropDef = getCropById(result.cropId)
      inventoryStore.addItem(result.cropId, result.quantity)
      achievementStore.discoverItem(result.cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(result.cropId, result.quantity)
      skillStore.addExp('farming', 10)
      harvested++
      harvestedCrops.push(`Giant ${cropDef?.name ?? result.cropId}x${result.quantity}`)
    }
  }

  // Harvest common crops againconst targets = farmStore.plots.filter(p => p.state === 'harvestable' && p.giantCropGroup === null)
  let seedsReturned = 0
  const exhaustedCrops: string[] = []

  for (const plot of targets) {
    const plotFertilizer = plot.fertilizer
    const result = farmStore.harvestPlot(plot.id)
    const cropId = result.cropId
    const genetics = result.genetics
    if (cropId) {
      const cropDef = getCropById(cropId)
      const fertDef = plotFertilizer ? getFertilizerById(plotFertilizer) : null
      const batchRingCropQuality = inventoryStore.getRingEffectValue('crop_quality_bonus')
      const batchAllSkillsBuff = cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0let quality = skillStore.rollCropQualityWithBonus((fertDef?.qualityBonus ?? 0) + batchRingCropQuality, batchAllSkillsBuff)
      quality = applyCropBlessing(quality)
      const intensiveDouble = skillStore.getSkill('farming').perk10 === 'intensive' && Math.random() < 0.2
      const yieldDouble = genetics && !intensiveDouble && Math.random() < (genetics.yield / 100) * 0.3
      const standardDouble = !intensiveDouble && !yieldDouble && gameStore.farmMapType === 'standard' && Math.random() < 0.15
      // Plot level: read plot.level directly to avoid the possibility of obtaining the wrong plot when harvestPlot performs a secondary subscript search by id internally.
      const harvestQty = (intensiveDouble || yieldDouble || standardDouble ? 2 : 1) + plot.level
      inventoryStore.addItem(cropId, harvestQty, quality)
      achievementStore.discoverItem(cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(cropId, harvestQty)
      skillStore.addExp('farming', 10)
      harvested++
      harvestedCrops.push(cropDef?.name?? cropId)
      if (result.exhausted) exhaustedCrops.push(cropDef?.name ?? cropId)
      // Breeding sweetness bonus
      if (genetics && genetics.sweetness > 0 && cropDef) {
        const bonusMoney = Math.floor((cropDef.sellPrice * harvestQty * genetics.sweetness) / 200)
        if (bonusMoney > 0) {
          usePlayerStore().earnMoney(bonusMoney)
        }
      }
      if (genetics?.isHybrid && genetics.hybridId) {
        useBreedingStore().recordHybridGrown(genetics.hybridId)
      }
      // Breeding seed recycling
      if (genetics && shouldReturnBreedingSeed(quality)) {
        const returned: SeedGenetics = {
          ...genetics,
          id: generateGeneticsId()
        }
        if (useBreedingStore().addToBox(returned)) seedsReturned++
      }
    }
  }

  if (seedsReturned > 0) {
    addLog(`${seedsReturned} breeding seeds have been recovered to the seed box.`)
  }

  if (harvested > 0) {
    sfxHarvest()
    const cropCounts = new Map<string, number>()
    for (const name of harvestedCrops) {
      cropCounts.set(name, (cropCounts.get(name) ?? 0) + 1)
    }
    const cropSummary = Array.from(cropCounts.entries())
      .map(([name, count]) => (count > 1 ? `${name}x${count}` : name))
      .join(',')
    addLog(`Harvested ${harvested} crops with one click: ${cropSummary}.`)
    if (exhaustedCrops.length > 0) addLog(formatExhaustedLog(exhaustedCrops))const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchHarvest * inventoryStore.getToolStaminaMultiplier('scythe'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('No crops to harvest.')
  }
}

/** One-click planting (plant specified crops on all empty farmland) */
export const handleBatchPlant = (cropId: string) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('hoe')) {
    addLog('The hoe is being upgraded and cannot sow.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const cropDef = getCropById(cropId)
  if (!cropDef) return

  const targets = farmStore.plots.filter(p => p.state === 'tilled')
  if (targets.length === 0) {
    addLog('There is no empty farmland for planting.')
    return
  }

  let planted = 0
  const plantRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const plantRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  for (const plot of targets) {
    if (!inventoryStore.hasItem(cropDef.seedId)) break
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        3*
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - plantRingFarmReduction) *
          (1 - plantRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    inventoryStore.removeItem(cropDef.seedId)
    farmStore.plantCrop(plot.id, cropDef.id)
    planted++
  }

  if (planted > 0) {
    sfxPlant()
    addLog(`Planted ${planted} plants ${cropDef.name} with one click.`)
    // Planting Alert: Crops may not mature this season
    const daysLeft = 28 - gameStore.day
    if (cropDef.growthDays > daysLeft) {
      const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
      const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
      if (!cropDef.season.includes(nextSeason)) {
        showFloat(`${cropDef.name} needs ${cropDef.growthDays} days, only ${daysLeft} days left in this season!`, 'danger')
        addLog(`Note: ${cropDef.name} needs ${cropDef.growthDays} days to mature, but there are only ${daysLeft} days left in this season, and it will wither after the season changes.`)
      }
    }
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant * Math.min(planted, 3))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient physical strength or insufficient seeds, unable to plant.')
  }
}

/** One-click fertilization (apply specified fertilizer to all unfertilized non-wasteland) */
export const handleBatchFertilize = (fertilizerType: FertilizerType) => {
  const gameStore = useGameStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const fertDef = getFertilizerById(fertilizerType)if (!fertDef) returnconst targets = farmStore.plots.filter(p => p.state !== 'wasteland' && !p.fertilizer)
  if (targets.length === 0) {
    addLog('There are no plots to fertilize.')
    return
  }

  let applied = 0
  for (const plot of targets) {
    if (!inventoryStore.hasItem(fertilizerType)) break
    if (!inventoryStore.removeItem(fertilizerType)) break
    if (farmStore.applyFertilizer(plot.id, fertilizerType)) {
      applied++
    } else {
      inventoryStore.addItem(fertilizerType)
      break
    }
  }

  if (applied > 0) {
    showFloat(`Fertilization ×${applied}`, 'success')
    addLog(`The ${fertDef.name} of ${applied} land was applied with one click.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant * Math.min(applied, 3))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient fertilizer, cannot be fertilized.')
  }
}

/** Eradicate a single crop */
export const handleRemoveCrop = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const plot = farmStore.plots[plotId]
  if (!plot) return
  if (plot.state !== 'planted' && plot.state !== 'growing' && plot.state !== 'harvestable') {
    addLog('There are no crops in this plot that can be eradicated.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction)
    )
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Insufficient physical strength and cannot be eradicated.')
    return
  }

  const result = farmStore.removeCrop(plotId)
  if (result.cropId) {
    const cropDef = getCropById(result.cropId)
    sfxDig()
    addLog(`Eradicated ${cropDef?.name ?? result.cropId}.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** Pest removal (single block) */
export const handleCurePest = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }const plot = farmStore.plots[plotId]
  if (!plot || !plot.infested) {
    addLog('This plot has no pests.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina') const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction)
    )
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Insufficient physical strength and unable to eliminate insects.')
    return
  }

  if (farmStore.curePest(plotId)) {
    sfxDig()
    addLog('Pest removed.')
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** One-click pest removal (clear all pest-infested plots, automatically stop when physical strength is insufficient) */
export const handleBatchCurePest = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.infested)
  if (targets.length === 0) {
    addLog('No plots need to be dewormed.')
    return
  }

  let cured = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        2*
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.curePest(plot.id)
    cured++
  }

  if (cured > 0) {
    sfxDig()
    addLog(`The ${cured} piece of land was exterminated with one click.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient physical strength and unable to eliminate insects.')
  }
}

/** Weeding (single block) */
export const handleClearWeed = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const plot = farmStore.plots[plotId]
  if (!plot || !plot.weedy) {
    addLog('There are no weeds in this plot.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction))
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Insufficient physical strength and unable to weed.')
    return
  }

  if (farmStore.clearWeed(plotId)) {
    sfxDig()
    addLog('Weeds removed.')
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** One-click weeding (clear all weeds, automatically stop when physical strength is insufficient) */
export const handleBatchClearWeed = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('It's already 2 o'clock in the morning, you must rest.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.weedy)
  if (targets.length === 0) {
    addLog('No plots need weeding.')
    return
  }

  let cleared = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        2*
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.clearWeed(plot.id)
    cleared++
  }

  if (cleared > 0) {
    sfxDig()
    addLog(`${cleared} piece of land was weeded with one click.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Insufficient physical strength and unable to weed.')
  }
}

export const useFarmActions = () => {
  return {
    selectedSeed,
    handlePlotClick,
    handleBuySeed,
    handleSellItem,
    handleSellItemAll,
    handleSellAll,
    handleBatchWater,
    handleBatchTill,
    handleBatchHarvest,
    QUALITY_NAMES
  }}