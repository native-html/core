import { Text, Element, Node, Document, NodeWithChildren } from 'domhandler';
import { Text as TextType, Tag as TagType } from 'domelementtype';

export {
  Text as DOMText,
  Element as DOMElement,
  Node as DOMNode,
  NodeWithChildren as DOMNodeWithChildren,
  Document as DOMDocument
};

export function isDOMText(node: any): node is Text {
  return node && node.type === TextType;
}

export function isDOMElement(node: any): node is Element {
  return node && node.type === TagType;
}
