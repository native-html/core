import { TBlock } from '../tree/TBlock';
import { TBlockAnchor } from '../tree/TBlockAnchor';
import { TNode } from '../tree/TNode';
import { TPhrasing } from '../tree/TPhrasing';
import { TPhrasingAnchor } from '../tree/TPhrasingAnchor';
import { TText } from '../tree/TText';

function groupText(tnode: TBlock, wrappernode: TPhrasing): TNode {
  let newChildren: TNode[] = [];
  let wrapper = wrappernode.newEmpty();
  for (const child of tnode.children) {
    const newChild = child;
    if (newChild instanceof TText || newChild instanceof TPhrasing) {
      wrapper.children.push(newChild);
    } else {
      newChildren.push(wrapper);
      wrapper = wrappernode.newEmpty();
      if (wrappernode instanceof TPhrasingAnchor) {
        const nextChild = new TBlockAnchor({
          ...newChild,
          href: wrappernode.href
        });
        newChildren.push(nextChild);
      } else {
        newChildren.push(newChild);
      }
    }
  }
  if (wrapper.children.length) {
    newChildren.push(wrapper);
  }
  tnode.children = newChildren;
  return tnode;
}

function hoistNode(node: TNode): TNode {
  node.children = node.children.map(hoistNode);
  if (node instanceof TPhrasing) {
    for (const child of node.children) {
      if (child instanceof TBlock) {
        return groupText(new TBlock({ ...node }), node);
      }
    }
  } else if (node instanceof TBlock) {
    if (node.children.length > 0) {
      return groupText(node, new TPhrasing({}));
    }
  }
  return node;
}

export function hoist(tree: TNode): TNode {
  return hoistNode(tree);
}
