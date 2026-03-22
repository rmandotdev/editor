import { describe, expect, it } from "bun:test";
import {
  findItemInTree,
  findParentOf,
  moveItemAfter,
  moveItemBefore,
  moveItemInto,
  moveItemOut,
} from "#lib/page-tree";
import type { Page } from "#types";

describe("findItemInTree", () => {
  const tree = [
    { id: "a", name: "A", content: "" },
    {
      id: "b",
      name: "B",
      content: "",
      children: [
        { id: "c", name: "C", content: "" },
        { id: "d", name: "D", content: "" },
      ],
    },
    { id: "e", name: "E", content: "" },
  ];

  it("should find root item", () => {
    const found = findItemInTree(tree, "a");
    expect(found?.id).toBe("a");
    expect(found?.name).toBe("A");
  });

  it("should find nested item", () => {
    const found = findItemInTree(tree, "c");
    expect(found?.id).toBe("c");
    expect(found?.name).toBe("C");
  });

  it("should return null for non-existent item", () => {
    const found = findItemInTree(tree, "xyz");
    expect(found).toBeNull();
  });
});

describe("findParentOf", () => {
  const tree = [
    { id: "a", name: "A", content: "" },
    {
      id: "b",
      name: "B",
      content: "",
      children: [
        { id: "c", name: "C", content: "" },
        { id: "d", name: "D", content: "" },
      ],
    },
    { id: "e", name: "E", content: "" },
  ];

  it("should return array for root item", () => {
    const parent = findParentOf(tree, "a");
    expect(parent).toBe(tree);
  });

  it("should return children array for nested item", () => {
    const parent = findParentOf(tree, "c");
    // @ts-expect-error
    expect(parent).toEqual(tree[1].children);
  });

  it("should return null for non-existent item", () => {
    const parent = findParentOf(tree, "xyz");
    expect(parent).toBeNull();
  });
});

describe("moveItemBefore", () => {
  it("should move item up in same level", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "" },
      { id: "c", name: "C", content: "" },
    ];

    const result = moveItemBefore(structuredClone(tree), "c", "a");
    expect(result.map((i) => i.id)).toEqual(["c", "a", "b"]);
  });

  it("should not move if item doesn't exist", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "" },
    ];

    const result = moveItemBefore(structuredClone(tree), "xyz", "a");
    expect(result.map((i) => i.id)).toEqual(["a", "b"]);
  });

  it("should move between different parents", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      {
        id: "b",
        name: "B",
        content: "",
        children: [{ id: "c", name: "C", content: "" }],
      },
    ];

    const result = moveItemBefore(structuredClone(tree), "c", "a");
    expect(result[0]?.id).toBe("c");
    expect(result[1]?.id).toBe("a");
    const b = result.find((i) => i.id === "b") as Page;
    expect(b.children?.length).toBe(0);
  });
});

describe("moveItemAfter", () => {
  it("should move item to end (after target)", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "" },
      { id: "c", name: "C", content: "" },
    ];

    const result = moveItemAfter(structuredClone(tree), "a", "c");
    expect(result.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("should not move if item doesn't exist", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "" },
    ];

    const result = moveItemAfter(structuredClone(tree), "xyz", "a");
    expect(result.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("moveItemInto", () => {
  it("should move item into another item's children", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      {
        id: "b",
        name: "B",
        content: "",
        children: [{ id: "c", name: "C", content: "" }],
      },
      { id: "d", name: "D", content: "" },
    ];

    const result = moveItemInto(structuredClone(tree), "d", "b");
    expect(result.map((i) => i.id)).toEqual(["a", "b"]);
    const b = result.find((i) => i.id === "b") as Page;
    expect(b.children?.map((i) => i.id)).toEqual(["c", "d"]);
  });

  it("should move into empty children", () => {
    const tree: Page[] = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "", children: [] },
    ];

    const result = moveItemInto(structuredClone(tree), "a", "b");
    expect(result.map((i) => i.id)).toEqual(["b"]);
    const b = result.find((i) => i.id === "b") as Page;
    expect(b.children?.map((i) => i.id)).toEqual(["a"]);
  });
});

describe("moveItemOut", () => {
  it("should move item out of parent after parent in grandparent", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      {
        id: "b",
        name: "B",
        content: "",
        children: [
          { id: "c", name: "C", content: "" },
          { id: "d", name: "D", content: "" },
        ],
      },
      { id: "e", name: "E", content: "" },
    ];

    const result = moveItemOut(structuredClone(tree), "d");
    expect(result.map((i) => i.id)).toEqual(["a", "b", "d", "e"]);
    const b = result.find((i) => i.id === "b") as Page;
    expect(b.children?.map((i) => i.id)).toEqual(["c"]);
  });

  it("should not move root item out", () => {
    const tree = [
      { id: "a", name: "A", content: "" },
      { id: "b", name: "B", content: "" },
    ];

    const result = moveItemOut(structuredClone(tree), "a");
    expect(result.map((i) => i.id)).toEqual(["a", "b"]);
  });
});
