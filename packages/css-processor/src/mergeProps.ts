import { EmptyProps, emptyProps, isNotEmpty } from './emptyProps';

export type MixedProps<T extends Record<string, any>> =
  | MixedPropsRecord<T>
  | EmptyProps;

export type MixedPropsRecord<T> = T extends Record<string, any> ? T : never;

function mergeProps<T extends Record<string, any>>(props: MixedProps<T>[]) {
  const filteredProps = props.filter(isNotEmpty);
  if (filteredProps.length) {
    return Object.assign({}, ...filteredProps);
  }
  return emptyProps;
}

export default mergeProps;
