import { FunctionComponent, useState } from "react";
import { Page } from "../types";

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

export const PagesMenu: FunctionComponent<PagesMenuProps> = ({
  isOpen,
  pages,
  currentPageIndex,
  onPageSelect,
  onAddPage,
  onRenamePage,
  onDeletePage,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pageIndex: number;
  } | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="pages-float float">
        <div className="pages-list">
          {pages.map((page, index) => (
            <button
              key={index}
              className={`page-item ${
                index === currentPageIndex ? "selected" : ""
              }`}
              onClick={() => onPageSelect(index)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.pageX, y: e.pageY, pageIndex: index });
              }}
            >
              {page.name}
            </button>
          ))}
        </div>
        <div className="divider" />
        <button onClick={onAddPage}>New Page</button>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          pageIndex={contextMenu.pageIndex}
          pages={pages}
          onRenamePage={onRenamePage}
          onDeletePage={onDeletePage}
          onClose={() => setContextMenu(null)}
        />
      )}
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

const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  x,
  y,
  pageIndex,
  pages,
  onRenamePage,
  onDeletePage,
  onClose,
}) => {
  return (
    <div className="context-menu float" style={{ left: x, top: y }}>
      <button
        onClick={() => {
          const newName = prompt("Enter new name:", pages[pageIndex]!.name);
          if (newName) {
            onRenamePage(pageIndex, newName);
          }
          onClose();
        }}
      >
        Rename
      </button>
      {pages.length > 1 && (
        <button
          onClick={() => {
            onDeletePage(pageIndex);
            onClose();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};
