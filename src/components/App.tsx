import { useState } from "react";
import { usePages } from "../hooks/usePages";
import { useEditorSettings } from "../hooks/useSettings";
import { Toolbar } from "./Toolbar";
import { SettingsModal } from "./SettingsModal";
import { PagesMenu } from "./PagesMenu";
import { Editor } from "./Editor";

export function App() {
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [toolbarOpacity, setToolbarOpacity] = useState(1);

  const currentPage = pages[currentPageIndex];

  return (
    <>
      <Toolbar
        opacity={toolbarOpacity}
        currentPageTitle={currentPage?.name || ""}
        onMouseMove={() => setToolbarOpacity(1)}
        onPagesClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onSettingsChange={updateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PagesMenu
        isOpen={isPagesMenuOpen}
        pages={pages}
        currentPageIndex={currentPageIndex}
        onPageSelect={setCurrentPageIndex}
        onAddPage={addPage}
        onRenamePage={renamePage}
        onDeletePage={deletePage}
        onClose={() => setIsPagesMenuOpen(false)}
      />

      <Editor
        content={currentPage?.content || ""}
        onChange={(content) => {
          updatePageContent(content);
          setToolbarOpacity(0);
          setIsPagesMenuOpen(false);
        }}
        settings={settings}
      />
    </>
  );
}

export default App;
