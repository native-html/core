import { ElementType } from 'domelementtype';
import { Node, Text, Element } from 'domhandler';

export function isTextNode(node: Node | null | undefined): node is Text {
  return !!node && node.type === ElementType.Text;
}

export function isElementNode(node: Node | null | undefined): node is Element {
  return !!node && node.type === ElementType.Tag;
}
