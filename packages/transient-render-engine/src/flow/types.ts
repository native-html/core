import { TStylesMerger } from '../styles/TStylesMerger';
import HTMLModelRegistry from '../model/HTMLModelRegistry';
import { TStyles } from '../styles/TStyles';

export interface DataFlowParams {
  baseStyles: TStyles;
  stylesMerger: TStylesMerger;
  modelRegistry: HTMLModelRegistry<string>;
  removeLineBreaksAroundEastAsianDiscardSet: boolean;
}
