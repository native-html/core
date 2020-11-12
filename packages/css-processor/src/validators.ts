import {
  CSSAbsoluteHardcodedFontSize,
  CSSHardcodedBorderWidth,
  CSSLengthUnit,
  CSSProcessorConfig
} from './config';
import {
  CSSPropertyCompatCategory,
  CSSPropertyDisplayCategory,
  CSSPropertyPropagationCategory,
  CSSPropertySpecs
} from './processor-types';

export interface CSSPropertyModel {
  inheritable: boolean;
  native: boolean;
  translatable: boolean;
  shorthand: boolean;
  display: 'text' | 'block';
}

export interface CSSPropertyValidatorParams<C extends CSSPropertyModel> {
  readonly model: C;
  readonly config: CSSProcessorConfig;
  readonly ignoreTransform?: boolean;
}

export abstract class CSSPropertyValidator<
  C extends CSSPropertyModel = any,
  N = any
> implements CSSPropertySpecs {
  protected readonly model: C;
  protected readonly config: CSSProcessorConfig;
  protected readonly ignoreTransform: boolean;
  public readonly propagationCategory: CSSPropertyPropagationCategory;
  public readonly compatCategory: CSSPropertyCompatCategory;
  public readonly displayCategory: CSSPropertyDisplayCategory;
  constructor({
    model,
    config,
    ignoreTransform = false
  }: CSSPropertyValidatorParams<C>) {
    this.model = model;
    this.ignoreTransform = ignoreTransform;
    this.config = config;
    this.propagationCategory = model.inheritable ? 'flow' : 'retain';
    this.compatCategory = model.translatable ? 'native' : 'web';
    this.displayCategory = model.display;
  }
  /**
   * Normalize a rule value after serialization with css-to-react-native.
   *
   * @param value - The CSS property value to test.
   * @returns The normalized value, or null if normalization failed.
   */
  normalizeValue(value: N): N | null {
    return value;
  }

  /**
   * Normalize before proceeding to css-to-react-native.
   *
   * @param value - The value to parse
   */
  normalizeBeforeCSSToRNTransform(value: string): string | null {
    return value;
  }

  /**
   * Transform a rule to native rule.
   *
   * @param value - The CSS property value to normalize.
   * @returns The normalized value, or null if normalization failed.
   */
  abstract normalizeRaw(value: string): N | null;

  isShorthand(): boolean {
    return this.model.shorthand;
  }

  shouldIgnoreTransform(): boolean {
    return this.ignoreTransform;
  }
}

export class ForgivingCSSPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C> {
  normalizeRaw(v: any) {
    return v;
  }
}

export class FontCSSValidator<
  C extends CSSPropertyModel
> extends ForgivingCSSPropertyValidator<C> {
  normalizeBeforeCSSToRNTransform(value: string): string | null {
    // A 'font' declaration may end with a list of multiple font families.
    // We must check support for this list before processing.
    const resp = value.split(',');
    let fontFamily = null;
    if (resp.length === 1) {
      return resp[0];
    }
    const base = resp.splice(0, 1)[0];
    for (const font of resp) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported = this.config.isFontSupported(normalizedFont);
      if (isFontSupported) {
        fontFamily =
          typeof isFontSupported === 'string'
            ? isFontSupported
            : normalizedFont;
        break;
      }
    }
    return (
      base.split(/\s+/).slice(0, -1).join(' ') + ' ' + (fontFamily || 'system')
    );
  }
}
export class ColorCSSPropertyValidator<
  C extends CSSPropertyModel
> extends ForgivingCSSPropertyValidator<C> {}

export class EnumerationCSSPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, string> {
  public readonly allowedList: ReadonlyArray<string>;
  constructor(
    { model, config, ignoreTransform = true }: CSSPropertyValidatorParams<C>,
    allowedList: string[]
  ) {
    super({ model, ignoreTransform, config });
    this.allowedList = allowedList;
  }
  normalizeBeforeCSSToRNTransform(value: string) {
    const values = value.split(/\s+/);
    return values[0] || null;
  }

  normalizeRaw(v: string): string | null {
    if (this.allowedList.indexOf(v) !== -1) {
      return v;
    }
    return null;
  }
}

export class EnumerationListCSSPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, string[]> {
  public readonly allowedList: ReadonlyArray<string>;
  constructor(
    { model, config, ignoreTransform = true }: CSSPropertyValidatorParams<C>,
    allowedList: string[]
  ) {
    super({ model, ignoreTransform, config });
    this.allowedList = allowedList;
  }

  normalizeRaw(value: string): string[] {
    const input = value.split(/\s+/);
    const values: string[] = [];
    for (const item of input) {
      if (this.allowedList.indexOf(item) !== -1) {
        values.push(item);
      }
    }
    return values;
  }
}

export class AspectRatioPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, number> {
  normalizeRaw(value: string): number | null {
    const match = /(\d+)\/(\d+)/.exec(value);
    if (match) {
      const ratio = Number(match[1]) / Number(match[2]);
      // Todo handle NaN
      return ratio;
    }
    const fallback = Number(value);
    return Number.isNaN(fallback) ? null : fallback;
  }
}

export class SizeCSSPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, number | string> {
  private computeSize(
    value: number,
    unit: CSSLengthUnit
  ): number | string | null {
    // TODO handle em / rem
    switch (unit) {
      case '%':
        return `${value}%`;
      case 'px':
        return value;
      case 'cm':
      case 'in':
      case 'mm':
      case 'pc':
      case 'pt':
        return value * this.config.absoluteLengthUnitsMultiplicators[unit];
    }
    return null;
  }

  public constructor({
    model,
    config,
    ignoreTransform = true
  }: CSSPropertyValidatorParams<C>) {
    super({ model, config, ignoreTransform });
  }

  normalizeValue(value: number | string) {
    if (typeof value === 'number') {
      return value;
    }
    if (value === '0') {
      return 0;
    }
    if (value === 'auto') {
      return value;
    }
    const match = /(\d+\.?\d*)\s*(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)/g.exec(
      value
    );
    if (match === null) {
      return null;
    }
    return this.computeSize(Number(match[1]), match[2] as CSSLengthUnit);
  }

  normalizeRaw(value: string): string | number | null {
    return this.normalizeValue(value);
  }
}

export class FontSizeCSSValidator<
  C extends CSSPropertyModel
> extends SizeCSSPropertyValidator<C> {
  normalizeValue(value: string) {
    const lookupValue = this.config.hardcodedFontSizesPixelMap[
      value as CSSAbsoluteHardcodedFontSize
    ];
    if (typeof lookupValue === 'number') {
      return lookupValue;
    }
    return super.normalizeValue(value);
  }
}

export class BorderWidthCSSPropertyValidator<
  C extends CSSPropertyModel
> extends SizeCSSPropertyValidator<C> {
  constructor({
    model,
    config,
    ignoreTransform = true
  }: CSSPropertyValidatorParams<C>) {
    super({ model, config, ignoreTransform });
  }

  normalizeRaw(value: string) {
    const lookupValue = this.config.hardcodedBorderWidthsPixelMap[
      value as CSSHardcodedBorderWidth
    ];
    if (typeof lookupValue === 'number') {
      return `${lookupValue}px`;
    }
    return value;
  }

  normalizeValue(value: string | number) {
    return super.normalizeValue(value);
  }
}

export class BorderWidthMultiCSSPropertyValidator<
  C extends CSSPropertyModel
> extends BorderWidthCSSPropertyValidator<C> {
  constructor({ model, config }: CSSPropertyValidatorParams<C>) {
    super({ model, config, ignoreTransform: false });
  }

  normalizeBeforeCSSToRNTransform(value: string) {
    const values = value.split(/\s+/);
    return values.map((v) => super.normalizeRaw(v)).join(' ');
  }
}

export class FloatNumberCSSPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, number> {
  constructor({ model, config }: CSSPropertyValidatorParams<C>) {
    super({ model, config, ignoreTransform: true });
  }

  normalizeRaw(value: string): number | null {
    const normalizedVal = Number(value);
    if (Number.isNaN(normalizedVal)) {
      return null;
    }
    return normalizedVal;
  }
}

export class FontFamilyPropertyValidator<
  C extends CSSPropertyModel
> extends CSSPropertyValidator<C, string> {
  constructor(params: CSSPropertyValidatorParams<C>) {
    super({ ...params, ignoreTransform: true });
  }

  normalizeRaw(value: string): string | null {
    const values = value.split(/,\s*/g);
    for (const font of values) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported = this.config.isFontSupported(normalizedFont);
      if (isFontSupported) {
        return typeof isFontSupported === 'string'
          ? isFontSupported
          : normalizedFont;
      }
    }
    return null;
  }
}

function normalizeFontName(fontName: string) {
  return fontName.replace(/["']/g, '').trim();
}
