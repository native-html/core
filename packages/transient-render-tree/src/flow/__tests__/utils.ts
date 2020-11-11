import { parseDOM } from 'htmlparser2';
import { toSerializableNode } from '../../dom/to-serializable';
import { TNode } from '../../tree/TNode';
import { translateNode } from '../translate';

export function translateTreeTest(source: string): TNode {
  const documentTree = parseDOM(source);
  return translateNode(toSerializableNode(documentTree[0]), null) as TNode;
}
