function getMatches(text: string, term: string): number[] {
  if (!term) return [];
  const matchesList: number[] = [];
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  let pos = 0;
  let found = lowerText.indexOf(lowerTerm, pos);
  while (found !== -1) {
    matchesList.push(found);
    pos = found + 1;
    found = lowerText.indexOf(lowerTerm, pos);
  }
  return matchesList;
}

export { getMatches };
