export interface Page {
  id: string;
  name: string;
  content: string;
}

export interface TreeItem {
  id: string;
  type: "folder" | "page";
  name: string;
  children?: TreeItem[];
  pageId?: string;
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
