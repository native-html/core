import { LongEnumerationCSSPropertyValidator } from './LongEnumerationCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongBorderStyleCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongEnumerationCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string): string | null {
    const normalizedVal = this.pickFirst(value);
    return normalizedVal
      ? super.normalizeRawInlineCSSValue(normalizedVal)
      : null;
  }

  normalizeNativeValue(value: string) {
    return this.pickFirst(value);
  }

  pickFirst(value: string) {
    const values = value.split(/\s+/);
    return values[0] || null;
  }
}
