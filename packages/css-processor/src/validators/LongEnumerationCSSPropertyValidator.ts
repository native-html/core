import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyValidatorParams, CSSPropertyModel } from './types';

export class LongEnumerationCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, string> {
  public readonly allowedList: ReadonlyArray<string>;
  constructor(params: CSSPropertyValidatorParams<C>, allowedList: string[]) {
    super(params);
    this.allowedList = allowedList;
  }

  normalizeRawInlineCSSValue(v: string): string | null {
    if (this.allowedList.indexOf(v) !== -1) {
      return v;
    }
    return null;
  }

  normalizeNativeValue(v: string): string | null {
    return this.normalizeInlineCSSValue(v);
  }
}
