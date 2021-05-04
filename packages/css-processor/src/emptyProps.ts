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

export function isNotEmpty(p: any): p is EmptyProps {
  return p.$$empty !== emptySymbol;
}
