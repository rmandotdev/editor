import { createSignal, createEffect, onMount } from "solid-js";

import type { Page } from "~/types";

const DEFAULT_PAGE: Page = { name: "Page 1", content: "" };

export function usePages() {
  const [pages, setPages] = createSignal<Page[]>([DEFAULT_PAGE]);
  const [currentPageIndex, setCurrentPageIndex] = createSignal(0);

  onMount(() => {
    const storedPages = localStorage.getItem("pages");
    const storedCurrentPage = localStorage.getItem("currentPage");

    if (storedPages) {
      const parsedPages = JSON.parse(storedPages) as Page[];
      setPages(parsedPages.length > 0 ? parsedPages : [DEFAULT_PAGE]);
    }

    const parsedIndex = parseInt(storedCurrentPage || "0", 10);
    setCurrentPageIndex(parsedIndex);

    window.addEventListener("storage", (event) => {
      if (!event.newValue) return;
      if (event.key === "pages") {
        const newPagesData = JSON.parse(event.newValue) as Page[];
        setPages(newPagesData);
        if (currentPageIndex() >= pages().length) {
          setCurrentPageIndex(pages().length - 1);
        }
      }
    });

    window.addEventListener("unload", () => {
      localStorage.setItem("currentPage", currentPageIndex().toString());
    });
  });

  createEffect(() => {
    localStorage.setItem("pages", JSON.stringify(pages()));
  });

  const addPage = () => {
    const newPage: Page = {
      name: `Page ${pages().length + 1}`,
      content: "",
    };
    setPages([...pages(), newPage]);
    setCurrentPageIndex(pages().length - 1);
  };

  const updatePageContent = (content: string) => {
    const idx = currentPageIndex();
    if (idx >= 0 && idx < pages().length) {
      const newPages = [...pages()];
      newPages[idx] = { ...newPages[idx]!, content };
      setPages(newPages);
    }
  };

  const renamePage = (index: number, newName: string) => {
    if (index >= 0 && index < pages().length) {
      const newPages = [...pages()];
      newPages[index] = { ...newPages[index]!, name: newName.trim() };
      setPages(newPages);
    }
  };

  const deletePage = (index: number) => {
    if (pages().length <= 1) return; // Don't delete the last page

    if (index >= 0 && index < pages().length) {
      const newPages = pages().filter((_, i) => i !== index);
      setPages(newPages.length > 0 ? newPages : [DEFAULT_PAGE]);

      let newIndex = currentPageIndex();
      if (newIndex >= newPages.length) {
        newIndex = newPages.length - 1;
      } else if (index < newIndex) {
        newIndex = newIndex - 1;
      }
      setCurrentPageIndex(newIndex);
    }
  };

  return {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    addPage,
    updatePageContent,
    renamePage,
    deletePage,
  };
}
