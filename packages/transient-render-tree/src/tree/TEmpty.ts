import { SerializableNode } from '../dom/serializer';
import { TNode, TNodeInit } from './TNode';

export interface TEmptyInit extends Omit<TNodeInit, 'type'> {
  domNode?: SerializableNode | null;
}

export class TEmpty extends TNode {
  public domNode: SerializableNode | null;
  constructor(init: TEmptyInit) {
    super(init, 'empty');
    this.domNode = init.domNode || null;
  }
}
