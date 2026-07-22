import { Editor as TiptapEditor } from "@tiptap/core";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { TrailingNode, UndoRedo } from "@tiptap/extensions";
import type { JSX } from "solid-js";
import { createEffect, onCleanup, onMount } from "solid-js";
import { Highlight as SearchHighlight } from "#lib/tiptap/Highlight";
import type { EditorSettings } from "#types";

interface EditorProps {
  content: string;
  onChange(content: string): void;
  onEditorReady(editor: TiptapEditor): void;
  onContentSynced?(): void;
  settings: EditorSettings;
}

function Editor(props: EditorProps): JSX.Element {
  let elementRef: HTMLDivElement | undefined;
  let editor: TiptapEditor | undefined;

  onMount(() => {
    if (!elementRef) return;

    editor = new TiptapEditor({
      element: elementRef,
      extensions: [
        Document,
        Paragraph,
        Text,
        HardBreak,
        Dropcursor,
        Gapcursor,
        TrailingNode,
        UndoRedo,
        SearchHighlight,
      ],
      content: props.content,
      editorProps: {
        attributes: {
          class:
            "w-full h-screen outline-none text-black dark:text-white caret-blue-500 bg-transparent scroll-smooth",
          spellcheck: props.settings.spellcheck.toString(),
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": "Editor",
        },
        handlePaste(_, event) {
          const text = event.clipboardData?.getData("text/plain");
          if (text) {
            editor?.chain().focus().insertContent(text).run();
            return true;
          }
          return false;
        },
        clipboardTextSerializer(slice) {
          const blocks: string[] = [];
          slice.content.forEach((node) => {
            blocks.push(node.textBetween(0, node.content.size, "\n"));
          });
          return blocks.join("\n");
        },
      },
      onUpdate({ editor }) {
        props.onChange(editor.getHTML());
      },
    });

    props.onEditorReady(editor);
  });

  createEffect(() => {
    if (!editor || !elementRef) return;
    const content = props.content;
    const editorContent = editor.getHTML();
    if (editorContent !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
      props.onContentSynced?.();
    }
  });

  createEffect(() => {
    if (!editor || !elementRef) return;
    const { fontSize, fontFamily, textAlign, spellcheck } = props.settings;

    const proseMirror = elementRef.querySelector(".ProseMirror") as HTMLElement;
    if (proseMirror) {
      proseMirror.style.fontSize = `${fontSize}px`;
      proseMirror.style.fontFamily = fontFamily;
      proseMirror.style.textAlign = textAlign;
    }

    const editableElement = elementRef.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    if (editableElement) {
      editableElement.spellcheck = spellcheck;
    }
  });

  onCleanup(() => {
    editor?.destroy();
  });

  return (
    <main>
      <div
        class="w-full absolute overflow-y-auto overflow-x-hidden
               [word-break:break-word] text-black dark:text-white caret-blue-500
               bg-transparent scrollbar-thin scroll-smooth scrollbar-gutter-stable
               scroll-pb-0 left-0 top-0 outline-none whitespace-pre-wrap"
        data-placeholder="Start writing..."
        ref={(ref) => (elementRef = ref)}
      />
      <style>{`
        .search-highlight {
          background-color: #fde047;
          border-radius: 2px;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
        .search-highlight-current {
          background-color: #60a5fa;
        }
        @media (prefers-color-scheme: dark) {
          .search-highlight {
            background-color: #ca8a04;
          }
          .search-highlight-current {
            background-color: #3b82f6;
          }
        }
        .ProseMirror {
          padding: calc(min(1em, 20vh) + 72px) max(-372px + 50vw, 1em) min(5em, 15vh);
        }
        .ProseMirror::after {
          content: "";
          display: block;
          min-height: 50vh;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #999;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </main>
  );
}

export default Editor;
