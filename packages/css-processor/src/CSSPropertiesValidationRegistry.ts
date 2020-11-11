import { CSSProcessorConfig } from './config';
import { makepropertiesValidators, ValidatorsType } from './make-validators';

export class CSSPropertiesValidationRegistry {
  public readonly validators: Readonly<ValidatorsType>;
  public readonly ignoredPropertiesRegistry: Partial<Record<string, true>>;

  constructor(config: CSSProcessorConfig) {
    this.validators = makepropertiesValidators(config);
    const registry = {} as any;
    config.ignoredProperties.forEach((prop) => {
      registry[prop] = true;
    });
    this.ignoredPropertiesRegistry = registry;
  }

  shouldIgnoreProperty(name: string) {
    return this.ignoredPropertiesRegistry[name] || false;
  }

  getValidatorForProperty(name: string) {
    if (Object.prototype.hasOwnProperty.call(this.validators, name)) {
      return this.validators[name as keyof ValidatorsType];
    }
    return null;
  }
}
