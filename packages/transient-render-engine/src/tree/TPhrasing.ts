import HTMLContentModel from '../model/HTMLContentModel';
import makeTNodePrototype, {
  TNodeCtor,
  Mutable,
  initialize
} from './makeTNodePrototype';
import { TNodeImpl, TNodeInit, TNodeShape } from './tree-types';

export interface TPhrasingImpl extends TNodeImpl {}

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

TPhrasing.prototype.isWhitespace = function isWhitespace() {
  return this.children.every(isChildWhitespace);
};

TPhrasing.prototype.isEmpty = function isEmpty() {
  // Only anonymous phrasing nodes with every children empty can be considered "empty"
  return this.tagName === null && this.children.every(isChildEmpty);
};

TPhrasing.prototype.collapseChildren = function collapseChildren(params) {
  let previous: TNodeImpl | null = null;
  let indexesToSplice: number[] = [];
  this.children.forEach((childK, k) => {
    const j = k - 1;
    childK.collapse(params);
    if (
      j > -1 &&
      childK.isCollapsibleLeft() &&
      (previous as TNodeImpl).isCollapsibleRight()
    ) {
      (previous as TNodeImpl).trimRight();
      if (previous!.isEmpty()) {
        indexesToSplice.push(j);
      }
    }
    previous = childK;
  });
  this.spliceChildren(indexesToSplice);
  this.trimLeft();
  this.trimRight();
  return null;
};

export default TPhrasing;

export { TPhrasing };
