import { ShortMergeRequest } from '../ShortMergeRequest';
import { ShortCSSPropertyValidator } from './ShortCSSPropertyValidator';
import { CSSPropertyModel, ShortCSSPropertyValidatorParams } from './types';

export type Directions = {
  top: string;
  bottom: string;
  left: string;
  right: string;
};

const WHITESPACE_REGEX = /\s+/;

export class ShortCardinalCSSpropertyValidator<
  C extends CSSPropertyModel = any
> extends ShortCSSPropertyValidator<C> {
  public directions: Readonly<Directions>;
  constructor(
    params: ShortCSSPropertyValidatorParams<C>,
    /**
     * Top, Right, Bottom, Left
     */
    directions: Readonly<Directions>
  ) {
    super(params);
    this.directions = directions;
  }

  normalizeInlineCSSValue(value: string | number) {
    if (typeof value === 'number') {
      return new ShortMergeRequest({
        [this.directions.top]: value,
        [this.directions.right]: value,
        [this.directions.bottom]: value,
        [this.directions.left]: value
      });
    }
    const values = value.split(WHITESPACE_REGEX);
    if (values.length === 4) {
      return new ShortMergeRequest({
        [this.directions.top]: values[0],
        [this.directions.right]: values[1],
        [this.directions.bottom]: values[2],
        [this.directions.left]: values[3]
      });
    }
    if (values.length === 3) {
      return new ShortMergeRequest({
        [this.directions.top]: values[0],
        [this.directions.right]: values[1],
        [this.directions.bottom]: values[2],
        [this.directions.left]: values[1]
      });
    }
    if (values.length === 2) {
      return new ShortMergeRequest({
        [this.directions.top]: values[0],
        [this.directions.right]: values[1],
        [this.directions.bottom]: values[0],
        [this.directions.left]: values[1]
      });
    }
    if (values.length === 1) {
      return new ShortMergeRequest({
        [this.directions.top]: values[0],
        [this.directions.right]: values[0],
        [this.directions.bottom]: values[0],
        [this.directions.left]: values[0]
      });
    }
    return null;
  }

  normalizeNativeValue(value: string | number) {
    return this.normalizeInlineCSSValue(value);
  }
}
