import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import {
  CSSLongNativeBlockPropKey,
  CSSLongNativeTextPropKey,
  NativeTextStyleKey,
  CSSShortPropsKey
} from './property-types';

/**
 * Extraneous longhand React Native ViewStyle keys.
 */
export type ExtraNativeViewStyleKeys = Exclude<
  Exclude<keyof ViewStyle | keyof ImageStyle, CSSShortPropsKey>,
  CSSLongNativeBlockPropKey
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
  Pick<ViewStyle & ImageStyle, ExtraNativeViewStyleKeys>
>;
