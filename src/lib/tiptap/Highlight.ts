import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { findMatches } from "#lib/search";

export const highlightPluginKey = new PluginKey<{
  searchTerm: string;
  caseSensitive: boolean;
}>("highlight");

export const Highlight = Extension.create({
  name: "searchHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: highlightPluginKey,
        state: {
          init() {
            return { searchTerm: "", caseSensitive: false };
          },
          apply(tr, prev) {
            const meta = tr.getMeta(highlightPluginKey);
            if (meta) return meta;
            return prev;
          },
        },
        props: {
          decorations(state) {
            const pluginState = highlightPluginKey.getState(state);
            if (!pluginState?.searchTerm) {
              return DecorationSet.empty;
            }

            const { searchTerm, caseSensitive } = pluginState;

            const segments: { text: string; pos: number }[] = [];
            state.doc.descendants((node, pos) => {
              if (node.isText && node.text) {
                segments.push({ text: node.text, pos });
              }
            });

            const matches = findMatches(segments, searchTerm, caseSensitive);
            const decorations = matches.map((match) =>
              Decoration.inline(match.from, match.to, {
                class: "search-highlight",
              }),
            );

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
