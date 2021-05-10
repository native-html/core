import { TNodeImpl } from '../tree/tree-types';

export function collapse(root: TNodeImpl): TNodeImpl {
  root.collapse();
  root.trimLeft();
  root.trimRight();
  return root;
}
