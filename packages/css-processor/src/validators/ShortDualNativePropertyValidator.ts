import { ShortMergeRequest } from '../ShortMergeRequest';
import { ShortCSSPropertyValidator } from './ShortCSSPropertyValidator';
import { CSSPropertyModel, ShortCSSPropertyValidatorParams } from './types';

export class ShortDualNativepropertyValidator<
  C extends CSSPropertyModel = any
> extends ShortCSSPropertyValidator<C> {
  public directions: [string, string];
  constructor(
    params: ShortCSSPropertyValidatorParams<C>,
    /**
     * First direction, second direction.
     */
    directions: [string, string]
  ) {
    super(params);
    this.directions = directions;
  }

  // These properties are only available for native styles.
  normalizeInlineCSSValue() {
    return null;
  }

  normalizeNativeValue(value: string | number) {
    return new ShortMergeRequest({
      [this.directions[0]]: value,
      [this.directions[1]]: value
    });
  }
}
