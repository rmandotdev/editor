function getMatches(
  text: string,
  term: string,
  caseSensitive = false,
): number[] {
  if (!term) return [];
  const matchesList: number[] = [];
  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchTerm = caseSensitive ? term : term.toLowerCase();
  let pos = 0;
  let found = searchText.indexOf(searchTerm, pos);
  while (found !== -1) {
    matchesList.push(found);
    pos = found + 1;
    found = searchText.indexOf(searchTerm, pos);
  }
  return matchesList;
}

export { getMatches };
