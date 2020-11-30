// TS Tests

import { MixedStyleDeclaration } from '../CSSProcessor';

type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never;

export const mixedTypesShouldSupportShorthandNativeProps: AssertEqual<
  Extract<keyof MixedStyleDeclaration, 'padding' | 'margin'>,
  'padding' | 'margin'
> = true;

export const mixedTypesShouldSupportSpecialWebProps: AssertEqual<
  Extract<keyof MixedStyleDeclaration, 'whiteSpace'>,
  'whiteSpace' | 'listStyleType'
> = true;

export const mixedTypesShouldSupportImgProps: AssertEqual<
  Extract<keyof MixedStyleDeclaration, 'resizeMode'>,
  'resizeMode'
> = true;
