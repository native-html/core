import { lookupRecord } from '../helpers';
import { LongSizeCSSPropertyValidator } from './LongSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongFontSizeCSSValidator<
  C extends CSSPropertyModel
> extends LongSizeCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string) {
    if (lookupRecord(this.config.hardcodedFontSizesPixelMap, value)) {
      return this.config.hardcodedFontSizesPixelMap[value];
    }
    return super.normalizeRawInlineCSSValue(value);
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
