import { useState, useEffect } from "react";
import { Page } from "../types";

const DEFAULT_PAGE: Page = { name: "Page 1", content: "" };

export function usePages() {
  const [pages, setPages] = useState([DEFAULT_PAGE]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const storedPages = localStorage.getItem("pages");
    const storedCurrentPage = localStorage.getItem("currentPage");

    if (storedPages) {
      const parsedPages = JSON.parse(storedPages) as Page[];
      setPages(parsedPages.length > 0 ? parsedPages : [DEFAULT_PAGE]);
    }

    const parsedIndex = parseInt(storedCurrentPage || "0", 10);
    setCurrentPageIndex(parsedIndex);
  }, []);

  const addPage = () => {
    const newPage: Page = {
      name: `Page ${pages.length + 1}`,
      content: "",
    };
    const newPages = [...pages, newPage];
    setPages(newPages);
    setCurrentPageIndex(pages.length);
    localStorage.setItem("pages", JSON.stringify(newPages));
    localStorage.setItem("currentPage", pages.length.toString());
  };

  const updatePageContent = (content: string) => {
    if (currentPageIndex >= 0 && currentPageIndex < pages.length) {
      const newPages = [...pages];
      const currentPage = newPages[currentPageIndex];
      if (currentPage) {
        newPages[currentPageIndex] = {
          name: currentPage.name,
          content,
        };
        setPages(newPages);
        localStorage.setItem("pages", JSON.stringify(newPages));
      }
    }
  };

  const renamePage = (index: number, newName: string) => {
    if (index >= 0 && index < pages.length) {
      const newPages = [...pages];
      const page = newPages[index];
      if (page) {
        newPages[index] = {
          name: newName.trim(),
          content: page.content,
        };
        setPages(newPages);
        localStorage.setItem("pages", JSON.stringify(newPages));
      }
    }
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) return; // Don't delete the last page

    if (index >= 0 && index < pages.length) {
      const newPages = pages.filter((_, i) => i !== index);
      setPages(newPages.length > 0 ? newPages : [DEFAULT_PAGE]);

      let newIndex = currentPageIndex;
      if (currentPageIndex >= newPages.length) {
        newIndex = newPages.length - 1;
      } else if (index < currentPageIndex) {
        newIndex = currentPageIndex - 1;
      }

      setCurrentPageIndex(newIndex);
      localStorage.setItem("pages", JSON.stringify(newPages));
      localStorage.setItem("currentPage", newIndex.toString());
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
