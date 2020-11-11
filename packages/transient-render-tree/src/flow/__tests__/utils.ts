import { parseDOM } from 'htmlparser2';
import { toSerializableNode } from '../../dom/to-serializable';
import { defaultStylesConfig } from '../../styles/defaults';
import { TStylesMerger } from '../../styles/TStylesMerger';
import { TNode } from '../../tree/TNode';
import { translateNode } from '../translate';

export const defaultStylesMerger = new TStylesMerger(defaultStylesConfig);
export const defaultInit = {
  parentStyles: null,
  stylesMerger: defaultStylesMerger
};

export function translateTreeTest(source: string): TNode {
  const documentTree = parseDOM(source);
  return translateNode(toSerializableNode(documentTree[0]), null, {
    stylesMerger: defaultStylesMerger
  }) as TNode;
}
