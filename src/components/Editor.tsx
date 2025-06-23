import { type JSX } from "solid-js";
import type { EditorSettings } from "../types";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  settings: EditorSettings;
}

const Editor = (props: EditorProps): JSX.Element => {
  return (
    <main class="editor">
      <textarea
        id="text-area"
        value={props.content}
        onInput={(e) => props.onChange((e.target as HTMLTextAreaElement).value)}
        placeholder="Start writing..."
        spellcheck={props.settings.autocorrect}
        style={{
          "font-size": `${props.settings.fontSize}px`,
          "font-family": props.settings.fontFamily,
          "text-align": props.settings.textAlign,
        }}
      />
    </main>
  );
};

export default Editor;
