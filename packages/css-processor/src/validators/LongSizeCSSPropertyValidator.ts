import { CSSLengthUnit } from '../config';
import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongSizeCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, number | string> {
  protected computeSize(
    value: number,
    unit: CSSLengthUnit
  ): number | string | null {
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
      case 'em':
        return this.computeEmSize(value);
      case 'ex':
        // This is an approximation.
        return this.computeEmSize(value * 0.63);
      case 'rem':
        return this.config.rootFontSize * value;
    }
    return null;
  }

  protected computeEmSize(value: number) {
    return this.config.rootFontSize * value;
  }

  protected splitValueAndUnit(value: string): [number, CSSLengthUnit] | null {
    const match =
      /^(\d*\.?\d*)\s*(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)$/g.exec(
        value
      );
    if (match === null) {
      return null;
    }
    return [Number(match[1]), match[2] as CSSLengthUnit];
  }

  normalizeRawInlineCSSValue(value: string) {
    if (value === '0') {
      return 0;
    }
    if (value === 'auto') {
      return value;
    }
    const split = this.splitValueAndUnit(value);
    if (split) {
      return this.computeSize(split[0], split[1]);
    }
    return null;
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
