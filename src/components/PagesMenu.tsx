import type { JSX, Setter } from "solid-js";
import { createSignal, For, Show } from "solid-js";

import type { TreeItem } from "#types";
import Button from "./ui/Button";
import ContextMenu from "./ui/ContextMenu";
import Divider from "./ui/Divider";

type ContextMenuState = {
  x: number;
  y: number;
  itemId: string;
  itemType: "folder" | "page";
} | null;

const DragHandleIcon = (): JSX.Element => (
  <svg
    class="w-4 h-4 cursor-grab text-gray-400 hover:text-gray-600 shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="Drag handle"
  >
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </svg>
);

const FolderSvgIcon = (props: { isOpen: boolean }): JSX.Element => (
  <svg
    class="w-4 h-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <title>Folder</title>
    <path
      d={
        props.isOpen
          ? "M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2z"
          : "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
      }
    />
  </svg>
);

const ChevronSvgIcon = (props: { isOpen: boolean }): JSX.Element => (
  <svg
    class="w-4 h-4 shrink-0 transition-transform"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    style={{ transform: props.isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
  >
    <title>Expand</title>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PageItem = (props: {
  item: TreeItem;
  isSelected: boolean;
  isDragOver: boolean;
  dragOverPosition: "before" | "after" | null;
  onClick: () => void;
  onContextMenu: (e: MouseEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, position: "before" | "after") => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: () => void;
}): JSX.Element => (
  <div
    class="relative"
    onDragOver={(e) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      props.onDragOver(e, e.clientY < midY ? "before" : "after");
    }}
    onDragLeave={props.onDragLeave}
    onDrop={props.onDrop}
  >
    <Show when={props.isDragOver && props.dragOverPosition === "before"}>
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
    </Show>
    <Show when={props.isDragOver && props.dragOverPosition === "after"}>
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
    </Show>
    <div
      class={`flex items-center gap-1 ${props.isDragOver ? "opacity-50" : ""}`}
      draggable={true}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
    >
      <DragHandleIcon />
      <Button
        label={props.item.name}
        variant="page"
        class={
          props.isSelected
            ? "bg-[#ddd] dark:bg-[#333] border-blue-500 flex-1"
            : "bg-[#ededed] dark:bg-[#181818] border-[#ededed] dark:border-[#181818] flex-1"
        }
        onClick={props.onClick}
        onMouseDown={(e) => {
          if (e.button === 0) {
            props.onClick();
          }
        }}
        onContextMenu={props.onContextMenu}
      />
    </div>
  </div>
);

const FolderItem = (props: {
  item: TreeItem;
  isSelected: boolean;
  isOpen: boolean;
  isDragOver: boolean;
  isDragOverFolder: boolean;
  dragOverPosition: "before" | "after" | null;
  onToggle: () => void;
  onContextMenu: (e: MouseEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, position: "before" | "after") => void;
  onDragOverFolder: (e: DragEvent) => void;
  onDragLeaveFolder: () => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDropFolder: (e: DragEvent) => void;
  onDragEnd: () => void;
  children?: JSX.Element;
}): JSX.Element => (
  <div>
    <div
      class="relative"
      onDragOver={(e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        props.onDragOver(e, e.clientY < midY ? "before" : "after");
      }}
      onDragLeave={props.onDragLeave}
      onDrop={props.onDrop}
    >
      <Show
        when={
          props.isDragOver &&
          !props.isDragOverFolder &&
          props.dragOverPosition === "before"
        }
      >
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      </Show>
      <Show
        when={
          props.isDragOver &&
          !props.isDragOverFolder &&
          props.dragOverPosition === "after"
        }
      >
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      </Show>
      <div
        class={`flex items-center gap-1 ${props.isDragOver && !props.isDragOverFolder ? "opacity-50" : ""}`}
        draggable={true}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
      >
        <DragHandleIcon />
        <Button
          label={props.item.name}
          variant="page"
          class={
            props.isSelected
              ? "bg-[#ddd] dark:bg-[#333] border-blue-500 flex-1"
              : "bg-[#ededed] dark:bg-[#181818] border-[#ededed] dark:border-[#181818] flex-1"
          }
          onClick={props.onToggle}
          onMouseDown={(e) => {
            if (e.button === 0) {
              props.onToggle();
            }
          }}
          onContextMenu={props.onContextMenu}
        >
          <div class="flex items-center gap-1">
            <ChevronSvgIcon isOpen={props.isOpen} />
            <FolderSvgIcon isOpen={props.isOpen} />
          </div>
        </Button>
      </div>
    </div>
    <div
      class={`ml-4 mt-1 min-h-2 rounded ${props.isDragOverFolder ? "bg-blue-100 dark:bg-blue-900 border-2 border-dashed border-blue-400" : ""}`}
      onDragOver={props.onDragOverFolder}
      onDragLeave={props.onDragLeaveFolder}
      onDrop={props.onDropFolder}
    >
      <Show when={props.isOpen && props.children}>{props.children}</Show>
    </div>
  </div>
);

const TreeItemView = (props: {
  item: TreeItem;
  tree: TreeItem[];
  currentPageId: string;
  openFolders: Set<string>;
  dragItemId: string | null;
  dragOverItemId: string | null;
  dragOverPosition: "before" | "after" | null;
  onSelectPage: (pageId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onContextMenu: (e: MouseEvent, item: TreeItem) => void;
  onDragStart: (e: DragEvent, item: TreeItem) => void;
  onDragOver: (
    e: DragEvent,
    itemId: string,
    position: "before" | "after",
  ) => void;
  onDragOverFolder: (e: DragEvent, folderId: string) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragLeaveFolder: () => void;
  onDrop: (e: DragEvent, item: TreeItem, position: "before" | "after") => void;
  onDropFolder: (e: DragEvent, folderId: string) => void;
  onDragEnd: () => void;
}): JSX.Element => {
  const isFolder = () => props.item.type === "folder";
  const isOpen = () => props.openFolders.has(props.item.id);
  const isSelected = () => {
    if (props.item.type === "page" && props.item.pageId) {
      return props.currentPageId === props.item.pageId;
    }
    return false;
  };

  return (
    <Show
      when={isFolder()}
      fallback={
        <PageItem
          item={props.item}
          isSelected={isSelected()}
          isDragOver={
            props.dragOverItemId === props.item.id &&
            props.dragItemId !== props.item.id
          }
          dragOverPosition={
            props.dragOverItemId === props.item.id
              ? props.dragOverPosition
              : null
          }
          onClick={() => {
            if (props.item.pageId) {
              props.onSelectPage(props.item.pageId);
            }
          }}
          onContextMenu={(e) => props.onContextMenu(e, props.item)}
          onDragStart={(e) => props.onDragStart(e, props.item)}
          onDragOver={(e, pos) => props.onDragOver(e, props.item.id, pos)}
          onDragLeave={props.onDragLeave}
          onDrop={(e) =>
            props.onDrop(e, props.item, props.dragOverPosition || "after")
          }
          onDragEnd={props.onDragEnd}
        />
      }
    >
      <FolderItem
        item={props.item}
        isSelected={isSelected()}
        isOpen={isOpen()}
        isDragOver={
          props.dragOverItemId === props.item.id &&
          props.dragItemId !== props.item.id
        }
        isDragOverFolder={props.dragOverItemId === `folder-${props.item.id}`}
        dragOverPosition={
          props.dragOverItemId === props.item.id ? props.dragOverPosition : null
        }
        onToggle={() => props.onToggleFolder(props.item.id)}
        onContextMenu={(e) => props.onContextMenu(e, props.item)}
        onDragStart={(e) => props.onDragStart(e, props.item)}
        onDragOver={(e, pos) => props.onDragOver(e, props.item.id, pos)}
        onDragOverFolder={(e) => props.onDragOverFolder(e, props.item.id)}
        onDragLeaveFolder={props.onDragLeaveFolder}
        onDragLeave={(e) => props.onDragLeave(e)}
        onDrop={(e) =>
          props.onDrop(e, props.item, props.dragOverPosition || "after")
        }
        onDropFolder={(e) => props.onDropFolder(e, props.item.id)}
        onDragEnd={props.onDragEnd}
      >
        <For each={props.item.children}>
          {(child) => (
            <TreeItemView
              item={child}
              tree={props.tree}
              currentPageId={props.currentPageId}
              openFolders={props.openFolders}
              dragItemId={props.dragItemId}
              dragOverItemId={props.dragOverItemId}
              dragOverPosition={props.dragOverPosition}
              onSelectPage={props.onSelectPage}
              onToggleFolder={props.onToggleFolder}
              onContextMenu={props.onContextMenu}
              onDragStart={props.onDragStart}
              onDragOver={props.onDragOver}
              onDragOverFolder={props.onDragOverFolder}
              onDragLeave={(e) => props.onDragLeave(e)}
              onDragLeaveFolder={props.onDragLeaveFolder}
              onDrop={props.onDrop}
              onDropFolder={props.onDropFolder}
              onDragEnd={props.onDragEnd}
            />
          )}
        </For>
      </FolderItem>
    </Show>
  );
};

const TreeList = (props: {
  tree: TreeItem[];
  currentPageId: string;
  openFolders: Set<string>;
  dragItemId: string | null;
  dragOverItemId: string | null;
  dragOverPosition: "before" | "after" | null;
  onSelectPage: (pageId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onContextMenu: (e: MouseEvent, item: TreeItem) => void;
  onDragStart: (e: DragEvent, item: TreeItem) => void;
  onDragOver: (
    e: DragEvent,
    itemId: string,
    position: "before" | "after",
  ) => void;
  onDragOverFolder: (e: DragEvent, folderId: string) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragLeaveFolder: () => void;
  onDrop: (e: DragEvent, item: TreeItem, position: "before" | "after") => void;
  onDropFolder: (e: DragEvent, folderId: string) => void;
  onDragEnd: () => void;
}): JSX.Element => (
  <div class="max-h-[min(calc(100vh-150px),calc(38px*8))] overflow-y-auto">
    <For each={props.tree}>
      {(item) => (
        <TreeItemView
          item={item}
          tree={props.tree}
          currentPageId={props.currentPageId}
          openFolders={props.openFolders}
          dragItemId={props.dragItemId}
          dragOverItemId={props.dragOverItemId}
          dragOverPosition={props.dragOverPosition}
          onSelectPage={props.onSelectPage}
          onToggleFolder={props.onToggleFolder}
          onContextMenu={props.onContextMenu}
          onDragStart={props.onDragStart}
          onDragOver={props.onDragOver}
          onDragOverFolder={props.onDragOverFolder}
          onDragLeave={props.onDragLeave}
          onDragLeaveFolder={props.onDragLeaveFolder}
          onDrop={props.onDrop}
          onDropFolder={props.onDropFolder}
          onDragEnd={props.onDragEnd}
        />
      )}
    </For>
  </div>
);

const Pages = (props: {
  tree: TreeItem[];
  currentPageId: string;
  openFolders: Set<string>;
  dragItemId: string | null;
  dragOverItemId: string | null;
  dragOverPosition: "before" | "after" | null;
  onSelectPage: (pageId: string) => void;
  onToggleFolder: (folderId: string) => void;
  setContextMenu: Setter<ContextMenuState>;
  onDragStart: (e: DragEvent, item: TreeItem) => void;
  onDragOver: (
    e: DragEvent,
    itemId: string,
    position: "before" | "after",
  ) => void;
  onDragOverFolder: (e: DragEvent, folderId: string) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragLeaveFolder: () => void;
  onDrop: (e: DragEvent, item: TreeItem, position: "before" | "after") => void;
  onDropFolder: (e: DragEvent, folderId: string) => void;
  onDragEnd: () => void;
  newPage: () => void;
  newFolder: () => void;
}): JSX.Element => (
  <div
    class="
    fixed border border-[#d8d8d8] dark:border-[#272727] bg-[#ededed] dark:bg-[#181818] p-2 rounded-md border-solid

    z-20 w-57.5 left-4 top-15
    "
    onClick={() => props.setContextMenu(null)}
  >
    <TreeList
      tree={props.tree}
      currentPageId={props.currentPageId}
      openFolders={props.openFolders}
      dragItemId={props.dragItemId}
      dragOverItemId={props.dragOverItemId}
      dragOverPosition={props.dragOverPosition}
      onSelectPage={props.onSelectPage}
      onToggleFolder={props.onToggleFolder}
      onContextMenu={(e, item) =>
        props.setContextMenu({
          x: e.pageX,
          y: e.pageY,
          itemId: item.id,
          itemType: item.type,
        })
      }
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDragOverFolder={props.onDragOverFolder}
      onDragLeave={props.onDragLeave}
      onDragLeaveFolder={props.onDragLeaveFolder}
      onDrop={props.onDrop}
      onDropFolder={props.onDropFolder}
      onDragEnd={props.onDragEnd}
    />
    <Divider />
    <div class="flex gap-2">
      <Button label="New Page" onClick={props.newPage} />
      <Button label="New Folder" onClick={props.newFolder} />
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
            label: "Move Into Folder",
            onClick: props.onMoveIn,
            show: props.canMoveIn,
          },
          {
            label: "Move Out of Folder",
            onClick: props.onMoveOut,
            show: props.canMoveOut,
          },
        ]}
      />
    )}
  </Show>
);

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

const PagesMenu = (props: {
  isOpen: boolean;
  tree: TreeItem[];
  currentPageId: string;
  selectPageByTreeItem: (itemId: string) => void;
  addPage: () => void;
  addFolder: () => void;
  renameItem: (itemId: string, newName: string) => void;
  deleteItem: (itemId: string) => void;
  moveItem: (itemId: string, direction: "up" | "down" | "in" | "out") => void;
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
    const item = findItemInTree(props.tree, c.itemId);
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

  const getParentItems = (itemId: string): TreeItem[] | null => {
    const findParent = (
      items: TreeItem[],
      targetId: string,
      parent: TreeItem[] | null,
    ): TreeItem[] | null => {
      for (const item of items) {
        if (item.id === targetId) return parent;
        if (item.children) {
          const found = findParent(item.children, targetId, item.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    return findParent(props.tree, itemId, null);
  };

  const getItemIndex = (itemId: string): number => {
    const parent = getParentItems(itemId);
    if (!parent) return -1;
    return parent.findIndex((item) => item.id === itemId);
  };

  const getPrevSibling = (itemId: string): TreeItem | null => {
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
    return prev !== null && prev.type === "folder";
  };

  const canMoveOut = () => {
    const c = contextMenu();
    if (!c) return false;
    return getParentItems(c.itemId) !== null;
  };

  const handleDragStart = (e: DragEvent, item: TreeItem) => {
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

  const handleDragOverFolder = (e: DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItemId(`folder-${folderId}`);
    setDragOverPosition(null);
  };

  const handleDragLeave = (_e: DragEvent) => {
    // Small delay to prevent flickering
    setTimeout(() => {
      if (dragOverItemId() === dragItemId()) {
        setDragOverItemId(null);
        setDragOverPosition(null);
      }
    }, 50);
  };

  const handleDragLeaveFolder = () => {
    setTimeout(() => {
      if (!dragOverItemId()?.startsWith("folder-")) {
        setDragOverItemId(null);
      }
    }, 50);
  };

  const handleDrop = (
    e: DragEvent,
    targetItem: TreeItem,
    position: "before" | "after",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = dragItemId();
    if (!draggedId || draggedId === targetItem.id) {
      handleDragEnd();
      return;
    }

    const draggedItem = findItemInTree(props.tree, draggedId);
    if (!draggedItem) {
      handleDragEnd();
      return;
    }

    if (
      draggedItem.type === "page" &&
      targetItem.type === "page" &&
      draggedItem.pageId
    ) {
      props.selectPageByTreeItem(draggedItem.pageId);
    }

    const targetParent = getParentItems(targetItem.id);
    if (!targetParent) {
      handleDragEnd();
      return;
    }

    const draggedParent = getParentItems(draggedId);
    const targetIdx = getItemIndex(targetItem.id);

    if (
      draggedParent &&
      draggedParent === targetParent &&
      draggedId === targetItem.id
    ) {
      handleDragEnd();
      return;
    }

    if (position === "before") {
      props.moveItem(draggedId, "out");
      for (let i = 0; i < targetIdx; i++) {
        props.moveItem(draggedId, "up");
      }
    } else {
      props.moveItem(draggedId, "out");
      for (let i = 0; i <= targetIdx; i++) {
        props.moveItem(draggedId, "down");
      }
    }

    handleDragEnd();
  };

  const handleDropFolder = (e: DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = dragItemId();
    if (!draggedId || draggedId === folderId) {
      handleDragEnd();
      return;
    }

    const draggedItem = findItemInTree(props.tree, draggedId);
    if (!draggedItem) {
      handleDragEnd();
      return;
    }

    if (draggedItem.type === "page" && draggedItem.pageId) {
      props.selectPageByTreeItem(draggedItem.pageId);
    }

    const folderItem = findItemInTree(props.tree, folderId);
    if (!folderItem || folderItem.type !== "folder") {
      handleDragEnd();
      return;
    }

    const currentParent = getParentItems(draggedId);
    if (currentParent && currentParent[0]?.id === folderId) {
      handleDragEnd();
      return;
    }

    props.moveItem(draggedId, "in");

    const folderIndex = getItemIndex(folderId);
    if (folderIndex >= 0) {
      const targetItemBeforeFolder = currentParent
        ? currentParent[folderIndex - 1]
        : null;
      if (targetItemBeforeFolder) {
        for (let i = 0; i < folderIndex; i++) {
          props.moveItem(draggedId, "up");
        }
      }
    }

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
        tree={props.tree}
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
        onDragOverFolder={handleDragOverFolder}
        onDragLeave={handleDragLeave}
        onDragLeaveFolder={handleDragLeaveFolder}
        onDrop={handleDrop}
        onDropFolder={handleDropFolder}
        onDragEnd={handleDragEnd}
        newPage={props.addPage}
        newFolder={props.addFolder}
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
