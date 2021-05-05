import { TNodeImpl, TNodeInit } from '../tree/tree-types';
import { Document } from 'domhandler';
import { TText } from '../tree/TText';
import { TPhrasing } from '../tree/TPhrasing';
import { TBlock } from '../tree/TBlock';
import { TDocument, TDocumentImpl } from '../tree/TDocument';
import {
  isDOMElement,
  isDOMText,
  DOMElement,
  DOMNode,
  DOMText
} from '../dom/dom-utils';
import { TStyles } from '../styles/TStyles';

import { TEmpty } from '../tree/TEmpty';
import { DataFlowParams } from './types';

export function mapNodeList({
  nodeList,
  parent,
  parentStyles,
  params
}: {
  nodeList: DOMNode[];
  parentStyles?: TStyles;
  parent: TNodeImpl | null;
  params: DataFlowParams;
}): TNodeImpl[] {
  const nextMap: TNodeImpl[] = [];
  for (const i in nodeList) {
    const child = nodeList[i];
    const translated = translateNode({
      node: child,
      parentStyles,
      params,
      nodeIndex: Number(i),
      parent
    });
    if (translated) {
      nextMap.push(translated);
    }
  }
  return nextMap;
}

export function bindChildren(
  node: TNodeImpl,
  children: DOMNode[],
  params: DataFlowParams
) {
  if (!node.elementModel || !node.elementModel.isOpaque) {
    node.bindChildren(
      mapNodeList({
        nodeList: children,
        parent: node,
        params
      })
    );
  }
}

function translateElement({
  node,
  nodeIndex,
  params,
  parent,
  parentStyles
}: TranslateParams<DOMElement>): TNodeImpl | null {
  const tagName = node.tagName;
  const sharedProps: Omit<TNodeInit, 'contentModel' | 'elementModel'> = {
    nodeIndex,
    parentStyles,
    stylesMerger: params.stylesMerger,
    domNode: node,
    parent
  };
  const elementModel = params.modelRegistry.getElementModelFromTagName(tagName);
  if (!elementModel) {
    return new TEmpty({
      ...sharedProps,
      isUnregistered: true,
      elementModel,
      domNode: node
    });
  }
  if (elementModel.isTranslatableTextual()) {
    if (node.children.length === 1) {
      const child = node.children[0] as DOMNode;
      if (isDOMText(child)) {
        return new TText({
          ...sharedProps,
          elementModel,
          textNode: child,
          domNode: node
        });
      }
    } else if (node.children.length === 0) {
      return new TText({
        ...sharedProps,
        elementModel,
        domNode: node,
        textNode: new DOMText('')
      });
    }
    const phrasing = new TPhrasing({
      ...sharedProps,
      domNode: node,
      elementModel
    });
    bindChildren(phrasing, node.children, params);
    return phrasing;
  }
  if (elementModel.isTranslatableBlock()) {
    const block = new TBlock({
      ...sharedProps,
      elementModel,
      parentStyles,
      domNode: node
    });
    bindChildren(block, node.children, params);
    return block;
  }
  return new TEmpty({
    ...sharedProps,
    isUnregistered: false,
    elementModel,
    domNode: node
  });
}

interface TranslateParams<T = DOMNode> {
  node: T;
  params: DataFlowParams;
  parent: TNodeImpl | null;
  parentStyles?: TStyles;
  nodeIndex?: number;
}

export function translateNode({
  node,
  parentStyles,
  params,
  nodeIndex,
  parent
}: TranslateParams<DOMNode | null>): TNodeImpl | null {
  if (isDOMText(node)) {
    return new TText({
      textNode: node,
      stylesMerger: params.stylesMerger,
      parentStyles,
      domNode: null,
      elementModel: null,
      nodeIndex,
      parent
    });
  }
  if (isDOMElement(node)) {
    return translateElement({
      node,
      parentStyles,
      params,
      nodeIndex,
      parent
    });
  }
  return null;
}

export function translateDocument(
  document: Document,
  params: DataFlowParams
): TDocumentImpl {
  const tdoc = new TDocument({
    stylesMerger: params.stylesMerger,
    styles: params.baseStyles,
    domNode: document as any
  });
  bindChildren(tdoc, document.children, params);
  tdoc.parseChildren();
  return tdoc;
}
