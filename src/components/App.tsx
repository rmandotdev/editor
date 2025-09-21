import { createSignal } from "solid-js";

import { usePages } from "~/hooks/usePages";
import { useEditorSettings } from "~/hooks/useSettings";

import Toolbar from "./Toolbar";
import SettingsModal from "./SettingsModal";
import PagesMenu from "./PagesMenu";
import Editor from "./Editor";

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
  const [toolbarOpacity, setToolbarOpacity] = createSignal(1);

  const currentPage = () => pages()[currentPageIndex()];

  const PAGES_BROKEN = "<something has broken - this page does not exist>";

  return (
    <>
      <Toolbar
        opacity={toolbarOpacity()}
        currentPageIndex={currentPageIndex()}
        currentPageTitle={currentPage()?.name ?? PAGES_BROKEN}
        onMouseMove={() => setToolbarOpacity(1)}
        onPagesClick={() => setIsPagesMenuOpen(!isPagesMenuOpen())}
        onSettingsClick={() => setIsSettingsOpen(true)}
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
        onAddPage={addPage}
        renamePage={renamePage}
        deletePage={deletePage}
      />

      <Editor
        content={currentPage()?.content ?? PAGES_BROKEN}
        settings={settings()}
        onChange={(content) => {
          updatePageContent(content);
          if (currentPage()?.content) {
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
