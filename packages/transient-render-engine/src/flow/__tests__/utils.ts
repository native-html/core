import { parseDOM } from 'htmlparser2';
import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStyles } from '../../styles/TStyles';
import { TStylesMerger } from '../../styles/TStylesMerger';
import { TNodeImpl, TNodeInit } from '../../tree/tree-types';
import { translateNode } from '../translate';
import { DataFlowParams } from '../types';

export const defaultModelRegistry = new HTMLModelRegistry();

export const defaultStylesMerger = new TStylesMerger(
  defaultStylesConfig,
  defaultModelRegistry
);
export const defaultInit: TNodeInit = {
  elementModel: null,
  domNode: null,
  context: {
    stylesMerger: defaultStylesMerger,
    removeLineBreaksAroundEastAsianDiscardSet: false
  },
  parent: null
};

export const defaultDataFlowParams: DataFlowParams = {
  stylesMerger: defaultStylesMerger,
  modelRegistry: defaultModelRegistry,
  baseStyles: TStyles.empty(),
  removeLineBreaksAroundEastAsianDiscardSet: false
};

export function translateTreeTest(
  source: string,
  params?: Partial<DataFlowParams>
): TNodeImpl {
  const documentTree = parseDOM(source);
  const stylesMerger = params?.modelRegistry
    ? new TStylesMerger(
        { ...defaultStylesConfig, enableUserAgentStyles: true },
        params.modelRegistry
      )
    : defaultStylesMerger;
  return translateNode({
    node: documentTree[0],
    params: { ...defaultDataFlowParams, ...params, stylesMerger },
    parent: null
  }) as TNodeImpl;
}
