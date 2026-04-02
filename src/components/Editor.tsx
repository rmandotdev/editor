import { Editor as TiptapEditor } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import { createEffect, type JSX, onCleanup, onMount } from "solid-js";
import type { EditorSettings } from "#types";

interface EditorProps {
  content: string;
  onChange(content: string): void;
  onEditorReady(editor: TiptapEditor): void;
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
        StarterKit.configure({ heading: false, codeBlock: false, link: false }),
        Highlight,
      ],
      content: props.content,
      editorProps: {
        attributes: {
          class:
            "w-full h-screen outline-none text-black dark:text-white caret-blue-500 bg-transparent scroll-smooth",
          spellcheck: props.settings.spellcheck.toString(),
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
        class="w-full absolute h-screen overflow-y-auto overflow-x-hidden
               [word-break:break-word] text-black dark:text-white caret-blue-500
               bg-transparent [scrollbar-width:thin] scroll-smooth
               p-[calc(min(1em,20vh)+72px)_max(-372px+50vw,1em)_min(5em,15vh)]
               scroll-pb-0 left-0 top-0 outline-none whitespace-pre-wrap"
        data-placeholder="Start writing..."
        ref={elementRef}
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
        .ProseMirror {
          min-height: 100%;
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
