import { CSSLengthUnit } from '../config';
import { lookupRecord } from '../helpers';
import { LongSizeCSSPropertyValidator } from './LongSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongFontSizeCSSValidator<
  C extends CSSPropertyModel
> extends LongSizeCSSPropertyValidator<C> {
  protected computeSize(value: number, unit: CSSLengthUnit) {
    if (unit === '%') {
      return this.computeEmSize(value / 100);
    }
    return super.computeSize(value, unit);
  }

  normalizeRawInlineCSSValue(value: string) {
    if (lookupRecord(this.config.absoluteFontSizesPixelMap, value)) {
      return this.config.absoluteFontSizesPixelMap[value];
    }
    if (lookupRecord(this.config.relativeFontSizesCoefficientMap, value)) {
      return this.computeEmSize(
        this.config.relativeFontSizesCoefficientMap[value]
      );
    }
    return super.normalizeRawInlineCSSValue(value);
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
