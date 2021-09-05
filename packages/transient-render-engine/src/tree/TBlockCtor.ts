import HTMLContentModel from '../model/HTMLContentModel';
import TNodeCtor, { GenericTNodeCtor, Mutable } from './TNodeCtor';
import { TNodeImpl, TNodeInit } from './tree-types';

export interface TBlockImpl extends TNodeImpl {}

const TBlockCtor = function TBlock(this: Mutable<TBlockImpl>, init: TNodeInit) {
  this.initialize(init);
} as Function as GenericTNodeCtor<TNodeInit, TBlockImpl>;

//@ts-ignore
TBlockCtor.prototype = new TNodeCtor('block', 'TBlock');

TBlockCtor.prototype.matchContentModel = function matchContentModel(
  contentModel
) {
  return (
    contentModel === HTMLContentModel.block ||
    contentModel === HTMLContentModel.mixed
  );
};

TBlockCtor.prototype.collapseChildren = function collapseChildren() {
  let indexesToSplice: number[] = [];
  this.children.forEach((child, i) => {
    child.collapse();
    if (child.isEmpty()) {
      indexesToSplice.push(i);
    }
  });
  this.spliceChildren(indexesToSplice);
};

TBlockCtor.prototype.getNativeStyles = function getNativeStyles(
  this: TNodeImpl
) {
  if (this.__nativeStyles === false) {
    this.__nativeStyles = {
      ...this.styles.nativeBlockFlow,
      ...this.styles.nativeBlockRet
    };
  }
  return this.__nativeStyles;
};

export default TBlockCtor;

export { TBlockCtor };
