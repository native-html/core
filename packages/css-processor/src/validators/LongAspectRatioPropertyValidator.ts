import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyModel } from './types';

const ASPECT_RATIO_REGEX = /^(\d+)\/(\d+)$/;

export class LongAspectRatioPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, number> {
  normalizeRawInlineCSSValue(value: string): number | null {
    const match = ASPECT_RATIO_REGEX.exec(value);
    if (match) {
      const ratio = Number(match[1]) / Number(match[2]);
      return Number.isFinite(ratio) ? ratio : null;
    }
    const fallback = Number(value);
    return Number.isNaN(fallback) ? null : fallback;
  }

  normalizeNativeValue(value: string | number): number | null {
    return typeof value !== 'string'
      ? value
      : this.normalizeRawInlineCSSValue(value);
  }
}
