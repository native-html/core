import { CSSProcessorConfig } from '../../config';
import { defaultCSSProcessorConfig } from '../../default';
import { CSSPropertiesValidationRegistry } from '../../CSSPropertiesValidationRegistry';

export function registryFromConfig(config: Partial<CSSProcessorConfig>) {
  return new CSSPropertiesValidationRegistry({
    ...defaultCSSProcessorConfig,
    ...config
  });
}
