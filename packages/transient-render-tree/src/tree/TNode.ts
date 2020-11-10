import { TStyles } from '../TStyles';
import { SerializableNode } from '../dom/to-serializable';

export interface TNodeInit {
  /**
   * Opaque nodes will hold a reference to a list of DOM children.
   */
  domChildren?: SerializableNode[];
  tagName?: string | null;
  attributes?: Record<string, string>;
  parentStyles: TStyles | null;
}
export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';
export abstract class TNode implements TNodeInit {
  public type: TNodeType;
  public styles: TStyles;
  public attributes: Record<string, string>;
  public children: TNode[];
  public domChildren?: SerializableNode[];
  public tagName: string | null;
  public isAnchor: boolean;
  public parentStyles: TStyles | null;

  constructor(init: TNodeInit, type: TNodeType) {
    this.type = type;
    this.attributes = init.attributes || {};
    this.isAnchor = false;
    this.tagName = init.tagName || null;
    const rawStyles = this.attributes.style;
    this.attributes.style && delete this.attributes.style;
    this.styles = new TStyles(rawStyles, init.parentStyles);
    this.parentStyles = init.parentStyles;
    this.children = [];
  }

  bindChildren(children: TNode[]) {
    this.children = children;
  }

  cloneInitParams<T extends TNodeInit = TNodeInit>(partial?: Partial<T>): T {
    return ({
      ...this,
      ...partial
    } as any) as T;
  }

  isCollapsibleLeft(): boolean {
    if (this.children.length) {
      return this.children[0].isCollapsibleLeft();
    }
    return false;
  }

  isCollapsibleRight(): boolean {
    if (this.children.length) {
      return this.children[this.children.length - 1].isCollapsibleRight();
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
