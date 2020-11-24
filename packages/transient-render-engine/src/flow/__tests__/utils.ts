import { parseDOM } from 'htmlparser2';
import { toSerializableNode } from '../../dom/to-serializable';
import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStyles } from '../../styles/TStyles';
import { TStylesMerger } from '../../styles/TStylesMerger';
import { TNode } from '../../tree/TNode';
import { translateNode } from '../translate';

export const defaultModelRegistry = new HTMLModelRegistry();

export const defaultStylesMerger = new TStylesMerger(
  defaultStylesConfig,
  defaultModelRegistry
);
export const defaultInit = {
  parentStyles: null,
  contentModel: null,
  stylesMerger: defaultStylesMerger
};

export function translateTreeTest(source: string): TNode {
  const documentTree = parseDOM(source);
  return translateNode(toSerializableNode(documentTree[0]), null, {
    stylesMerger: defaultStylesMerger,
    modelRegistry: defaultModelRegistry,
    baseStyles: TStyles.empty()
  }) as TNode;
}
