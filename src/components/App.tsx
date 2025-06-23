import { createSignal } from "solid-js";
import { usePages } from "../hooks/usePages";
import { useEditorSettings } from "../hooks/useSettings";
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

  return (
    <>
      <Toolbar
        opacity={toolbarOpacity()}
        pageIndex={currentPageIndex()}
        currentPageTitle={
          currentPage()?.name ||
          "<something has broken - this page does not exist>"
        }
        onMouseMove={() => setToolbarOpacity(1)}
        onPagesClick={() => setIsPagesMenuOpen(!isPagesMenuOpen())}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onRenamePage={renamePage}
      />

      <SettingsModal
        isOpen={isSettingsOpen()}
        settings={settings()}
        onSettingsChange={updateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PagesMenu
        isOpen={isPagesMenuOpen()}
        pages={pages()}
        currentPageIndex={currentPageIndex()}
        onPageSelect={setCurrentPageIndex}
        onAddPage={addPage}
        onRenamePage={renamePage}
        onDeletePage={deletePage}
        onClose={() => setIsPagesMenuOpen(false)}
      />

      <Editor
        content={currentPage()?.content || ""}
        onChange={(content) => {
          updatePageContent(content);
          if (currentPage()?.content) {
            setToolbarOpacity(0);
          } else {
            setToolbarOpacity(1);
          }
          setIsPagesMenuOpen(false);
        }}
        settings={settings()}
      />
    </>
  );
}

export default App;
