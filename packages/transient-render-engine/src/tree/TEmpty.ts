import HTMLContentModel from '../model/HTMLContentModel';
import makeTNodePrototype, {
  TNodeCtor,
  Mutable,
  initialize
} from './makeTNodePrototype';
import { DOMElement } from '../dom/dom-utils';
import { TNodeImpl, TNodeInit, TNodeShape } from './tree-types';

export interface TEmptyImpl extends TNodeImpl<TEmptyInit> {
  domNode: DOMElement;
  isUnregistered: boolean;
}

export interface TEmptyInit extends TNodeInit {
  domNode: DOMElement;
  isUnregistered: boolean;
}

interface TEmpty extends TNodeShape {}

const TEmpty = (function TEmpty(this: Mutable<TEmptyImpl>, init: TEmptyInit) {
  initialize(this, init);
} as Function) as TNodeCtor<TEmptyInit, TEmptyImpl>;

TEmpty.prototype = makeTNodePrototype('empty', 'TEmpty', {
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
