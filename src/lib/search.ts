type TextSegment = {
  text: string;
  pos: number;
};

type Match = {
  from: number;
  to: number;
};

function findMatches(
  segments: TextSegment[],
  term: string,
  caseSensitive = false,
): Match[] {
  if (segments.length === 0 || !term) return [];

  const searchText = caseSensitive ? term : term.toLowerCase();
  const results: Match[] = [];

  for (const seg of segments) {
    const text = caseSensitive ? seg.text : seg.text.toLowerCase();
    let idx = text.indexOf(searchText);
    while (idx !== -1) {
      results.push({ from: seg.pos + idx, to: seg.pos + idx + term.length });
      idx = text.indexOf(searchText, idx + term.length);
    }
  }

  return results;
}

export type { TextSegment };
export { findMatches };
