import { TNode, TNodeInit } from '../tree/TNode';
import { Node } from 'domhandler';
import { TText } from '../tree/TText';
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

import { TEmpty } from '../tree/TEmpty';
import defaultHTMLElementModels from '../model/defaultHTMLElementModels';
import { DataFlowParams } from './types';

export function mapNodeList(
  nodeList: SerializableNode[],
  parentStyles: TStyles | null,
  params: DataFlowParams
): TNode[] {
  const nextMap: TNode[] = [];
  for (const i in nodeList) {
    const child = nodeList[i];
    const translated = translateNode(child, parentStyles, params, Number(i));
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
  if (!node.elementModel || !node.elementModel.isOpaque) {
    node.bindChildren(mapNodeList(children, node.styles, params));
  }
}

function translateElement(
  node: SerializableElement,
  parentStyles: TStyles | null,
  params: DataFlowParams,
  nodeIndex: number
): TNode | null {
  const tagName = node.tagName.toLowerCase();
  const sharedProps: Omit<TNodeInit, 'contentModel' | 'elementModel'> = {
    tagName,
    nodeIndex,
    parentStyles,
    stylesMerger: params.stylesMerger,
    attributes: node.attribs,
    domNode: null
  };
  if (tagName === 'html') {
    const tdoc = new TDocument({
      ...sharedProps,
      styles: parentStyles
    });
    bindChildren(tdoc, node.children, params);
    tdoc.parseChildren();
    return tdoc;
  }
  const elementModel = params.modelRegistry.getElementModelFromTagName(tagName);
  if (!elementModel) {
    return new TEmpty({
      ...sharedProps,
      isUnregistered: true,
      contentModel: null,
      elementModel: null,
      domNode: node,
      nodeIndex: 0
    });
  }
  const contentModel = elementModel.contentModel;
  if (elementModel.isTranslatableTextual()) {
    if (node.children.length === 1) {
      const child = node.children[0] as SerializableNode;
      if (isSerializableText(child)) {
        return new TText({
          ...sharedProps,
          contentModel,
          elementModel,
          data: child.data
        });
      }
    } else if (node.children.length === 0) {
      return new TText({
        ...sharedProps,
        contentModel,
        elementModel,
        data: ''
      });
    }
    const phrasing = new TPhrasing({
      ...sharedProps,
      contentModel,
      elementModel
    });
    bindChildren(phrasing, node.children, params);
    return phrasing;
  }
  if (elementModel.isTranslatableBlock()) {
    const block = new TBlock({
      ...sharedProps,
      contentModel,
      elementModel,
      parentStyles,
      domNode: elementModel.isOpaque ? node : null
    });
    bindChildren(block, node.children, params);
    return block;
  }
  return new TEmpty({
    ...sharedProps,
    isUnregistered: false,
    contentModel,
    elementModel,
    domNode: node
  });
}

export function translateNode(
  node: SerializableNode | null,
  parentStyles: TStyles | null,
  params: DataFlowParams,
  nodeIndex: number
): TNode | null {
  if (isSerializableText(node)) {
    return new TText({
      data: node.data,
      stylesMerger: params.stylesMerger,
      contentModel: null,
      elementModel: null,
      parentStyles,
      domNode: null,
      nodeIndex
    });
  }
  if (isSerializableElement(node)) {
    return translateElement(node, parentStyles, params, nodeIndex);
  }
  return null;
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
    let body = rootNodes.find((n) => n.tagName === 'body');
    if (!body) {
      body = new TBlock({
        tagName: 'body',
        stylesMerger: params.stylesMerger,
        contentModel: defaultHTMLElementModels.body.contentModel,
        elementModel: defaultHTMLElementModels.body,
        parentStyles: params.baseStyles,
        domNode: null,
        nodeIndex: 0
      });
      body.bindChildren(rootNodes);
    }
    const newTdoc = new TDocument({
      styles: params.baseStyles,
      stylesMerger: params.stylesMerger,
      domNode: null,
      nodeIndex: 0
    });
    newTdoc.bindChildren([body]);
    return newTdoc;
  }
}
