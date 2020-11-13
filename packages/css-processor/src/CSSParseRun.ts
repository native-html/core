import { CSSPropertiesValidationRegistry as CSSPropertiesValidationMap } from './CSSPropertiesValidationRegistry';
import { CSSProcessedProps } from './CSSProcessedProps';

export abstract class CSSParseRun {
  protected validationMap: CSSPropertiesValidationMap;
  protected processedProps: CSSProcessedProps;

  constructor(validationMap: CSSPropertiesValidationMap) {
    this.validationMap = validationMap;
    this.processedProps = new CSSProcessedProps();
  }

  protected abstract fillProcessedProps(): void;

  public exec(): CSSProcessedProps {
    this.fillProcessedProps();
    return this.processedProps;
  }
}
