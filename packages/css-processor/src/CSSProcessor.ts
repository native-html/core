import { CSSProcessorConfig } from './config';
import { CSSInlineParseRun } from './CSSInlineParseRun';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { CSSProcessedPropsRegistry, CSSRawRulesList } from './processor-types';

// https://www.w3.org/TR/CSS22/
// https://www.w3.org/TR/css3-cascade/
// https://www.w3.org/TR/css-cascade-4/
// https://www.w3.org/TR/css-text-3/
// https://www.w3.org/TR/css3-values/
// https://www.w3.org/TR/css-values-4/

export class CSSProcessor {
  public readonly registry: CSSPropertiesValidationRegistry;
  constructor(config: CSSProcessorConfig) {
    this.registry = new CSSPropertiesValidationRegistry(config);
  }

  private parseRules(str: string): CSSRawRulesList {
    return str
      .split(';')
      .map((prop) => prop.split(':'))
      .reduce<CSSRawRulesList>((acc, prop) => {
        if (prop.length === 2) {
          return [...acc, [prop[0].trim(), prop[1].trim()]];
        }
        return acc;
      }, []);
  }

  compileCss(str: string): CSSProcessedPropsRegistry {
    const rules = this.parseRules(str);
    const parseRun = new CSSInlineParseRun(rules, this.registry);
    return parseRun.exec();
  }
}
