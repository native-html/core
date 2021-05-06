import HTMLContentModel from '../model/HTMLContentModel';
import { DOMElement } from '../dom/dom-utils';
import { TNodeImpl, TNodeInit } from './tree-types';
import TNodeCtor, { GenericTNodeCtor, Mutable } from './TNodeCtor';

export interface TEmptyImpl extends TNodeImpl<TEmptyInit> {
  readonly domNode: DOMElement;
  readonly isUnregistered: boolean;
}

export interface TEmptyInit extends TNodeInit {
  domNode: DOMElement;
  isUnregistered: boolean;
}

const TEmptyCtor = (function TEmpty(
  this: Mutable<TEmptyImpl>,
  init: TEmptyInit
) {
  this.initialize(init);
} as Function) as GenericTNodeCtor<TEmptyInit, TEmptyImpl>;

//@ts-ignore
TEmptyCtor.prototype = new TNodeCtor('empty', 'TEmpty', {
  isUnregistered: {
    get(this: TEmptyImpl) {
      return this.init.isUnregistered;
    }
  }
});

TEmptyCtor.prototype.matchContentModel = function matchContentModel(
  contentModel: HTMLContentModel
) {
  return contentModel === HTMLContentModel.none;
};

export default TEmptyCtor;

export { TEmptyCtor };
