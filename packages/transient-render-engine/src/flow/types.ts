import { TStylesMerger } from '../styles/TStylesMerger';
import HTMLModelRegistry from '../model/HTMLModelRegistry';
import { TStyles } from '../styles/TStyles';
import { SetMarkersForTNode } from '../tree/tree-types';

export interface DataFlowParams {
  baseStyles: TStyles;
  stylesMerger: TStylesMerger;
  modelRegistry: HTMLModelRegistry<string>;
  removeLineBreaksAroundEastAsianDiscardSet: boolean;
  setMarkersForTNode?: SetMarkersForTNode;
}
