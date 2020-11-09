import { TEmpty } from '../tree/TEmpty';
import { TNode } from '../tree/TNode';
import { Node, Element } from 'domhandler';
import { TText } from '../tree/TText';
import { getElementModelFromTagName } from '../dom/elements-model';
import { TPhrasingAnchor } from '../tree/TPhrasingAnchor';
import { TPhrasing } from '../tree/TPhrasing';
import { TBlock } from '../tree/TBlock';
import { isTextNode, isElementNode } from '../dom/utils';
import { TDocument } from '../tree/TDocument';
import { serializeChildren, serializeNode } from '../dom/serializer';

function mapNodeList(nodeList: Node[]): TNode[] {
  const nextMap: TNode[] = [];
  for (const child of nodeList) {
    const translated = translateNode(child);
    if (translated) {
      nextMap.push(translated);
    }
  }
  return nextMap;
}

function mapChildren(node: Element): TNode[] {
  return mapNodeList(node.children);
}

function translateElement(node: Element): TNode {
  const tagName = node.tagName.toLowerCase();
  const model = getElementModelFromTagName(tagName);
  const sharedProps = {
    tagName,
    attributes: node.attribs
  };
  if (model.isDocument) {
    return new TDocument({ children: mapChildren(node), ...sharedProps });
  }
  if (model.isAnchor) {
    const anchor = new TPhrasingAnchor({
      ...sharedProps,
      href: node.attribs.href,
      children: mapChildren(node)
    });
    return anchor;
  }
  if (model.isPhrasing) {
    if (!node.children.length) {
      return new TText({
        ...sharedProps,
        data: ''
      });
    } else if (node.children.length === 1) {
      const child = node.firstChild as Node;
      if (isTextNode(child)) {
        return new TText({
          ...sharedProps,
          data: child.data
        });
      }
    }
    const phrasing = new TPhrasing({
      ...sharedProps,
      children: mapChildren(node)
    });
    return phrasing;
  }
  if (model.isTranslatableBlock) {
    const block = new TBlock({
      ...sharedProps,
      domChildren: model.isOpaque
        ? serializeChildren(node.children)
        : undefined,
      children: model.isOpaque ? undefined : mapChildren(node)
    });
    return block;
  }

  return new TEmpty({
    tagName,
    domNode: serializeNode(node)
  });
}

export function translateNode(node: Node): TNode | null {
  if (isTextNode(node)) {
    return new TText({
      data: node.data
    });
  }
  if (isElementNode(node)) {
    return translateElement(node);
  }
  return null;
}

export function translateDocument(documentTree: Node[]): TDocument {
  const rootNodes = mapNodeList(documentTree);
  const tdoc = rootNodes.find((n) => n instanceof TDocument);
  if (tdoc) {
    return tdoc as TDocument;
  } else {
    return new TDocument({
      children: [new TBlock({ tagName: 'body', children: rootNodes })]
    });
  }
}
