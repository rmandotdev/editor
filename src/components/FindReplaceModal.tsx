import { createSignal, type JSX, Show } from "solid-js";

type Direction = "next" | "prev";

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onNavigate: (direction: Direction) => void;
  onReplace: (replacement: string) => void;
  onReplaceAll: (replacement: string) => void;
  matchCount: number;
  currentMatchIndex: number;
  caseSensitive: boolean;
  onCaseSensitiveChange: (value: boolean) => void;
}

const SearchIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-label="Search"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CloseIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-label="Close"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const FindReplaceModal = (props: FindReplaceModalProps): JSX.Element => {
  const [replaceText, setReplaceText] = createSignal("");

  const handleFindKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onNavigate("next");
    }
  };

  const handleReplaceKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (props.matchCount > 0) {
        props.onReplace(replaceText());
      }
    }
  };

  const handleClose = () => {
    setReplaceText("");
    props.onClose();
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-[#1a1a1a] 
               border border-[#ccc] dark:border-[#444] rounded-lg shadow-xl p-4 min-w-80"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="text-black dark:text-white font-medium">
            Find &amp; Replace
          </span>
          <button
            type="button"
            onClick={handleClose}
            class="text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <div>
            <label
              for="find-input"
              class="block text-xs text-[#666] dark:text-[#999] mb-1"
            >
              Find
            </label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[#666] dark:text-[#999]">
                  <SearchIcon />
                </span>
                <input
                  id="find-input"
                  type="text"
                  value={props.searchTerm}
                  onInput={(e) =>
                    props.onSearchTermChange(e.currentTarget.value)
                  }
                  onKeyDown={handleFindKeyDown}
                  class="w-full bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] dark:border-[#444] 
                         rounded px-8 py-1 text-black dark:text-white text-sm outline-none
                         focus:border-blue-500"
                  placeholder="Search..."
                  autofocus
                />
              </div>
              <button
                type="button"
                onClick={() => props.onNavigate("prev")}
                class="px-3 py-1 text-sm bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] 
                       dark:border-[#444] rounded text-black dark:text-white cursor-pointer
                       hover:bg-[#eee] dark:hover:bg-[#333]"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => props.onNavigate("next")}
                class="px-3 py-1 text-sm bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] 
                       dark:border-[#444] rounded text-black dark:text-white cursor-pointer
                       hover:bg-[#eee] dark:hover:bg-[#333]"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  props.onCaseSensitiveChange(!props.caseSensitive)
                }
                class="px-2 py-1 text-xs font-mono bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] 
                       dark:border-[#444] rounded text-black dark:text-white cursor-pointer
                       hover:bg-[#eee] dark:hover:bg-[#333]"
                title="Match Case"
              >
                Aa
              </button>
            </div>
            <Show when={props.searchTerm}>
              <span class="text-xs text-[#666] dark:text-[#999] mt-1 block">
                {props.matchCount > 0
                  ? `${props.currentMatchIndex + 1} of ${props.matchCount}`
                  : "No matches"}
              </span>
            </Show>
          </div>

          <div>
            <label
              for="replace-input"
              class="block text-xs text-[#666] dark:text-[#999] mb-1"
            >
              Replace with
            </label>
            <input
              id="replace-input"
              type="text"
              value={replaceText()}
              onInput={(e) => setReplaceText(e.currentTarget.value)}
              onKeyDown={handleReplaceKeyDown}
              class="w-full bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] dark:border-[#444] 
                     rounded px-3 py-1 text-black dark:text-white text-sm outline-none
                     focus:border-blue-500"
              placeholder="Replace with..."
            />
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              onClick={() => props.onReplace(replaceText())}
              disabled={props.matchCount === 0}
              class="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded cursor-pointer
                     hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => props.onReplaceAll(replaceText())}
              disabled={props.matchCount === 0}
              class="flex-1 px-3 py-1.5 text-sm bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#ddd] 
                     dark:border-[#444] rounded text-black dark:text-white cursor-pointer
                     hover:bg-[#eee] dark:hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Replace All
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export type { Direction };
export default FindReplaceModal;
