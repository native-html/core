import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongForgivingCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string) {
    return value;
  }
}
