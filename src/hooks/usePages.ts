import { createEffect, createSignal, onMount } from "solid-js";

import type { Page, TreeItem } from "#types";

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_PAGE: Page = { id: generateId(), name: "Page 1", content: "" };
const DEFAULT_TREE: TreeItem[] = [
  { id: generateId(), type: "page", name: "Page 1", pageId: DEFAULT_PAGE.id },
];

export function usePages() {
  const [pages, setPages] = createSignal<Page[]>([DEFAULT_PAGE]);
  const [tree, setTree] = createSignal<TreeItem[]>(DEFAULT_TREE);
  const [currentPageId, setCurrentPageId] = createSignal<string>(
    DEFAULT_PAGE.id,
  );

  const findPageIndex = (pageId: string): number =>
    pages().findIndex((p) => p.id === pageId);

  const findItemInTree = (
    items: TreeItem[],
    targetId: string,
  ): TreeItem | null => {
    for (const item of items) {
      if (item.id === targetId) return item;
      if (item.children) {
        const found = findItemInTree(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const findItemParent = (
    items: TreeItem[],
    targetId: string,
    parent: TreeItem[] | null = null,
  ): TreeItem[] | null => {
    for (const item of items) {
      if (item.id === targetId) return parent;
      if (item.children) {
        const found = findItemParent(item.children, targetId, item.children);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const findItemIndex = (items: TreeItem[], targetId: string): number => {
    return items.findIndex((item) => item.id === targetId);
  };

  const updateTreeAt = (
    targetId: string,
    updater: (item: TreeItem) => TreeItem,
  ): void => {
    const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
    const update = (items: TreeItem[]): boolean => {
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
    update(newTree);
    setTree(newTree);
  };

  const removeFromTree = (targetId: string): TreeItem | null => {
    const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
    let removed: TreeItem | null = null;
    const remove = (items: TreeItem[]): boolean => {
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
    remove(newTree);
    setTree(newTree);
    return removed;
  };

  const addToTree = (parentId: string | null, item: TreeItem): void => {
    const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
    if (parentId === null) {
      newTree.push(item);
      setTree(newTree);
      return;
    }
    const add = (items: TreeItem[]): boolean => {
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
    add(newTree);
    setTree(newTree);
  };

  onMount(() => {
    const storedPages = localStorage.getItem("pages");
    const storedTree = localStorage.getItem("tree");
    const storedCurrentPage = localStorage.getItem("currentPageId");

    if (storedPages) {
      const parsedPages = JSON.parse(storedPages) as Page[];
      setPages(parsedPages.length > 0 ? parsedPages : [DEFAULT_PAGE]);
    }

    if (storedTree) {
      const parsedTree = JSON.parse(storedTree) as TreeItem[];
      setTree(parsedTree.length > 0 ? parsedTree : DEFAULT_TREE);
    }

    if (storedCurrentPage) {
      setCurrentPageId(storedCurrentPage);
    }

    window.addEventListener("storage", (event) => {
      if (!event.newValue) return;
      if (event.key === "pages") {
        setPages(JSON.parse(event.newValue));
      } else if (event.key === "tree") {
        setTree(JSON.parse(event.newValue));
      } else if (event.key === "currentPageId") {
        setCurrentPageId(event.newValue);
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
    localStorage.setItem("tree", JSON.stringify(tree()));
  });

  const addPage = (parentFolderId?: string) => {
    const newPage: Page = {
      id: generateId(),
      name: `Page ${pages().length + 1}`,
      content: "",
    };
    setPages([...pages(), newPage]);

    const newTreeItem: TreeItem = {
      id: generateId(),
      type: "page",
      name: newPage.name,
      pageId: newPage.id,
    };

    addToTree(parentFolderId ?? null, newTreeItem);
    setCurrentPageId(newPage.id);
    return newPage.id;
  };

  const addFolder = (parentFolderId?: string) => {
    const newFolder: TreeItem = {
      id: generateId(),
      type: "folder",
      name: "New Folder",
      children: [],
    };
    addToTree(parentFolderId ?? null, newFolder);
  };

  const renameItem = (itemId: string, newName: string) => {
    const item = findItemInTree(tree(), itemId);
    if (!item) return;

    if (item.type === "page" && item.pageId) {
      const pageIndex = findPageIndex(item.pageId);
      if (pageIndex >= 0) {
        setPages(
          pages().map((p, i) =>
            i === pageIndex ? { ...p, name: newName.trim() } : p,
          ),
        );
      }
    }

    updateTreeAt(itemId, (i) => ({ ...i, name: newName.trim() }));
  };

  const deleteItem = (itemId: string) => {
    const item = findItemInTree(tree(), itemId);
    if (!item) return;

    if (item.type === "page" && item.pageId) {
      const pageIndex = findPageIndex(item.pageId);
      if (pageIndex >= 0) {
        const newPages = pages().filter((_, i) => i !== pageIndex);
        setPages(newPages.length > 0 ? newPages : [DEFAULT_PAGE]);

        if (currentPageId() === item.pageId) {
          const firstPage = findItemInTree(tree(), itemId);
          if (firstPage?.pageId) {
            setCurrentPageId(firstPage.pageId);
          } else {
            setCurrentPageId(DEFAULT_PAGE.id);
          }
        }
      }
    }

    removeFromTree(itemId);
  };

  const moveItem = (
    itemId: string,
    direction: "up" | "down" | "in" | "out",
  ) => {
    const parentItems = findItemParent(tree(), itemId);
    if (!parentItems) return;

    const currentIndex = findItemIndex(parentItems, itemId);
    if (currentIndex < 0) return;

    const item = findItemInTree(tree(), itemId);
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
      if (targetFolder && targetFolder.type === "folder") {
        const removed = removeFromTree(itemId);
        if (removed) {
          const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
          const add = (items: TreeItem[]): boolean => {
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
          add(newTree);
          setTree(newTree);
        }
      }
    } else if (direction === "out") {
      const itemCopy = JSON.parse(JSON.stringify(item)) as TreeItem;
      removeFromTree(itemId);

      const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
      const findAndInsert = (items: TreeItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          const currentItem = items[i];
          const parentFirst = parentItems[0];
          if (currentItem && parentFirst && currentItem.id === parentFirst.id) {
            items.splice(i + 1, 0, itemCopy);
            return true;
          }
          if (currentItem?.children) {
            if (findAndInsert(currentItem.children)) return true;
          }
        }
        return false;
      };
      findAndInsert(newTree);
      setTree(newTree);
    }
  };

  const updateParentSiblings = (
    newSiblings: TreeItem[],
    oldSiblings: TreeItem[],
  ) => {
    const newTree = JSON.parse(JSON.stringify(tree())) as TreeItem[];
    const oldFirst = oldSiblings[0];
    const update = (items: TreeItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it && oldFirst && it.id === oldFirst.id) {
          if (it.children) {
            it.children = newSiblings;
          } else {
            for (let j = 0; j < newSiblings.length; j++) {
              const sibling = newSiblings[j];
              if (sibling !== undefined) {
                items[j] = sibling;
              }
            }
          }
          return true;
        }
        if (it?.children) {
          if (update(it.children)) return true;
        }
      }
      return false;
    };
    update(newTree);
    setTree(newTree);
  };

  const getCurrentPage = (): Page | null => {
    const id = currentPageId();
    return pages().find((p) => p.id === id) || null;
  };

  const updatePageContent = (content: string) => {
    const id = currentPageId();
    const idx = findPageIndex(id);
    if (idx >= 0) {
      const newPages = [...pages()];
      const page = newPages[idx];
      if (page) {
        newPages[idx] = { ...page, content };
        setPages(newPages);
      }
    }
  };

  return {
    pages,
    tree,
    currentPageId,
    setCurrentPageId,
    addPage,
    addFolder,
    renameItem,
    deleteItem,
    moveItem,
    updatePageContent,
    getCurrentPage,
    findItemInTree,
    findPageIndex,
  };
}
