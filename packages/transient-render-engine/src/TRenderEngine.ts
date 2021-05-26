import { collapse } from './flow/collapse';
import { hoist } from './flow/hoist';
import { translateDocument } from './flow/translate';
import { ParserOptions as HTMLParserOptions } from 'htmlparser2';
import omit from 'ramda/src/omit';
import {
  CSSProcessorConfig,
  defaultCSSProcessorConfig
} from '@native-html/css-processor';
import parseDocument from './dom/parseDocument';
import { StylesConfig } from './styles/types';
import { TStylesMerger } from './styles/TStylesMerger';
import { defaultStylesConfig } from './styles/defaults';
import { TStyles } from './styles/TStyles';
import HTMLModelRegistry from './model/HTMLModelRegistry';
import { HTMLModelRecord, TagName } from './model/model-types';
import { DefaultHTMLElementModelsStatic } from './model/defaultHTMLElementModels';
import { DataFlowParams } from './flow/types';
import {
  Document,
  Element,
  Node,
  NodeWithChildren,
  isDomElement
} from './dom/dom-utils';
import { SetMarkersForTNode, TDocument } from './tree/tree-types';
import { DomHandlerOptions, DomVisitorCallbacks } from './dom/DomHandler';

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
    defaultHTMLElementModels: DefaultHTMLElementModelsStatic
  ) => HTMLModelRecord<TagName | E>;
  /**
   * Remove line breaks around special east-asian characters such as defined here:
   * https://www.w3.org/TR/2020/WD-css-text-3-20200429/#line-break-transform
   *
   * @defaultValue false
   */
  readonly removeLineBreaksAroundEastAsianDiscardSet?: boolean;
  /**
   * A list of tags which should not be included in the DOM.
   */
  readonly ignoredDomTags?: string[];

  /**
   * An object which callbacks will be invoked when a DOM element or text node
   * has been parsed and its children attached.
   *
   * @remark Each callback is applied during parsing, thus with very little
   * overhead. However, it means that one node next siblings won't be
   * available. If you need some siblings logic, apply this logic to the
   * children of this node.
   */
  readonly domVisitors?: DomVisitorCallbacks;

  /**
   * Ignore specific DOM nodes.
   *
   * **Warning**: when this function is invoked, the node has not yet been
   * attached to its parent or siblings. Use the second argument (`parent`)
   * if you need to perform logic based on parent.
   *
   * @remarks The function is applied during parsing, thus with very little
   * overhead. However, it means that one node next siblings won't be
   * available.
   *
   * @returns `true` if this node should not be included in the DOM, anything
   * else otherwise.
   */
  readonly ignoreDomNode?: (
    node: Node,
    parent: NodeWithChildren
  ) => boolean | void | unknown;

  /**
   * Select the DOM root before TTree generation. For example, you could
   * iterate over children until you reach an article element and return this
   * element.
   *
   * @remarks Applied after DOM parsing, before normalization and TTree
   * construction. Before normalization implies that a body will be added in
   * the tree **after** selecting root.
   */
  readonly selectDomRoot?: (node: NodeWithChildren) => any;

  /**
   * Customize markers logic by extracting markers from TNode properties such
   * as classes, ids, attributes, tagName ...
   *
   * @remarks If you are using JavaScript, you can use module augmentation and
   * declaration merging to add properties to the {@link Markers} shape.
   */
  readonly setMarkersForTNode?: SetMarkersForTNode;

  /**
   * Disable hoisting. Note that your layout might break!
   */
  readonly dangerouslyDisableHoisting?: boolean;
  /**
   * Disable whitespace collapsing. Especially useful if your html is
   * being pre-processed server-side with a minifier.
   */
  readonly dangerouslyDisableWhitespaceCollapsing?: boolean;
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

/**
 * The Transient Render Engine.
 *
 * @public
 */
export class TRenderEngine {
  private htmlParserOptions: Readonly<HTMLParserOptions & DomHandlerOptions>;
  private dataFlowParams: DataFlowParams;
  private hoistingEnabled: boolean;
  private whitespaceCollapsingEnabled: boolean;
  private selectDomRoot: TRenderEngineOptions['selectDomRoot'];
  constructor(options?: TRenderEngineOptions) {
    const stylesConfig = createStylesConfig(options);
    this.hoistingEnabled = !(options?.dangerouslyDisableHoisting ?? false);
    this.whitespaceCollapsingEnabled = !(
      options?.dangerouslyDisableWhitespaceCollapsing ?? false
    );
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
    this.htmlParserOptions = {
      decodeEntities: true,
      lowerCaseTags: true,
      ignoredTags: options?.ignoredDomTags,
      ignoreNode: options?.ignoreDomNode,
      visitors: options?.domVisitors,
      ...options?.htmlParserOptions
    };
    this.dataFlowParams = {
      stylesMerger,
      modelRegistry,
      setMarkersForTNode: options?.setMarkersForTNode,
      baseStyles: new TStyles(
        stylesMerger.compileStyleDeclaration(stylesConfig.baseStyle)
      ),
      removeLineBreaksAroundEastAsianDiscardSet:
        options?.removeLineBreaksAroundEastAsianDiscardSet || false
    };
    this.selectDomRoot = options?.selectDomRoot;
  }

  private normalizeDocument(document: Document) {
    let body: Element | undefined;
    let head: Element | undefined;
    for (const child of document.children) {
      if (body && head) {
        break;
      }
      if (isDomElement(child) && child.tagName === 'body') {
        body = child;
      }
      if (isDomElement(child) && child.tagName === 'head') {
        head = child;
      }
    }
    //@ts-ignore
    if (!body && !head) {
      body = new Element('body', {});
      body.childNodes = document.children;
      document.children.forEach((c) => {
        c.parent = body as Element;
        c.parentNode = body as Element;
      });
      body.parent = document;
      body.parentNode = document;
      document.childNodes = [body];
    }
    return document;
  }

  parseDocument(html: string) {
    let document = parseDocument(html, this.htmlParserOptions);
    if (this.selectDomRoot) {
      const selected = this.selectDomRoot(document) as Document;
      if (selected && selected !== document) {
        document.childNodes = [selected];
        selected.parent = document;
      }
    }
    for (const child of document.children) {
      if (isDomElement(child) && child.tagName === 'html') {
        document = child;
        break;
      }
    }
    return this.normalizeDocument(document);
  }

  buildTTreeFromDoc(document: Document | Element): TDocument {
    const tdoc = translateDocument(document, this.dataFlowParams);
    const hoistedTDoc = this.hoistingEnabled ? hoist(tdoc) : tdoc;
    const collapsedTDoc = this.whitespaceCollapsingEnabled
      ? collapse(hoistedTDoc)
      : tdoc;
    return collapsedTDoc as unknown as TDocument;
  }

  buildTTree(html: string): TDocument {
    return this.buildTTreeFromDoc(this.parseDocument(html));
  }

  getHTMLElementsModels() {
    return this.dataFlowParams.modelRegistry.modelRecords;
  }
}
