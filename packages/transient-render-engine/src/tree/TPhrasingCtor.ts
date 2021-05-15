import HTMLContentModel from '../model/HTMLContentModel';
import TNodeCtor, { GenericTNodeCtor, Mutable } from './TNodeCtor';
import { TNodeImpl, TNodeInit } from './tree-types';

export interface TPhrasingImpl extends TNodeImpl {}

function isChildEmpty(c: TNodeImpl) {
  return c.isEmpty();
}

const TPhrasingCtor = function TPhrasing(
  this: Mutable<TNodeImpl>,
  init: TNodeInit
) {
  this.initialize(init);
} as Function as GenericTNodeCtor<TNodeInit, TPhrasingImpl>;

//@ts-ignore
TPhrasingCtor.prototype = new TNodeCtor('phrasing', 'TPhrasing');

TPhrasingCtor.prototype.matchContentModel = function matchContentModel(
  contentModel
) {
  return (
    contentModel === HTMLContentModel.textual ||
    contentModel === HTMLContentModel.mixed
  );
};

TPhrasingCtor.prototype.isEmpty = function isEmpty() {
  // Only anonymous phrasing nodes with every children empty can be considered "empty"
  return this.tagName === null && this.children.every(isChildEmpty);
};

TPhrasingCtor.prototype.collapseChildren = function collapseChildren() {
  let previous: TNodeImpl | null = null;
  this.children.forEach((childK, k) => {
    const j = k - 1;
    childK.collapse();
    if (
      j > -1 &&
      childK.isCollapsibleLeft() &&
      (previous as TNodeImpl).isCollapsibleRight()
    ) {
      // We must trim left from current to support trimming
      // after <br> and <wbr> tags.
      childK.trimLeft();
    }
    previous = childK;
  });
  this.trimLeft();
  this.trimRight();
  return null;
};

export default TPhrasingCtor;

export { TPhrasingCtor };
