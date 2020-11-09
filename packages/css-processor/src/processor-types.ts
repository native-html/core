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

export type CSSProcessedPropsRegistry = Readonly<
  Record<CSSRulesCompatCategory, CSSDisplayRegistry>
>;
