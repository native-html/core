import CSSProcessor, {
  CSSProcessedPropsRegistry,
  CSSProcessorConfig,
  CSSProperties,
  MixedStyleDeclaration
} from '@native-html/css-processor';
import { TStyles } from './TStyles';
import { StylesConfig } from './types';

const emptyProperties: CSSProperties = Object.freeze({});
export const emptyProcessedPropsReg: CSSProcessedPropsRegistry = Object.freeze({
  native: {
    block: {
      flow: emptyProperties,
      retain: emptyProperties
    },
    text: {
      flow: emptyProperties,
      retain: emptyProperties
    }
  },
  web: {
    block: {
      flow: emptyProperties,
      retain: emptyProperties
    },
    text: {
      flow: emptyProperties,
      retain: emptyProperties
    }
  }
});

function mapMixedStyleRecordToCSSProcessedPropsReg(
  processor: CSSProcessor,
  styles?: Record<string, MixedStyleDeclaration>
): Record<string, CSSProcessedPropsRegistry> {
  let regStyles: Record<string, CSSProcessedPropsRegistry> = {};
  for (const key in styles) {
    regStyles[key] = processor.compileStyleDeclaration(styles[key]);
  }
  return regStyles;
}

// Specificity hierarchy, in descending order:
// 1. Inline styles
// 2. ID (idsStyles)
// 3. Classes (classesStyles)
// 4. Element name (tagsStyles)
// 5. Attribute styles (styles derived from attributes)
// 6. Default element styles
// 7. Inherited styles (baseFontStyles)
export class TStylesMerger {
  private processor: CSSProcessor;
  private tagsStyles: Record<string, CSSProcessedPropsRegistry>;
  private classesStyles: Record<string, CSSProcessedPropsRegistry>;
  private idsStyles: Record<string, CSSProcessedPropsRegistry>;
  private enableCSSInlineProcessing: boolean;
  constructor(config: StylesConfig, cssProcessorConfig?: CSSProcessorConfig) {
    this.processor = new CSSProcessor(cssProcessorConfig);
    this.classesStyles = mapMixedStyleRecordToCSSProcessedPropsReg(
      this.processor,
      config.classesStyles
    );
    this.tagsStyles = mapMixedStyleRecordToCSSProcessedPropsReg(
      this.processor,
      config.tagsStyles
    );
    this.idsStyles = mapMixedStyleRecordToCSSProcessedPropsReg(
      this.processor,
      config.idsStyles
    );
    this.enableCSSInlineProcessing = config.enableCSSInlineProcessing;
  }

  compileCss(inlineStyles: string) {
    return this.processor.compileCss(inlineStyles);
  }

  buildStyles(
    inlineStyle: string,
    parentStyles: TStyles | null,
    descriptor: {
      tagName: string | null;
      className: string | null;
      id: string | null;
    }
  ): TStyles {
    const ownInlinePropsReg =
      this.enableCSSInlineProcessing && inlineStyle
        ? this.compileCss(inlineStyle)
        : null;
    const tagOwnProps = this.tagsStyles[descriptor.tagName as string] ?? null;
    const idOwnProps = this.idsStyles[descriptor.id as string] ?? null;
    const classesOwnProps =
      this.classesStyles[descriptor.className as string] ?? null;
    // Latest properties will override former properties.
    const mergedOwnProps = mergePropsRegistries([
      tagOwnProps,
      classesOwnProps,
      idOwnProps,
      ownInlinePropsReg
    ]);
    return new TStyles(mergedOwnProps, parentStyles);
  }
}

/**
 * Merge from lower specificy registries (left) to higher specificity registry (right).
 * @param registries
 */
function mergePropsRegistries(
  registries: Array<CSSProcessedPropsRegistry | null>
): CSSProcessedPropsRegistry {
  return (registries.filter((e) => e != null) as Array<
    CSSProcessedPropsRegistry
  >).reduce((prev, curr) => {
    return {
      native: {
        block: {
          flow: {
            ...prev.native.block.flow,
            ...curr.native.block.flow
          },
          retain: {
            ...prev.native.block.retain,
            ...curr.native.block.retain
          }
        },
        text: {
          flow: {
            ...prev.native.text.flow,
            ...curr.native.text.flow
          },
          retain: {
            ...prev.native.text.retain,
            ...curr.native.text.retain
          }
        }
      },
      web: {
        block: {
          flow: {
            ...prev.web.block.flow,
            ...curr.web.block.flow
          },
          retain: {
            ...prev.web.block.retain,
            ...curr.web.block.retain
          }
        },
        text: {
          flow: {
            ...prev.web.text.flow,
            ...curr.web.text.flow
          },
          retain: {
            ...prev.web.text.retain,
            ...curr.web.text.retain
          }
        }
      }
    };
  }, emptyProcessedPropsReg);
}
