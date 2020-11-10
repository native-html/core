import { TEmpty } from '../tree/TEmpty';
import { TNode, TNodeInit } from '../tree/TNode';
import { Node } from 'domhandler';
import { TText } from '../tree/TText';
import { getElementModelFromTagName } from '../dom/elements-model';
import { TPhrasingAnchor } from '../tree/TPhrasingAnchor';
import { TPhrasing } from '../tree/TPhrasing';
import { TBlock } from '../tree/TBlock';
import { TDocument } from '../tree/TDocument';
import {
  isSerializableElement,
  isSerializableText,
  SerializableElement,
  SerializableNode,
  toSerializableChildren
} from '../dom/to-serializable';
import { TStyles } from '../TStyles';

function mapNodeList(
  nodeList: SerializableNode[],
  parentStyles: TStyles | null
): TNode[] {
  const nextMap: TNode[] = [];
  for (const child of nodeList) {
    const translated = translateNode(child, parentStyles);
    if (translated) {
      nextMap.push(translated);
    }
  }
  return nextMap;
}

export function bindChildren(node: TNode, children: SerializableNode[]) {
  node.bindChildren(mapNodeList(children, node.styles));
}

function translateElement(
  node: SerializableElement,
  parentStyles: TStyles | null
): TNode {
  const tagName = node.tagName.toLowerCase();
  const model = getElementModelFromTagName(tagName);
  const sharedProps: TNodeInit = {
    tagName,
    parentStyles,
    attributes: node.attribs
  };
  if (model.isDocument) {
    const tdoc = new TDocument({ ...sharedProps });
    bindChildren(tdoc, node.children);
    return tdoc;
  }
  if (model.isAnchor) {
    const anchor = new TPhrasingAnchor({
      ...sharedProps,
      href: node.attribs.href
    });
    bindChildren(anchor, node.children);
    return anchor;
  }
  if (model.isPhrasing) {
    if (!node.children.length) {
      return new TText({
        ...sharedProps,
        data: ''
      });
    } else if (node.children.length === 1) {
      const child = node.children[0] as SerializableNode;
      if (isSerializableText(child)) {
        return new TText({
          ...sharedProps,
          data: child.data
        });
      }
    }
    const phrasing = new TPhrasing(sharedProps);
    bindChildren(phrasing, node.children);
    return phrasing;
  }
  if (model.isTranslatableBlock) {
    const block = new TBlock({
      ...sharedProps,
      parentStyles,
      domChildren: model.isOpaque && !model.isVoid ? node.children : undefined
    });
    bindChildren(block, node.children);
    return block;
  }

  return new TEmpty({
    ...sharedProps,
    domNode: node
  });
}

export function translateNode(
  node: SerializableNode | null,
  parentStyles: TStyles | null
): TNode | null {
  if (!node) {
    return null;
  }
  if (isSerializableText(node)) {
    return new TText({
      data: node.data
    });
  }
  if (isSerializableElement(node)) {
    return translateElement(node, parentStyles);
  }
  return null;
}

export function translateDocument(documentTree: Node[]): TDocument {
  const rootNodes = mapNodeList(toSerializableChildren(documentTree), null);
  let foundTdoc = rootNodes.find((n) => n instanceof TDocument);
  if (foundTdoc) {
    return foundTdoc as TDocument;
  } else {
    const body = new TBlock({
      tagName: 'body',
      parentStyles: null
    });
    body.bindChildren(rootNodes);
    const newTdoc = new TDocument({
      parentStyles: null
    });
    newTdoc.bindChildren([body]);
    return newTdoc;
  }
}
