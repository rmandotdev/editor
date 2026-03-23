import { createEffect, createSignal, onMount } from "solid-js";
import { moveItemOut } from "#lib/page-tree";
import type { Page } from "#types";

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_PAGE: Page = { id: generateId(), name: "Page 1", content: "" };

export function usePages() {
  const [pages, setPages] = createSignal<Page[]>([DEFAULT_PAGE]);
  const [currentPageId, setCurrentPageId] = createSignal<string>(
    DEFAULT_PAGE.id,
  );

  const findPageInTree = (items: Page[], targetId: string): Page | null => {
    for (const item of items) {
      if (item.id === targetId) return item;
      if (item.children) {
        const found = findPageInTree(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const findPageParent = (
    items: Page[],
    targetId: string,
    parent: Page[] | null = null,
  ): Page[] | null => {
    for (const item of items) {
      if (item.id === targetId) return parent;
      if (item.children) {
        const found = findPageParent(item.children, targetId, item.children);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const findPageIndex = (items: Page[], targetId: string): number => {
    return items.findIndex((item) => item.id === targetId);
  };

  const findItemInTree = (targetId: string): Page | null => {
    return findPageInTree(pages(), targetId);
  };

  const updateTreeAt = (
    targetId: string,
    updater: (item: Page) => Page,
  ): void => {
    const newPages = structuredClone(pages());
    const update = (items: Page[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.id === targetId) {
          items[i] = updater(item);
          return true;
        }
        if (item?.children) {
          if (update(item.children)) return true;
        }
      }
      return false;
    };
    update(newPages);
    setPages(newPages);
  };

  const removeFromTree = (targetId: string): Page | null => {
    const newPages = structuredClone(pages());
    let removed: Page | null = null;
    const remove = (items: Page[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.id === targetId) {
          removed = item;
          items.splice(i, 1);
          return true;
        }
        if (item?.children) {
          if (remove(item.children)) return true;
        }
      }
      return false;
    };
    remove(newPages);
    setPages(newPages);
    return removed;
  };

  const addToTree = (parentId: string | null, item: Page): void => {
    const newPages = structuredClone(pages());
    if (parentId === null) {
      newPages.push(item);
      setPages(newPages);
      return;
    }
    const add = (items: Page[]): boolean => {
      for (const it of items) {
        if (it.id === parentId) {
          if (!it.children) it.children = [];
          it.children.push(item);
          return true;
        }
        if (it.children) {
          if (add(it.children)) return true;
        }
      }
      return false;
    };
    add(newPages);
    setPages(newPages);
  };

  onMount(() => {
    const storedPages = localStorage.getItem("pages");
    const storedCurrentPage = localStorage.getItem("currentPageId");

    if (storedPages) {
      const parsedPages = JSON.parse(storedPages) as Page[];
      setPages(parsedPages.length > 0 ? parsedPages : [DEFAULT_PAGE]);

      if (storedCurrentPage) {
        const findIdInPages = (items: Page[], targetId: string): boolean => {
          for (const item of items) {
            if (item.id === targetId) return true;
            if (item.children && findIdInPages(item.children, targetId)) {
              return true;
            }
          }
          return false;
        };
        if (findIdInPages(parsedPages, storedCurrentPage)) {
          setCurrentPageId(storedCurrentPage);
        } else if (parsedPages.length > 0 && parsedPages[0]) {
          setCurrentPageId(parsedPages[0].id);
        }
      } else if (parsedPages.length > 0 && parsedPages[0]) {
        setCurrentPageId(parsedPages[0].id);
      }
    }

    window.addEventListener("storage", (event) => {
      if (!event.newValue) return;
      if (event.key === "pages") {
        setPages(JSON.parse(event.newValue));
      } else if (event.key === "currentPageId") {
        const newId = event.newValue;
        const findIdInPages = (items: Page[], targetId: string): boolean => {
          for (const item of items) {
            if (item.id === targetId) return true;
            if (item.children && findIdInPages(item.children, targetId)) {
              return true;
            }
          }
          return false;
        };
        if (findIdInPages(pages(), newId)) {
          setCurrentPageId(newId);
        }
      }
    });

    window.addEventListener("unload", () => {
      localStorage.setItem("currentPageId", currentPageId());
    });
  });

  createEffect(() => {
    localStorage.setItem("pages", JSON.stringify(pages()));
  });

  createEffect(() => {
    localStorage.setItem("currentPageId", currentPageId());
  });

  const addPage = (parentFolderId?: string) => {
    const countPages = (items: Page[]): number => {
      let count = 0;
      for (const item of items) {
        count++;
        if (item.children) {
          count += countPages(item.children);
        }
      }
      return count;
    };

    const newPage: Page = {
      id: generateId(),
      name: `Page ${countPages(pages()) + 1}`,
      content: "",
    };

    addToTree(parentFolderId ?? null, newPage);
    setCurrentPageId(newPage.id);
    return newPage.id;
  };

  const renameItem = (itemId: string, newName: string) => {
    updateTreeAt(itemId, (item) => ({ ...item, name: newName.trim() }));
  };

  const deleteItem = (itemId: string) => {
    const currentId = currentPageId();
    const findInSubtree = (targetId: string, items: Page[]): boolean => {
      for (const item of items) {
        if (item.id === targetId) return true;
        if (item.children && findInSubtree(targetId, item.children))
          return true;
      }
      return false;
    };

    if (
      currentId === itemId ||
      findInSubtree(currentId, findItemInTree(itemId)?.children ?? [])
    ) {
      const survivingItems: Page[] = [];
      const collectSurviving = (items: Page[]) => {
        for (const item of items) {
          if (item.id !== itemId) {
            survivingItems.push(item);
            if (item.children) {
              collectSurviving(item.children);
            }
          }
        }
      };
      collectSurviving(pages());
      if (survivingItems.length > 0 && survivingItems[0]) {
        setCurrentPageId(survivingItems[0].id);
      }
    }

    removeFromTree(itemId);
  };

  const moveItem = (
    itemId: string,
    direction: "up" | "down" | "in" | "out",
  ) => {
    let parentItems = findPageParent(pages(), itemId);

    if (direction === "out") {
      if (!parentItems) return;
    } else {
      if (!parentItems) {
        parentItems = pages();
      }
    }

    const currentIndex = findPageIndex(parentItems, itemId);
    if (currentIndex < 0) return;

    const item = findItemInTree(itemId);
    if (!item) return;

    if (direction === "up" && currentIndex > 0) {
      const siblings = [...parentItems];
      const prevItem = siblings[currentIndex - 1];
      const currItem = siblings[currentIndex];
      if (prevItem !== undefined && currItem !== undefined) {
        siblings[currentIndex - 1] = currItem;
        siblings[currentIndex] = prevItem;
        updateParentSiblings(siblings, parentItems);
      }
    } else if (direction === "down" && currentIndex < parentItems.length - 1) {
      const siblings = [...parentItems];
      const currItem = siblings[currentIndex];
      const nextItem = siblings[currentIndex + 1];
      if (currItem !== undefined && nextItem !== undefined) {
        siblings[currentIndex] = nextItem;
        siblings[currentIndex + 1] = currItem;
        updateParentSiblings(siblings, parentItems);
      }
    } else if (direction === "in" && currentIndex > 0) {
      const targetFolder = parentItems[currentIndex - 1];
      if (targetFolder) {
        const removed = removeFromTree(itemId);
        if (removed) {
          const newPages = structuredClone(pages());
          const add = (items: Page[]): boolean => {
            for (const it of items) {
              if (it.id === targetFolder.id) {
                if (!it.children) it.children = [];
                it.children.push(removed);
                return true;
              }
              if (it.children) {
                if (add(it.children)) return true;
              }
            }
            return false;
          };
          add(newPages);
          setPages(newPages);
        }
      }
    } else if (direction === "out") {
      const newPages = moveItemOut(pages(), itemId);
      setPages(newPages);
    }
  };

  const updateParentSiblings = (newSiblings: Page[], oldSiblings: Page[]) => {
    const newPages = structuredClone(pages());
    const oldFirst = oldSiblings[0];
    const update = (items: Page[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it && oldFirst && it.id === oldFirst.id) {
          for (let j = 0; j < newSiblings.length; j++) {
            const sibling = newSiblings[j];
            if (sibling !== undefined) {
              items[i + j] = sibling;
            }
          }
          if (newSiblings.length < oldSiblings.length) {
            items.splice(
              i + newSiblings.length,
              oldSiblings.length - newSiblings.length,
            );
          }
          return true;
        }
        if (it?.children) {
          if (update(it.children)) return true;
        }
      }
      return false;
    };
    update(newPages);
    setPages(newPages);
  };

  const getCurrentPage = (): Page | null => {
    const id = currentPageId();
    return findPageInTree(pages(), id);
  };

  const updatePageContent = (content: string) => {
    updateTreeAt(currentPageId(), (item) => ({ ...item, content }));
  };

  return {
    pages,
    setPages,
    currentPageId,
    setCurrentPageId,
    addPage,
    renameItem,
    deleteItem,
    moveItem,
    updatePageContent,
    getCurrentPage,
    findItemInTree,
  };
}
