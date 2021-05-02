import { Text, Element, Node } from 'domhandler';
import { Text as TextType, Tag as TagType } from 'domelementtype';

export { Text as DOMText, Element as DOMElement, Node as DOMNode };

export function isText(node: any): node is Text {
  return node && node.type === TextType;
}

export function isElement(node: any): node is Element {
  return node && node.type === TagType;
}
