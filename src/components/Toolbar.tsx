import type { JSXElement } from "solid-js";

import Button from "./ui/Button";
import SvgIcon from "./ui/SvgIcon";

const PagesSvgIcon = (): JSXElement => (
  <SvgIcon stroke-width={20} stroke-linecap="round">
    <path d="M20 70v100M60 50v140" />
    <rect width="120" height="180" x="100" y="30" rx="20" />
  </SvgIcon>
);

const SettingsSvgIcon = (): JSXElement => (
  <SvgIcon stroke-width={25} stroke-linecap="round" stroke-linejoin="round">
    <path d="M122.2 20h-4.4a20 20 0 0 0-20 20v1.8a20 20 0 0 1-10 17.3l-4.3 2.5a20 20 0 0 1-20 0l-1.5-.8a20 20 0 0 0-27.3 7.3l-2.2 3.8a20 20 0 0 0 7.3 27.3l1.5 1a20 20 0 0 1 10 17.2v5.1a20 20 0 0 1-10 17.4l-1.5.9a20 20 0 0 0-7.3 27.3l2.2 3.8a20 20 0 0 0 27.3 7.3l1.5-.8a20 20 0 0 1 20 0l4.3 2.5a20 20 0 0 1 10 17.3v1.8a20 20 0 0 0 20 20h4.4a20 20 0 0 0 20-20v-1.8a20 20 0 0 1 10-17.3l4.3-2.5a20 20 0 0 1 20 0l1.5.8a20 20 0 0 0 27.3-7.3l2.2-3.9a20 20 0 0 0-7.3-27.3l-1.5-.8a20 20 0 0 1-10-17.4v-5a20 20 0 0 1 10-17.4l1.5-.9a20 20 0 0 0 7.3-27.3l-2.2-3.8a20 20 0 0 0-27.3-7.3l-1.5.8a20 20 0 0 1-20 0l-4.3-2.5a20 20 0 0 1-10-17.3V40a20 20 0 0 0-20-20" />
    <circle cx="120" cy="120" r="30" />
  </SvgIcon>
);

const ToolbarLeft = (props: { onPagesClick: () => void }): JSXElement => (
  <div>
    <Button variant="toolbar" onClick={props.onPagesClick}>
      <PagesSvgIcon />
    </Button>
  </div>
);

const PageTitle = (props: {
  currentPageTitle: string;
  currentPageIndex: number;
  renamePage: (index: number, newName: string) => void;
}): JSXElement => {
  const makeEditable = (span: HTMLSpanElement) => {
    span.contentEditable = "true";
  };

  const handleRenameEnd = (span: HTMLSpanElement) => {
    const newName = span.textContent || props.currentPageTitle;
    span.textContent = newName;
    props.renamePage(props.currentPageIndex, newName);
    span.contentEditable = "false";
    makeEditable(span);
  };

  return (
    <span
      class="text-2xl"
      onMouseEnter={(e) => makeEditable(e.currentTarget)}
      onClick={(e) => makeEditable(e.currentTarget)}
      onFocusOut={(e) => handleRenameEnd(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleRenameEnd(e.currentTarget);
        }
      }}
    >
      {props.currentPageTitle}
    </span>
  );
};

const ToolbarCenter = (props: {
  currentPageTitle: string;
  currentPageIndex: number;
  renamePage: (index: number, newName: string) => void;
}): JSXElement => (
  <div
    class={`text-center content-center flex-1 text-black dark:text-white [font-family:"Cousine",monospace]`}
  >
    <PageTitle
      currentPageIndex={props.currentPageIndex}
      currentPageTitle={props.currentPageTitle}
      renamePage={props.renamePage}
    />
  </div>
);

const ToolbarRight = (props: { onSettingsClick: () => void }): JSXElement => (
  <div>
    <Button variant="toolbar" onClick={props.onSettingsClick}>
      <SettingsSvgIcon />
    </Button>
  </div>
);

const Toolbar = (props: {
  opacity: number;
  currentPageTitle: string;
  currentPageIndex: number;
  onMouseMove: () => void;
  onPagesClick: () => void;
  onSettingsClick: () => void;
  renamePage: (index: number, newName: string) => void;
}): JSXElement => {
  return (
    <div
      class="justify-between flex absolute z-10 w-[calc(100%_-_10px)] opacity-0 transition-opacity duration-[0.5s] p-4 hover:opacity-100;"
      style={{ opacity: props.opacity }}
      onMouseMove={props.onMouseMove}
    >
      <ToolbarLeft onPagesClick={props.onPagesClick} />

      <ToolbarCenter
        currentPageIndex={props.currentPageIndex}
        currentPageTitle={props.currentPageTitle}
        renamePage={props.renamePage}
      />

      <ToolbarRight onSettingsClick={props.onSettingsClick} />
    </div>
  );
};

export default Toolbar;
