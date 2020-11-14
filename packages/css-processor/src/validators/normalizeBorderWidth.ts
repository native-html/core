import { CSSProcessorConfig } from '../config';
import { lookupRecord } from '../helpers';

export default function normalizeBorderWidth(
  config: CSSProcessorConfig,
  value: string
) {
  if (lookupRecord(config.hardcodedBorderWidthsPixelMap, value)) {
    return `${config.hardcodedBorderWidthsPixelMap[value]}px`;
  }
  return value;
}
