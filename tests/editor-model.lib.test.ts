import { describe, expect, it } from "bun:test";
import {
  createModel,
  deleteBackward,
  deleteForward,
  getCursor,
  getCursorOffset,
  getText,
  insertAtCursor,
  moveCursor,
  redo,
  setCursor,
  setText,
  undo,
} from "#lib/editor-model";

describe("createModel", () => {
  it("should create empty model", () => {
    const model = createModel();
    expect(getText(model)).toBe("");
    expect(getCursor(model)).toEqual({ line: 1, column: 1, offset: 0 });
  });

  it("should create model with initial text", () => {
    const model = createModel("hello");
    expect(getText(model)).toBe("hello");
    expect(getCursor(model).offset).toBe(5);
  });
});

describe("insertAtCursor", () => {
  it("should insert text at cursor", () => {
    const model = createModel("hello");
    setCursor(model, 1);
    insertAtCursor(model, "X");
    expect(getText(model)).toBe("hXello");
    expect(getCursor(model).offset).toBe(2);
  });

  it("should insert at beginning", () => {
    const model = createModel("hello");
    setCursor(model, 0);
    insertAtCursor(model, "X");
    expect(getText(model)).toBe("Xhello");
    expect(getCursor(model).offset).toBe(1);
  });

  it("should insert at end", () => {
    const model = createModel("hello");
    insertAtCursor(model, "!");
    expect(getText(model)).toBe("hello!");
    expect(getCursor(model).offset).toBe(6);
  });

  it("should handle multiline insert", () => {
    const model = createModel("hello\nworld");
    setCursor(model, 5);
    insertAtCursor(model, "X\nY");
    expect(getText(model)).toBe("helloX\nY\nworld");
    expect(getCursor(model)).toEqual({ line: 2, column: 2, offset: 8 });
  });
});

describe("deleteBackward", () => {
  it("should delete character before cursor", () => {
    const model = createModel("hello");
    setCursor(model, 3);
    deleteBackward(model);
    expect(getText(model)).toBe("helo");
    expect(getCursor(model).offset).toBe(2);
  });

  it("should delete multiple characters", () => {
    const model = createModel("hello");
    setCursor(model, 5);
    deleteBackward(model, 3);
    expect(getText(model)).toBe("he");
    expect(getCursor(model).offset).toBe(2);
  });

  it("should do nothing at start", () => {
    const model = createModel("hello");
    setCursor(model, 0);
    deleteBackward(model);
    expect(getText(model)).toBe("hello");
  });
});

describe("deleteForward", () => {
  it("should delete character after cursor", () => {
    const model = createModel("hello");
    setCursor(model, 2);
    deleteForward(model);
    expect(getText(model)).toBe("helo");
    expect(getCursor(model).offset).toBe(2);
  });

  it("should do nothing at end", () => {
    const model = createModel("hello");
    setCursor(model, 5);
    deleteForward(model);
    expect(getText(model)).toBe("hello");
  });
});

describe("moveCursor", () => {
  it("should move left", () => {
    const model = createModel("hello");
    setCursor(model, 3);
    moveCursor(model, "left");
    expect(getCursor(model).offset).toBe(2);
  });

  it("should move right", () => {
    const model = createModel("hello");
    setCursor(model, 3);
    moveCursor(model, "right");
    expect(getCursor(model).offset).toBe(4);
  });

  it("should move to start of line", () => {
    const model = createModel("hello");
    setCursor(model, 5);
    moveCursor(model, "home");
    expect(getCursor(model).column).toBe(1);
  });

  it("should move to end of line", () => {
    const model = createModel("hello");
    setCursor(model, 0);
    moveCursor(model, "end");
    expect(getCursor(model).column).toBe(6);
  });

  it("should move up", () => {
    const model = createModel("hello\nworld");
    setCursor(model, 10);
    moveCursor(model, "up");
    expect(getCursor(model).line).toBe(1);
  });

  it("should move down", () => {
    const model = createModel("hello\nworld");
    setCursor(model, 3);
    moveCursor(model, "down");
    expect(getCursor(model).line).toBe(2);
  });

  it("should not move left at start", () => {
    const model = createModel("hello");
    setCursor(model, 0);
    moveCursor(model, "left");
    expect(getCursor(model).offset).toBe(0);
  });

  it("should not move right at end", () => {
    const model = createModel("hello");
    setCursor(model, 5);
    moveCursor(model, "right");
    expect(getCursor(model).offset).toBe(5);
  });
});

describe("setCursor", () => {
  it("should set cursor to specific offset", () => {
    const model = createModel("hello");
    setCursor(model, 2);
    expect(getCursor(model).offset).toBe(2);
  });

  it("should clamp to start", () => {
    const model = createModel("hello");
    setCursor(model, -5);
    expect(getCursor(model).offset).toBe(0);
  });

  it("should clamp to end", () => {
    const model = createModel("hello");
    setCursor(model, 100);
    expect(getCursor(model).offset).toBe(5);
  });
});

describe("setText", () => {
  it("should replace all text", () => {
    const model = createModel("hello");
    insertAtCursor(model, "world");
    setText(model, "new");
    expect(getText(model)).toBe("new");
    expect(getCursor(model).offset).toBe(3);
  });

  it("should clear undo/redo stacks", () => {
    const model = createModel("");
    insertAtCursor(model, "a");
    insertAtCursor(model, "b");
    undo(model);
    expect(getText(model)).toBe("a");
    setText(model, "c");
    redo(model);
    expect(getText(model)).toBe("c");
  });
});

describe("undo/redo", () => {
  it("should undo text insertion", () => {
    const model = createModel("");
    insertAtCursor(model, "hello");
    undo(model);
    expect(getText(model)).toBe("");
  });

  it("should redo undone action", () => {
    const model = createModel("");
    insertAtCursor(model, "hello");
    undo(model);
    redo(model);
    expect(getText(model)).toBe("hello");
  });

  it("should undo cursor movement", () => {
    const model = createModel("hello");
    setCursor(model, 5);
    undo(model);
    expect(getCursor(model).offset).toBe(5);
  });

  it("should not undo when stack is empty", () => {
    const model = createModel("hello");
    undo(model);
    expect(getText(model)).toBe("hello");
  });

  it("should not redo when stack is empty", () => {
    const model = createModel("hello");
    redo(model);
    expect(getText(model)).toBe("hello");
  });

  it("should maintain undo stack limit", () => {
    const model = createModel("");
    for (let i = 0; i < 150; i++) {
      insertAtCursor(model, "a");
    }
    expect(model.undoStack.length).toBe(100);
  });

  it("should chain multiple operations", () => {
    const model = createModel("");
    insertAtCursor(model, "a");
    insertAtCursor(model, "b");
    insertAtCursor(model, "c");
    undo(model);
    expect(getText(model)).toBe("ab");
    undo(model);
    expect(getText(model)).toBe("a");
    redo(model);
    expect(getText(model)).toBe("ab");
  });

  it("should clear redo stack on new action", () => {
    const model = createModel("");
    insertAtCursor(model, "a");
    insertAtCursor(model, "b");
    undo(model);
    expect(getText(model)).toBe("a");
    insertAtCursor(model, "c");
    redo(model);
    expect(getText(model)).toBe("ac");
  });
});

describe("getCursorOffset", () => {
  it("should return current cursor offset", () => {
    const model = createModel("hello");
    setCursor(model, 3);
    expect(getCursorOffset(model)).toBe(3);
  });
});

describe("cursor position calculations", () => {
  it("should calculate correct line/column for simple text", () => {
    const model = createModel("abc\ndef");
    expect(getCursor(model)).toEqual({ line: 2, column: 4, offset: 7 });
  });

  it("should calculate correct line/column after insert", () => {
    const model = createModel("ab\ncd");
    setCursor(model, 3);
    insertAtCursor(model, "X");
    expect(getText(model)).toBe("ab\nXcd");
    expect(getCursor(model)).toEqual({ line: 2, column: 2, offset: 4 });
  });

  it("should handle empty lines", () => {
    const model = createModel("a\n\nb");
    setCursor(model, 3);
    expect(getCursor(model)).toEqual({ line: 3, column: 1, offset: 3 });
  });
});
