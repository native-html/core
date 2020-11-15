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
import { TStyles } from '../styles/TStyles';
import { TStylesMerger } from '../styles/TStylesMerger';

export function mapNodeList(
  nodeList: SerializableNode[],
  parentStyles: TStyles | null,
  params: DataFlowParams
): TNode[] {
  const nextMap: TNode[] = [];
  for (const child of nodeList) {
    const translated = translateNode(child, parentStyles, params);
    if (translated) {
      nextMap.push(translated);
    }
  }
  return nextMap;
}

export function bindChildren(
  node: TNode,
  children: SerializableNode[],
  params: DataFlowParams
) {
  node.bindChildren(mapNodeList(children, node.styles, params));
}

function translateElement(
  node: SerializableElement,
  parentStyles: TStyles | null,
  params: DataFlowParams
): TNode {
  const tagName = node.tagName.toLowerCase();
  const model = getElementModelFromTagName(tagName);
  const sharedProps: TNodeInit = {
    tagName,
    parentStyles,
    stylesMerger: params.stylesMerger,
    attributes: node.attribs
  };
  if (model.isDocument) {
    const tdoc = new TDocument({ ...sharedProps });
    bindChildren(tdoc, node.children, params);
    tdoc.parseChildren();
    return tdoc;
  }
  if (model.isAnchor) {
    const anchor = new TPhrasingAnchor({
      ...sharedProps,
      href: node.attribs.href
    });
    bindChildren(anchor, node.children, params);
    return anchor;
  }
  if (model.isPhrasing) {
    if (node.children.length === 1) {
      const child = node.children[0] as SerializableNode;
      if (isSerializableText(child)) {
        return new TText({
          ...sharedProps,
          data: child.data
        });
      }
    }
    const phrasing = new TPhrasing(sharedProps);
    bindChildren(phrasing, node.children, params);
    return phrasing;
  }
  if (model.isTranslatableBlock) {
    const block = new TBlock({
      ...sharedProps,
      parentStyles,
      domChildren: model.isOpaque && !model.isVoid ? node.children : undefined
    });
    bindChildren(block, node.children, params);
    return block;
  }

  return new TEmpty({
    ...sharedProps,
    domNode: node
  });
}

export function translateNode(
  node: SerializableNode | null,
  parentStyles: TStyles | null,
  params: DataFlowParams
): TNode | null {
  if (isSerializableText(node)) {
    return new TText({
      data: node.data,
      stylesMerger: params.stylesMerger,
      parentStyles
    });
  }
  if (isSerializableElement(node)) {
    return translateElement(node, parentStyles, params);
  }
  return null;
}

interface DataFlowParams {
  baseStyles: TStyles;
  stylesMerger: TStylesMerger;
}

export function translateDocument(
  documentTree: Node[],
  params: DataFlowParams
): TDocument {
  const serializableDocTree = toSerializableChildren(documentTree);
  const rootNodes = mapNodeList(serializableDocTree, params.baseStyles, params);
  let foundTdoc = rootNodes.find((n) => n instanceof TDocument);
  if (foundTdoc) {
    return foundTdoc as TDocument;
  } else {
    const body = new TBlock({
      tagName: 'body',
      stylesMerger: params.stylesMerger,
      parentStyles: null
    });
    body.bindChildren(rootNodes);
    const newTdoc = new TDocument({
      parentStyles: params.baseStyles,
      stylesMerger: params.stylesMerger
    });
    newTdoc.bindChildren([body]);
    return newTdoc;
  }
}
