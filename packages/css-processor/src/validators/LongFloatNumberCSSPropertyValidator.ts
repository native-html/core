import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongFloatNumberCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, number> {
  normalizeRawInlineCSSValue(value: string): number | null {
    const normalizedVal = Number(value);
    if (Number.isNaN(normalizedVal)) {
      return null;
    }
    return normalizedVal;
  }

  normalizeNativeValue(v: string | number): number | null {
    return this.normalizeInlineCSSValue(v);
  }
}
