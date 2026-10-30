import type { InventoryItem, Quality } from '@/types'

const MAX_STACK = 999
const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']

/** Standardized aging value-added (document/file): non-positive numbers are treated as 0 */
export const normalizeAddedValue = (value?: number): number => (typeof value === 'number' && value > 0 ? Math.floor(value) : 0)

/** The aging value of the item stack (file/file), if not, it will be 0 */
export const getAddedValue = (stack: { addedValue?: number }): number => normalizeAddedValue(stack.addedValue)

/** Only items, quality, and aging value-added are the same to be considered the same stack and can be merged */
export const isSameStack = (stack: InventoryItem, itemId: string, quality: Quality, addedValue: number): boolean =>
  stack.itemId === itemId && stack.quality === quality && getAddedValue(stack) === addedValue

/** The unique key of the item stack (list key / used in selected state) */
export const getStackKey = (stack: InventoryItem): string => `${stack.itemId}:${stack.quality}:${getAddedValue(stack)}`

/** Create a new item stack, do not write the addedValue field when there is no added value */
export const makeStack = (itemId: string, quantity: number, quality: Quality, addedValue: number): InventoryItem =>
  addedValue > 0 ? { itemId, quantity, quality, addedValue } : { itemId, quantity, quality }

/** Putting items in: first fill up the same stack, then open a new stack (the total number of cells does not exceed capacity), and return the amount that cannot be placed */
export const putIntoStacks = (
  pool: InventoryItem[],
  capacity: number,
  itemId: string,
  quantity: number,
  quality: Quality,
  addedValue: number
): number => {
  let remaining = quantity
  for (const slot of pool) {
    if (remaining <= 0) break
    if (isSameStack(slot, itemId, quality, addedValue) && slot.quantity < MAX_STACK) {
      const canAdd = Math.min(remaining, MAX_STACK - slot.quantity)
      slot.quantity += canAdd
      remaining -= canAdd
    }
  }
  while (remaining > 0 && pool.length < capacity) {
    const batch = Math.min(remaining, MAX_STACK)
    pool.push(makeStack(itemId, batch, quality, addedValue))
    remaining -= batch
  }
  return remaining
}

/** How much more can be put in (remaining on the same stack + spaces) */
export const getStackSpace = (pool: InventoryItem[], capacity: number, itemId: string, quality: Quality, addedValue: number): number => {
  let space = Math.max(0, capacity - pool.length) * MAX_STACK
  for (const slot of pool) {
    if (isSameStack(slot, itemId, quality, addedValue) && slot.quantity < MAX_STACK) space += MAX_STACK - slot.quantity
  }
  return space
}

/** Statistics quantity; quality / addedValue is not limited if not passed */
export const countStacks = (pool: InventoryItem[], itemId: string, quality?: Quality, addedValue?: number): number =>
  pool
    .filter(
      s =>
        s.itemId === itemId &&
        (quality === undefined || s.quality === quality) &&
        (addedValue === undefined || getAddedValue(s) === addedValue)
    )
    .reduce((sum, s) => sum + s.quantity, 0)

/**
 * Retrieve items from across the stack. If the quantity is insufficient, false will be returned and no changes will be made.
 * When value-added is not specified, the non-value-added items are consumed first, and then the value-added items are consumed from low to high; within the same value-added quantity, the quality is ordered from low to high.
 */
export const takeFromStacks = (
  pool: InventoryItem[],
  itemId: string,
  quantity: number,
  quality?: Quality,
  addedValue?: number
): boolean => {
  if (countStacks(pool, itemId, quality, addedValue) < quantity) return false
  const values =addedValue !== undefined ? [addedValue] : [...new Set(pool.filter(s => s.itemId === itemId).map(getAddedValue))].sort((a, b) => a - b)
  const qualities = quality !== undefined ? [quality] : QUALITY_ORDER
  let remaining = quantity
  for (const value of values) {
    for (const q of qualities) {
      for (let i = pool.length - 1; i >= 0 && remaining > 0; i--) {
        const slot = pool[i]!
        if (!isSameStack(slot, itemId, q, value)) continue
        const take = Math.min(remaining, slot.quantity)
        slot.quantity -= take
        remaining -= take
        if (slot.quantity <= 0) pool.splice(i, 1)
      }
    }
  }
  return true
}

/** Merge the same stack and split the stack that exceeds the upper limit (retaining locking and aging value-added), without sorting */
export const mergeStacks = (pool: InventoryItem[]): InventoryItem[] => {
  const merged: InventoryItem[] = []
  for (const item of pool) {
    const addedValue = getAddedValue(item)
    const existing = merged.find(m => isSameStack(m, item.itemId, item.quality, addedValue))
    if (existing) {
      existing.quantity += item.quantity
      if (item.locked) existing.locked = true
    } else {
      const stack = makeStack(item.itemId, item.quantity, item.quality, addedValue)
      merged.push(item.locked ? { ...stack, locked: true } : stack)
    }
  }
  const split: InventoryItem[] = []
  for (const item of merged) {
    let remaining = item.quantity
    while (remaining > 0) {
      const batch = Math.min(remaining, MAX_STACK)
      split.push({ ...item, quantity: batch })
      remaining -= batch
    }
  }
  return split
}