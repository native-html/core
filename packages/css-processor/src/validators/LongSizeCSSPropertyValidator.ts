import { CSSLengthUnit } from '../config';
import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongSizeCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, number | string> {
  private computeSize(
    value: number,
    unit: CSSLengthUnit
  ): number | string | null {
    // TODO handle em / rem
    switch (unit) {
      case '%':
        return `${value}%`;
      case 'px':
        return value;
      case 'cm':
      case 'in':
      case 'mm':
      case 'pc':
      case 'pt':
        return value * this.config.absoluteLengthUnitsMultiplicators[unit];
    }
    return null;
  }

  normalizeRawInlineCSSValue(value: string) {
    if (value === '0') {
      return 0;
    }
    if (value === 'auto') {
      return value;
    }
    const match = /(\d+\.?\d*)\s*(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)/g.exec(
      value
    );
    if (match === null) {
      return null;
    }
    return this.computeSize(Number(match[1]), match[2] as CSSLengthUnit);
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
