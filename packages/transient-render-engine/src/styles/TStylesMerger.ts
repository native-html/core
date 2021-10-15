import CSSProcessor, {
  CSSProcessedProps,
  CSSProcessorConfig,
  MixedStyleDeclaration
} from '@native-html/css-processor';
import HTMLModelRegistry from '../model/HTMLModelRegistry';
import { TNodeDescriptor } from '../tree/tree-types';
import { TStyles } from './TStyles';
import { StylesConfig } from './types';

export const emptyProcessedPropsReg: CSSProcessedProps =
  new CSSProcessedProps();

function mapMixedStyleRecordToCSSProcessedPropsReg(
  processor: CSSProcessor,
  styles?: Record<string, MixedStyleDeclaration>
): Record<string, CSSProcessedProps> {
  let regStyles: Record<string, CSSProcessedProps> = {};
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
  private tagsStyles: Record<string, CSSProcessedProps>;
  private classesStyles: Record<string, CSSProcessedProps>;
  private idsStyles: Record<string, CSSProcessedProps>;
  private enableCSSInlineProcessing: boolean;
  private enableUserAgentStyles: boolean;
  private modelRegistry: HTMLModelRegistry<string>;
  constructor(
    config: Required<StylesConfig>,
    modelRegistry: HTMLModelRegistry<string>,
    cssProcessorConfig?: CSSProcessorConfig
  ) {
    this.processor = new CSSProcessor(cssProcessorConfig);
    this.modelRegistry = modelRegistry;
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
    this.enableUserAgentStyles = config.enableUserAgentStyles;
  }

  compileInlineCSS(inlineCSS: string) {
    return this.processor.compileInlineCSS(inlineCSS);
  }

  compileStyleDeclaration(styleDeclaration: MixedStyleDeclaration) {
    return this.processor.compileStyleDeclaration(styleDeclaration);
  }

  buildStyles(
    inlineStyle: string,
    parentStyles: TStyles | null,
    descriptor: TNodeDescriptor
  ): TStyles {
    const ownInlinePropsReg =
      this.enableCSSInlineProcessing && inlineStyle
        ? this.compileInlineCSS(inlineStyle)
        : null;
    const model = descriptor.tagName
      ? this.modelRegistry.getElementModelFromTagName(descriptor.tagName)
      : null;
    const userTagOwnProps =
      this.tagsStyles[descriptor.tagName as string] ?? null;
    const userIdOwnProps = this.idsStyles[descriptor.id as string] ?? null;
    const classes = descriptor.classes;
    const userClassesOwnPropsList = classes.map(
      (c) => this.classesStyles[c] || null
    );
    const dynamicPropsFromAttributes = this.enableUserAgentStyles
      ? (model?.getMixedUAStyles?.(descriptor, descriptor.domNode!) || null) ??
        model?.getUADerivedStyleFromAttributes?.(
          descriptor.attributes,
          descriptor.markers
        ) ??
        null
      : null;
    const userAgentTagProps = this.enableUserAgentStyles
      ? model?.mixedUAStyles ?? null
      : null;
    // Latest properties will override former properties.
    const mergedOwnProps = emptyProcessedPropsReg.merge(
      userAgentTagProps &&
        this.processor.compileStyleDeclaration(userAgentTagProps),
      dynamicPropsFromAttributes &&
        this.processor.compileStyleDeclaration(dynamicPropsFromAttributes),
      userTagOwnProps,
      ...userClassesOwnPropsList,
      userIdOwnProps,
      ownInlinePropsReg
    );
    return new TStyles(mergedOwnProps, parentStyles);
  }
}
