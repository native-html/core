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

export interface TRenderEngineOptions {
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
}

export class TRenderEngine {
  private htmlParserOptions: Readonly<HTMLParserOptions>;
  private dataFlowParams: DataFlowParams;
  constructor(options?: TRenderEngineOptions) {
    const baseStyle = {
      ...defaultStylesConfig.baseStyle,
      ...options?.stylesConfig?.baseStyle
    };
    const userSelectedFontSize =
      options?.cssProcessorConfig?.rootFontSize || baseStyle.fontSize;
    // TODO log a warning when type is string
    const rootFontSize =
      typeof userSelectedFontSize === 'number' ? userSelectedFontSize : 14;
    baseStyle.fontSize = rootFontSize;
    const stylesConfig = {
      ...defaultStylesConfig,
      ...options?.stylesConfig,
      baseStyle
    };
    const stylesMerger = new TStylesMerger(stylesConfig, {
      ...defaultCSSProcessorConfig,
      ...options?.cssProcessorConfig,
      rootFontSize
    });
    this.htmlParserOptions = {
      decodeEntities: true,
      ...options?.htmlParserOptions
    };
    this.dataFlowParams = {
      stylesMerger: stylesMerger,
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
