import { Text, Element, Node, Document } from 'domhandler';
import { Text as TextType, Tag as TagType } from 'domelementtype';

export {
  Text as DOMText,
  Element as DOMElement,
  Node as DOMNode,
  Document as DOMDocument
};

export function isDOMText(node: any): node is Text {
  return node && node.type === TextType;
}

export function isDOMElement(node: any): node is Element {
  return node && node.type === TagType;
}
