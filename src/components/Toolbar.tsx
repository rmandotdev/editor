import type { JSX } from "solid-js";

interface ToolbarProps {
  opacity: number;
  currentPageTitle: string;
  pageIndex: number;
  onMouseMove: () => void;
  onPagesClick: () => void;
  onSettingsClick: () => void;
  onRenamePage: (index: number, newName: string) => void;
}

const Toolbar = (props: ToolbarProps): JSX.Element => {
  let pageTitleRef: HTMLParagraphElement | undefined;

  const makeEdidtable = () => {
    if (pageTitleRef) {
      pageTitleRef.contentEditable = "true";
    }
  };

  const renamePage = () => {
    if (pageTitleRef) {
      const newName = pageTitleRef.textContent || props.currentPageTitle;
      pageTitleRef.textContent = newName;
      props.onRenamePage(props.pageIndex, newName);
      pageTitleRef.contentEditable = "false";
      makeEdidtable();
    }
  };

  return (
    <div
      id="toolbar"
      class="toolbar"
      style={{ opacity: props.opacity }}
      onMouseMove={props.onMouseMove}
    >
      <div class="toolbar-left">
        <button
          id="pages-button"
          class="toolbar-button"
          onClick={props.onPagesClick}
        >
          <svg
            class="svg-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240 240"
            fill="none"
            stroke="currentColor"
            stroke-width="20"
            stroke-linecap="round"
          >
            <path d="M20 70v100M60 50v140" />
            <rect width="120" height="180" x="100" y="30" rx="20" />
          </svg>
        </button>
      </div>
      <div class="toolbar-center">
        <span
          class="current-page-title"
          onMouseEnter={makeEdidtable}
          onClick={makeEdidtable}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              renamePage();
            }
          }}
          onFocusOut={renamePage}
          ref={pageTitleRef}
        >
          {props.currentPageTitle}
        </span>
      </div>
      <div class="toolbar-right">
        <button
          id="settings-button"
          class="toolbar-button"
          onClick={props.onSettingsClick}
        >
          <svg
            class="svg-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240 240"
            fill="none"
            stroke="currentColor"
            stroke-width="25"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M122.2 20h-4.4a20 20 0 0 0-20 20v1.8a20 20 0 0 1-10 17.3l-4.3 2.5a20 20 0 0 1-20 0l-1.5-.8a20 20 0 0 0-27.3 7.3l-2.2 3.8a20 20 0 0 0 7.3 27.3l1.5 1a20 20 0 0 1 10 17.2v5.1a20 20 0 0 1-10 17.4l-1.5.9a20 20 0 0 0-7.3 27.3l2.2 3.8a20 20 0 0 0 27.3 7.3l1.5-.8a20 20 0 0 1 20 0l4.3 2.5a20 20 0 0 1 10 17.3v1.8a20 20 0 0 0 20 20h4.4a20 20 0 0 0 20-20v-1.8a20 20 0 0 1 10-17.3l4.3-2.5a20 20 0 0 1 20 0l1.5.8a20 20 0 0 0 27.3-7.3l2.2-3.9a20 20 0 0 0-7.3-27.3l-1.5-.8a20 20 0 0 1-10-17.4v-5a20 20 0 0 1 10-17.4l1.5-.9a20 20 0 0 0 7.3-27.3l-2.2-3.8a20 20 0 0 0-27.3-7.3l-1.5.8a20 20 0 0 1-20 0l-4.3-2.5a20 20 0 0 1-10-17.3V40a20 20 0 0 0-20-20" />
            <circle cx="120" cy="120" r="30" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
