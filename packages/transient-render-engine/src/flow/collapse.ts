import { TBlock, TBlockImpl } from '../tree/TBlock';
import { TNodeImpl } from '../tree/tree-types';
import { TPhrasing, TPhrasingImpl } from '../tree/TPhrasing';
import { TText, TTextImpl } from '../tree/TText';
import {
  normalizeWhitespaces,
  replaceSegmentBreaks,
  removeLineBreaksAroundEastAsianDiscardSet,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
} from './text-transforms';
import compose from 'ramda/src/compose';
import { DataFlowParams } from './types';
import TDocument from '../tree/TDocument';

const collapseWhiteSpaces = compose(
  normalizeWhitespaces,
  replaceSegmentBreaks,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
);

const collapseWhiteSpacesWithEastAsianCharset = compose(
  normalizeWhitespaces,
  replaceSegmentBreaks,
  removeLineBreaksAroundEastAsianDiscardSet,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
);

function collapseText(node: TTextImpl, params: DataFlowParams): TTextImpl {
  if (node.hasWhiteSpaceCollapsingEnabled) {
    if (params.removeLineBreaksAroundEastAsianDiscardSet) {
      node.data = collapseWhiteSpacesWithEastAsianCharset(node.data);
    } else {
      node.data = collapseWhiteSpaces(node.data);
    }
  }
  return node;
}

function collapseBlock(node: TBlockImpl, params: DataFlowParams): TBlockImpl {
  const newChildren = [];
  for (const i in node.children) {
    const child = collapseNode(node.children[i], params);
    if (!child.isWhitespace()) {
      child.trimLeft();
      child.trimRight();
      if (!child.isEmpty()) {
        newChildren.push(child);
      }
    }
  }
  node.bindChildren(newChildren, true);
  return node;
}

function collapsePhrasing(
  node: TPhrasingImpl,
  params: DataFlowParams
): TPhrasingImpl {
  let collapsedChildren: TNodeImpl[] = [];
  let trimmedChildren: TNodeImpl[] = [];
  for (const i in node.children) {
    const child = collapseNode(node.children[i], params);
    if (child instanceof TText) {
      if (!child.isEmpty()) {
        collapsedChildren.push(child);
      }
    } else if (child instanceof TPhrasing) {
      if (!child.isEmpty()) {
        collapsedChildren.push(child);
      }
    }
  }
  collapsedChildren.forEach((childI, i) => {
    const k = i + 1;
    if (k <= node.children.length - 1) {
      const childK = node.children[k];
      if (childI.isCollapsibleRight() && childK.isCollapsibleLeft()) {
        childI.trimRight();
        if (!childI.isEmpty()) {
          trimmedChildren.push(childI);
        }
      } else {
        trimmedChildren.push(childI);
      }
    } else {
      trimmedChildren.push(childI);
    }
  });
  node.bindChildren(trimmedChildren, true);
  return node;
}

function collapseNode(node: TNodeImpl, params: DataFlowParams): TNodeImpl {
  if (node instanceof TText) {
    return collapseText(node as TTextImpl, params);
  }
  if (node instanceof TBlock || node instanceof TDocument) {
    return collapseBlock(node, params);
  }
  if (node instanceof TPhrasing) {
    return collapsePhrasing(node, params);
  }
  return node;
}

export function collapse(tree: TNodeImpl, params: DataFlowParams): TNodeImpl {
  const root = collapseNode(tree, params);
  root.trimLeft();
  root.trimRight();
  return root;
}
