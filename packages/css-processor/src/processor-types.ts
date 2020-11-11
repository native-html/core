import { TextStyle, ViewStyle } from 'react-native';
import {
  LngNtrBlkFloProperties,
  LngNtrBlkRetProperties,
  LngNtrTxtFloProperties,
  LngNtrTxtRetProperties,
  LngNunBlkFloProperties,
  LngNunBlkProperties,
  LngWebTxtFloProperties,
  LngWebTxtRetProperties
} from './property-types';

export type CSSRawRulesList = [string, any][];
export type CSSPropertiesRegistry = Record<string, any>;
/**
 * - *flow* CSS properties will be inherited by children TTree nodes;
 * - *retain* CSS properties will only apply to the TTree node to which it is
 *   attached.
 */
export type CSSRulesPropagationCategory = 'flow' | 'retain';
/**
 * - *text* displays will only affect textual nodes
 * - *block* displays will affect all nodes
 */
export type CSSRulesDisplayCategory = 'text' | 'block';
/**
 * - *native* properties can be injected in React Native components style prop;
 * - *web* properties are solely used in the transient tree render engine.
 */
export type CSSRulesCompatCategory = 'native' | 'web';

export type CSSPropagationRegistry = Record<
  CSSRulesPropagationCategory,
  CSSPropertiesRegistry
>;

export type CSSDisplayRegistry = Record<
  CSSRulesDisplayCategory,
  CSSPropagationRegistry
>;

export interface WebTextFlowPropertiesRegistry
  extends Record<LngWebTxtFloProperties, any> {
  whiteSpace: 'normal' | 'pre';
}

export interface CSSProcessedPropsRegistry
  extends Record<CSSRulesCompatCategory, CSSDisplayRegistry> {
  native: {
    text: {
      flow: Partial<Pick<TextStyle, LngNtrTxtFloProperties>>;
      retain: Partial<Pick<TextStyle, LngNtrTxtRetProperties>>;
    };
    block: {
      flow: Partial<Pick<ViewStyle, LngNtrBlkFloProperties>>;
      retain: Partial<Pick<ViewStyle, LngNtrBlkRetProperties>>;
    };
  };
  web: {
    text: {
      flow: Partial<WebTextFlowPropertiesRegistry> & CSSPropertiesRegistry;
      retain: Partial<Record<LngWebTxtRetProperties, any>> &
        CSSPropertiesRegistry;
    };
    block: {
      flow: Partial<Pick<ViewStyle, LngNunBlkFloProperties>> &
        CSSPropertiesRegistry;
      retain: Partial<Pick<ViewStyle, LngNunBlkProperties>> &
        CSSPropertiesRegistry;
    };
  };
}
