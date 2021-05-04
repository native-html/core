const emptySymbol = Symbol('emptyProps');

export type EmptyProps = typeof emptyProps;

export const emptyProps = (function () {
  let obj = {};
  Object.defineProperty(obj, '$$empty', {
    value: emptySymbol,
    enumerable: false
  });
  obj = Object.freeze(obj);
  return obj;
})() as {
  $$empty: symbol;
};

export function isNotEmpty<T>(p: T): p is Exclude<T, EmptyProps | null> {
  //@ts-ignore
  return !!p && p.$$empty !== emptySymbol;
}
