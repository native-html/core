import { getPropertyName } from 'css-to-react-native';
import { CSSParseRun } from './CSSParseRun';
import { MixedStyleDeclaration } from './CSSProcessor';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { ValidatorsType } from './makepropertiesValidators';
import { CSSProperties } from './processor-types';
import { ShortMergeRequest } from './ShortMergeRequest';
import { LongCSSPropertyValidator } from './validators/LongCSSPropertyValidator';

type CSSRawPropertiesList = [string, any][];

export class CSSInlineParseRun extends CSSParseRun {
  private rules: CSSRawPropertiesList;

  constructor(inlineCSS: string, registry: CSSPropertiesValidationRegistry) {
    super(registry);
    this.rules = this.parseInlineCSS(inlineCSS);
    this.normalizeProp = this.normalizeProp.bind(this);
    this.reduceProps = this.reduceProps.bind(this);
  }

  private parseInlineCSS(inlineCSS: string): CSSRawPropertiesList {
    return inlineCSS
      .split(';')
      .map((prop) => prop.split(':'))
      .reduce<CSSRawPropertiesList>((acc, prop) => {
        if (prop.length === 2) {
          return [...acc, [prop[0].trim(), prop[1].trim()]];
        }
        return acc;
      }, []);
  }

  normalizeProp(
    rule: CSSRawPropertiesList[number],
    strict = false
  ): null | [keyof ValidatorsType, any] {
    const rawName = rule[0];
    const rawValue = rule[1];
    const camelCaseName = getPropertyName(rawName);
    if (!this.validationMap.shouldRegisterInlineProperty(camelCaseName)) {
      return null;
    }
    const validator = this.validationMap.getValidatorForProperty(camelCaseName);
    const normalizedValue = validator.normalizeInlineCSSValue(rawValue);
    if (normalizedValue === null) {
      if (strict) {
        throw new TypeError();
      }
      return null;
    }
    return [camelCaseName, normalizedValue];
  }

  reduceProps(
    reg: CSSProperties,
    rule: null | [keyof ValidatorsType, Exclude<any, null>]
  ): CSSProperties {
    if (!rule) {
      return reg;
    }
    const [camelCaseName, normalizedValue] = rule;
    if (normalizedValue instanceof ShortMergeRequest) {
      try {
        return normalizedValue
          .map((r) => this.normalizeProp(r, true))
          .reduce(this.reduceProps, reg);
      } catch (e) {
        return reg;
      }
    }
    return {
      ...reg,
      [camelCaseName]: normalizedValue
    };
  }

  fillProcessedProps() {
    const rawTransformed = this.rules
      .map((r) => this.normalizeProp(r))
      .reduce(this.reduceProps, {});
    (Object.keys(rawTransformed) as Array<keyof ValidatorsType>).forEach(
      (camelCaseName) => {
        const value = rawTransformed[camelCaseName];
        const validator = this.validationMap.getValidatorForProperty(
          camelCaseName
        ) as LongCSSPropertyValidator;
        const normalizedValue = validator.normalizeInlineCSSValue(value);
        this.processedProps.withProperty(
          camelCaseName as keyof MixedStyleDeclaration,
          normalizedValue,
          validator
        );
      }
    );
  }
}
