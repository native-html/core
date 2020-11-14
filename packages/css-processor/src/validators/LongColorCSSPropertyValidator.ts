import { LongForgivingCSSPropertyValidator } from './LongForgivingCSSPropertyValidator';
import { CSSPropertyModel } from './types';

export class LongColorCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongForgivingCSSPropertyValidator<C> {}
