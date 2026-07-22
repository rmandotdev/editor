import { describe, expect, it } from "bun:test";
import type { TextSegment } from "#lib/search";
import { findMatches } from "#lib/search";

function seg(text: string, pos: number): TextSegment {
  return { text, pos };
}

describe("findMatches", () => {
  it("should find a single match in one segment", () => {
    const segments = [seg("hello world", 0)];
    const result = findMatches(segments, "world");
    expect(result).toEqual([{ from: 6, to: 11 }]);
  });

  it("should find multiple non-overlapping matches", () => {
    const segments = [seg("ababab", 0)];
    const result = findMatches(segments, "ab");
    expect(result).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 4, to: 6 },
    ]);
  });

  it("should not overlap matches", () => {
    const segments = [seg("aaa", 0)];
    const result = findMatches(segments, "aa");
    expect(result).toEqual([{ from: 0, to: 2 }]);
  });

  it("should find two non-overlapping matches in aaaa", () => {
    const segments = [seg("aaaa", 0)];
    const result = findMatches(segments, "aa");
    expect(result).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 4 },
    ]);
  });

  it("should find match in second segment", () => {
    const segments = [seg("hel", 0), seg("lo world", 3)];
    const result = findMatches(segments, "lo");
    expect(result).toEqual([{ from: 3, to: 5 }]);
  });

  it("should not match across segments", () => {
    const segments = [seg("a", 0), seg("b", 1), seg("c", 2)];
    const result = findMatches(segments, "abc");
    expect(result).toEqual([]);
  });

  it("should return empty for no matches", () => {
    const segments = [seg("hello", 0)];
    const result = findMatches(segments, "xyz");
    expect(result).toEqual([]);
  });

  it("should return empty for empty segments", () => {
    const result = findMatches([], "hello");
    expect(result).toEqual([]);
  });

  it("should return empty for empty term", () => {
    const segments = [seg("hello", 0)];
    const result = findMatches(segments, "");
    expect(result).toEqual([]);
  });

  it("should handle case-insensitive search by default", () => {
    const segments = [seg("Hello HELLO hello", 0)];
    const result = findMatches(segments, "hello");
    expect(result).toEqual([
      { from: 0, to: 5 },
      { from: 6, to: 11 },
      { from: 12, to: 17 },
    ]);
  });

  it("should handle case-sensitive search", () => {
    const segments = [seg("Hello HELLO hello", 0)];
    const result = findMatches(segments, "hello", true);
    expect(result).toEqual([{ from: 12, to: 17 }]);
  });

  it("should handle single character search", () => {
    const segments = [seg("aba", 0)];
    const result = findMatches(segments, "a");
    expect(result).toEqual([
      { from: 0, to: 1 },
      { from: 2, to: 3 },
    ]);
  });

  it("should find match at end of last segment", () => {
    const segments = [seg("hello ", 0), seg("world", 6)];
    const result = findMatches(segments, "world");
    expect(result).toEqual([{ from: 6, to: 11 }]);
  });
});
