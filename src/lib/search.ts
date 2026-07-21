type TextSegment = {
  text: string;
  pos: number;
};

type Match = {
  from: number;
  to: number;
};

function mapConcatPos(concatPos: number, segments: TextSegment[]): number {
  let remaining = concatPos;
  for (const seg of segments) {
    if (remaining <= seg.text.length) {
      return seg.pos + remaining;
    }
    remaining -= seg.text.length;
  }
  const last = segments[segments.length - 1];
  return last ? last.pos + last.text.length : 0;
}

function findMatches(
  segments: TextSegment[],
  term: string,
  caseSensitive = false,
): Match[] {
  if (segments.length === 0 || !term) return [];

  const fullText = segments.map((s) => s.text).join("");
  const searchText = caseSensitive ? term : term.toLowerCase();
  const text = caseSensitive ? fullText : fullText.toLowerCase();

  const results: Match[] = [];
  let idx = text.indexOf(searchText);
  while (idx !== -1) {
    const from = mapConcatPos(idx, segments);
    const to = mapConcatPos(idx + term.length, segments);
    results.push({ from, to });
    idx = text.indexOf(searchText, idx + term.length);
  }

  return results;
}

export type { TextSegment };
export { findMatches };
