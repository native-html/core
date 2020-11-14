export default function normalizeFontName(fontName: string) {
  return fontName.replace(/["']/g, '').trim();
}
