import HTMLContentModel from '../model/HTMLContentModel';
import makeTNodePrototype, {
  TNodeCtor,
  Mutable,
  initialize
} from './makeTNodePrototype';
import { TNodeImpl, TNodeInit, TNodeShape } from './tree-types';

interface TBlock extends TNodeShape {}

export interface TBlockImpl extends TNodeImpl {}

const TBlock = (function TBlock(this: Mutable<TBlockImpl>, init: TNodeInit) {
  initialize(this, init);
} as Function) as TNodeCtor<TNodeInit, TBlockImpl>;

TBlock.prototype = makeTNodePrototype('block', 'TBlock');

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
