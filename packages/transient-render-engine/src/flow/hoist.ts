import { TBlock, TBlockImpl } from '../tree/TBlock';
import { TNodeImpl } from '../tree/tree-types';
import { TPhrasing } from '../tree/TPhrasing';
import { TText } from '../tree/TText';

/**
 * Wrap text nodes around TPhrasing nodes.
 * @param tnode The parent node of all elements to group.
 */
function groupText(tnode: TBlockImpl): TNodeImpl {
  if (tnode instanceof TText) {
    return tnode;
  }
  let newChildren: TNodeImpl[] = [];
  const wrapperInit = {
    elementModel: null,
    stylesMerger: tnode.stylesMerger,
    parent: null
  };
  let wrapper = new TPhrasing(wrapperInit);
  let wrapperChildren: TNodeImpl[] = [];
  for (const child of tnode.children) {
    if (child instanceof TText || child instanceof TPhrasing) {
      wrapperChildren.push(child);
    } else {
      if (wrapperChildren.length) {
        newChildren.push(wrapper);
        wrapper.bindChildren(wrapperChildren);
        wrapper = new TPhrasing(wrapperInit);
        wrapperChildren = [];
      }
      newChildren.push(child);
    }
  }
  if (wrapperChildren.length) {
    wrapper.bindChildren(wrapperChildren);
    newChildren.push(wrapper);
  }
  tnode.bindChildren(newChildren);
  return tnode;
}

function hoistNode(tnode: TNodeImpl): TNodeImpl {
  if (tnode instanceof TText) {
    return tnode;
  }
  tnode.bindChildren(tnode.children.map(hoistNode));
  if (tnode instanceof TPhrasing) {
    for (const cnode of tnode.children) {
      if (cnode instanceof TBlock) {
        const newNode = new TBlock(tnode.cloneInitParams());
        newNode.bindChildren(tnode.children);
        const output = groupText(newNode);
        return output;
      }
    }
  } else if (tnode instanceof TBlock) {
    if (tnode.children.length > 0) {
      const output = groupText(tnode);
      return output;
    }
  }
  return tnode;
}

export function hoist(tree: TNodeImpl): TNodeImpl {
  return hoistNode(tree);
}
