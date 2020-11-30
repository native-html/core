import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import normalizeFontName from './normalizeFontName';
import { CSSPropertyModel } from './types';

const SEPARATOR_REGEX = /,\s*/;

export class LongFontFamilyPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, string> {
  normalizeRawInlineCSSValue(value: string): string | null {
    const values = value.split(SEPARATOR_REGEX);
    for (const font of values) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported =
        normalizedFont.length && this.config.isFontSupported(normalizedFont);
      if (isFontSupported) {
        return typeof isFontSupported === 'string'
          ? isFontSupported
          : normalizedFont;
      }
    }
    return null;
  }
  normalizeNativeValue(value: string) {
    return this.normalizeInlineCSSValue(value);
  }
}
