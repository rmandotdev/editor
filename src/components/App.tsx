import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { usePages } from "#hooks/usePages";
import { useEditorSettings } from "#hooks/useSettings";
import { getMatches } from "#lib/get-matches";
import Editor from "./Editor";
import type { Direction } from "./FindReplaceModal";
import FindReplaceModal from "./FindReplaceModal";
import PagesMenu from "./PagesMenu";
import SettingsModal from "./SettingsModal";
import Toolbar from "./Toolbar";

function App() {
  const {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    addPage,
    updatePageContent,
    renamePage,
    deletePage,
  } = usePages();

  const { settings, updateSettings } = useEditorSettings();

  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);

  const [searchTerm, setSearchTerm] = createSignal("");
  const [currentMatchIndex, setCurrentMatchIndex] = createSignal(0);
  const [caseSensitive, setCaseSensitive] = createSignal(false);

  const [toolbarOpacity, setToolbarOpacity] = createSignal(1);

  const currentPage = () => pages()[currentPageIndex()];

  const PAGES_BROKEN = "<something has broken - this page does not exist>";

  const content = () => currentPage()?.content ?? "";

  const matches = createMemo(() =>
    getMatches(content(), searchTerm(), caseSensitive()),
  );

  const handleNavigate = (direction: Direction) => {
    const matchCount = matches().length;
    if (matchCount === 0) return;

    let newIndex = currentMatchIndex();
    if (direction === "next") {
      newIndex = (newIndex + 1) % matchCount;
    } else {
      newIndex = (newIndex - 1 + matchCount) % matchCount;
    }
    setCurrentMatchIndex(newIndex);
  };

  const handleReplace = (replacement: string) => {
    const matchPositions = matches();
    if (matchPositions.length === 0 || !searchTerm()) return;

    const idx = currentMatchIndex();
    const pos = matchPositions[idx]?.start;
    if (pos === undefined) return;

    const text = content();
    const newContent =
      text.slice(0, pos) + replacement + text.slice(pos + searchTerm().length);
    updatePageContent(newContent);

    const newMatches = getMatches(newContent, searchTerm(), caseSensitive());
    if (newMatches.length > 0) {
      setCurrentMatchIndex(Math.min(idx, newMatches.length - 1));
    }
  };

  const handleReplaceAll = (replacement: string) => {
    if (!searchTerm()) return;
    const text = content();
    const flags = caseSensitive() ? "g" : "gi";
    const newContent = text.replace(
      new RegExp(RegExp.escape(searchTerm()), flags),
      replacement,
    );
    updatePageContent(newContent);
    setCurrentMatchIndex(0);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentMatchIndex(0);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setSearchTerm("");
    setCurrentMatchIndex(0);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setCurrentMatchIndex(0);
  };

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F3" ||
        (e.ctrlKey && e.key === "f") ||
        (e.ctrlKey && e.key === "h")
      ) {
        e.preventDefault();
        handleOpenSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <>
      <Toolbar
        opacity={toolbarOpacity()}
        currentPageIndex={currentPageIndex()}
        currentPageTitle={currentPage()?.name ?? PAGES_BROKEN}
        onMouseMove={() => setToolbarOpacity(1)}
        onPagesClick={() => setIsPagesMenuOpen(!isPagesMenuOpen())}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onSearchClick={handleOpenSearch}
        renamePage={renamePage}
      />

      <SettingsModal
        isOpen={isSettingsOpen()}
        settings={settings()}
        updateSettings={updateSettings}
        closeSettingsModal={() => setIsSettingsOpen(false)}
      />

      <PagesMenu
        isOpen={isPagesMenuOpen()}
        pages={pages()}
        currentPageIndex={currentPageIndex()}
        selectPage={setCurrentPageIndex}
        newPage={addPage}
        renamePage={renamePage}
        deletePage={deletePage}
      />

      <FindReplaceModal
        isOpen={isSearchOpen()}
        content={content()}
        searchTerm={searchTerm()}
        matchCount={matches().length}
        currentMatchIndex={currentMatchIndex()}
        onClose={handleCloseSearch}
        onSearchTermChange={handleSearchTermChange}
        onNavigate={handleNavigate}
        onReplace={handleReplace}
        onReplaceAll={handleReplaceAll}
        caseSensitive={caseSensitive()}
        onCaseSensitiveChange={setCaseSensitive}
      />

      <Editor
        content={content()}
        settings={settings()}
        searchTerm={searchTerm()}
        caseSensitive={caseSensitive()}
        currentMatchIndex={matches().length > 0 ? currentMatchIndex() : -1}
        isSearchOpen={isSearchOpen()}
        onChange={(newContent) => {
          updatePageContent(newContent);
          if (newContent) {
            setToolbarOpacity(0);
          } else {
            setToolbarOpacity(1);
          }
          setIsPagesMenuOpen(false);
        }}
      />
    </>
  );
}

export default App;
