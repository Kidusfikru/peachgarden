import { useInventoryStore } from '@/stores/useInventoryStore'
import { useWarehouseStore } from '@/stores/useWarehouseStore'
import { getItemById } from '@/data/items'
import { getAddedValue } from '@/composables/useItemStacks'
import type { InventoryItem, Quality } from '@/types'

/** Backpack + warehouse combined by item and quality */
export interface CombinedStack {
  itemId: string
  quality: Quality
  quantity: number
}

/** Backpack + all boxes in the warehouse are totaled by item and quality (those in the backpack are listed first) */
export const getCombinedStacks = (filter: (stack: InventoryItem) => boolean): CombinedStack[] => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()
  const totals = new Map<string, CombinedStack>()
  const pools = wh.unlocked ? [inv.items, ...wh.chests.map(c => c.items)] : [inv.items]
  for (const pool of pools) {
    for (const stack of pool) {
      if (!filter(stack)) continue
      const key = `${stack.itemId}:${stack.quality}`
      const prev = totals.get(key)
      totals.set(key, { itemId: stack.itemId, quality: stack.quality, quantity: (prev?.quantity ?? 0) + stack.quantity })
    }
  }
  return [...totals.values()]
}

/** Items that can be given as gifts and enshrined: total backpack + warehouse, except seeds */
export const getGiftableStacks = (): CombinedStack[] =>
  getCombinedStacks(stack => {
    const def = getItemById(stack.itemId)
    return !!def && def.category !== 'seed'
  })

/** Total backpack + quantity of an item in all boxes in the warehouse */
export const getCombinedItemCount = (itemId: string, quality?: Quality): number => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()
  let total = inv.getItemCount(itemId, quality)
  if (wh.unlocked) {
    for (const chest of wh.chests) {
      total += wh.getChestItemCount(chest.id, itemId, quality)
    }
  }
  return total
}

/** Whether the total number of all boxes in the backpack + warehouse is sufficient */
export const hasCombinedItem = (itemId: string, quantity: number = 1): boolean => getCombinedItemCount(itemId) >= quantity

const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']

/** Boxes participating in the total deduction: Void raw material box first, the rest in order (empty when the warehouse is not unlocked) */
const getConsumeChests = () => {
  const wh = useWarehouseStore()
  if (!wh.unlocked) return []
  const voidInput = wh.getVoidInputChest()
  return voidInput ? [voidInput, ...wh.chests.filter(c => c.id !== voidInput.id)] : [...wh.chests]
}

/** The aging value-added level (including 0) of the item in the backpack or box, from low to high */
const getAddedValueTiers = (itemId: string, chests: { items: InventoryItem[] }[]): number[] => {
  const values = [useInventoryStore().items, ...chests.map(c => c.items)].flatMap(pool =>
    pool.filter(s => s.itemId === itemId).map(getAddedValue)
  )
  return [...new Set([0, ...values])].sort((a, b) => a - b)
}

/**
 * The total of backpack + warehouse will be deducted. Those without aging value-added are used first, and then the value-added ones are used from low to high; if the quality is not specified, the low-quality ones are used within the same value-added range.
 * In the same gear, press Backpack → Void Raw Material Box → Other boxes. When there is ordinary wine in the warehouse, the aged wine in the backpack will not be used up first.
 */
export const removeCombinedItem = (itemId: string, quantity: number = 1, quality?: Quality): boolean => {
  if (getCombinedItemCount(itemId, quality) < quantity) return false

  const inv = useInventoryStore()
  const wh = useWarehouseStore()
  const chests = getConsumeChests()
  const qualities = quality !== undefined ? [quality] : QUALITY_ORDERlet remaining = quantity
  for (const tier of getAddedValueTiers(itemId, chests)) {
    for (const q of qualities) {
      const fromInv = Math.min(remaining, inv.getItemCount(itemId, q, tier))
      if (fromInv > 0) {
        inv.removeItem(itemId, fromInv, q, tier)
        remaining -= fromInv
      }
      for (const chest of chests) {
        if (remaining <= 0) return true
        const take = Math.min(remaining, wh.getChestItemCount(chest.id, itemId, q, tier))
        if (take > 0) {
          wh.removeItemFromChest(chest.id, itemId, take, q, tier)
          remaining -= take
        }
      }
      if (remaining <= 0) return true
    }
  }

  return true
}

/** The quality of the item in the backpack + warehouse that will be used first by removeCombinedItem (the lowest quality in the lowest value-added file) */
export const getLowestCombinedQuality = (itemId: string): Quality => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()
  const chests = getConsumeChests()
  for (const tier of getAddedValueTiers(itemId, chests)) {
    for (const q of QUALITY_ORDER) {
      if (inv.getItemCount(itemId, q, tier) > 0) return q
      if (chests.some(c => wh.getChestItemCount(c.id, itemId, q, tier) > 0)) return q
    }
  }
  return 'normal'
}