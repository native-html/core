import {
  Node as DOMNode,
  Text as DOMText,
  Element as DOMElement
} from 'domhandler';
import { ElementType } from 'domelementtype';

import map from 'ramda/src/map';
import identity from 'ramda/src/identity';
import always from 'ramda/src/always';
import pipe from 'ramda/src/pipe';
import reject from 'ramda/src/reject';
export interface AlterDOMParams {
  ignoreDOMNode?: (node: DOMNode) => boolean;
  alterDOMData?: (node: DOMText) => string | false | void;
  alterDOMChildren?: (node: DOMElement) => DOMNode[] | false | void;
  alterDOMElement?: (node: DOMElement) => DOMElement | false | void;
}

export default function alterDOMNodes(
  nodes: DOMNode[],
  params: AlterDOMParams
): DOMNode[] {
  const {
    ignoreDOMNode = always(false),
    alterDOMElement = identity,
    alterDOMChildren = identity,
    alterDOMData = (node) => node.data
  } = params;
  const alterNodes = pipe<DOMNode[], DOMNode[], DOMNode[]>(
    reject(ignoreDOMNode),
    map(function applyParams(node: DOMNode) {
      let nextNode = node;
      if (node.type === ElementType.Tag) {
        const elementNode =
          alterDOMElement(node as DOMElement) || (nextNode as DOMElement);
        const alteredChildren = alterDOMChildren(elementNode);
        elementNode.children = Array.isArray(alteredChildren)
          ? alteredChildren
          : elementNode.children;
        elementNode.children = alterNodes(elementNode.children);
        nextNode = elementNode;
      } else if (node.type === ElementType.Text) {
        const textNode = node as DOMText;
        const alteredData = alterDOMData(textNode);
        textNode.data =
          typeof alteredData === 'string' ? alteredData : textNode.data;
      }
      return nextNode;
    })
  );
  return alterNodes(nodes);
}
