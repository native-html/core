import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import {
  CSSProcessedPropsRegistry,
  CSSDisplayRegistry,
  CSSRawRulesList,
  CSSPropertiesRegistry,
  CSSRulesCompatCategory,
  CSSRulesDisplayCategory,
  CSSRulesPropagationCategory
} from './processor-types';
import { CSSPropertyValidator } from './validators';

export class CSSInlineParseRun implements CSSProcessedPropsRegistry {
  readonly native: CSSProcessedPropsRegistry['native'];
  readonly web: CSSProcessedPropsRegistry['web'];
  private rawTransformed: Record<string, any> = {};
  private registry: CSSPropertiesValidationRegistry;

  private newCompatCategory<
    T extends CSSRulesCompatCategory
  >(): CSSProcessedPropsRegistry[T] {
    return {
      block: {
        retain: {},
        flow: {}
      },
      text: {
        retain: {},
        flow: {}
      }
    };
  }

  constructor(
    rules: CSSRawRulesList,
    registry: CSSPropertiesValidationRegistry
  ) {
    this.registry = registry;
    this.native = this.newCompatCategory<'native'>();
    this.web = this.newCompatCategory<'web'>();
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
      }, {} as CSSPropertiesRegistry);
    this.registerRules();
  }

  private addRule<
    C extends CSSRulesCompatCategory,
    D extends CSSRulesDisplayCategory,
    P extends CSSRulesPropagationCategory
  >(rule: [string, any], compat: C, display: D, inheritability: P) {
    this[compat][display][inheritability][
      rule[0] as keyof CSSProcessedPropsRegistry[C][D][P]
    ] = rule[1] as any;
  }

  public registerRules() {
    Object.keys(this.rawTransformed).forEach((camelCaseName) => {
      const value = this.rawTransformed[camelCaseName];
      const validator = this.registry.getValidatorForProperty(
        camelCaseName
      ) as CSSPropertyValidator;
      const normalizedValue = validator.normalizeValue(value);
      this.addRule(
        [camelCaseName, normalizedValue],
        validator.isTranslatable() ? 'native' : 'web',
        validator.display(),
        validator.isInheritable() ? 'flow' : 'retain'
      );
    });
  }

  private normalize(reg: CSSPropertiesRegistry): CSSPropertiesRegistry {
    return reg;
  }

  private assembleDisplayCategory(
    base: CSSDisplayRegistry,
    category: CSSRulesDisplayCategory
  ) {
    return {
      retain: this.normalize(base[category].retain),
      flow: this.normalize(base[category].flow)
    };
  }

  private assembleCompatCategory(compat: CSSRulesCompatCategory) {
    return {
      block: this.assembleDisplayCategory(this[compat], 'block'),
      text: this.assembleDisplayCategory(this[compat], 'text')
    };
  }
  public exec(): CSSProcessedPropsRegistry {
    return {
      native: this.assembleCompatCategory('native'),
      web: this.assembleCompatCategory('web')
    };
  }
}
