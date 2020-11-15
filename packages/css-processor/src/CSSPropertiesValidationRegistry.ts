import { CSSProcessorConfig, CSSPropertyNameList } from './config';
import makepropertiesValidators, {
  ValidatorsType
} from './makepropertiesValidators';
import { GenericCSSPropertyValidator } from './validators/GenericPropertyValidator';

function makeRegistry(list: CSSPropertyNameList) {
  const registry = {} as any;
  list.forEach((prop) => {
    registry[prop] = true;
  });
  return registry;
}

export class CSSPropertiesValidationRegistry {
  public readonly validators: Readonly<ValidatorsType>;
  public readonly ignoredPropertiesRegistry: Partial<Record<string, true>>;
  public readonly allowedPropertiesRegistry: Partial<
    Record<string, true>
  > | null;

  constructor(config: CSSProcessorConfig) {
    this.validators = makepropertiesValidators(config);
    this.ignoredPropertiesRegistry = makeRegistry(
      config.inlinePropertiesBlacklist
    );
    this.allowedPropertiesRegistry = config.inlinePropertiesWhitelist
      ? makeRegistry(config.inlinePropertiesWhitelist)
      : null;
  }

  private isInlinePropertyAllowed(name: string) {
    if (this.allowedPropertiesRegistry) {
      return !!this.allowedPropertiesRegistry[name];
    }
    return !this.ignoredPropertiesRegistry[name];
  }

  shouldRegisterInlineProperty(name: string): name is keyof ValidatorsType {
    return (
      this.isInlinePropertyAllowed(name) &&
      !!this.validators[name as keyof ValidatorsType]
    );
  }

  getValidatorForProperty<T extends string>(
    name: T
  ): T extends keyof ValidatorsType ? GenericCSSPropertyValidator : null {
    return (this.validators[name as keyof ValidatorsType] as any) || null;
  }
}
