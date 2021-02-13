import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStylesMerger } from '../../styles/TStylesMerger';
import { TNodeInit } from '../TNode';

const stylesMerger = new TStylesMerger(
  defaultStylesConfig,
  new HTMLModelRegistry()
);
export const defaultInit: TNodeInit = {
  contentModel: null,
  elementModel: null,
  parentStyles: null,
  stylesMerger,
  domNode: null,
  nodeIndex: 0,
  parent: null
};
