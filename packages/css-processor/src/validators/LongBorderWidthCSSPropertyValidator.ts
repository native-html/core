import { lookupRecord } from '../helpers';
import { LongSizeCSSPropertyValidator } from './LongSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongBorderWidthCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongSizeCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string) {
    if (lookupRecord(this.config.hardcodedBorderWidthsPixelMap, value)) {
      return this.config.hardcodedBorderWidthsPixelMap[value];
    }
    return super.normalizeRawInlineCSSValue(value);
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
