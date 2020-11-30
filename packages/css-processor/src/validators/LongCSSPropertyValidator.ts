import { GenericCSSPropertyValidator } from './GenericPropertyValidator';
import { CSSPropertyValidatorParams, CSSPropertyModel } from './types';

export abstract class LongCSSPropertyValidator<
  C extends CSSPropertyModel = any,
  N = any
> extends GenericCSSPropertyValidator<C> {
  constructor(params: CSSPropertyValidatorParams<C>) {
    super(params, false);
  }

  /**
   * Normalize a rule value from inline CSS styles.
   *
   * @param value - The CSS property value to test.
   * @returns The normalized value, or null if normalization failed.
   */
  normalizeInlineCSSValue(value: N | string): N | null {
    if (typeof value !== 'string') {
      return value;
    }
    return this.normalizeRawInlineCSSValue(value);
  }

  abstract normalizeRawInlineCSSValue(value: string): N | null;

  /**
   * Normalize a mixed value from a @{link MixedStyleDeclaration}.
   *
   * @param value
   */
  normalizeNativeValue(value: N): N | null {
    return value;
  }
}
