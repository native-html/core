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
import { TStylesMerger } from '../styles/TStylesMerger';
import HTMLModelRegistry from '../model/HTMLModelRegistry';
import { TEmpty } from '../tree/TEmpty';
import defaultHTMLModelRecord from '../model/defaultHTMLModelRecord';

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
): TNode | null {
  const tagName = node.tagName.toLowerCase();
  const sharedProps: Omit<TNodeInit, 'contentModel' | 'elementModel'> = {
    tagName,
    parentStyles,
    stylesMerger: params.stylesMerger,
    attributes: node.attribs
  };
  if (tagName === 'html') {
    const tdoc = new TDocument({ ...sharedProps });
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
      domNode: node
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
      domChildren:
        elementModel.isOpaque && !elementModel.isVoid
          ? node.children
          : undefined
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
  params: DataFlowParams
): TNode | null {
  if (isSerializableText(node)) {
    return new TText({
      data: node.data,
      stylesMerger: params.stylesMerger,
      contentModel: null,
      elementModel: null,
      parentStyles
    });
  }
  if (isSerializableElement(node)) {
    return translateElement(node, parentStyles, params);
  }
  return null;
}

export interface DataFlowParams {
  baseStyles: TStyles;
  stylesMerger: TStylesMerger;
  modelRegistry: HTMLModelRegistry<string>;
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
      contentModel: defaultHTMLModelRecord.body.contentModel,
      elementModel: defaultHTMLModelRecord.body,
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
