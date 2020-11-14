import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import {
  CSSLongNativeBlockPropKey,
  CSSLongNativeTextPropKey,
  NativeTextStyleKey,
  CSSShortPropsKey,
  CSSLongNativeUntranslatableBlockPropKey
} from './property-types';

export type ExtendedNativeViewStyleKeys = keyof ViewStyle | keyof ImageStyle;

export type NativeDirectionalStyleKeys = Extract<
  ExtendedNativeViewStyleKeys,
  | 'borderBottomEndRadius'
  | 'borderBottomStartRadius'
  | 'borderTopEndRadius'
  | 'borderTopStartRadius'
  | 'borderEndColor'
  | 'borderEndWidth'
  | 'borderStartColor'
  | 'borderStartWidth'
  | 'marginEnd'
  | 'marginStart'
  | 'paddingEnd'
  | 'paddingStart'
  | 'start'
  | 'end'
>;

export type ExtraNativeShortViewStyleKeys = Extract<
  ExtendedNativeViewStyleKeys,
  | 'marginHorizontal'
  | 'marginVertical'
  | 'paddingHorizontal'
  | 'paddingVertical'
>;

export type ExtraNativeShortStyle = Pick<
  TextStyle & ViewStyle,
  ExtraNativeShortViewStyleKeys | NativeShortKeys
>;

export type ExtraNativeUntranslatedLongStyles = Pick<
  ViewStyle,
  CSSLongNativeUntranslatableBlockPropKey
>;

/**
 * Extraneous React Native ViewStyle keys.
 */
export type ExtraNativeLongViewStyleKeys = Exclude<
  Exclude<ExtendedNativeViewStyleKeys, CSSShortPropsKey>,
  | CSSLongNativeBlockPropKey
  | NativeDirectionalStyleKeys
  | ExtraNativeShortViewStyleKeys
>;

/**
 * Native Short keys.
 */
export type NativeShortKeys = Extract<
  CSSShortPropsKey,
  NativeTextStyleKey | keyof ViewStyle
>;

/**
 * Extraneous longhand React Native TextStyle keys.
 */
export type ExtraNativeTextStyleKeys = Exclude<
  Exclude<NativeTextStyleKey, CSSShortPropsKey>,
  CSSLongNativeTextPropKey
>;

export type ExtraNativeTextStyle = Partial<
  Pick<TextStyle, ExtraNativeTextStyleKeys>
>;

export type ExtraNativeViewStyle = Partial<
  Pick<
    ViewStyle & ImageStyle,
    ExtraNativeLongViewStyleKeys | ExtraNativeShortViewStyleKeys
  >
>;
