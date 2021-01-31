import { TNode, TNodeInit } from './TNode';
import HTMLContentModel from '../model/HTMLContentModel';

export interface TBlockInit extends TNodeInit {}

export class TBlock extends TNode {
  public readonly displayName: string = 'TBlock';
  constructor(init: TBlockInit) {
    super(init, 'block');
  }

  matchContentModel(contentModel: HTMLContentModel) {
    return (
      contentModel === HTMLContentModel.block ||
      contentModel === HTMLContentModel.mixed
    );
  }
}
