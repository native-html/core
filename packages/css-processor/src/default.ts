import { CSSProcessorConfig } from './config';

const inchMultiplicator = 96;
const cmMultiplicator = inchMultiplicator * 2.54;
const mmMultiplicator = cmMultiplicator / 10;
const ptMultiplicator = 4 / 3;
const pcMultiplicator = 12 * ptMultiplicator;

export const defaultCSSProcessorConfig: CSSProcessorConfig = {
  absoluteLengthUnitsMultiplicators: {
    cm: cmMultiplicator,
    in: inchMultiplicator,
    mm: mmMultiplicator,
    pc: pcMultiplicator,
    pt: ptMultiplicator
  },
  absoluteBorderWidthsPixelMap: {
    medium: 2.5,
    thick: 5,
    thin: 1
  },
  absoluteFontSizesPixelMap: {
    medium: 14,
    'xx-small': 8.5,
    'x-small': 10,
    small: 12,
    large: 17,
    'x-large': 20,
    'xx-large': 24
  },
  relativeFontSizesCoefficientMap: {
    larger: 1.2,
    smaller: 0.83
  },
  inlinePropertiesBlacklist: [],
  rootFontSize: 16,
  inlinePropertiesWhitelist: null,
  isFontSupported() {
    return true;
  }
};
