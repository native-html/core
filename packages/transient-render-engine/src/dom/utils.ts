import { Text as TextType, Tag as TagType } from 'domelementtype';
import { Node, Text, Element } from 'domhandler';

export function isTextNode(node: Node | null | undefined): node is Text {
  return !!node && node.type === TextType;
}

export function isElementNode(node: Node | null | undefined): node is Element {
  return !!node && node.type === TagType;
}
