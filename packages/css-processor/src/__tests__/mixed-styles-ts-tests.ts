import { CSSProcessedProps } from '../CSSProcessedProps';
import { MixedStyleDeclaration } from '../CSSProcessor';

type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never;

export const testProcessedProps: AssertEqual<
  Extract<
    keyof CSSProcessedProps['native']['block']['retain'],
    'backgroundColor'
  >,
  'backgroundColor'
> = true;

export const testBackgroundColor: AssertEqual<
  Extract<keyof MixedStyleDeclaration, 'backgroundColor'>,
  'backgroundColor'
> = true;

export const testObjectFit: AssertEqual<
  Extract<keyof MixedStyleDeclaration, 'objectFit'>,
  'objectFit'
> = true;
