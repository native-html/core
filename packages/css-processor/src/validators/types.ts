import { CSSProcessorConfig } from '../config';

export interface CSSPropertyModel {
  inheritable: boolean;
  native: boolean;
  translatable: boolean;
  display: 'text' | 'block';
}

export interface CSSPropertyValidatorParams<C extends CSSPropertyModel> {
  readonly model: C;
  readonly config: CSSProcessorConfig;
  /**
   * The camelCase name of the style property.
   */
  readonly propertyName: string;
}

export interface ShortCSSPropertyValidatorParams<C extends CSSPropertyModel>
  extends CSSPropertyValidatorParams<C> {}
