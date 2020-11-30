import { ShortCSSToReactNativeValidator } from './ShortCSSToReactNativeValidator';
import normalizeFontName from './normalizeFontName';
import { CSSPropertyModel } from './types';
import { ShortMergeRequest } from '../ShortMergeRequest';

const WHITESPACE_REGEX = /\s+/;

export class ShortFontCSSValidator<
  C extends CSSPropertyModel
> extends ShortCSSToReactNativeValidator<C> {
  normalizeInlineCSSValue(value: string): ShortMergeRequest | null {
    // A 'font' declaration may end with a list of multiple font families.
    // We must check support for this list before processing.
    const resp = value.split(',');
    let fontFamily = null;
    if (resp.length === 1) {
      return super.normalizeInlineCSSValue(resp[0]);
    }
    const base = resp.splice(0, 1)[0];
    for (const font of resp) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported = this.config.isFontSupported(normalizedFont);
      if (isFontSupported) {
        fontFamily =
          typeof isFontSupported === 'string'
            ? isFontSupported
            : normalizedFont;
        break;
      }
    }
    return super.normalizeInlineCSSValue(
      base.split(WHITESPACE_REGEX).slice(0, -1).join(' ') +
        ' ' +
        (fontFamily || 'system')
    );
  }
}
