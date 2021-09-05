import { TextStyle, ViewStyle } from 'react-native';
import {
  StandardLonghandProperties,
  StandardShorthandProperties
} from 'csstype';

// To translate manually
// borderBottom, borderLeft, borderRight, borderTop
// borderStyle, overflow, placeItems, placeSelf,
// textEmphasis

/**
 * React Native style keys which are exclusive to TextStyle.
 */
export type NativeTextStyleKey = Exclude<keyof TextStyle, keyof ViewStyle>;

/**
 * Shorthand properties.
 * These properties will be pre-translated with css-to-react-native.
 * These properties are not considered "native, web, flow ... etc" because
 * they won't be translated per-se.
 */
export type CSSShortPropsKey = Extract<
  keyof StandardShorthandProperties,
  | 'background'
  | 'border'
  | 'borderColor'
  | 'borderRadius'
  | 'borderWidth'
  | 'flex'
  | 'flexFlow'
  | 'font'
  | 'margin'
  | 'padding'
  | 'textDecoration'
>;

/**
 * Flowed properties.
 * Such properties propagate recursively to children nodes.
 */
export type CSSFlowedPropKey = Extract<
  keyof StandardLonghandProperties,
  | 'borderCollapse'
  | 'borderSpacing'
  | 'captionSide'
  | 'color'
  | 'cursor'
  | 'direction'
  | 'emptyCells'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontVariant'
  | 'fontWeight'
  | 'font'
  | 'letterSpacing'
  | 'lineHeight'
  | 'listStyleImage'
  | 'listStylePosition'
  | 'listStyleType'
  | 'listStyle'
  | 'orphans'
  | 'quotes'
  | 'textAlign'
  | 'textIndent'
  | 'textTransform'
  | 'visibility'
  | 'whiteSpace'
  | 'listStyleType'
  | 'widows'
  | 'wordSpacing'
>;

/**
 * Long, Native Text properties
 */
export type CSSLongNativeTextPropKey = Extract<
  keyof StandardLonghandProperties,
  NativeTextStyleKey
>;

/**
 * Long, Native-untranslatable, Text properties
 */
export type CSSLongNativeUntranslatableTextPropKey = never;

/**
 * Long, Native-translatable, Text properties
 */
export type CSSLongNativeTranslatableTextPropKey = Exclude<
  CSSLongNativeTextPropKey,
  CSSLongNativeUntranslatableTextPropKey
>;

/**
 * Long, Native-translatable, Text, Flowed properties
 */
export type CSSLongNativeTranslatableTextFlowedPropKey = Extract<
  CSSLongNativeTextPropKey,
  CSSFlowedPropKey
>;

/**
 * Long, Native-translatable, Text, Retained properties
 */
export type CSSLongNativeTranslatableTextRetainedPropKey = Exclude<
  CSSLongNativeTextPropKey,
  CSSFlowedPropKey
>;

/**
 * Long, Native-untranslatable, Text Retained properties
 */
export type CSSLongNativeUntranslatableTextRetainedPropKey = Exclude<
  CSSLongNativeUntranslatableTextPropKey,
  CSSFlowedPropKey
>;
/**
 * Long, Native-untranslatable, Text Flowed properties
 */
export type CSSLongNativeUntranslatableTextFlowedPropKey = Extract<
  CSSLongNativeUntranslatableTextPropKey,
  CSSFlowedPropKey
>;

/**
 * Long, Web, Text Flowed properties
 */
export type CSSLongWebTextFlowedPropKey = Extract<
  keyof StandardLonghandProperties,
  'whiteSpace' | 'listStyleType' | 'userSelect'
>;

/**
 * Long, Web, Text Retained properties
 */
export type CSSLongWebTextRetainedPropKey = Extract<
  keyof StandardLonghandProperties,
  never
>;

/**
 * Short, Text properties
 */
export type CSSShortTextPropKey = Extract<
  CSSShortPropsKey,
  'textDecoration' | 'font'
>;

/**
 * Short, Block properties
 */
export type CSSShortBlockPropKey = Exclude<
  CSSShortPropsKey,
  CSSShortTextPropKey
>;

/**
 * Short, Native-translatable, Block properties
 */
export type CSSShortNativeTranslatableBlockPropKey = Exclude<
  CSSShortPropsKey,
  CSSShortTextPropKey
>;

/**
 * Long, Native, Block properties
 */
export type CSSLongNativeBlockPropKey = Extract<
  keyof StandardLonghandProperties | 'borderStyle',
  keyof ViewStyle
>;

/**
 * Long, Native-translatable, Block properties
 */
export type CSSLongNativeTranslatableBlockPropKey = Exclude<
  CSSLongNativeBlockPropKey,
  CSSLongNativeUntranslatableBlockPropKey
>;

/**
 * Long, Native-untranslatable, Block properties
 */
export type CSSLongNativeUntranslatableBlockPropKey = Extract<
  CSSLongNativeBlockPropKey,
  'position'
>;
/**
 * Long, Native-untranslatable, Block, Flowed properties
 */
export type CSSLongNativeUntranslatableBlockFlowedPropKey = Extract<
  CSSLongNativeUntranslatableBlockPropKey,
  CSSFlowedPropKey
>;
/**
 * Long, Native-untranslatable, Block, Retained properties
 */
export type CSSLongNativeUntranslatableBlockRetainedPropKey = Exclude<
  CSSLongNativeUntranslatableBlockPropKey,
  CSSFlowedPropKey
>;

/**
 * Long, Native-translatable, Block, Flowed properties
 */
export type CSSLongNativeTranslatableBlockFlowedPropKey = Extract<
  CSSLongNativeTranslatableBlockPropKey,
  CSSFlowedPropKey
>;

/**
 * Long, Native-translatable, Block, Retained properties
 */
export type CSSLongNativeTranslatableBlockRetainedPropKey = Exclude<
  CSSLongNativeTranslatableBlockPropKey,
  CSSFlowedPropKey
>;

/**
 * Native properties
 */
export type CSSNativePropKey =
  | CSSLongNativeTextPropKey
  | CSSLongNativeBlockPropKey
  | CSSShortPropsKey;
