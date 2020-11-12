import { CSSPropertiesValidationRegistry as CSSPropertiesValidationMap } from './CSSPropertiesValidationRegistry';
import { CSSProcessedPropsRegistry } from './CSSProcessedPropsRegistry';

export abstract class CSSParseRun {
  protected validationMap: CSSPropertiesValidationMap;
  protected registry: CSSProcessedPropsRegistry;

  constructor(validationMap: CSSPropertiesValidationMap) {
    this.validationMap = validationMap;
    this.registry = new CSSProcessedPropsRegistry();
  }

  protected abstract fillRegistry(): void;

  public exec(): CSSProcessedPropsRegistry {
    this.fillRegistry();
    return this.registry;
  }
}
