import type { Editor as TiptapEditor } from "@tiptap/core";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

import { usePages } from "#hooks/usePages";
import { useEditorSettings } from "#hooks/useSettings";
import { findMatches } from "#lib/search";
import { highlightPluginKey } from "#lib/tiptap/Highlight";
import Editor from "./Editor";
import type { Direction } from "./FindReplaceModal";
import FindReplaceModal from "./FindReplaceModal";
import PagesMenu from "./PagesMenu";
import SettingsModal from "./SettingsModal";
import Toolbar from "./Toolbar";

function App() {
  const {
    pages,
    setPages,
    currentPageId,
    setCurrentPageId,
    addPage,
    renameItem,
    deleteItem,
    moveItem,
    updatePageContent,
    getCurrentPage,
  } = usePages();

  const { settings, updateSettings } = useEditorSettings();

  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [editorInstance, setEditorInstance] = createSignal<TiptapEditor | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = createSignal("");
  const [currentMatchIndex, setCurrentMatchIndex] = createSignal(0);
  const [caseSensitive, setCaseSensitive] = createSignal(false);

  const [toolbarOpacity, setToolbarOpacity] = createSignal(1);
  const [syncVersion, setSyncVersion] = createSignal(0);

  const currentPage = () => getCurrentPage();

  const PAGES_BROKEN = "<something has broken - this page does not exist>";

  const content = () => currentPage()?.content ?? "";

  const matches = createMemo(() => {
    syncVersion();
    const editor = editorInstance();
    const term = searchTerm();
    if (!editor || !term) return [];

    const segments: { text: string; pos: number }[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        segments.push({ text: node.text, pos });
      }
    });

    return findMatches(segments, term, caseSensitive());
  });

  const setSearchOptions = (term: string, cs: boolean, idx: number) => {
    const editor = editorInstance();
    if (!editor) return;
    const tr = editor.state.tr;
    tr.setMeta(highlightPluginKey, {
      searchTerm: term,
      caseSensitive: cs,
      currentMatchIndex: idx,
    });
    editor.view.dispatch(tr);
  };

  createEffect(() => {
    setSearchOptions(searchTerm(), caseSensitive(), currentMatchIndex());
  });

  const selectMatch = (index: number) => {
    const editor = editorInstance();
    const allMatches = matches();
    if (!editor || allMatches.length === 0) return;

    const match = allMatches[index];
    if (!match) return;

    const { node } = editor.view.domAtPos(match.from);
    const el = (
      node.nodeType === Node.TEXT_NODE ? node.parentElement : node
    ) as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
    selectMatch(newIndex);
  };

  const handleEditorReady = (editor: TiptapEditor) => {
    setEditorInstance(editor);
  };

  const handleReplace = (replacement: string) => {
    const editor = editorInstance();
    const matchPositions = matches();
    if (!editor || matchPositions.length === 0 || !searchTerm()) return;

    const idx = currentMatchIndex();
    const match = matchPositions[idx];
    if (!match) return;

    editor
      .chain()
      .focus()
      .setTextSelection({ from: match.from, to: match.to })
      .insertContent(replacement)
      .run();

    setCurrentMatchIndex(Math.min(idx, matchPositions.length - 2));
  };

  const handleReplaceAll = (replacement: string) => {
    const editor = editorInstance();
    if (!editor || !searchTerm()) return;

    const allMatches = matches();
    if (allMatches.length === 0) return;

    const sortedMatches = [...allMatches].sort((a, b) => b.from - a.from);

    for (const match of sortedMatches) {
      editor
        .chain()
        .focus()
        .setTextSelection({ from: match.from, to: match.to })
        .insertContent(replacement)
        .run();
    }

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

  const selectPageByTreeItem = (itemId: string) => {
    setCurrentPageId(itemId);
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
        currentPageId={currentPageId()}
        currentPageTitle={currentPage()?.name ?? PAGES_BROKEN}
        onMouseMove={() => setToolbarOpacity(1)}
        onPagesClick={() => setIsPagesMenuOpen(!isPagesMenuOpen())}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onSearchClick={handleOpenSearch}
        renameItem={renameItem}
        pages={pages()}
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
        currentPageId={currentPageId()}
        selectPageByTreeItem={selectPageByTreeItem}
        addPage={addPage}
        renameItem={renameItem}
        deleteItem={deleteItem}
        moveItem={moveItem}
        setPages={setPages}
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
        onEditorReady={handleEditorReady}
        onContentSynced={() => setSyncVersion((v) => v + 1)}
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
