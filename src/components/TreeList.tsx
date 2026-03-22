import type { JSX } from "solid-js";
import { For, Show } from "solid-js";

import type { Page } from "#types";
import TreeItem from "./TreeItem";

type TreeListProps = {
  pages: Page[];
  currentPageId: string;
  openFolders: Set<string>;
  dragItemId: string | null;
  dragOverItemId: string | null;
  dragOverPosition: "before" | "after" | null;
  onSelectPage: (pageId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onContextMenu: (e: MouseEvent, item: Page) => void;
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
};

const TreeList = (props: TreeListProps): JSX.Element => {
  return (
    <div class="max-h-[min(calc(100vh-150px),calc(38px*8))] overflow-y-auto">
      <For each={props.pages}>
        {(item) => (
          <TreeItem
            item={item}
            isSelected={props.currentPageId === item.id}
            isOpen={props.openFolders.has(item.id)}
            isDragOver={
              props.dragOverItemId === item.id && props.dragItemId !== item.id
            }
            isDragOverNestable={props.dragOverItemId === `nest-${item.id}`}
            dragOverPosition={
              props.dragOverItemId === item.id ? props.dragOverPosition : null
            }
            onSelect={() => props.onSelectPage(item.id)}
            onToggle={() => props.onToggleFolder(item.id)}
            onContextMenu={(e) => props.onContextMenu(e, item)}
            onDragStart={(e) => props.onDragStart(e, item)}
            onDragOver={(e, pos) => props.onDragOver(e, item.id, pos)}
            onDragOverNestable={(e) => props.onDragOverNestable(e, item.id)}
            onDragLeaveNestable={props.onDragLeaveNestable}
            onDragLeave={(e) => props.onDragLeave(e)}
            onDrop={(e) =>
              props.onDrop(e, item, props.dragOverPosition || "after")
            }
            onDropNestable={(e) => props.onDropNestable(e, item.id)}
            onDragEnd={props.onDragEnd}
          >
            <Show when={item.children && item.children.length > 0}>
              <TreeList
                pages={item.children ?? []}
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
                onDragOverNestable={props.onDragOverNestable}
                onDragLeave={props.onDragLeave}
                onDragLeaveNestable={props.onDragLeaveNestable}
                onDrop={props.onDrop}
                onDropNestable={props.onDropNestable}
                onDragEnd={props.onDragEnd}
              />
            </Show>
          </TreeItem>
        )}
      </For>
    </div>
  );
};

export default TreeList;
