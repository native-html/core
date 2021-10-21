import {
  ViewProps,
  TextProps,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';

/**
 * Props available on both React Native `Text` and `View` components.
 */
export type ReactNativeProps = Pick<
  ViewProps,
  Extract<keyof ViewProps, Exclude<keyof TextProps, 'style'>>
> &
  Pick<
    TextProps,
    Extract<keyof TextProps, Exclude<keyof ViewProps, 'style'>>
  > & {
    style?: StyleProp<
      Pick<ViewStyle, Extract<keyof ViewStyle, keyof TextStyle>>
    >;
  };

/**
 * React Native `Text` props, minus the `style` prop.
 */
export type StylessReactNativeTextProps = Omit<TextProps, 'style'>;

/**
 * React Native `View` props, minus the `style` prop.
 */
export type StylessReactNativeViewProps = Omit<ViewProps, 'style'> & {
  onPress?: () => void;
};

/**
 * An intersection between React Native `View` and `Text` props, minus the
 * `style` prop.
 */
export type StylessReactNativeProps = Omit<ReactNativeProps, 'style'> & {
  onPress?: () => void;
};

/**
 * An object containing props targetting either `Text`, `View`, or both.
 */
export type ReactNativePropsDefinitions = {
  /**
   * Props that will only apply to `Text`-backed renderers.
   */
  text?: StylessReactNativeTextProps;
  /**
   * Props that will only apply to `View`-backed renderers.
   */
  view?: StylessReactNativeViewProps;
  /**
   * Props that will apply to both `View` and `Text`-backed renderers.
   */
  native?: StylessReactNativeProps;
};

/**
 * An object containing props targetting either `Text` or `View`.
 */
export type ReactNativePropsSwitch = {
  /**
   * Props that will only apply to `Text`-wrapped renderers.
   */
  text?: StylessReactNativeTextProps;
  /**
   * Props that will only apply to `View`-wrapped renderers.
   */
  view?: StylessReactNativeViewProps;
};
