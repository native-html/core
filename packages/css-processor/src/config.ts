import {
  CSSLongNativeTranslatableBlockPropKey,
  CSSLongNativeTranslatableTextPropKey
} from './property-types';

export type CSSLengthUnit =
  | 'cm'
  | 'mm'
  | 'in'
  | 'px'
  | 'pt'
  | 'pc'
  | 'em'
  | 'ex'
  | 'ch'
  | 'rem'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax'
  | '%';

export type CSSHardcodedBorderWidth = 'thin' | 'medium' | 'thick';

export type CSSAbsoluteLengthUnit = Extract<
  CSSLengthUnit,
  'in' | 'cm' | 'mm' | 'px' | 'pt' | 'pc'
>;

export type CSSRelativeHarcodedFontSize = 'smaller' | 'larger';

export type CSSAbsoluteHardcodedFontSize =
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'x-large'
  | 'xx-large';

export type CSSAbsoluteLengthUnitsMultiplicators = Record<
  Exclude<CSSAbsoluteLengthUnit, 'px'>,
  number
>;

export type CSSPropertyNameList = Array<
  CSSLongNativeTranslatableBlockPropKey | CSSLongNativeTranslatableTextPropKey
>;

export interface CSSProcessorConfig {
  readonly absoluteLengthUnitsMultiplicators: CSSAbsoluteLengthUnitsMultiplicators;
  readonly absoluteBorderWidthsPixelMap: Record<
    CSSHardcodedBorderWidth,
    number
  >;
  readonly relativeFontSizesCoefficientMap: Record<
    CSSRelativeHarcodedFontSize,
    number
  >;
  readonly absoluteFontSizesPixelMap: Record<
    CSSAbsoluteHardcodedFontSize,
    number
  >;
  /**
   * Ignore those properties when compiling inline styles. The names should be
   * camelCased.
   *
   * @remarks As of this version, inline styles are considered 100% safe and
   * predictable, thus this property is generally not advised.
   */
  readonly inlinePropertiesBlacklist: CSSPropertyNameList;

  /**
   * Allow those properties when compiling inline styles. The names should be
   * camelCased.
   *
   * @remarks When present, inlinePropertiesBlacklist will be ignored.
   */
  readonly inlinePropertiesWhitelist: CSSPropertyNameList | null;

  /**
   * Font size used to compute REM.
   */
  readonly rootFontSize: number;

  /**
   * Determine is the provided font is supported on running platform.
   *
   * @param fontName - The name of the font to validate. Any quotes have been removed.
   * @returns `true` when the font is supported on current platform, a string
   * when this font should be mapped to another font (such as monospace →
   * Menlo), false otherwise.
   */
  isFontSupported(fontName: string): boolean | string;
}
