import { lookupRecord } from '../helpers';
import { LongNonPercentSizeCSSPropertyValidator } from './LongNonPercentSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongBorderWidthCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongNonPercentSizeCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string) {
    if (lookupRecord(this.config.absoluteBorderWidthsPixelMap, value)) {
      return this.config.absoluteBorderWidthsPixelMap[value];
    }
    return super.normalizeRawInlineCSSValue(value);
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
