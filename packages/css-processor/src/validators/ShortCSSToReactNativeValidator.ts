import { ShortCSSPropertyValidator } from './ShortCSSPropertyValidator';
import { CSSPropertyModel } from './types';
import expandCSSToRN from './expandCSSToRN';
import { ShortMergeRequest } from '../ShortMergeRequest';

export class ShortCSSToReactNativeValidator<
  C extends CSSPropertyModel = any
> extends ShortCSSPropertyValidator<C> {
  normalizeInlineCSSValue(value: string): ShortMergeRequest | null {
    return new ShortMergeRequest(expandCSSToRN(this.propertyName, value));
  }
  /**
   * Not supported on Native.
   * @param value
   */
  normalizeNativeValue() {
    return null;
  }
}
