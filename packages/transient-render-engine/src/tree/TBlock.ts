import { TNode, TNodeInit } from './TNode';
import { SerializableNode } from '../dom/to-serializable';
import HTMLContentModel from '../model/HTMLContentModel';

export interface TBlockInit extends TNodeInit {}

export class TBlock extends TNode {
  public domChildren?: SerializableNode[];
  public readonly displayName: string = 'TBlock';
  constructor(init: TBlockInit) {
    super(init, 'block');
    if (init.domChildren) {
      this.domChildren = init.domChildren;
    }
  }

  matchContentModel(contentModel: HTMLContentModel) {
    return (
      contentModel === HTMLContentModel.block ||
      contentModel === HTMLContentModel.mixed
    );
  }
}