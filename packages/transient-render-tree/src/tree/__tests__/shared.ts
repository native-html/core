import { defaultStylesConfig } from '../../styles/defaults';
import { TStylesMerger } from '../../styles/TStylesMerger';

const stylesMerger = new TStylesMerger(defaultStylesConfig);
export const defaultInit = {
  parentStyles: null,
  stylesMerger
};
