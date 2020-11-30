import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyValidatorParams, CSSPropertyModel } from './types';

const WHITESPACE_REGEX = /\s+/;

export class LongEnumerationListCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, string[]> {
  public readonly allowedList: ReadonlyArray<string>;
  constructor(params: CSSPropertyValidatorParams<C>, allowedList: string[]) {
    super(params);
    this.allowedList = allowedList;
  }

  normalizeRawInlineCSSValue(value: string): string[] | null {
    const input = value.split(WHITESPACE_REGEX);
    const values: string[] = [];
    for (const item of input) {
      if (this.allowedList.indexOf(item) !== -1) {
        values.push(item);
      }
    }
    return values.length > 0 ? values : null;
  }
}
