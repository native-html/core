import { TNode, TNodeInit } from './TNode';
import { SerializableElement } from '../dom/to-serializable';
import HTMLContentModel from '../model/HTMLContentModel';

export interface TBlockInit extends TNodeInit {}

export class TBlock extends TNode {
  public domNode?: SerializableElement;
  public readonly displayName: string = 'TBlock';
  constructor(init: TBlockInit) {
    super(init, 'block');
    if (init.domNode) {
      this.domNode = init.domNode;
    }
  }

  matchContentModel(contentModel: HTMLContentModel) {
    return (
      contentModel === HTMLContentModel.block ||
      contentModel === HTMLContentModel.mixed
    );
  }
}
