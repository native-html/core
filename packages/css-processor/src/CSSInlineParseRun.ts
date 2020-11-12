import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { CSSParseRun } from './CSSParseRun';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import {
  CSSProcessedPropsRegistry,
  CSSRawPropertiesList,
  CSSProperties
} from './processor-types';
import { CSSPropertyValidator } from './validators';

export class CSSInlineParseRun
  extends CSSParseRun
  implements CSSProcessedPropsRegistry {
  private rawTransformed: Record<string, any> = {};

  constructor(
    rules: CSSRawPropertiesList,
    registry: CSSPropertiesValidationRegistry
  ) {
    super(registry);
    this.rawTransformed = rules
      .map((rule) => {
        const rawName = rule[0];
        const rawValue = rule[1];
        const camelCaseName = getPropertyName(rawName);
        if (this.registry.shouldIgnoreProperty(camelCaseName)) {
          return null;
        }
        const validator = this.registry.getValidatorForProperty(camelCaseName);
        if (!validator) {
          return null;
        }
        const normalizedValue = validator.isShorthand()
          ? validator.normalizeBeforeCSSToRNTransform(rawValue)
          : validator.normalizeRaw(rawValue);
        if (normalizedValue === null) {
          return null;
        }
        return [camelCaseName, normalizedValue];
      })
      .reduce((reg, rule) => {
        if (!rule) {
          return reg;
        }
        const [camelCaseName, value] = rule;
        const validator = this.registry.getValidatorForProperty(camelCaseName);
        if (validator && validator.shouldIgnoreTransform()) {
          return { ...reg, [camelCaseName]: value };
        }
        try {
          return { ...reg, ...getStylesForProperty(camelCaseName, value) };
        } catch (e) {
          // Ignore this rule if parsing failed
        }
        return reg;
      }, {} as CSSProperties);
    this.registerRules();
  }

  private registerRules() {
    Object.keys(this.rawTransformed).forEach((camelCaseName) => {
      const value = this.rawTransformed[camelCaseName];
      const validator = this.registry.getValidatorForProperty(
        camelCaseName
      ) as CSSPropertyValidator;
      const normalizedValue = validator.normalizeValue(value);
      this.registerProperty(camelCaseName, normalizedValue, validator);
    });
  }
}
