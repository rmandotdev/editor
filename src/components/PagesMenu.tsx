import type { JSX, Setter } from "solid-js";
import { createSignal, Show } from "solid-js";

import type { Page } from "#types";
import TreeList from "./TreeList";
import Button from "./ui/Button";
import ContextMenu from "./ui/ContextMenu";
import Divider from "./ui/Divider";

type ContextMenuState = {
  x: number;
  y: number;
  itemId: string;
} | null;

const Pages = (props: {
  pages: Page[];
  currentPageId: string;
  openFolders: Set<string>;
  dragItemId: string | null;
  dragOverItemId: string | null;
  dragOverPosition: "before" | "after" | null;
  onSelectPage: (pageId: string) => void;
  onToggleFolder: (folderId: string) => void;
  setContextMenu: Setter<ContextMenuState>;
  onDragStart: (e: DragEvent, item: Page) => void;
  onDragOver: (
    e: DragEvent,
    itemId: string,
    position: "before" | "after",
  ) => void;
  onDragOverNestable: (e: DragEvent, folderId: string) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragLeaveNestable: () => void;
  onDrop: (e: DragEvent, item: Page, position: "before" | "after") => void;
  onDropNestable: (e: DragEvent, folderId: string) => void;
  onDragEnd: () => void;
  newPage: () => void;
}): JSX.Element => (
  <div
    class="fixed bg-[#ededed] dark:bg-[#181818] p-2 z-20 w-57.5 left-4 top-15"
    onClick={() => props.setContextMenu(null)}
  >
    <TreeList
      pages={props.pages}
      currentPageId={props.currentPageId}
      openFolders={props.openFolders}
      dragItemId={props.dragItemId}
      dragOverItemId={props.dragOverItemId}
      dragOverPosition={props.dragOverPosition}
      onSelectPage={props.onSelectPage}
      onToggleFolder={props.onToggleFolder}
      onContextMenu={(e, item) => {
        e.preventDefault();
        props.setContextMenu({
          x: e.pageX,
          y: e.pageY,
          itemId: item.id,
        });
      }}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDragOverNestable={props.onDragOverNestable}
      onDragLeave={props.onDragLeave}
      onDragLeaveNestable={props.onDragLeaveNestable}
      onDrop={props.onDrop}
      onDropNestable={props.onDropNestable}
      onDragEnd={props.onDragEnd}
    />
    <Divider />
    <div class="flex gap-2">
      <Button label="New Page" onClick={props.newPage} />
    </div>
  </div>
);

const PagesContextMenu = (props: {
  contextMenu: () => ContextMenuState;
  onRename: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveIn: () => void;
  onMoveOut: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveIn: boolean;
  canMoveOut: boolean;
}) => (
  <Show when={props.contextMenu()}>
    {(contextMenu) => (
      <ContextMenu
        x={contextMenu().x}
        y={contextMenu().y}
        items={[
          { label: "Rename", onClick: props.onRename, show: true },
          { label: "Delete", onClick: props.onDelete, show: true },
          { label: "Move Up", onClick: props.onMoveUp, show: props.canMoveUp },
          {
            label: "Move Down",
            onClick: props.onMoveDown,
            show: props.canMoveDown,
          },
          {
            label: "Move Into Page",
            onClick: props.onMoveIn,
            show: props.canMoveIn,
          },
          {
            label: "Move Out of Page",
            onClick: props.onMoveOut,
            show: props.canMoveOut,
          },
        ]}
      />
    )}
  </Show>
);

const findItemInTree = (items: Page[], targetId: string): Page | null => {
  for (const item of items) {
    if (item.id === targetId) return item;
    if (item.children) {
      const found = findItemInTree(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

const PagesMenu = (props: {
  isOpen: boolean;
  pages: Page[];
  currentPageId: string;
  selectPageByTreeItem: (itemId: string) => void;
  addPage: () => void;
  renameItem: (itemId: string, newName: string) => void;
  deleteItem: (itemId: string) => void;
  moveItem: (itemId: string, direction: "up" | "down" | "in" | "out") => void;
  setPages: (pages: Page[]) => void;
}): JSX.Element => {
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>(null);
  const [openFolders, setOpenFolders] = createSignal<Set<string>>(new Set());
  const [dragItemId, setDragItemId] = createSignal<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = createSignal<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = createSignal<
    "before" | "after" | null
  >(null);

  const toggleFolder = (folderId: string) => {
    const newSet = new Set(openFolders());
    if (newSet.has(folderId)) {
      newSet.delete(folderId);
    } else {
      newSet.add(folderId);
    }
    setOpenFolders(newSet);
  };

  const onRename = () => {
    const c = contextMenu();
    if (!c) return;
    const item = findItemInTree(props.pages, c.itemId);
    if (!item) return;
    const newName = prompt("Enter new name:", item.name);
    if (newName) {
      props.renameItem(c.itemId, newName);
    }
    setContextMenu(null);
  };

  const onDelete = () => {
    const c = contextMenu();
    if (!c) return;
    props.deleteItem(c.itemId);
    setContextMenu(null);
  };

  const getParentItems = (itemId: string): Page[] | null => {
    const findParent = (
      items: Page[],
      targetId: string,
      parent: Page[] | null,
    ): Page[] | null => {
      for (const item of items) {
        if (item.id === targetId) return parent;
        if (item.children) {
          const found = findParent(item.children, targetId, item.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    return findParent(props.pages, itemId, null);
  };

  const getItemIndex = (itemId: string): number => {
    const parent = getParentItems(itemId);
    if (!parent) return -1;
    return parent.findIndex((item) => item.id === itemId);
  };

  const getPrevSibling = (itemId: string): Page | null => {
    const parent = getParentItems(itemId);
    if (!parent) return null;
    const idx = getItemIndex(itemId);
    if (idx <= 0) return null;
    return parent[idx - 1] ?? null;
  };

  const onMoveUp = () => {
    const c = contextMenu();
    if (!c) return;
    props.moveItem(c.itemId, "up");
    setContextMenu(null);
  };

  const onMoveDown = () => {
    const c = contextMenu();
    if (!c) return;
    props.moveItem(c.itemId, "down");
    setContextMenu(null);
  };

  const onMoveIn = () => {
    const c = contextMenu();
    if (!c) return;
    props.moveItem(c.itemId, "in");
    setContextMenu(null);
  };

  const onMoveOut = () => {
    const c = contextMenu();
    if (!c) return;
    props.moveItem(c.itemId, "out");
    setContextMenu(null);
  };

  const canMoveUp = () => {
    const c = contextMenu();
    if (!c) return false;
    return getItemIndex(c.itemId) > 0;
  };

  const canMoveDown = () => {
    const c = contextMenu();
    if (!c) return false;
    const parent = getParentItems(c.itemId);
    if (!parent) return false;
    return getItemIndex(c.itemId) < parent.length - 1;
  };

  const canMoveIn = () => {
    const c = contextMenu();
    if (!c) return false;
    const prev = getPrevSibling(c.itemId);
    return prev !== null && (prev.children?.length ?? 0) > 0;
  };

  const canMoveOut = () => {
    const c = contextMenu();
    if (!c) return false;
    return getParentItems(c.itemId) !== null;
  };

  const handleDragStart = (e: DragEvent, item: Page) => {
    setDragItemId(item.id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (
    e: DragEvent,
    itemId: string,
    position: "before" | "after",
  ) => {
    e.preventDefault();
    setDragOverItemId(itemId);
    setDragOverPosition(position);
  };

  const handleDragOverNestable = (e: DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItemId(`nest-${folderId}`);
    setDragOverPosition(null);
  };

  const handleDragLeave = (_e: DragEvent) => {
    setTimeout(() => {
      if (dragOverItemId() === dragItemId()) {
        setDragOverItemId(null);
        setDragOverPosition(null);
      }
    }, 50);
  };

  const handleDragLeaveNestable = () => {
    setTimeout(() => {
      if (dragOverItemId()?.startsWith("nest-")) {
        setDragOverItemId(null);
      }
    }, 50);
  };

  const handleDrop = (
    e: DragEvent,
    targetItem: Page,
    position: "before" | "after",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = dragItemId();
    if (!draggedId || draggedId === targetItem.id) {
      handleDragEnd();
      return;
    }

    const draggedItem = findItemInTree(props.pages, draggedId);
    if (!draggedItem) {
      handleDragEnd();
      return;
    }

    props.selectPageByTreeItem(draggedId);

    const targetParent = getParentItems(targetItem.id);
    if (!targetParent) {
      handleDragEnd();
      return;
    }

    const newPages = structuredClone(props.pages);
    const draggedItemCopy = structuredClone(draggedItem);

    const removeItem = (items: Page[]): Page | null => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;
        if (item.id === draggedId) {
          return items.splice(i, 1)[0] ?? null;
        }
        if (item.children) {
          const found = removeItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    removeItem(newPages);

    const targetIdx = getItemIndex(targetItem.id);
    const insertIdx = position === "before" ? targetIdx : targetIdx + 1;

    const insertInto = (items: Page[]): boolean => {
      for (const item of items) {
        if (item.id === targetItem.id) {
          const parentArr = items;
          parentArr.splice(insertIdx, 0, draggedItemCopy);
          return true;
        }
        if (item.children) {
          if (insertInto(item.children)) return true;
        }
      }
      return false;
    };

    insertInto(newPages);
    props.setPages(newPages);
    handleDragEnd();
  };

  const handleDropNestable = (e: DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = dragItemId();
    if (!draggedId || draggedId === folderId) {
      handleDragEnd();
      return;
    }

    const draggedItem = findItemInTree(props.pages, draggedId);
    if (!draggedItem) {
      handleDragEnd();
      return;
    }

    props.selectPageByTreeItem(draggedId);

    const draggedItemCopy = structuredClone(draggedItem);
    const newPages = structuredClone(props.pages);

    const removeItem = (items: Page[]): Page | null => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;
        if (item.id === draggedId) {
          return items.splice(i, 1)[0] ?? null;
        }
        if (item.children) {
          const found = removeItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    removeItem(newPages);

    const insertInto = (items: Page[]): boolean => {
      for (const item of items) {
        if (item.id === folderId) {
          if (!item.children) item.children = [];
          item.children.push(draggedItemCopy);
          return true;
        }
        if (item.children) {
          if (insertInto(item.children)) return true;
        }
      }
      return false;
    };

    insertInto(newPages);
    props.setPages(newPages);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDragItemId(null);
    setDragOverItemId(null);
    setDragOverPosition(null);
  };

  return (
    <Show when={props.isOpen}>
      <Pages
        pages={props.pages}
        currentPageId={props.currentPageId}
        openFolders={openFolders()}
        dragItemId={dragItemId()}
        dragOverItemId={dragOverItemId()}
        dragOverPosition={dragOverPosition()}
        onSelectPage={props.selectPageByTreeItem}
        onToggleFolder={toggleFolder}
        setContextMenu={setContextMenu}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragOverNestable={handleDragOverNestable}
        onDragLeave={handleDragLeave}
        onDragLeaveNestable={handleDragLeaveNestable}
        onDrop={handleDrop}
        onDropNestable={handleDropNestable}
        onDragEnd={handleDragEnd}
        newPage={props.addPage}
      />

      <PagesContextMenu
        contextMenu={contextMenu}
        onRename={onRename}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onMoveIn={onMoveIn}
        onMoveOut={onMoveOut}
        canMoveUp={canMoveUp()}
        canMoveDown={canMoveDown()}
        canMoveIn={canMoveIn()}
        canMoveOut={canMoveOut()}
      />
    </Show>
  );
};

export default PagesMenu;
