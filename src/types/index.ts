export interface Page {
  name: string;
  content: string;
}

export interface EditorSettings {
  spellcheck: boolean;
  fontSize: number;
  fontFamily:
    | "Cousine"
    | "Arial"
    | "Times New Roman"
    | "Courier New"
    | (string & {});
  textAlign: "left" | "center" | "right" | "justify";
}
