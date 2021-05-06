import HTMLContentModel from '../model/HTMLContentModel';
import TNode, { TNodeCtor, Mutable } from './TNode';
import { TNodeImpl, TNodeInit } from './tree-types';

export interface TPhrasingImpl extends TNodeImpl {}

function isChildEmpty(c: TNodeImpl) {
  return c.isEmpty();
}

const TPhrasing = (function TPhrasing(
  this: Mutable<TNodeImpl>,
  init: TNodeInit
) {
  this.initialize(init);
} as Function) as TNodeCtor<TNodeInit, TPhrasingImpl>;

//@ts-ignore
TPhrasing.prototype = new TNode('phrasing', 'TPhrasing');

TPhrasing.prototype.matchContentModel = function matchContentModel(
  contentModel
) {
  return (
    contentModel === HTMLContentModel.textual ||
    contentModel === HTMLContentModel.mixed
  );
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
