import { Node, Text, Element } from 'domhandler';
import { isElementNode, isTextNode } from './utils';

export type SerializableNode = SerializableElement | SerializableText;

export interface SerializableText extends Pick<Text, 'data'> {
  type: 'text';
}

export interface SerializableElement
  extends Pick<Element, 'attribs' | 'tagName'> {
  type: 'element';
  children: SerializableNode[];
}

export function serializeChildren(children: Node[]): SerializableNode[] {
  const serializableNodes: SerializableNode[] = [];
  for (const child of children) {
    const serialized = serializeNode(child);
    if (serialized) {
      serializableNodes.push(serialized);
    }
  }
  return serializableNodes;
}

function serializeTextNode({ data }: Text): SerializableText {
  return {
    data,
    type: 'text'
  };
}

function serializeElement({
  attribs,
  tagName,
  children
}: Element): SerializableElement {
  return {
    attribs,
    tagName,
    type: 'element',
    children: serializeChildren(children)
  };
}

export function serializeNode(node?: Node): null | SerializableNode {
  if (isTextNode(node)) {
    return serializeTextNode(node);
  }
  if (isElementNode(node)) {
    return serializeElement(node);
  }
  return null;
}
