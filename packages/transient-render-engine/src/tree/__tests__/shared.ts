import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStylesMerger } from '../../styles/TStylesMerger';
import { TNodeInit } from '../tree-types';

const stylesMerger = new TStylesMerger(
  defaultStylesConfig,
  new HTMLModelRegistry()
);
export const defaultInit: TNodeInit = {
  elementModel: null,
  context: { stylesMerger, removeLineBreaksAroundEastAsianDiscardSet: false }
};
