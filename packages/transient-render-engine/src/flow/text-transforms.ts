// TODO, when React Native supports unicode regexes,
// we should use `p{Zs}` instead of [ \t] to comply
// with the CSS3 Text Module standard. https://www.w3.org/TR/css-text-3/#spaces
const COLLAPSIBLE_AROUND_SEGMENT_BREAK_REGEX = /[ \t]*[\r\n\f]+[ \t]*/g;
const CONSECUTIVE_SEGMENT_BREAKS_REGEX = /[\r\n\f]+/g;
const ZERO_WIDTH_SPACES_AROUND_SEGMENT_BREAKS_REGEX =
  /(\u200b\n\u200b?|\u200b?\n\u200b)/g;
const SPACE_DISCARDING_CHARSET_REGEX =
  /([\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uF900-\uFAFF\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFF00-\uFFEF])\n([\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uF900-\uFAFF\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFF00-\uFFEF])/g;
const SEGMENT_BREAK_REGEX = /\n/g;
const SUBSEQUENT_WHITESPACE_REGEX = /[ \t]+/g;

// Implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20201119/#white-space-phase-1
export function removeCollapsibleAroundSegmentBreak(data: string): string {
  return data.replace(COLLAPSIBLE_AROUND_SEGMENT_BREAK_REGEX, '\n');
}

// Implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20201119/#line-break-transform
export function removeConsecutiveSegmentBreaks(data: string): string {
  return data.replace(CONSECUTIVE_SEGMENT_BREAKS_REGEX, '\n');
}

// Implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20200429/#line-break-transform
// In the latest version (https://www.w3.org/TR/2020/WD-css-text-3-20201119/),
// the behavior is considered at UA discretion.
export function normalizeZeroWidthWhitespaces(data: string): string {
  return data.replace(ZERO_WIDTH_SPACES_AROUND_SEGMENT_BREAKS_REGEX, '\u200b');
}

// Partial implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20200429/#line-break-transform
//
// Because RN Javascript runtime doesn't support String.fromCharCode, we don't support space discarding
// for character ranges above U+FFFF
//
// In the latest version (https://www.w3.org/TR/2020/WD-css-text-3-20201119/),
// the behavior is considered at UA discretion.
export function removeLineBreaksAroundEastAsianDiscardSet(
  data: string
): string {
  return data.replace(SPACE_DISCARDING_CHARSET_REGEX, '$1$2');
}

// Implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20201119/#white-space-phase-2
// (A.1)
export function replaceSegmentBreaks(data: string): string {
  return data.replace(SEGMENT_BREAK_REGEX, ' ');
}

// Implementation of
// https://www.w3.org/TR/2020/WD-css-text-3-20201119/#white-space-phase-2
// (A.4)
export function normalizeWhitespaces(data: string): string {
  return data.replace(SUBSEQUENT_WHITESPACE_REGEX, ' ');
}
