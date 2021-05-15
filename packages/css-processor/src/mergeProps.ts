import { emptyProps, isNotEmpty } from './emptyProps';

function mergeProps<T extends Record<string, any>>(props: Array<T | null>): T {
  const filteredProps = props.filter(isNotEmpty);
  if (filteredProps.length) {
    return Object.assign({}, ...filteredProps);
  }
  return emptyProps as unknown as T;
}

export default mergeProps;
