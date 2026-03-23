import type { JSX } from "solid-js";
import { Show } from "solid-js";

import type { Page } from "#types";
import Button from "./ui/Button";

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

type TreeItemProps = {
  item: Page;
  isSelected: boolean;
  isOpen: boolean;
  isDragOver: boolean;
  isDragOverNestable: boolean;
  dragOverPosition: "before" | "after" | null;
  onSelect: () => void;
  onToggle: () => void;
  onContextMenu: (e: MouseEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, position: "before" | "after") => void;
  onDragOverNestable: (e: DragEvent) => void;
  onDragLeaveNestable: () => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDropNestable: (e: DragEvent) => void;
  onDragEnd: () => void;
  children?: JSX.Element;
};

const TreeItem = (props: TreeItemProps): JSX.Element => {
  const hasChildren = () => (props.item.children?.length ?? 0) > 0;
  let isDragging = false;

  return (
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
            !props.isDragOverNestable &&
            props.dragOverPosition === "before"
          }
        >
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
        </Show>
        <Show
          when={
            props.isDragOver &&
            !props.isDragOverNestable &&
            props.dragOverPosition === "after"
          }
        >
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
        </Show>
        <div
          class={`flex items-center gap-1 ${props.isDragOver && !props.isDragOverNestable ? "opacity-50" : ""}`}
        >
          <Show when={hasChildren()}>
            <button
              type="button"
              class="w-6 h-6 flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#ddd] dark:hover:bg-[#333] rounded"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.button === 0) {
                  props.onToggle();
                }
              }}
            >
              <ChevronSvgIcon isOpen={props.isOpen} />
            </button>
          </Show>
          <div
            class="flex-1"
            draggable={true}
            onDragStart={() => {
              isDragging = true;
              props.onDragStart(new DragEvent("dragstart"));
            }}
            onDragEnd={() => {
              isDragging = false;
              props.onDragEnd();
            }}
          >
            <Button
              label={props.item.name}
              variant="page"
              class={
                props.isSelected
                  ? "bg-[#ddd] dark:bg-[#333] border-blue-500 flex-1"
                  : "bg-[#ededed] dark:bg-[#181818] border-[#ededed] dark:border-[#181818] flex-1"
              }
              onMouseUp={(e) => {
                if (e.button === 0 && !isDragging) {
                  props.onSelect();
                }
              }}
              onContextMenu={props.onContextMenu}
            />
          </div>
        </div>
      </div>
      <Show when={hasChildren()}>
        <div
          class={`ml-4 mt-1 min-h-2 rounded ${props.isDragOverNestable ? "bg-blue-100 dark:bg-blue-900 border-2 border-dashed border-blue-400" : ""}`}
          onDragOver={props.onDragOverNestable}
          onDragLeave={props.onDragLeaveNestable}
          onDrop={props.onDropNestable}
        >
          <Show when={props.isOpen && props.children}>{props.children}</Show>
        </div>
      </Show>
    </div>
  );
};

export default TreeItem;
