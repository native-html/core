import { TBlock } from '../tree/TBlock';
import { TNode } from '../tree/TNode';
import { TPhrasing } from '../tree/TPhrasing';
import { TText } from '../tree/TText';
import {
  normalizeWhitespaces,
  replaceSegmentBreaks,
  normalizeSpaceDiscardingCharset,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
} from './text-transforms';

function collapseText(node: TText): TText {
  node.data = normalizeWhitespaces(
    replaceSegmentBreaks(
      normalizeSpaceDiscardingCharset(
        normalizeZeroWidthWhitespaces(
          removeConsecutiveSegmentBreaks(
            removeCollapsibleAroundSegmentBreak(node.data)
          )
        )
      )
    )
  );
  return node;
}

function collapseBlock(node: TBlock): TBlock {
  const newChildren = [];
  for (const i in node.children) {
    const child = collapseNode(node.children[i]);
    if (!child.isWhitespace()) {
      if (child.isCollapsibleLeft()) {
        child.trimLeft();
      }
      if (child.isCollapsibleRight()) {
        child.trimRight();
      }
      if (!child.isEmpty()) {
        newChildren.push(child);
      }
    }
  }
  node.children = newChildren;
  return node;
}

function collapsePhrasing(node: TPhrasing): TPhrasing {
  let collapsedChildren: TNode[] = [];
  let trimmedChildren: TNode[] = [];
  for (const i in node.children) {
    const child = collapseNode(node.children[i]);
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
    if (k < node.children.length - 1) {
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
  node.children = trimmedChildren;
  return node;
}

function collapseNode(node: TNode): TNode {
  if (node instanceof TText) {
    return collapseText(node);
  }
  if (node instanceof TBlock) {
    return collapseBlock(node);
  }
  if (node instanceof TPhrasing) {
    return collapsePhrasing(node);
  }
  return node;
}

export function collapse(tree: TNode): TNode {
  const root = collapseNode(tree);
  root.isCollapsibleLeft() && root.trimLeft();
  root.isCollapsibleRight() && root.trimRight();
  return root;
}
