import { createSignal, Show, For } from "solid-js";
import type { JSXElement } from "solid-js";

import type { Page } from "~/types";

import Button from "./ui/Button";
import Divider from "./ui/Divider";
import ContextMenu from "./ui/ContextMenu";

const PageButton = (props: {
  label: string;
  isCurrentPage: boolean;
  onClick: () => void;
  onContextMenu: (e: MouseEvent) => void;
}): JSXElement => {
  return (
    <Button
      label={props.label}
      variant="page"
      class={
        props.isCurrentPage
          ? "bg-[color:var(--background-hover-color)] border-[color:var(--accent-color)]"
          : "bg-[var(--float-bg-color)] border-[color:var(--float-bg-color)]"
      }
      onClick={props.onClick}
      onMouseDown={(e) => {
        if (e.button === 0) {
          props.onClick();
        }
      }}
      onContextMenu={props.onContextMenu}
    />
  );
};

type ContexMenuState = { x: number; y: number; pageIndex: number } | null;

const PagesList = (props: {
  pages: Page[];
  currentPageIndex: number;
  selectPage: (index: number) => void;
  setContextMenu: (arg: ContexMenuState) => void;
}) => (
  <div class="max-h-[min(calc(100vh_-_150px),calc(38px_*_8))] overflow-y-auto">
    <For each={props.pages}>
      {(page, index) => (
        <PageButton
          isCurrentPage={props.currentPageIndex === index()}
          onClick={() => props.selectPage(index())}
          label={page.name}
          onContextMenu={(e) => {
            e.preventDefault();
            props.setContextMenu({
              x: e.pageX,
              y: e.pageY,
              pageIndex: index(),
            });
          }}
        />
      )}
    </For>
  </div>
);

const Pages = (props: {
  currentPageIndex: number;
  pages: Page[];
  selectPage: (index: number) => void;
  setContextMenu: (arg: ContexMenuState) => void;
  onAddPage: () => void;
}): JSXElement => (
  <div
    class="
    fixed border border-[color:var(--float-border-color)] bg-[color:var(--float-bg-color)] p-2 rounded-md border-solid

    z-20 w-[230px] left-4 top-[60px]
    "
    onClick={() => props.setContextMenu(null)}
  >
    <PagesList
      pages={props.pages}
      currentPageIndex={props.currentPageIndex}
      selectPage={props.selectPage}
      setContextMenu={props.setContextMenu}
    />
    <Divider />
    <Button label="New Page" onClick={props.onAddPage} />
  </div>
);

const PagesContextMenu = (props: {
  contextMenu: () => ContexMenuState;
  onRenamePage: () => void;
  onDeletePage: () => void;
  showDeleteButton: boolean;
}) => (
  <Show when={props.contextMenu()}>
    {(contextMenu) => (
      <ContextMenu
        x={contextMenu().x}
        y={contextMenu().y}
        items={[
          {
            label: "Rename",
            onClick: props.onRenamePage,
          },
          {
            label: "Delete",
            onClick: props.onDeletePage,
            show: props.showDeleteButton,
          },
        ]}
      />
    )}
  </Show>
);

const PagesMenu = (props: {
  isOpen: boolean;
  pages: Page[];
  currentPageIndex: number;
  onAddPage: () => void;
  selectPage: (index: number) => void;
  renamePage: (index: number, newName: string) => void;
  deletePage: (index: number) => void;
}): JSXElement => {
  const [contextMenu, setContextMenu] = createSignal<ContexMenuState>(null);

  const onRenamePage = () => {
    const c = contextMenu();
    if (!c) {
      throw new Error("BROKEN STATE");
    }
    const page = props.pages[c.pageIndex];
    if (!page) {
      throw new Error("BROKEN STATE");
    }
    const oldName = page.name;
    const newName = prompt("Enter new name:", oldName);
    if (newName) {
      props.renamePage(c.pageIndex, newName);
    }
    setContextMenu(null);
  };

  const onDeletePage = () => {
    const c = contextMenu();
    if (!c) {
      throw new Error("BROKEN STATE");
    }
    props.deletePage(c.pageIndex);
    setContextMenu(null);
  };

  return (
    <Show when={props.isOpen}>
      <Pages
        currentPageIndex={props.currentPageIndex}
        onAddPage={props.onAddPage}
        selectPage={props.selectPage}
        pages={props.pages}
        setContextMenu={setContextMenu}
      />

      <PagesContextMenu
        contextMenu={contextMenu}
        onRenamePage={onRenamePage}
        onDeletePage={onDeletePage}
        showDeleteButton={props.pages.length > 1}
      />
    </Show>
  );
};

export default PagesMenu;
