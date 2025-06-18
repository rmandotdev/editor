import { FunctionComponent } from "react";

interface ToolbarProps {
  opacity: number;
  currentPageTitle: string;
  onMouseMove: () => void;
  onPagesClick: () => void;
  onSettingsClick: () => void;
}

export const Toolbar: FunctionComponent<ToolbarProps> = ({
  opacity,
  currentPageTitle,
  onMouseMove,
  onPagesClick,
  onSettingsClick,
}) => (
  <div
    id="toolbar"
    className="toolbar"
    style={{ opacity }}
    onMouseMove={onMouseMove}
  >
    <div className="toolbar-left">
      <button
        id="pages-button"
        className="toolbar-button"
        onClick={onPagesClick}
      >
        <svg
          className="svg-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
        >
          <path d="M20 70v100M60 50v140" />
          <rect width="120" height="180" x="100" y="30" rx="20" />
        </svg>
      </button>
    </div>
    <div className="toolbar-center">
      <span id="current-page-title" className="opacity-70">
        {currentPageTitle}
      </span>
    </div>
    <div className="toolbar-right">
      <button
        id="settings-button"
        className="toolbar-button"
        onClick={onSettingsClick}
      >
        <svg
          className="svg-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M122.2 20h-4.4a20 20 0 0 0-20 20v1.8a20 20 0 0 1-10 17.3l-4.3 2.5a20 20 0 0 1-20 0l-1.5-.8a20 20 0 0 0-27.3 7.3l-2.2 3.8a20 20 0 0 0 7.3 27.3l1.5 1a20 20 0 0 1 10 17.2v5.1a20 20 0 0 1-10 17.4l-1.5.9a20 20 0 0 0-7.3 27.3l2.2 3.8a20 20 0 0 0 27.3 7.3l1.5-.8a20 20 0 0 1 20 0l4.3 2.5a20 20 0 0 1 10 17.3v1.8a20 20 0 0 0 20 20h4.4a20 20 0 0 0 20-20v-1.8a20 20 0 0 1 10-17.3l4.3-2.5a20 20 0 0 1 20 0l1.5.8a20 20 0 0 0 27.3-7.3l2.2-3.9a20 20 0 0 0-7.3-27.3l-1.5-.8a20 20 0 0 1-10-17.4v-5a20 20 0 0 1 10-17.4l1.5-.9a20 20 0 0 0 7.3-27.3l-2.2-3.8a20 20 0 0 0-27.3-7.3l-1.5.8a20 20 0 0 1-20 0l-4.3-2.5a20 20 0 0 1-10-17.3V40a20 20 0 0 0-20-20" />
          <circle cx="120" cy="120" r="30" />
        </svg>
      </button>
    </div>
  </div>
);
