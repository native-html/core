import { TStyles } from '../styles/TStyles';
import { SerializableNode } from '../dom/to-serializable';
import { TStylesMerger } from '../styles/TStylesMerger';

export interface TNodeInit {
  /**
   * Opaque nodes will hold a reference to a list of DOM children.
   */
  domChildren?: SerializableNode[];
  tagName?: string | null;
  attributes?: Record<string, string>;
  parentStyles: TStyles | null;
  styles?: TStyles;
  stylesMerger: TStylesMerger;
}
export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';
export abstract class TNode implements TNodeInit {
  public readonly type: TNodeType;
  public readonly styles: TStyles;
  public readonly attributes: Record<string, string>;
  public readonly children: TNode[];
  public readonly domChildren?: SerializableNode[];
  public readonly tagName: string | null;
  public readonly className: string | null;
  public readonly id: string | null;
  public readonly isAnchor: boolean;
  public readonly parentStyles: TStyles | null;
  public readonly hasWhiteSpaceCollapsingEnabled: boolean;
  public readonly stylesMerger!: TStylesMerger;

  constructor(init: TNodeInit, type: TNodeType) {
    this.type = type;
    this.attributes = init.attributes || {};
    this.isAnchor = false;
    this.tagName = init.tagName || null;
    this.id = this.attributes.id || null;
    this.className = this.attributes.class || null;
    Object.defineProperty(this, 'stylesMerger', {
      enumerable: false,
      value: init.stylesMerger
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

  bindChildren(children: TNode[]) {
    // @ts-ignore
    this.children = children;
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
