import HTMLContentModel from '../model/HTMLContentModel';
import TNode, { TNodeCtor, Mutable } from './TNode';
import { TNodeImpl, TNodeInit } from './tree-types';

export interface TBlockImpl extends TNodeImpl {}

const TBlock = (function TBlock(this: Mutable<TBlockImpl>, init: TNodeInit) {
  this.initialize(init);
} as Function) as TNodeCtor<TNodeInit, TBlockImpl>;

//@ts-ignore
TBlock.prototype = new TNode('block', 'TBlock');

TBlock.prototype.matchContentModel = function matchContentModel(contentModel) {
  return (
    contentModel === HTMLContentModel.block ||
    contentModel === HTMLContentModel.mixed
  );
};

TBlock.prototype.collapseChildren = function collapseChildren(params) {
  let indexesToSplice: number[] = [];
  this.children.forEach((child, i) => {
    child.collapse(params);
    if (child.isEmpty()) {
      indexesToSplice.push(i);
    }
  });
  this.spliceChildren(indexesToSplice);
};

export default TBlock;

export { TBlock };
