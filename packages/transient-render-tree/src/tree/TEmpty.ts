import { SerializableElement } from '../dom/to-serializable';
import { TNode, TNodeInit } from './TNode';

export interface TEmptyInit extends Omit<TNodeInit, 'type'> {
  domNode: SerializableElement;
}

export class TEmpty extends TNode {
  public domNode: SerializableElement;
  constructor(init: TEmptyInit) {
    super(init, 'empty');
    this.domNode = init.domNode;
  }
}
