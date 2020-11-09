import { CSSProcessorConfig } from './config';
import { makepropertiesValidators, ValidatorsType } from './make-validators';

export class CSSPropertiesValidationRegistry {
  public readonly validators: Readonly<ValidatorsType>;
  constructor(config: CSSProcessorConfig) {
    this.validators = makepropertiesValidators(config);
  }

  getValidatorForRule(name: string) {
    if (Object.prototype.hasOwnProperty.call(this.validators, name)) {
      return this.validators[name as keyof ValidatorsType];
    }
    return null;
  }
}
