import { DOMElement } from '../dom/dom-utils';
import { DataFlowParams } from '../flow/types';
import HTMLContentModel from '../model/HTMLContentModel';
import HTMLElementModel from '../model/HTMLElementModel';
import { TStyles } from '../styles/TStyles';
import { TStylesMerger } from '../styles/TStylesMerger';

export interface TNodeInit {
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly stylesMerger: TStylesMerger;
  readonly parent?: TNodeShape | null;
  readonly domNode?: DOMElement | null;
  readonly styles?: TStyles | null;
  readonly parentStyles?: TStyles | null;
  readonly nodeIndex?: number;
}

export interface TNodeDerivedFields {
  readonly attributes: Record<string, string>;
  readonly parentStyles: TStyles | null;
  readonly stylesMerger: TStylesMerger;
  readonly contentModel: HTMLContentModel | null;
  readonly id: string | null;
  readonly classes: string[];
  /**
   * Opaque nodes will hold a reference to a serializable DOM node.
   */
  readonly domNode: DOMElement | null;
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly styles: TStyles;
  readonly tagName: string | null;
  /**
   * The parent of this node before hoisting.
   */
  readonly parent: TNodeShape | null;
  readonly nodeIndex: number;
}

export interface TNodeShape extends TNodeDerivedFields {
  /**
   * The position of this element relatively to its parents, before hoisting,
   * after collapsing.
   *
   * @remarks
   * "Before hoisting" implies that this index corresponds to the node position
   * in the DOM, after suppressing empty elements as per whitespace collapsing
   * algorithm.
   */
  readonly nodeIndex: number;

  /**
   * Children of this node.
   */
  readonly children: ReadonlyArray<TNodeShape>;

  /**
   * Used for debugging purposes.
   */
  readonly displayName: string;
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
  isWhitespace(this: TNodeImpl): boolean;
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
}

export interface TNodeInvariants {
  readonly type: TNodeType;
  readonly displayName: string;
}

export interface TNodeImpl<T = TNodeInit>
  extends TNodeMethods,
    TNodeDerivedFields,
    TNodeInvariants,
    TNodeShape {
  __nodeIndex: number | null;
  __trimmedLeft: boolean;
  __trimmedRight: boolean;
  readonly children: ReadonlyArray<TNodeImpl>;
  readonly init: T;
  readonly hasWhiteSpaceCollapsingEnabled: boolean;
}
