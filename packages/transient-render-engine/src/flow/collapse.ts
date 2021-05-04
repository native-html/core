import { TNodeImpl } from '../tree/tree-types';
import { DataFlowParams } from './types';

export function collapse(root: TNodeImpl, params: DataFlowParams): TNodeImpl {
  root.collapse(params);
  root.trimLeft();
  root.trimRight();
  return root;
}
