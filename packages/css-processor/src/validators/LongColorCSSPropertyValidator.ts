import { LongForgivingCSSPropertyValidator } from './LongForgivingCSSPropertyValidator';
import { CSSPropertyModel } from './types';

const COLOR_REGEX = /^(rgb|rgba|hsl|hsla)\([\d,%. ]+\)|[#]?\w+$/;

export class LongColorCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongForgivingCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string): string | null {
    return value.match(COLOR_REGEX) ? value : null;
  }
}
