import { DOMElement } from '../dom/dom-utils';
import HTMLContentModel from '../model/HTMLContentModel';
import { TNode, TNodeInit } from './TNode';

export interface TEmptyInit extends Omit<TNodeInit, 'type'> {
  domNode: DOMElement;
  isUnregistered: boolean;
}

export class TEmpty extends TNode {
  public domNode: DOMElement;
  public readonly displayName = 'TEmpty';
  public readonly isUnregistered: boolean;
  constructor(init: TEmptyInit) {
    super(init, 'empty');
    this.domNode = init.domNode;
    this.isUnregistered = init.isUnregistered;
  }

  matchContentModel(contentModel: HTMLContentModel) {
    return contentModel === HTMLContentModel.none;
  }
}
