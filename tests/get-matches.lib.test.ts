import { describe, expect, it } from "bun:test";
import { getMatches } from "#lib/get-matches";

describe("getMatches", () => {
  it("should correctly find matches", () => {
    expect(getMatches("hello world", "world")).toEqual([6]);
  });

  it("should be case insensitive by default", () => {
    expect(getMatches("Hello World", "hello")).toEqual([0]);
    expect(getMatches("Hello World", "WORLD")).toEqual([6]);
    expect(getMatches("HELLO world", "World")).toEqual([6]);
  });

  it("should be case sensitive when caseSensitive is true", () => {
    expect(getMatches("Hello World", "Hello", true)).toEqual([0]);
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
    expect(getMatches("hello hello HELLO", "hello")).toEqual([0, 6, 12]);
    expect(getMatches("hello hello HELLO", "hello", true)).toEqual([0, 6]);
    expect(getMatches("hello hello HELLO", "HELLO", true)).toEqual([12]);
  });
});
