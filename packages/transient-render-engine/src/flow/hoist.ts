import { TBlock, TBlockImpl } from '../tree/TBlock';
import { TNodeImpl } from '../tree/tree-types';
import { TPhrasing } from '../tree/TPhrasing';
import { TText } from '../tree/TText';

/**
 * Wrap text nodes around TPhrasing nodes.
 * @param tnode The parent node of all elements to group.
 */
function groupText(tnode: TBlockImpl): TNodeImpl {
  let newChildren: TNodeImpl[] = [];
  const wrappernode = new TPhrasing({
    parentStyles: tnode.styles,
    elementModel: null,
    stylesMerger: tnode.stylesMerger,
    parent: null
  });
  let wrapper = wrappernode.newEmpty();
  let wrapperChildren: TNodeImpl[] = [];
  for (const child of tnode.children) {
    if (child instanceof TText || child instanceof TPhrasing) {
      wrapperChildren.push(child);
    } else {
      if (wrapperChildren.length) {
        newChildren.push(wrapper);
        wrapper.bindChildren(wrapperChildren);
        wrapper = wrappernode.newEmpty();
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
  tnode.bindChildren(tnode.children.map(hoistNode));
  if (tnode instanceof TPhrasing) {
    for (const cnode of tnode.children) {
      if (cnode instanceof TBlock) {
        const initParams = tnode.cloneInitParams({
          parentStyles: cnode.parentStyles,
          styles: cnode.styles
        });
        const newNode = new TBlock(initParams);
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
