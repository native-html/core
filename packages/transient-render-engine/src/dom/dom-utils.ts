import { Text, Element, Node, Document, NodeWithChildren } from 'domhandler';
import { Text as TextType, Tag as TagType } from 'domelementtype';

export { Text, Element, Node, NodeWithChildren, Document };

export function isDomText(node: any): node is Text {
  return node && node.type === TextType;
}

export function isDomElement(node: any): node is Element {
  return node && node.type === TagType;
}
