import { FunctionComponent } from "react";
import { EditorSettings } from "../types";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  settings: EditorSettings;
}

export const Editor: FunctionComponent<EditorProps> = ({
  content,
  onChange,
  settings,
}) => {
  return (
    <main className="editor">
      <textarea
        id="text-area"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing..."
        spellCheck={settings.autocorrect}
        style={{
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
          textAlign: settings.textAlign,
        }}
      />
    </main>
  );
};
