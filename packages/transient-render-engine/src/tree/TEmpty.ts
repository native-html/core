import { SerializableElement } from '../dom/to-serializable';
import { TNode, TNodeInit } from './TNode';

export interface TEmptyInit extends Omit<TNodeInit, 'type'> {
  domNode: SerializableElement;
  isUnregistered: boolean;
}

export class TEmpty extends TNode {
  public domNode: SerializableElement;
  public readonly displayName = 'TEmpty';
  public readonly isUnregistered: boolean;
  constructor(init: TEmptyInit) {
    super(init, 'empty');
    this.domNode = init.domNode;
    this.isUnregistered = init.isUnregistered;
  }
}
