export interface Page {
  name: string;
  content: string;
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
