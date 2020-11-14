import { CSSPropertyModel } from './types';
import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import expandCSSToRN from './expandCSSToRN';

export class LongCSSToReactNativeValidator<
  C extends CSSPropertyModel = any
> extends LongCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string) {
    const expanded = expandCSSToRN(this.propertyName, value);
    if (expanded) {
      return expanded[this.propertyName];
    }
    return null;
  }
}
