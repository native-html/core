import { CSSLengthUnit } from '../config';
import { LongSizeCSSPropertyValidator } from './LongSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongNonPercentSizeCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongSizeCSSPropertyValidator<C> {
  protected computeSize(value: number, unit: CSSLengthUnit) {
    if (unit === '%') {
      return null;
    }
    return super.computeSize(value, unit);
  }
}
