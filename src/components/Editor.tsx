import { createEffect, type JSX } from "solid-js";

import type { EditorSettings } from "#types";

interface Match {
  start: number;
  end: number;
}

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  settings: EditorSettings;
  searchTerm?: string;
  caseSensitive?: boolean;
  currentMatchIndex?: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setCaretPosition(element: HTMLDivElement, position: number) {
  const range = document.createRange();
  const selection = window.getSelection();

  let charCount = 0;
  let found = false;

  function traverseNodes(node: Node) {
    if (found) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const nextCount = charCount + (node.textContent?.length ?? 0);
      if (position <= nextCount) {
        range.setStart(node, position - charCount);
        range.setEnd(node, position - charCount);
        found = true;
      }
      charCount = nextCount;
    } else {
      for (const child of Array.from(node.childNodes)) {
        traverseNodes(child);
        if (found) return;
      }
    }
  }

  traverseNodes(element);

  if (!found) {
    range.selectNodeContents(element);
    range.collapse(false);
  }

  selection?.removeAllRanges();
  selection?.addRange(range);
}

function Editor(props: EditorProps): JSX.Element {
  let editorRef: HTMLDivElement | undefined;

  const renderContent = (): string => {
    const text = props.content;
    if (!props.searchTerm || !text) return escapeHtml(text);

    const escaped = escapeHtml(text);
    const searchEscaped = RegExp.escape(props.searchTerm);
    const flags = props.caseSensitive ? "" : "i";
    const regex = new RegExp(`(${searchEscaped})`, `g${flags}`);

    return escaped.replace(
      regex,
      '<mark class="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">$1</mark>',
    );
  };

  const handleInput = () => {
    if (!editorRef) return;
    const text = editorRef.innerText;
    props.onChange(text);
  };

  createEffect(() => {
    if (!editorRef) return;
    const searchTerm = props.searchTerm;
    const selection = window.getSelection();
    let savedOffset = 0;
    let hadSelection = false;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      savedOffset = preCaretRange.toString().length;
      hadSelection = true;
    }

    const html = renderContent();
    editorRef.innerHTML = html;

    if (searchTerm && hadSelection) {
      setCaretPosition(editorRef, savedOffset);
    }
  });

  createEffect(() => {
    if (editorRef && props.searchTerm) {
      const matches = getMatches(
        props.content,
        props.searchTerm,
        props.caseSensitive,
      );
      if (matches.length > 0 && props.currentMatchIndex !== undefined) {
        const match = matches[props.currentMatchIndex];
        if (match) {
          setCaretPosition(editorRef, match.start);
        }
      }
    }
  });

  return (
    <main>
      <div
        ref={editorRef}
        contentEditable={true}
        spellcheck={props.settings.spellcheck}
        onInput={handleInput}
        class="w-full absolute h-screen overflow-y-auto overflow-x-hidden
               [word-break:break-word] text-black dark:text-white caret-blue-500
               bg-transparent [scrollbar-width:thin] scroll-smooth
               p-[calc(min(1em,20vh)+72px)_max(-372px+50vw,1em)_min(5em,15vh)]
               scroll-pb-0 left-0 top-0 outline-none whitespace-pre-wrap"
        style={{
          "font-size": `${props.settings.fontSize}px`,
          "font-family": props.settings.fontFamily,
          "text-align": props.settings.textAlign,
        }}
        data-placeholder="Start writing..."
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
        }
      `}</style>
    </main>
  );
}

function getMatches(
  content: string,
  searchTerm: string,
  caseSensitive = false,
): Match[] {
  if (!searchTerm) return [];
  const matches: Match[] = [];
  const searchContent = caseSensitive ? content : content.toLowerCase();
  const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  let pos = 0;
  let found = searchContent.indexOf(search, pos);
  while (found !== -1) {
    matches.push({ start: found, end: found + searchTerm.length });
    pos = found + 1;
    found = searchContent.indexOf(search, pos);
  }
  return matches;
}

export default Editor;
