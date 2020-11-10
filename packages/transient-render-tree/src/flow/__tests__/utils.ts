import { toSerializableNode } from '../../dom/to-serializable';
import { TNode } from '../../tree/TNode';
import { parseHtml } from '../parse-html';
import { translateNode } from '../translate';

export async function translateTreeTest(source: string): Promise<TNode> {
  const documentTree = await parseHtml(source);
  return translateNode(toSerializableNode(documentTree[0]), null) as TNode;
}
