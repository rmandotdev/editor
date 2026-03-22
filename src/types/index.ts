export interface Page {
  id: string;
  name: string;
  content: string;
  children?: Page[];
}

export namespace EditorSettings {
  export type FontFamily =
    | "Cousine"
    | "Arial"
    | "Times New Roman"
    | "Courier New";
  export type TextAlign = "left" | "center" | "right" | "justify";
}

export interface EditorSettings {
  spellcheck: boolean;
  fontSize: number;
  fontFamily: EditorSettings.FontFamily;
  textAlign: EditorSettings.TextAlign;
}
