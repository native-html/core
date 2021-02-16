import { TStyles } from '../styles/TStyles';
import { SerializableElement } from '../dom/to-serializable';
import { TStylesMerger } from '../styles/TStylesMerger';
import HTMLContentModel from '../model/HTMLContentModel';
import { HTMLElementModel } from '..';

export interface TNodeInit {
  /**
   * Opaque nodes will hold a reference to a serializable DOM node.
   */
  domNode: SerializableElement | null;
  tagName?: string | null;
  contentModel: HTMLContentModel | null;
  elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  attributes?: Record<string, string>;
  parentStyles: TStyles | null;
  styles?: TStyles | null;
  stylesMerger: TStylesMerger;
  /**
   * The position of this element relatively to its parents, before hoisting,
   * after collapsing.
   *
   * @remarks
   * "Before hoisting" implies that this index corresponds to the node position
   * in the DOM, after suppressing empty elements as per whitespace collapsing
   * algorithm.
   */
  nodeIndex: number;
  /**
   * The parent of this node before hoisting.
   */
  parent: TNode | null;
}

export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';

function updateNodeIndexes(node: TNode, i: number) {
  //@ts-expect-error
  node.nodeIndex = i;
}

export abstract class TNode implements TNodeInit {
  public readonly type: TNodeType;
  public readonly styles: TStyles;
  public readonly attributes: Record<string, string>;
  public readonly contentModel: HTMLContentModel | null;
  public readonly elementModel: HTMLElementModel<
    string,
    HTMLContentModel
  > | null;
  public readonly children: TNode[];
  public readonly domNode: SerializableElement | null;
  public readonly tagName: string | null;
  public readonly className: string | null;
  public readonly id: string | null;
  public readonly parentStyles: TStyles | null;
  public readonly parent!: TNode | null;
  public readonly hasWhiteSpaceCollapsingEnabled: boolean;
  public readonly stylesMerger!: TStylesMerger;
  public readonly nodeIndex: number;
  public abstract readonly displayName: string;

  constructor(init: TNodeInit, type: TNodeType) {
    this.type = type;
    this.attributes = init.attributes || {};
    this.contentModel = init.contentModel;
    this.tagName = init.tagName || null;
    this.elementModel = init.elementModel;
    this.domNode = init.domNode || null;
    this.id = this.attributes.id || null;
    this.className = this.attributes.class || null;
    this.nodeIndex = init.nodeIndex;
    Object.defineProperty(this, 'stylesMerger', {
      enumerable: false,
      value: init.stylesMerger
    });
    Object.defineProperty(this, 'parent', {
      enumerable: false,
      value: init.parent
    });
    this.styles =
      init.styles ||
      init.stylesMerger.buildStyles(
        this.attributes.style,
        init.parentStyles,
        this
      );
    this.parentStyles = init.parentStyles;
    this.children = [];
    this.hasWhiteSpaceCollapsingEnabled =
      typeof this.styles.webTextFlow.whiteSpace === 'string'
        ? this.styles.webTextFlow.whiteSpace === 'normal'
        : true;
    delete this.attributes.style;
    delete this.attributes.class;
    delete this.attributes.id;
  }

  abstract matchContentModel(contentModel: HTMLContentModel): boolean;

  bindChildren(children: TNode[], shouldUpdateNodeIndexes: boolean = false) {
    // @ts-expect-error
    this.children = children;
    if (shouldUpdateNodeIndexes) {
      children.forEach(updateNodeIndexes);
    }
  }

  cloneInitParams<T extends TNodeInit = TNodeInit>(partial?: Partial<T>): T {
    return ({
      ...this,
      stylesMerger: this.stylesMerger,
      ...partial
    } as any) as T;
  }

  isCollapsibleLeft(): boolean {
    if (this.children.length) {
      return (
        this.hasWhiteSpaceCollapsingEnabled &&
        this.children[0].isCollapsibleLeft()
      );
    }
    return false;
  }

  isCollapsibleRight(): boolean {
    if (this.children.length) {
      return (
        this.hasWhiteSpaceCollapsingEnabled &&
        this.children[this.children.length - 1].isCollapsibleRight()
      );
    }
    return false;
  }

  isWhitespace(): boolean {
    return false;
  }

  isEmpty(): boolean {
    return false;
  }

  trimLeft() {
    if (this.children.length) {
      const firstChild = this.children[0];
      firstChild.trimLeft();
      if (firstChild.isEmpty()) {
        this.children.splice(0, 1);
      }
    }
  }

  trimRight() {
    if (this.children.length) {
      const lastChild = this.children[this.children.length - 1];
      lastChild.trimRight();
      if (lastChild.isEmpty()) {
        this.children.splice(-1, 1);
      }
    }
  }
}
