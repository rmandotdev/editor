import { describe, expect, it } from "bun:test";
import { getMatches } from "#lib/get-matches";

describe("getMatches", () => {
  it("should correctly find matches", () => {
    expect(getMatches("hello world", "world")).toEqual([{ start: 6, end: 11 }]);
  });

  it("should be case insensitive by default", () => {
    expect(getMatches("Hello World", "hello")).toEqual([{ start: 0, end: 5 }]);
    expect(getMatches("Hello World", "WORLD")).toEqual([{ start: 6, end: 11 }]);
    expect(getMatches("HELLO world", "World")).toEqual([{ start: 6, end: 11 }]);
  });

  it("should be case sensitive when caseSensitive is true", () => {
    expect(getMatches("Hello World", "Hello", true)).toEqual([
      { start: 0, end: 5 },
    ]);
    expect(getMatches("Hello World", "hello", true)).toEqual([]);
    expect(getMatches("Hello World", "HELLO", true)).toEqual([]);
  });

  it("should return empty array for empty term", () => {
    expect(getMatches("hello world", "")).toEqual([]);
    expect(getMatches("hello world", "", true)).toEqual([]);
  });

  it("should return empty array when no matches found", () => {
    expect(getMatches("hello world", "xyz")).toEqual([]);
    expect(getMatches("hello world", "xyz", true)).toEqual([]);
  });

  it("should find multiple matches", () => {
    expect(getMatches("hello hello HELLO", "hello")).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 },
      { start: 12, end: 17 },
    ]);
    expect(getMatches("hello hello HELLO", "hello", true)).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 },
    ]);
    expect(getMatches("hello hello HELLO", "HELLO", true)).toEqual([
      { start: 12, end: 17 },
    ]);
  });
});
