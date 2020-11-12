import { CSSLongWebTextFlowedPropKey } from './property-types';

export type CSSRawPropertiesList = [string, any][];
export type CSSProperties = Record<string, any>;
/**
 * - *flow* CSS properties will be inherited by children TTree nodes;
 * - *retain* CSS properties will only apply to the TTree node to which it is
 *   attached.
 */
export type CSSPropertyPropagationCategory = 'flow' | 'retain';
/**
 * - *text* displays will only affect textual nodes
 * - *block* displays will affect all nodes
 */
export type CSSPropertyDisplayCategory = 'text' | 'block';
/**
 * - *native* properties can be injected in React Native components style prop;
 * - *web* properties are solely used in the transient tree render engine.
 */
export type CSSPropertyCompatCategory = 'native' | 'web';

export type CSSPropagationRegistry = Record<
  CSSPropertyPropagationCategory,
  CSSProperties
>;

export type CSSDisplayRegistry = Record<
  CSSPropertyDisplayCategory,
  CSSPropagationRegistry
>;

export interface WebTextFlowProperties
  extends Partial<Record<CSSLongWebTextFlowedPropKey, any>> {
  whiteSpace?: 'normal' | 'pre';
}

export interface CSSPropertySpecs {
  readonly propagationCategory: CSSPropertyPropagationCategory;
  readonly compatCategory: CSSPropertyCompatCategory;
  readonly displayCategory: CSSPropertyDisplayCategory;
}
