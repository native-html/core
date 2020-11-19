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
    if (child instanceof TText || child instanceof TPhrasing) {
      wrapper.children.push(child);
    } else {
      if (wrapper.children.length) {
        newChildren.push(wrapper);
        wrapper = wrappernode.newEmpty();
      }
      if (wrappernode instanceof TPhrasingAnchor) {
        const nextChild = new TBlockAnchor({
          ...child.cloneInitParams(),
          href: wrappernode.href,
          parentStyles: wrappernode.parentStyles
        });
        nextChild.bindChildren(child.children);
        newChildren.push(nextChild);
      } else {
        newChildren.push(child);
      }
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
        const newNode = new TBlock(
          tnode.cloneInitParams({
            parentStyles: cnode.parentStyles,
            styles: cnode.styles
          })
        );
        newNode.bindChildren(tnode.children);
        const output = groupText(newNode, tnode);
        return output;
      }
    }
  } else if (tnode instanceof TBlock) {
    if (tnode.children.length > 0) {
      const output = groupText(
        tnode,
        new TPhrasing({
          parentStyles: tnode.styles,
          stylesMerger: tnode.stylesMerger
        })
      );
      return output;
    }
  }
  return tnode;
}

export function hoist(tree: TNode): TNode {
  return hoistNode(tree);
}
