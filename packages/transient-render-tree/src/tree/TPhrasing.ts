import { TBlock } from './TBlock';
import { TNode, TNodeInit } from './TNode';

export interface TPhrasingInit extends TNodeInit {}

export class TPhrasing extends TNode implements TPhrasingInit {
  constructor(init: TPhrasingInit) {
    super(init, 'phrasing');
  }

  newEmpty(): TPhrasing {
    return new TPhrasing({});
  }

  isWhitespace() {
    return this.children.every((c) => c.isWhitespace());
  }

  isEmpty() {
    return this.children.every((c) => c.isEmpty());
  }

  toBlock() {
    this.trimLeft();
    this.trimRight();
    return new TBlock(this);
  }
}
