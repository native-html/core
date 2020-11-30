import { collapse } from './flow/collapse';
import { hoist } from './flow/hoist';
import { DataFlowParams, translateDocument } from './flow/translate';
import { TDocument } from './tree/TDocument';
import { parseDOM, ParserOptions as HTMLParserOptions } from 'htmlparser2';
import {
  CSSProcessorConfig,
  defaultCSSProcessorConfig
} from '@native-html/css-processor';
import { StylesConfig } from './styles/types';
import { TStylesMerger } from './styles/TStylesMerger';
import { defaultStylesConfig } from './styles/defaults';
import { TStyles } from './styles/TStyles';
import HTMLModelRegistry from './model/HTMLModelRegistry';
import { HTMLModelRecord, TagName } from './model/model-types';
import { DefaultHTMLElementModels } from './model/defaultHTMLElementModels';

export interface TRenderEngineOptions<E extends string = never> {
  /**
   * Customization for CSS inline processing.
   */
  readonly cssProcessorConfig?: Partial<CSSProcessorConfig>;
  /**
   * Options for htmlparser2 library parser.
   */
  readonly htmlParserOptions?: Readonly<HTMLParserOptions>;
  /**
   * Various configuration for styling.
   */
  readonly stylesConfig?: StylesConfig;
  /**
   * Customize supported tags in the engine.
   *
   * @remarks If you need to add new tags, always use lowercase names.
   */
  readonly customizeHTMLModels?: (
    defaultHTMLElementModels: DefaultHTMLElementModels
  ) => HTMLModelRecord<TagName | E>;
}

export class TRenderEngine {
  private htmlParserOptions: Readonly<HTMLParserOptions>;
  private dataFlowParams: DataFlowParams;
  constructor(options?: TRenderEngineOptions) {
    const baseStyle = {
      ...defaultStylesConfig.baseStyle,
      ...options?.stylesConfig?.baseStyle
    };
    const modelRegistry = new HTMLModelRegistry(options?.customizeHTMLModels);
    const userSelectedFontSize =
      options?.cssProcessorConfig?.rootFontSize || baseStyle.fontSize;
    // TODO log a warning when type is string
    const rootFontSize =
      typeof userSelectedFontSize === 'number' ? userSelectedFontSize : 14;
    const stylesConfig = {
      ...defaultStylesConfig,
      ...options?.stylesConfig,
      baseStyle
    };
    if (stylesConfig.enableUserAgentStyles) {
      stylesConfig.baseStyle.fontSize = rootFontSize;
    }
    const stylesMerger = new TStylesMerger(stylesConfig, modelRegistry, {
      ...defaultCSSProcessorConfig,
      ...options?.cssProcessorConfig,
      rootFontSize
    });
    this.htmlParserOptions = {
      decodeEntities: true,
      ...options?.htmlParserOptions
    };
    this.dataFlowParams = {
      stylesMerger,
      modelRegistry,
      baseStyles: new TStyles(
        stylesMerger.compileStyleDeclaration(stylesConfig.baseStyle)
      )
    };
  }

  buildTTree(html: string) {
    const documentTree = parseDOM(html, this.htmlParserOptions);
    const tdoc = translateDocument(documentTree, this.dataFlowParams);
    return collapse(hoist(tdoc)) as TDocument;
  }
}
