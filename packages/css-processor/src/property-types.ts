import { TextStyle, ViewStyle } from 'react-native';
import {
  StandardLonghandProperties,
  StandardShorthandProperties
} from 'csstype';

// To translate manually
// borderBottom, borderLeft, borderRight, borderTop
// borderStyle, overflow, placeItems, placeSelf,
// textEmphasis

// Type: Shorthand / Longhand : Sht / Lng
// Compat: Web / Native-translatable / Native-untranslatable : Web / Ntr / Nun
// Display: Text / Block : Txt / Blk
// Propagation: Flow / Retain : Flo / Ret
//
// Order: Type Compat Display Propagation

/**
 * Shorthand properties.
 * These properties will be pre-translated with css-to-react-native.
 * These properties are not considered "native, web, flow ... etc" because
 * they won't be translated per-se.
 */
export type ShtProperties = Extract<
  keyof StandardShorthandProperties,
  | 'background'
  | 'border'
  | 'borderColor'
  | 'borderRadius'
  | 'borderWidth'
  | 'borderStyle'
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
export type FloProperties = Extract<
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
  | 'widows'
  | 'wordSpacing'
>;

/**
 * Long, Native Text properties
 */
export type LngNativeTxtProperties = Extract<
  keyof StandardLonghandProperties,
  Exclude<keyof TextStyle, keyof ViewStyle>
>;

/**
 * Long, Native-untranslatable, Text properties
 */
export type LngNunTxtProperties = never;

/**
 * Long, Native-translatable, Text properties
 */
export type LngNtrTxtProperties = Exclude<
  LngNativeTxtProperties,
  LngNunTxtProperties
>;

/**
 * Long, Native-translatable, Text, Flowed properties
 */
export type LngNtrTxtFloProperties = Extract<
  LngNativeTxtProperties,
  FloProperties
>;

/**
 * Long, Native-translatable, Text, Retained properties
 */
export type LngNtrTxtRetProperties = Exclude<
  LngNativeTxtProperties,
  FloProperties
>;

/**
 * Long, Native-untranslatable, Text Retained properties
 */
export type LngNunTxtRetProperties = Exclude<
  LngNunTxtProperties,
  FloProperties
>;
/**
 * Long, Native-untranslatable, Text Flowed properties
 */
export type LngNunTxtFloProperties = Extract<
  LngNunTxtProperties,
  FloProperties
>;

/**
 * Long, Web, Text Flowed properties
 */
export type LngWebTxtFloProperties = Extract<
  keyof StandardLonghandProperties,
  'whiteSpace'
>;

/**
 * Long, Web, Text Retained properties
 */
export type LngWebTxtRetProperties = Extract<
  keyof StandardLonghandProperties,
  never
>;

/**
 * Short, Text properties
 */
export type ShtTxtProperties = Extract<
  ShtProperties,
  'textDecoration' | 'font'
>;

/**
 * Short, Block properties
 */
export type ShtBlkProperties = Exclude<ShtProperties, ShtTxtProperties>;

/**
 * Short, Native-translatable, Block properties
 */
export type ShtNtrBlkProperties = Exclude<ShtProperties, ShtTxtProperties>;

/**
 * Long, Native, Block properties
 */
export type LngNativeBlkProperties = Extract<
  keyof StandardLonghandProperties,
  keyof ViewStyle
>;

/**
 * Long, Native-translatable, Block properties
 */
export type LngNtrBlkProperties = Exclude<
  LngNativeBlkProperties,
  LngNunBlkProperties
>;

/**
 * Long, Native-untranslatable, Block properties
 */
export type LngNunBlkProperties = Extract<
  LngNativeBlkProperties,
  | 'alignContent'
  | 'alignItems'
  | 'alignSelf'
  | 'aspectRatio'
  | 'bottom'
  | 'display'
  | 'flexBasis'
  | 'flexDirection'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexWrap'
  | 'justifyContent'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'position'
>;
/**
 * Long, Native-untranslatable, Block, Flowed properties
 */
export type LngNunBlkFloProperties = Extract<
  LngNunBlkProperties,
  FloProperties
>;
/**
 * Long, Native-untranslatable, Block, Retained properties
 */
export type LngNunBlkRetProperties = Exclude<
  LngNunBlkProperties,
  FloProperties
>;

/**
 * Long, Native-translatable, Block, Flowed properties
 */
export type LngNtrBlkFloProperties = Extract<
  LngNtrBlkProperties,
  FloProperties
>;

/**
 * Long, Native-translatable, Block, Retained properties
 */
export type LngNtrBlkRetProperties = Exclude<
  LngNtrBlkProperties,
  FloProperties
>;

/**
 * Native properties
 */
export type NativeProperties =
  | LngNativeTxtProperties
  | LngNativeBlkProperties
  | ShtProperties;
