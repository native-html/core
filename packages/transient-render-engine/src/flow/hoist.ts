import { TBlock } from '../tree/TBlock';
import { TNode } from '../tree/TNode';
import { TPhrasing } from '../tree/TPhrasing';
import { TText } from '../tree/TText';

/**
 * Wrap text nodes around TPhrasing nodes.
 * @param tnode The parent node of all elements to group.
 */
function groupText(tnode: TBlock): TNode {
  let newChildren: TNode[] = [];
  const wrappernode = new TPhrasing({
    parentStyles: tnode.styles,
    contentModel: null,
    elementModel: null,
    stylesMerger: tnode.stylesMerger,
    domNode: null,
    nodeIndex: 0
  });
  let wrapper = wrappernode.newEmpty();
  for (const child of tnode.children) {
    if (child instanceof TText || child instanceof TPhrasing) {
      wrapper.children.push(child);
    } else {
      if (wrapper.children.length) {
        newChildren.push(wrapper);
        wrapper = wrappernode.newEmpty();
      }
      newChildren.push(child);
    }
  }
  if (wrapper.children.length) {
    newChildren.push(wrapper);
  }
  tnode.bindChildren(newChildren);
  return tnode;
}

function hoistNode(tnode: TNode): TNode {
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

export function hoist(tree: TNode): TNode {
  return hoistNode(tree);
}
