import { CSSProcessorConfig } from './config';
import makepropertiesValidators, {
  ValidatorsType
} from './makepropertiesValidators';
import { GenericCSSPropertyValidator } from './validators/GenericPropertyValidator';

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

  shouldRegisterProperty(name: string): name is keyof ValidatorsType {
    return (
      !this.ignoredPropertiesRegistry[name] &&
      !!this.validators[name as keyof ValidatorsType]
    );
  }

  getValidatorForProperty<T extends string>(
    name: T
  ): T extends keyof ValidatorsType ? GenericCSSPropertyValidator : null {
    return (this.validators[name as keyof ValidatorsType] as any) || null;
  }
}
