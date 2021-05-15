import { CSSProcessorConfig } from '../config';
import { CSSPropertyModel, CSSPropertyValidatorParams } from './types';
import {
  CSSPropertyCompatCategory,
  CSSPropertyDisplayCategory,
  CSSPropertyPropagationCategory,
  CSSPropertySpecs
} from '../processor-types';
import { ShortMergeRequest } from '../ShortMergeRequest';

export abstract class GenericCSSPropertyValidator<
  C extends CSSPropertyModel = any,
  N = any
> implements CSSPropertySpecs
{
  protected readonly model: C;
  protected readonly config: CSSProcessorConfig;
  public readonly compatCategory: CSSPropertyCompatCategory;
  public readonly propagationCategory: CSSPropertyPropagationCategory;
  public readonly displayCategory: CSSPropertyDisplayCategory;
  public readonly propertyName: string;
  private readonly _isShorthand: boolean;

  constructor(
    { model, config, propertyName }: CSSPropertyValidatorParams<C>,
    isShorthand: boolean
  ) {
    this.model = model;
    this.config = config;
    this.compatCategory = model.translatable ? 'native' : 'web';
    this.propagationCategory = model.inheritable ? 'flow' : 'retain';
    this.displayCategory = model.display;
    this.propertyName = propertyName;
    this._isShorthand = isShorthand;
  }

  /**
   * Normalize value from inline styles
   *
   * @param value
   */
  abstract normalizeInlineCSSValue(
    value: string | N
  ): ShortMergeRequest | N | null;

  /**
   * Normalize value from native styles.
   *
   * @param value
   */
  abstract normalizeNativeValue(value: N): ShortMergeRequest | N | null;

  isShorthand(): boolean {
    return this._isShorthand;
  }
}
