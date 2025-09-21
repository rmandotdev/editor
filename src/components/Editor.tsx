import type { JSXElement } from "solid-js";

import type { EditorSettings } from "~/types";

const Editor = (props: {
  content: string;
  onChange: (content: string) => void;
  settings: EditorSettings;
}): JSXElement => {
  return (
    <main>
      <textarea
        class="w-full resize-none [outline:none] absolute h-screen overflow-y-auto overflow-x-hidden
               [word-break:break-word] text-[color:var(--text-color)] caret-[#4787ee]
               bg-transparent delay-[0.5s] [scrollbar-width:thin] scroll-smooth
               [padding:calc(min(1em,20vh)_+_72px)_max(-372px_+_50vw,1em)_min(5em,15vh)]
               scroll-pb-0 left-0 top-0"
        style={{
          "font-size": `${props.settings.fontSize}px`,
          "font-family": props.settings.fontFamily,
          "text-align": props.settings.textAlign,
        }}
        spellcheck={props.settings.spellcheck}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        value={props.content}
        placeholder="Start writing..."
      />
    </main>
  );
};

export default Editor;
