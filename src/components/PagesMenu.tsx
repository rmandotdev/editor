import { createSignal, type JSX, Show } from "solid-js";
import type { Page } from "../types";

interface PagesMenuProps {
  isOpen: boolean;
  pages: Page[];
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  onAddPage: () => void;
  onRenamePage: (index: number, newName: string) => void;
  onDeletePage: (index: number) => void;
  onClose: () => void;
}

const PagesMenu = (props: PagesMenuProps): JSX.Element => {
  const [contextMenu, setContextMenu] = createSignal<{
    x: number;
    y: number;
    pageIndex: number;
  } | null>(null);

  return (
    <>
      <Show when={props.isOpen}>
        <div class="pages-float float" onClick={() => setContextMenu(null)}>
          <div class="pages-list">
            {props.pages.map((page, index) => (
              <button
                class={`page-item ${
                  index === props.currentPageIndex ? "selected" : ""
                }`}
                onClick={() => props.onPageSelect(index)}
                onMouseDown={(e) => {
                  if (e.button === 0) {
                    props.onPageSelect(index);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.pageX, y: e.pageY, pageIndex: index });
                }}
              >
                {page.name}
              </button>
            ))}
          </div>
          <div class="divider" />
          <button onClick={props.onAddPage}>New Page</button>
        </div>
      </Show>

      <Show when={contextMenu()}>
        <ContextMenu
          x={contextMenu()?.x || 0}
          y={contextMenu()?.y || 0}
          pageIndex={contextMenu()?.pageIndex || 0}
          pages={props.pages}
          onRenamePage={props.onRenamePage}
          onDeletePage={props.onDeletePage}
          onClose={() => setContextMenu(null)}
        />
      </Show>
    </>
  );
};

interface ContextMenuProps {
  x: number;
  y: number;
  pageIndex: number;
  pages: Page[];
  onRenamePage: (index: number, newName: string) => void;
  onDeletePage: (index: number) => void;
  onClose: () => void;
}

const ContextMenu = (props: ContextMenuProps): JSX.Element => {
  return (
    <div
      class="context-menu float"
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      <button
        onClick={() => {
          const newName = prompt(
            "Enter new name:",
            props.pages[props.pageIndex]!.name
          );
          if (newName) {
            props.onRenamePage(props.pageIndex, newName);
          }
          props.onClose();
        }}
      >
        Rename
      </button>
      {props.pages.length > 1 && (
        <button
          onClick={() => {
            props.onDeletePage(props.pageIndex);
            props.onClose();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default PagesMenu;
