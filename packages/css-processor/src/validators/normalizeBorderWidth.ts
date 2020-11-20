import { CSSProcessorConfig } from '../config';
import { lookupRecord } from '../helpers';

export default function normalizeBorderWidth(
  config: CSSProcessorConfig,
  value: string
) {
  if (lookupRecord(config.absoluteBorderWidthsPixelMap, value)) {
    return `${config.absoluteBorderWidthsPixelMap[value]}px`;
  }
  return value;
}
