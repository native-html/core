declare module 'css-to-react-native' {
  const transform: (rules: ([string, any] | null)[]) => Record<string, string>;
  export function getPropertyName(a: string): string;
  export function getStylesForProperty<T extends string>(
    a: T,
    v: string
  ): Record<T, any>;
  export default transform;
}
