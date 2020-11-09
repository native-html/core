export interface TNodeInit {
  children?: TNode[];
  tagName?: string | null;
  attributes?: Record<string, string>;
}
export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';
export abstract class TNode implements Required<TNodeInit> {
  public type: TNodeType;
  public attributes: Record<string, string>;
  public children: TNode[];
  public tagName: string | null;
  public isAnchor: boolean;

  constructor(init: TNodeInit, type: TNodeType) {
    this.type = type;
    this.attributes = init.attributes || {};
    this.children = init.children || [];
    this.isAnchor = false;
    this.tagName = init.tagName || null;
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
