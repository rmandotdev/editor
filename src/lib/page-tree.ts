import type { Page } from "#types";

function findItemInTree(items: Page[], targetId: string): Page | null {
  for (const item of items) {
    if (item.id === targetId) return item;
    if (item.children) {
      const found = findItemInTree(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function findParentOf(items: Page[], targetId: string): Page[] | null {
  for (const item of items) {
    if (item.id === targetId) return items;
    if (item.children) {
      const found = findParentOf(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function findParentItemAndArray(
  items: Page[],
  targetId: string,
): { parentItem: Page; parentArray: Page[] } | null {
  for (const item of items) {
    if (item.id === targetId) {
      return null;
    }
    if (item.children) {
      if (item.children.some((child) => child.id === targetId)) {
        return { parentItem: item, parentArray: item.children };
      }
      const found = findParentItemAndArray(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function findIndexInParent(items: readonly Page[], targetId: string): number {
  return items.findIndex((item) => item.id === targetId);
}

function removeItemFromTree(items: Page[], targetId: string): Page | null {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    if (item.id === targetId) {
      return items.splice(i, 1)[0] ?? null;
    }
    if (item.children) {
      const removed = removeItemFromTree(item.children, targetId);
      if (removed) return removed;
    }
  }
  return null;
}

function moveItemBefore(
  items: Page[],
  itemId: string,
  beforeItemId: string,
): Page[] {
  if (itemId === beforeItemId) return structuredClone(items);

  const findItem = (list: Page[], id: string): Page | null => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const movedItem = findItem(items, itemId);
  if (movedItem?.children) {
    const isInSubtree = (list: Page[], targetId: string): boolean => {
      for (const item of list) {
        if (item.id === targetId) return true;
        if (item.children && isInSubtree(item.children, targetId)) return true;
      }
      return false;
    };
    if (isInSubtree(movedItem.children, beforeItemId))
      return structuredClone(items);
  }

  const newItems = structuredClone(items);

  const targetParent = findParentOf(newItems, beforeItemId);
  if (!targetParent) return newItems;

  const insertIdx = findIndexInParent(targetParent, beforeItemId);
  if (insertIdx < 0) return newItems;

  const item = removeItemFromTree(newItems, itemId);
  if (!item) return newItems;

  targetParent.splice(insertIdx, 0, item);
  return newItems;
}

function moveItemAfter(
  items: Page[],
  itemId: string,
  afterItemId: string,
): Page[] {
  if (itemId === afterItemId) return structuredClone(items);

  const findItem = (list: Page[], id: string): Page | null => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const movedItem = findItem(items, itemId);
  if (movedItem?.children) {
    const isInSubtree = (list: Page[], targetId: string): boolean => {
      for (const item of list) {
        if (item.id === targetId) return true;
        if (item.children && isInSubtree(item.children, targetId)) return true;
      }
      return false;
    };
    if (isInSubtree(movedItem.children, afterItemId))
      return structuredClone(items);
  }

  const newItems = structuredClone(items);

  const targetParent = findParentOf(newItems, afterItemId);
  if (!targetParent) return newItems;

  const afterIdx = findIndexInParent(targetParent, afterItemId);
  if (afterIdx < 0) return newItems;

  const item = removeItemFromTree(newItems, itemId);
  if (!item) return newItems;

  targetParent.splice(afterIdx + 1, 0, item);
  return newItems;
}

function moveItemInto(
  items: Page[],
  itemId: string,
  intoItemId: string,
): Page[] {
  if (itemId === intoItemId) return structuredClone(items);

  const findItem = (list: Page[], id: string): Page | null => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const movedItem = findItem(items, itemId);
  if (movedItem?.children) {
    const isInSubtree = (list: Page[], targetId: string): boolean => {
      for (const item of list) {
        if (item.id === targetId) return true;
        if (item.children && isInSubtree(item.children, targetId)) return true;
      }
      return false;
    };
    if (isInSubtree(movedItem.children, intoItemId))
      return structuredClone(items);
  }

  const newItems = structuredClone(items);

  const item = removeItemFromTree(newItems, itemId);
  if (!item) return newItems;

  const target = findItemInTree(newItems, intoItemId);
  if (!target) return newItems;

  if (!target.children) target.children = [];
  target.children.push(item);
  return newItems;
}

function moveItemOut(items: Page[], itemId: string): Page[] {
  const newItems = structuredClone(items);
  const parentInfo = findParentItemAndArray(newItems, itemId);
  if (!parentInfo) return newItems;

  const { parentItem } = parentInfo;
  const grandParent = findParentOf(newItems, parentItem.id);
  if (!grandParent) return newItems;

  const parentIdx = findIndexInParent(grandParent, parentItem.id);
  if (parentIdx < 0) return newItems;

  const removedItem = removeItemFromTree(newItems, itemId);
  if (!removedItem) return newItems;

  grandParent.splice(parentIdx + 1, 0, removedItem);
  return newItems;
}

export {
  findIndexInParent,
  findItemInTree,
  findParentOf,
  moveItemAfter,
  moveItemBefore,
  moveItemInto,
  moveItemOut,
};
