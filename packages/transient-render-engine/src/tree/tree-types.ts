import { DOMElement, DOMText } from '../dom/dom-utils';
import { DataFlowParams } from '../flow/types';
import HTMLContentModel from '../model/HTMLContentModel';
import HTMLElementModel from '../model/HTMLElementModel';
import { TStylesShape } from '../styles/TStyles';
import { TStylesMerger } from '../styles/TStylesMerger';

export interface TNodeInit {
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly stylesMerger: TStylesMerger;
  readonly parent?: TNodeImpl | null;
  readonly domNode?: DOMElement | null;
  readonly styles?: TStylesShape | null;
  readonly parentStyles?: TStylesShape | null;
  readonly nodeIndex?: number;
  readonly isUnregistered?: boolean;
}

/**
 * @public
 */
export interface TNodePrintOptions {
  withStyles: boolean;
  withNodeIndex: boolean;
}

/**
 * @public
 */
export interface TNodeShape {
  /**
   * Attributes for this tag.
   */
  readonly attributes: Record<string, string>;
  /**
   * The id for this node, extracted from the id attribute of the
   * underlying DOMNode.
   */
  readonly id: string | null;
  /**
   * A list of classes for this node, extracted from the class attribute of the
   * underlying DOMNode.
   */
  readonly classes: string[];
  /**
   * Non-anonymous nodes will hold a reference to a DOM node.
   */
  readonly domNode: DOMElement | null;
  /**
   * Styles for this node, organized in categories.
   *
   * See {@link TStylesShape}.
   */
  readonly styles: TStylesShape;
  /**
   * The tag name for this node.
   *
   * @remarks Anonymous nodes generated during hoisting won't have a tag name.
   * Also, some TText nodes don't have a tagName.
   */
  readonly tagName: string | null;
  /**
   * The parent of this node before hoisting.
   *
   * @remarks
   * "Before hoisting" implies that this parent will not match "anonymous"
   * parents.
   */
  readonly parent: TDocument | TBlock | TPhrasing | null;
  /**
   * The position of this element relatively to its parents, before hoisting,
   * after collapsing.
   *
   * @remarks
   * "Before hoisting" implies that this index corresponds to the node position
   * in the DOM, after removal of empty elements as per whitespace collapsing
   * algorithm.
   */
  readonly nodeIndex: number;
  /**
   * Children of this node.
   */
  readonly children: ReadonlyArray<TNode>;

  /**
   * Used for debugging purposes.
   */
  readonly displayName: string;

  /**
   * The type of this tnode.
   */
  readonly type: TNodeType;

  /**
   * `true` when this tag is not a valid HTML tag **and** there is no custom
   * renderer for this tag.
   */
  readonly isUnregistered: boolean;
  /**
   * Create a JSX string representation of this node and its children.
   *
   * @remarks The snapshot is _just_ a representation. For example, it will
   * print `href` as an attribute of the TNode, while if you want to access
   * `href` programatically, you'll need to access it via
   * `tnode.attributes.href`.
   *
   * @param options - Customize what should be displayed.
   */
  snapshot(options?: Partial<TNodePrintOptions>): string;

  /**
   * Test if the given content model matches this TNode content model.
   *
   * @param contentModel - The content model to test against.
   */
  matchContentModel(contentModel: HTMLContentModel): boolean;
}

export interface DocumentContext {
  charset: string;
  baseHref: string;
  baseTarget: '_blank' | '_self' | '_parent' | '_top';
  lang: string;
  dir: 'ltr' | 'rtl';
  title: string;
  meta: { name: string; value: string }[];
  links: Record<string, string>[];
}

export type TNode = TBlock | TDocument | TEmpty | TPhrasing | TText;

export interface TBlock extends TNodeShape {
  readonly type: 'block';
  readonly tagName: string;
  readonly domNode: DOMElement;
}

export interface TDocument extends TNodeShape {
  /**
   * An object containing special information for this document, such as lang,
   * dir, charset, baseHref...
   */
  readonly context: Readonly<DocumentContext>;
  readonly type: 'document';
}

export interface TEmpty extends TNodeShape {
  readonly type: 'empty';
  readonly domNode: DOMElement;
}

export interface TPhrasing extends TNodeShape {
  readonly type: 'phrasing';
}

export interface TText extends TNodeShape {
  readonly data: string;
  readonly type: 'text';
  readonly textNode: DOMText;
}

export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';

export interface TNodeMethods {
  bindChildren(
    this: TNodeImpl,
    children: ReadonlyArray<TNodeImpl>,
    shouldUpdateNodeIndexes?: boolean
  ): void;
  cloneInitParams<T extends TNodeInit = TNodeInit>(
    this: TNodeImpl,
    partial?: Partial<T>
  ): T;
  isCollapsibleLeft(this: TNodeImpl): boolean;
  isCollapsibleRight(this: TNodeImpl): boolean;
  isEmpty(this: TNodeImpl): boolean;
  trimLeft(this: TNodeImpl): void;
  trimRight(this: TNodeImpl): void;
  matchContentModel(contentModel: HTMLContentModel): boolean;
  collapse(this: TNodeImpl, params: DataFlowParams): void;
  /**
   * Collpase this node children.
   *
   * @param params
   * @returns A list of indexes to splice
   */
  collapseChildren(this: TNodeImpl, params: DataFlowParams): void;
  spliceChildren(this: TNodeImpl, indexes: number[]): void;
  snapshot(options?: Partial<TNodePrintOptions>): string;
  toString(): string;
  initialize(init: TNodeInit): void;
}

export interface TNodeImpl<T = TNodeInit>
  extends TNodeMethods,
    Omit<TNodeShape, 'children'> {
  __nodeIndex: number | null;
  __trimmedLeft: boolean;
  __trimmedRight: boolean;
  readonly children: ReadonlyArray<TNodeImpl>;
  readonly init: T;
  readonly hasWhiteSpaceCollapsingEnabled: boolean;
  readonly parentStyles: TStylesShape | null;
  readonly stylesMerger: TStylesMerger;
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly contentModel: HTMLContentModel | null;
}
