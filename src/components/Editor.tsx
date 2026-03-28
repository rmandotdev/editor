import { createEffect, createSignal, type JSX, onMount } from "solid-js";
import {
  createModel,
  deleteBackward,
  getCursor,
  getCursorOffset,
  getText,
  insertAtCursor,
  moveCursor,
  redo,
  setCursor,
  setText,
  undo,
} from "#lib/editor-model";
import { escapeHtml } from "#lib/escape-html";
import type { EditorSettings } from "#types";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  settings: EditorSettings;
  searchTerm?: string;
  caseSensitive?: boolean;
  currentMatchIndex?: number;
  isSearchOpen?: boolean;
}

function Editor(props: EditorProps): JSX.Element {
  let textareaRef: HTMLTextAreaElement | undefined;
  let displayRef: HTMLDivElement | undefined;
  let cursorRef: HTMLDivElement | undefined;

  const [model] = createSignal(createModel(""));
  const [paddingTop, setPaddingTop] = createSignal(0);
  const [paddingLeft, setPaddingLeft] = createSignal(0);

  const renderContent = (): string => {
    const text = getText(model());
    if (!props.searchTerm || !text) return escapeHtml(text);

    const escaped = escapeHtml(text);
    const searchEscaped = RegExp.escape(escapeHtml(props.searchTerm));
    const flags = props.caseSensitive ? "" : "i";
    const regex = new RegExp(`(${searchEscaped})`, `g${flags}`);

    return escaped.replace(
      regex,
      '<mark class="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">$1</mark>',
    );
  };

  const getLineHeight = (): number => {
    return props.settings.fontSize * 1.5;
  };

  const getCharWidth = (): number => {
    return props.settings.fontSize * 0.6;
  };

  const updateCursorPosition = () => {
    if (!cursorRef || !textareaRef) return;

    const cursor = getCursor(model());
    const lineHeight = getLineHeight();
    const charWidth = getCharWidth();

    const top = paddingTop() + (cursor.line - 1) * lineHeight;
    const left = paddingLeft() + (cursor.column - 1) * charWidth;

    cursorRef.style.top = `${top}px`;
    cursorRef.style.left = `${left}px`;
  };

  const measurePadding = () => {
    if (!textareaRef) return;
    const computed = getComputedStyle(textareaRef);
    setPaddingTop(parseFloat(computed.paddingTop) || 0);
    setPaddingLeft(parseFloat(computed.paddingLeft) || 0);
  };

  const handleInput = () => {
    if (!textareaRef) return;
    const newText = textareaRef.value;
    const currentOffset = textareaRef.selectionStart;
    const modelInstance = model();

    setText(modelInstance, newText);
    setCursor(modelInstance, currentOffset);

    props.onChange(newText);
    updateCursorPosition();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const modelInstance = model();

    if (e.ctrlKey && e.key === "a") {
      setTimeout(() => {
        if (!textareaRef) return;
        const start = textareaRef.selectionStart;
        setCursor(modelInstance, start);
      }, 0);
      return;
    }

    if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      undo(modelInstance);
      if (textareaRef) {
        textareaRef.value = getText(modelInstance);
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      props.onChange(getText(modelInstance));
      updateCursorPosition();
      return;
    }

    if (e.ctrlKey && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      redo(modelInstance);
      if (textareaRef) {
        textareaRef.value = getText(modelInstance);
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      props.onChange(getText(modelInstance));
      updateCursorPosition();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      insertAtCursor(modelInstance, "\n");
      if (textareaRef) {
        textareaRef.value = getText(modelInstance);
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      props.onChange(getText(modelInstance));
      updateCursorPosition();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      deleteBackward(modelInstance);
      if (textareaRef) {
        textareaRef.value = getText(modelInstance);
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      props.onChange(getText(modelInstance));
      updateCursorPosition();
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveCursor(modelInstance, "left");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveCursor(modelInstance, "right");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveCursor(modelInstance, "up");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveCursor(modelInstance, "down");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      moveCursor(modelInstance, "home");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      moveCursor(modelInstance, "end");
      if (textareaRef) {
        const offset = getCursorOffset(modelInstance);
        textareaRef.setSelectionRange(offset, offset);
      }
      updateCursorPosition();
      return;
    }
  };

  const handleScroll = () => {
    if (!textareaRef || !displayRef || !cursorRef) return;
    displayRef.scrollTop = textareaRef.scrollTop;
    displayRef.scrollLeft = textareaRef.scrollLeft;
    cursorRef.style.top = `${paddingTop() + textareaRef.scrollTop}px`;
  };

  onMount(() => {
    if (textareaRef) {
      textareaRef.value = props.content || "";
      setText(model(), props.content || "");
      setCursor(model(), props.content?.length || 0);
      measurePadding();
      updateCursorPosition();
    }
  });

  createEffect(() => {
    if (!textareaRef) return;
    const newContent = props.content;
    const currentContent = textareaRef.value;

    if (newContent !== currentContent) {
      textareaRef.value = newContent;
      setText(model(), newContent);
      const offset = Math.min(textareaRef.selectionStart, newContent.length);
      setCursor(model(), offset);
      updateCursorPosition();
    }
  });

  return (
    <main class="relative w-full h-screen overflow-hidden">
      <div
        ref={displayRef}
        class="absolute inset-0 overflow-y-auto overflow-x-hidden pointer-events-none"
        style={{
          "font-size": `${props.settings.fontSize}px`,
          "font-family": props.settings.fontFamily,
          "text-align": props.settings.textAlign,
          "white-space": "pre-wrap",
          "word-break": "break-word",
          padding:
            "calc(min(1em,20vh)+72px) max(-372px+50vw,1em) min(5em,15vh)",
          "line-height": "1.5",
        }}
        innerHTML={`${renderContent()}<br/>`}
      />
      <div
        ref={cursorRef}
        class="absolute w-0.5 bg-blue-500 pointer-events-none"
        style={{
          height: `${props.settings.fontSize * 1.5}px`,
          "z-index": 10,
        }}
      />
      <textarea
        ref={textareaRef}
        class="absolute inset-0 w-full h-full opacity-0 resize-none outline-none"
        style={{
          "font-size": `${props.settings.fontSize}px`,
          "font-family": props.settings.fontFamily,
          "text-align": props.settings.textAlign,
          "line-height": "1.5",
          padding:
            "calc(min(1em,20vh)+72px) max(-372px+50vw,1em) min(5em,15vh)",
          "caret-color": "transparent",
        }}
        spellcheck={props.settings.spellcheck}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
      />
      <style>{`
        mark {
          background-color: #fde047;
          border-radius: 2px;
          padding: 0 2px;
          margin: 0 -1px;
          box-decoration-break: clone;
        }
        @media (prefers-color-scheme: dark) {
          mark {
            background-color: #ca8a04;
          }
        }
      `}</style>
    </main>
  );
}

export default Editor;
