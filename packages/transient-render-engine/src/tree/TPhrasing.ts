import HTMLContentModel from '../model/HTMLContentModel';
import makeTNodePrototype, {
  TNodeCtor,
  Mutable,
  initialize
} from './makeTNodePrototype';
import { TNodeImpl, TNodeInit, TNodeShape } from './tree-types';

export interface TPhrasingImpl extends TNodeImpl {
  newEmpty(): TPhrasingImpl;
  emptyParams<T = {}>(): Partial<TNodeInit> & T;
}

function isChildEmpty(c: TNodeImpl) {
  return c.isEmpty();
}

function isChildWhitespace(c: TNodeImpl) {
  return c.isWhitespace();
}

interface TPhrasing extends TNodeShape {}

const TPhrasing = (function TPhrasing(
  this: Mutable<TNodeImpl>,
  init: TNodeInit
) {
  initialize(this, init);
} as Function) as TNodeCtor<TNodeInit, TPhrasingImpl>;

TPhrasing.prototype = makeTNodePrototype('phrasing', 'TPhrasing');

TPhrasing.prototype.matchContentModel = function matchContentModel(
  contentModel
) {
  return (
    contentModel === HTMLContentModel.textual ||
    contentModel === HTMLContentModel.mixed
  );
};

TPhrasing.prototype.newEmpty = function newEmpty(this: TPhrasingImpl) {
  return new TPhrasing(this.cloneInitParams(this.emptyParams()));
};

TPhrasing.prototype.emptyParams = function emptyParams(
  this: TPhrasingImpl,
  other?: any
) {
  return Object.assign({}, other, { domNode: null });
};

TPhrasing.prototype.isWhitespace = function isWhitespace() {
  return this.children.every(isChildWhitespace);
};

TPhrasing.prototype.isEmpty = function isEmpty() {
  // Only anonymous phrasing nodes with every children empty can be considered "empty"
  return this.tagName === null && this.children.every(isChildEmpty);
};

TPhrasing.prototype = Object.freeze(TPhrasing.prototype);

export default TPhrasing;

export { TPhrasing };
