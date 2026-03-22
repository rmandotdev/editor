import { describe, expect, it } from "bun:test";
import { getMatches } from "#lib/get-matches";

describe("getMatches", () => {
  it("should correctly find matches", () => {
    expect(getMatches("hello world", "world")).toEqual([6]);
  });
});
