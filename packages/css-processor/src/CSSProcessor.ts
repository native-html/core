import { CSSProcessorConfig } from './config';
import { CSSInlineParseRun } from './CSSInlineParseRun';
import { CSSNativeParseRun } from './CSSNativeParseRun';
import { CSSProcessedProps } from './CSSProcessedProps';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { defaultCSSProcessorConfig } from './default';
import { ExtraNativeTextStyle, ExtraNativeViewStyle } from './native-types';
import { CSSRawPropertiesList, WebTextFlowProperties } from './processor-types';

// https://www.w3.org/TR/CSS22/
// https://www.w3.org/TR/css3-cascade/
// https://www.w3.org/TR/css-cascade-4/
// https://www.w3.org/TR/css-text-3/
// https://www.w3.org/TR/css3-values/
// https://www.w3.org/TR/css-values-4/

/**
 *
 */
export type MixedStyleDeclaration = CSSProcessedProps['native']['text']['flow'] &
  CSSProcessedProps['native']['block']['flow'] &
  CSSProcessedProps['native']['text']['retain'] &
  CSSProcessedProps['native']['block']['retain'] &
  WebTextFlowProperties &
  ExtraNativeTextStyle &
  ExtraNativeViewStyle;

export class CSSProcessor {
  public readonly registry: CSSPropertiesValidationRegistry;
  constructor(userConfig?: Partial<CSSProcessorConfig>) {
    const config = {
      ...defaultCSSProcessorConfig,
      ...userConfig
    };
    this.registry = new CSSPropertiesValidationRegistry(config);
  }

  private parseInlineProperties(str: string): CSSRawPropertiesList {
    return str
      .split(';')
      .map((prop) => prop.split(':'))
      .reduce<CSSRawPropertiesList>((acc, prop) => {
        if (prop.length === 2) {
          return [...acc, [prop[0].trim(), prop[1].trim()]];
        }
        return acc;
      }, []);
  }

  compileStyleDeclaration(
    declaration: MixedStyleDeclaration
  ): CSSProcessedProps {
    const parseRun = new CSSNativeParseRun(declaration, this.registry);
    return parseRun.exec();
  }

  compileCss(str: string): CSSProcessedProps {
    const properties = this.parseInlineProperties(str);
    const parseRun = new CSSInlineParseRun(properties, this.registry);
    return parseRun.exec();
  }
}
