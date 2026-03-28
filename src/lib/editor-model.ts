export interface CursorPosition {
  line: number;
  column: number;
  offset: number;
}

export interface EditorState {
  text: string;
  cursor: CursorPosition;
}

export interface EditorModel {
  state: EditorState;
  undoStack: EditorState[];
  redoStack: EditorState[];
}

function offsetToCursor(text: string, offset: number): CursorPosition {
  const lines = text.slice(0, offset).split("\n");
  const line = lines.length;
  const lastLine = lines[lines.length - 1];
  const column = (lastLine?.length ?? 0) + 1;
  return { line, column, offset };
}

function cursorToOffset(text: string, cursor: CursorPosition): number {
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < cursor.line - 1 && i < lines.length; i++) {
    const lineLength = lines[i]?.length ?? 0;
    offset += lineLength + 1;
  }
  const currentLineLength = lines[cursor.line - 1]?.length ?? 0;
  offset += Math.min(cursor.column - 1, currentLineLength);
  return offset;
}

function createState(
  text: string,
  cursorOffset: number = text.length,
): EditorState {
  return {
    text,
    cursor: offsetToCursor(text, cursorOffset),
  };
}

export function createModel(initialText: string = ""): EditorModel {
  return {
    state: createState(initialText),
    undoStack: [],
    redoStack: [],
  };
}

function cloneState(state: EditorState): EditorState {
  return { ...state, cursor: { ...state.cursor } };
}

function saveToUndo(model: EditorModel): void {
  model.undoStack.push(cloneState(model.state));
  if (model.undoStack.length > 100) {
    model.undoStack.shift();
  }
  model.redoStack = [];
}

export function insertText(model: EditorModel, text: string): EditorState {
  const { state } = model;
  const offset = cursorToOffset(state.text, state.cursor);
  const newText = state.text.slice(0, offset) + text + state.text.slice(offset);
  const newOffset = offset + text.length;
  return {
    text: newText,
    cursor: offsetToCursor(newText, newOffset),
  };
}

export function insertAtCursor(model: EditorModel, text: string): EditorModel {
  saveToUndo(model);
  model.state = insertText(model, text);
  return model;
}

export function deleteBackward(
  model: EditorModel,
  count: number = 1,
): EditorModel {
  const { state } = model;
  const offset = cursorToOffset(state.text, state.cursor);
  if (offset === 0) return model;

  saveToUndo(model);
  const deleteStart = Math.max(0, offset - count);
  const newText = state.text.slice(0, deleteStart) + state.text.slice(offset);
  const newOffset = deleteStart;
  model.state = {
    text: newText,
    cursor: offsetToCursor(newText, newOffset),
  };
  return model;
}

export function deleteForward(
  model: EditorModel,
  count: number = 1,
): EditorModel {
  const { state } = model;
  const offset = cursorToOffset(state.text, state.cursor);
  if (offset >= state.text.length) return model;

  saveToUndo(model);
  const deleteEnd = Math.min(state.text.length, offset + count);
  const newText = state.text.slice(0, offset) + state.text.slice(deleteEnd);
  model.state = {
    text: newText,
    cursor: state.cursor,
  };
  return model;
}

export function moveCursor(
  model: EditorModel,
  direction: "left" | "right" | "up" | "down" | "home" | "end",
): EditorModel {
  const { state } = model;
  const lines = state.text.split("\n");
  const currentLineIndex = state.cursor.line - 1;
  const currentLine = lines[currentLineIndex] ?? "";

  const newCursor = { ...state.cursor };

  switch (direction) {
    case "left": {
      if (newCursor.column > 1) {
        newCursor.column--;
      } else if (newCursor.line > 1) {
        newCursor.line--;
        newCursor.column = (lines[newCursor.line - 1]?.length ?? 0) + 1;
      }
      break;
    }
    case "right": {
      if (newCursor.column <= currentLine.length) {
        newCursor.column++;
      } else if (newCursor.line < lines.length) {
        newCursor.line++;
        newCursor.column = 1;
      }
      break;
    }
    case "up": {
      if (newCursor.line > 1) {
        newCursor.line--;
        newCursor.column = Math.min(
          newCursor.column,
          (lines[newCursor.line - 1]?.length ?? 0) + 1,
        );
      }
      break;
    }
    case "down": {
      if (newCursor.line < lines.length) {
        newCursor.line++;
        newCursor.column = Math.min(
          newCursor.column,
          (lines[newCursor.line - 1]?.length ?? 0) + 1,
        );
      }
      break;
    }
    case "home": {
      newCursor.column = 1;
      break;
    }
    case "end": {
      newCursor.column = currentLine.length + 1;
      break;
    }
  }

  newCursor.offset = cursorToOffset(state.text, newCursor);
  model.state = { ...state, cursor: newCursor };
  return model;
}

export function setCursor(model: EditorModel, offset: number): EditorModel {
  const { text } = model.state;
  offset = Math.max(0, Math.min(offset, text.length));
  model.state = {
    ...model.state,
    cursor: offsetToCursor(text, offset),
  };
  return model;
}

export function setText(model: EditorModel, text: string): EditorModel {
  model.state = createState(text);
  model.undoStack = [];
  model.redoStack = [];
  return model;
}

export function undo(model: EditorModel): EditorModel {
  if (model.undoStack.length === 0) return model;

  const previousState = model.undoStack.pop();
  if (!previousState) return model;
  model.redoStack.push(cloneState(model.state));
  model.state = previousState;
  return model;
}

export function redo(model: EditorModel): EditorModel {
  if (model.redoStack.length === 0) return model;

  const nextState = model.redoStack.pop();
  if (!nextState) return model;
  model.undoStack.push(cloneState(model.state));
  model.state = nextState;
  return model;
}

export function getText(model: EditorModel): string {
  return model.state.text;
}

export function getCursor(model: EditorModel): CursorPosition {
  return model.state.cursor;
}

export function getCursorOffset(model: EditorModel): number {
  return cursorToOffset(model.state.text, model.state.cursor);
}
