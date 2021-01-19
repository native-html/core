import {
  Node as DOMNode,
  Text as DOMText,
  Element as DOMElement
} from 'domhandler';

import map from 'ramda/src/map';
import identity from 'ramda/src/identity';

export interface AlterDOMParams {
  alterDOMData?: (node: DOMText) => string | false | void;
  alterDOMChildren?: (node: DOMElement) => DOMNode[] | false | void;
  alterDOMElement?: (node: DOMElement) => DOMElement | false | void;
}

export default function alterDOMNodes(
  nodes: DOMNode[],
  params: AlterDOMParams
) {
  const {
    alterDOMElement = identity,
    alterDOMChildren = identity,
    alterDOMData = (node) => node.data
  } = params;
  return map(function applyParams(node: DOMNode) {
    let nextNode = node;
    if (node.type === 'tag') {
      const elementNode =
        alterDOMElement(node as DOMElement) || (nextNode as DOMElement);
      const alteredChildren = alterDOMChildren(elementNode);
      elementNode.children = Array.isArray(alteredChildren)
        ? alteredChildren
        : elementNode.children;
      elementNode.children = alterDOMNodes(elementNode.children, params);
      nextNode = elementNode;
    } else if (node.type === 'text') {
      const textNode = node as DOMText;
      const alteredData = alterDOMData(textNode);
      textNode.data =
        typeof alteredData === 'string' ? alteredData : textNode.data;
    }
    return nextNode;
  }, nodes);
}
