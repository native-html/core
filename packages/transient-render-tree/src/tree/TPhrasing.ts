import { TBlock } from './TBlock';
import { TNode, TNodeInit } from './TNode';

export interface TPhrasingInit extends TNodeInit {}

export class TPhrasing extends TNode {
  constructor(init: TPhrasingInit) {
    super(init, 'phrasing');
  }

  protected emptyParams<T = {}>(other?: T): Partial<TNodeInit> & T {
    return {
      tagName: null,
      attributes: {},
      ...other
    } as any;
  }

  /**
   * Create a new empty instance of this node.
   * This instance should have empty children, tagName set to null, no styles nor attributes.
   */
  newEmpty(): TPhrasing {
    return new TPhrasing(this.cloneInitParams(this.emptyParams()));
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
    return new TBlock(this.cloneInitParams());
  }
}
