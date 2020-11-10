import { TNode, TNodeInit } from './TNode';
import { SerializableNode } from '../dom/to-serializable';

export interface TBlockInit extends TNodeInit {
  /**
   * Opaque nodes will hold a reference to a list of DOM children.
   */
  domChildren?: SerializableNode[];
}

export class TBlock extends TNode {
  public domChildren?: SerializableNode[];
  constructor(init: TBlockInit) {
    super(init, 'block');
    if (init.domChildren) {
      this.domChildren = init.domChildren;
    }
  }
}
