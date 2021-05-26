import { TNodeImpl, TNodeInit } from '../tree/tree-types';
import { Document } from 'domhandler';
import { TTextCtor } from '../tree/TTextCtor';
import { TPhrasingCtor } from '../tree/TPhrasingCtor';
import { TBlockCtor } from '../tree/TBlockCtor';
import { TDocumentCtor, TDocumentImpl } from '../tree/TDocumentImpl';
import { isDomElement, isDomText, Element, Node, Text } from '../dom/dom-utils';
import { TStyles } from '../styles/TStyles';

import { TEmptyCtor } from '../tree/TEmptyCtor';
import { DataFlowParams } from './types';

export function mapNodeList({
  nodeList,
  parent,
  parentStyles,
  params
}: {
  nodeList: Node[];
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
  children: Node[],
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
}: TranslateParams<Element>): TNodeImpl | null {
  const tagName = node.tagName;
  const sharedProps: Omit<TNodeInit, 'contentModel' | 'elementModel'> = {
    nodeIndex,
    parentStyles,
    context: params,
    domNode: node,
    parent
  };
  const elementModel = params.modelRegistry.getElementModelFromTagName(tagName);
  if (!elementModel) {
    return new TEmptyCtor({
      ...sharedProps,
      isUnregistered: true,
      elementModel,
      domNode: node
    });
  }
  if (elementModel.isTranslatableTextual()) {
    if (node.children.length === 1) {
      const child = node.children[0] as Node;
      if (isDomText(child)) {
        return new TTextCtor({
          ...sharedProps,
          elementModel,
          textNode: child,
          domNode: node
        });
      }
    } else if (node.children.length === 0) {
      return new TTextCtor({
        ...sharedProps,
        elementModel,
        domNode: node,
        textNode: new Text('')
      });
    }
    const phrasing = new TPhrasingCtor({
      ...sharedProps,
      domNode: node,
      elementModel
    });
    bindChildren(phrasing, node.children, params);
    return phrasing;
  }
  if (elementModel.isTranslatableBlock()) {
    const block = new TBlockCtor({
      ...sharedProps,
      elementModel,
      parentStyles,
      domNode: node
    });
    bindChildren(block, node.children, params);
    return block;
  }
  return new TEmptyCtor({
    ...sharedProps,
    isUnregistered: false,
    elementModel,
    domNode: node
  });
}

interface TranslateParams<T = Node> {
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
}: TranslateParams<Node | null>): TNodeImpl | null {
  if (isDomText(node)) {
    return new TTextCtor({
      textNode: node,
      context: params,
      parentStyles,
      domNode: null,
      elementModel: null,
      nodeIndex,
      parent
    });
  }
  if (isDomElement(node)) {
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
  const tdoc = new TDocumentCtor({
    context: params,
    styles: params.baseStyles,
    domNode: document as any
  });
  bindChildren(tdoc, document.children, params);
  tdoc.parseChildren();
  return tdoc;
}
