import TBlockCtor, { TBlockImpl } from '../tree/TBlockCtor';
import { TNodeImpl } from '../tree/tree-types';
import { TPhrasingCtor } from '../tree/TPhrasingCtor';
import { TTextCtor } from '../tree/TTextCtor';

/**
 * Wrap text nodes around TPhrasing nodes.
 * @param tnode The parent node of all elements to group.
 */
function groupText(tnode: TBlockImpl): TNodeImpl {
  let newChildren: TNodeImpl[] = [];
  const wrapperInit = {
    elementModel: null,
    context: tnode.init.context,
    // We need to merge styles here to make sure
    // some React Native styles working only for the uppermost Text element
    // such as "textAlign" are preserved.
    parentStyles: tnode.styles,
    parent: null
  };
  let wrapper = new TPhrasingCtor(wrapperInit);
  let wrapperChildren: TNodeImpl[] = [];
  for (const child of tnode.children) {
    if (child instanceof TTextCtor || child instanceof TPhrasingCtor) {
      wrapperChildren.push(child);
    } else {
      if (wrapperChildren.length) {
        newChildren.push(wrapper);
        wrapper.bindChildren(wrapperChildren);
        wrapper = new TPhrasingCtor(wrapperInit);
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
  if (tnode instanceof TTextCtor) {
    return tnode;
  }
  tnode.bindChildren(tnode.children.map(hoistNode));
  if (tnode instanceof TPhrasingCtor) {
    for (const cnode of tnode.children) {
      if (cnode instanceof TBlockCtor) {
        const newNode = new TBlockCtor(tnode.cloneInitParams());
        newNode.bindChildren(tnode.children);
        const output = groupText(newNode);
        return output;
      }
    }
  } else if (tnode instanceof TBlockCtor) {
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
