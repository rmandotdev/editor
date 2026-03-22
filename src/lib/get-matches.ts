interface Match {
  start: number;
  end: number;
}

function getMatches(
  content: string,
  searchTerm: string,
  caseSensitive = false,
): Match[] {
  if (!searchTerm) return [];
  const matches: Match[] = [];
  const searchContent = caseSensitive ? content : content.toLowerCase();
  const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  let pos = 0;
  let found = searchContent.indexOf(search, pos);
  while (found !== -1) {
    matches.push({ start: found, end: found + searchTerm.length });
    pos = found + searchTerm.length;
    found = searchContent.indexOf(search, pos);
  }
  return matches;
}

export { getMatches, type Match };
