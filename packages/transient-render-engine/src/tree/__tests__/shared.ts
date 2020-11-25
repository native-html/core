import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStylesMerger } from '../../styles/TStylesMerger';

const stylesMerger = new TStylesMerger(
  defaultStylesConfig,
  new HTMLModelRegistry()
);
export const defaultInit = {
  contentModel: null,
  elementModel: null,
  parentStyles: null,
  stylesMerger
};
