import { collapse } from './flow/collapse';
import { hoist } from './flow/hoist';
import { translateDocument } from './flow/translate';
import { TDocument } from './tree/TDocument';
import { parseDOM, ParserOptions as HTMLParserOptions } from 'htmlparser2';
import omit from 'ramda/src/omit';
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
import { DataFlowParams } from './flow/types';
import alterDOMNodes, { AlterDOMParams } from './dom/alterDOMNodes';

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
  /**
   * Remove line breaks around special east-asian characters such as defined here:
   * https://www.w3.org/TR/2020/WD-css-text-3-20200429/#line-break-transform
   *
   * @defaultValue false
   */
  readonly removeLineBreaksAroundEastAsianDiscardSet?: boolean;
  /**
   * Alter the DOM tree prior to pre-rendering.
   */
  readonly alterDOMParams?: AlterDOMParams;
}

function createStylesConfig(
  options?: TRenderEngineOptions
): Required<StylesConfig> {
  const enableUserAgentStyles =
    typeof options?.stylesConfig?.enableUserAgentStyles === 'boolean'
      ? options.stylesConfig.enableUserAgentStyles
      : defaultStylesConfig.enableUserAgentStyles;
  const baseStyle = {
    ...(enableUserAgentStyles
      ? defaultStylesConfig.baseStyle
      : omit(['fontSize'], defaultStylesConfig.baseStyle)),
    ...options?.stylesConfig?.baseStyle
  };
  return {
    ...defaultStylesConfig,
    ...options?.stylesConfig,
    baseStyle
  };
}

export class TRenderEngine {
  private htmlParserOptions: Readonly<HTMLParserOptions>;
  private dataFlowParams: DataFlowParams;
  private alterDOMParams?: AlterDOMParams;
  constructor(options?: TRenderEngineOptions) {
    const stylesConfig = createStylesConfig(options);
    const modelRegistry = new HTMLModelRegistry(options?.customizeHTMLModels);
    const userSelectedFontSize =
      options?.cssProcessorConfig?.rootFontSize ||
      stylesConfig.baseStyle?.fontSize;
    // TODO log a warning when type is string
    const stylesMerger = new TStylesMerger(stylesConfig, modelRegistry, {
      ...defaultCSSProcessorConfig,
      ...options?.cssProcessorConfig,
      rootFontSize:
        typeof userSelectedFontSize === 'number' ? userSelectedFontSize : 14
    });
    this.alterDOMParams = options?.alterDOMParams;
    this.htmlParserOptions = {
      decodeEntities: true,
      ...options?.htmlParserOptions
    };
    this.dataFlowParams = {
      stylesMerger,
      modelRegistry,
      baseStyles: new TStyles(
        stylesMerger.compileStyleDeclaration(stylesConfig.baseStyle)
      ),
      removeLineBreaksAroundEastAsianDiscardSet:
        options?.removeLineBreaksAroundEastAsianDiscardSet || false
    };
  }

  buildTTree(html: string) {
    let documentTree = parseDOM(html, this.htmlParserOptions);
    if (
      this.alterDOMParams?.ignoreDOMNode ||
      this.alterDOMParams?.alterDOMChildren ||
      this.alterDOMParams?.alterDOMData ||
      this.alterDOMParams?.alterDOMElement
    ) {
      documentTree = alterDOMNodes(documentTree, this.alterDOMParams);
    }
    const tdoc = translateDocument(documentTree, this.dataFlowParams);
    return collapse(hoist(tdoc), this.dataFlowParams) as TDocument;
  }
}
