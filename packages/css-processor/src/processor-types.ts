import { CSSLongWebTextFlowedPropKey } from './property-types';

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

export type CSSListStyleTypePropertyBase =
  | 'none'
  | 'disc'
  | 'circle'
  | 'square'
  | 'decimal'
  | 'cjk-decimal'
  | 'decimal-leading-zero'
  | 'lower-roman'
  | 'upper-roman'
  | 'lower-greek'
  | 'lower-alpha'
  | 'lower-latin'
  | 'upper-alpha'
  | 'upper-latin'
  | 'arabic-indic'
  | 'armenian'
  | 'bengali'
  | 'cambodian'
  | 'cjk-earthly-branch'
  | 'cjk-heavenly-stem'
  | 'cjk-ideographic'
  | 'devanagari'
  | 'ethiopic-numeric'
  | 'georgian'
  | 'gujarati'
  | 'gurmukhi'
  | 'hebrew'
  | 'hiragana'
  | 'hiragana-iroha'
  | 'japanese-formal'
  | 'japanese-informal'
  | 'kannada'
  | 'katakana'
  | 'katakana-iroha'
  | 'khmer'
  | 'korean-hangul-formal'
  | 'korean-hanja-formal'
  | 'korean-hanja-informal'
  | 'lao'
  | 'lower-armenian'
  | 'malayalam'
  | 'mongolian'
  | 'myanmar'
  | 'oriya'
  | 'persian'
  | 'simp-chinese-formal'
  | 'simp-chinese-informal'
  | 'tamil'
  | 'telugu'
  | 'thai'
  | 'tibetan'
  | 'trad-chinese-formal'
  | 'trad-chinese-informal'
  | 'upper-armenian'
  | 'disclosure-open'
  | 'disclosure-closed';

export interface WebTextFlowProperties
  extends Partial<Record<CSSLongWebTextFlowedPropKey, any>> {
  whiteSpace?: 'normal' | 'pre';
  listStyleType?: CSSListStyleTypePropertyBase | string;
}

export interface WebBlockRetainProperties {
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export interface CSSPropertySpecs<
  C extends CSSPropertyCompatCategory = CSSPropertyCompatCategory,
  D extends CSSPropertyDisplayCategory = CSSPropertyDisplayCategory,
  P extends CSSPropertyPropagationCategory = CSSPropertyPropagationCategory
> {
  readonly compatCategory: C;
  readonly displayCategory: D;
  readonly propagationCategory: P;
}
