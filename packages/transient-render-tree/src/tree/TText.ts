import { TNode, TNodeInit } from './TNode';

export interface TTextInit extends TNodeInit {
  data: string;
}

export class TText extends TNode implements TTextInit {
  public data: string;
  constructor(init: TTextInit) {
    super(init, 'text');
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
