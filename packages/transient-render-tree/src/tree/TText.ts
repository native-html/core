import { TNode, TNodeInit } from './TNode';

export interface TTextInit
  extends Omit<TNodeInit, 'bindChildren' | 'parentStyles'> {
  data: string;
}

export class TText extends TNode {
  public data: string;
  constructor(init: TTextInit) {
    // Text node don't inherit flowed style properties,
    // since inheritance will be handled by React Native engine.
    // TODO test
    super({ ...init, parentStyles: null }, 'text');
    this.data = init.data;
  }

  isCollapsibleLeft(): boolean {
    return !this.isEmpty() && this.data[0] === ' ';
  }

  isCollapsibleRight(): boolean {
    return !this.isEmpty() && this.data[this.data.length - 1] === ' ';
  }

  isWhitespace() {
    return this.data === ' ';
  }

  isEmpty() {
    return !this.data.length;
  }

  trimLeft() {
    this.data = this.data.slice(1);
  }

  trimRight() {
    this.data = this.data.substr(0, this.data.length - 1);
  }
}
