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

export function toSerializableChildren(children: Node[]): SerializableNode[] {
  const serializableNodes: SerializableNode[] = [];
  for (const child of children) {
    const serialized = toSerializableNode(child);
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

function toSerializableElement({
  attribs,
  tagName,
  children
}: Element): SerializableElement {
  return {
    attribs,
    tagName,
    type: 'element',
    children: toSerializableChildren(children)
  };
}

export function toSerializableNode(node?: Node): null | SerializableNode {
  if (isTextNode(node)) {
    return serializeTextNode(node);
  }
  if (isElementNode(node)) {
    return toSerializableElement(node);
  }
  return null;
}
