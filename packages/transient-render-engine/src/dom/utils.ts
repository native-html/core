import { ElementType } from 'htmlparser2';
import { Node, Text, Element } from 'domhandler';

export function isTextNode(node: Node | null | undefined): node is Text {
  return !!node && node.type === ElementType.Text;
}

export function isElementNode(node: Node | null | undefined): node is Element {
  return !!node && node.type === ElementType.Tag;
}
