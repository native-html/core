import { TextStyle, ViewStyle } from 'react-native';
import {
  CSSLongNativeTranslatableBlockFlowedPropKey,
  CSSLongNativeTranslatableBlockRetainedPropKey,
  CSSLongNativeTranslatableTextFlowedPropKey,
  CSSLongNativeTranslatableTextRetainedPropKey,
  CSSLongNativeUntranslatableBlockFlowedPropKey,
  CSSLongNativeUntranslatableBlockPropKey,
  CSSLongWebTextFlowedPropKey,
  CSSLongWebTextRetainedPropKey
} from './property-types';

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

export interface CSSProcessedPropsRegistry
  extends Record<CSSPropertyCompatCategory, CSSDisplayRegistry> {
  native: {
    text: {
      flow: Partial<
        Pick<TextStyle, CSSLongNativeTranslatableTextFlowedPropKey>
      >;
      retain: Partial<
        Pick<TextStyle, CSSLongNativeTranslatableTextRetainedPropKey>
      >;
    };
    block: {
      flow: Partial<
        Pick<ViewStyle, CSSLongNativeTranslatableBlockFlowedPropKey>
      >;
      retain: Partial<
        Pick<ViewStyle, CSSLongNativeTranslatableBlockRetainedPropKey>
      >;
    };
  };
  web: {
    text: {
      flow: Partial<WebTextFlowProperties> & CSSProperties;
      retain: Partial<Record<CSSLongWebTextRetainedPropKey, any>> &
        CSSProperties;
    };
    block: {
      flow: Partial<
        Pick<ViewStyle, CSSLongNativeUntranslatableBlockFlowedPropKey>
      > &
        CSSProperties;
      retain: Partial<
        Pick<ViewStyle, CSSLongNativeUntranslatableBlockPropKey>
      > &
        CSSProperties;
    };
  };
}
