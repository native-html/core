import HTMLContentModel from '../model/HTMLContentModel';
import { DOMElement } from '../dom/dom-utils';
import { TNodeImpl, TNodeInit } from './tree-types';
import TNode, { TNodeCtor, Mutable } from './TNode';

export interface TEmptyImpl extends TNodeImpl<TEmptyInit> {
  readonly domNode: DOMElement;
  readonly isUnregistered: boolean;
}

export interface TEmptyInit extends TNodeInit {
  domNode: DOMElement;
  isUnregistered: boolean;
}

const TEmpty = (function TEmpty(this: Mutable<TEmptyImpl>, init: TEmptyInit) {
  this.initialize(init);
} as Function) as TNodeCtor<TEmptyInit, TEmptyImpl>;

//@ts-ignore
TEmpty.prototype = new TNode('empty', 'TEmpty', {
  isUnregistered: {
    get(this: TEmptyImpl) {
      return this.init.isUnregistered;
    }
  }
});

TEmpty.prototype.matchContentModel = function matchContentModel(
  contentModel: HTMLContentModel
) {
  return contentModel === HTMLContentModel.none;
};

export default TEmpty;

export { TEmpty };
