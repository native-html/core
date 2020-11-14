import { TextStyle, ViewStyle } from 'react-native';
import makepropertiesValidators from '../makepropertiesValidators';
import { ExtraNativeShortViewStyleKeys } from '../native-types';
import {
  CSSLongNativeTextPropKey,
  CSSLongNativeTranslatableBlockFlowedPropKey,
  CSSLongNativeTranslatableBlockRetainedPropKey,
  CSSLongNativeTranslatableTextFlowedPropKey,
  CSSLongNativeTranslatableTextRetainedPropKey,
  CSSLongNativeUntranslatableBlockRetainedPropKey,
  CSSLongWebTextFlowedPropKey,
  CSSShortPropsKey
} from '../property-types';

type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never;

type PropertiesValidator = ReturnType<typeof makepropertiesValidators>;

// These type tests assert that the exported validators map
// all required rules

type NativeTextStyleKeys = Exclude<keyof TextStyle, keyof ViewStyle>;

export const testExtraShortNativeProps: AssertEqual<
  Extract<keyof PropertiesValidator, ExtraNativeShortViewStyleKeys>,
  ExtraNativeShortViewStyleKeys
> = true;

export const testRNTextProps: AssertEqual<
  NativeTextStyleKeys,
  CSSLongNativeTextPropKey
> = true;

export const testLngNunBlkRetKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongNativeUntranslatableBlockRetainedPropKey>,
  Record<CSSLongNativeUntranslatableBlockRetainedPropKey, any>
> = true;

export const testShtKeys: AssertEqual<
  Pick<PropertiesValidator, CSSShortPropsKey>,
  Record<CSSShortPropsKey, any>
> = true;

export const testLngNtrBlkRetKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongNativeTranslatableBlockRetainedPropKey>,
  Record<CSSLongNativeTranslatableBlockRetainedPropKey, any>
> = true;

export const testLngNtrBlkFloKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongNativeTranslatableBlockFlowedPropKey>,
  Record<CSSLongNativeTranslatableBlockFlowedPropKey, any>
> = true;

export const testLngWebTxtFloKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongWebTextFlowedPropKey>,
  Record<CSSLongWebTextFlowedPropKey, any>
> = true;

export const testLngNtrTxtRetKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongNativeTranslatableTextRetainedPropKey>,
  Record<CSSLongNativeTranslatableTextRetainedPropKey, any>
> = true;

export const testLngNtrTxtFloKeys: AssertEqual<
  Pick<PropertiesValidator, CSSLongNativeTranslatableTextFlowedPropKey>,
  Record<CSSLongNativeTranslatableTextFlowedPropKey, any>
> = true;
