import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { CSSParseRun } from './CSSParseRun';
import { MixedStyleDeclaration } from './CSSProcessor';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { CSSRawPropertiesList, CSSProperties } from './processor-types';
import { CSSPropertyValidator } from './validators';

export class CSSInlineParseRun extends CSSParseRun {
  private rules: CSSRawPropertiesList;

  constructor(
    rules: CSSRawPropertiesList,
    registry: CSSPropertiesValidationRegistry
  ) {
    super(registry);
    this.rules = rules;
  }

  fillRegistry() {
    const rawTransformed: Record<string, any> = this.rules
      .map((rule) => {
        const rawName = rule[0];
        const rawValue = rule[1];
        const camelCaseName = getPropertyName(rawName);
        if (this.validationMap.shouldIgnoreProperty(camelCaseName)) {
          return null;
        }
        const validator = this.validationMap.getValidatorForProperty(
          camelCaseName
        );
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
        const validator = this.validationMap.getValidatorForProperty(
          camelCaseName
        );
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
    Object.keys(rawTransformed).forEach((camelCaseName) => {
      const value = rawTransformed[camelCaseName];
      const validator = this.validationMap.getValidatorForProperty(
        camelCaseName
      ) as CSSPropertyValidator;
      const normalizedValue = validator.normalizeValue(value);
      this.registry.withProperty(
        camelCaseName as keyof MixedStyleDeclaration,
        normalizedValue,
        validator
      );
    });
  }
}
