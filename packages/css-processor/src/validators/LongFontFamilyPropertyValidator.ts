import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import normalizeFontName from './normalizeFontName';
import { CSSPropertyModel } from './types';

export class LongFontFamilyPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, string> {
  normalizeRawInlineCSSValue(value: string): string | null {
    const values = value.split(/,\s*/g);
    for (const font of values) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported = this.config.isFontSupported(normalizedFont);
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
