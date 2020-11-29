export function removeCollapsibleAroundSegmentBreak(data: string): string {
  return data.replace(/[ \t]*[\r\n\f]+[ \t]*/g, '\n');
}

export function removeConsecutiveSegmentBreaks(data: string): string {
  return data.replace(/[\r\n\f]+/g, '\n');
}

export function normalizeZeroWidthWhitespaces(data: string): string {
  return data.replace(/(\u200b\n\u200b?|\u200b?\n\u200b)/g, '\u200b');
}

const unicodeSpaceDiscarding =
  '[\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uF900-\uFAFF\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFF00-\uFFEF]';

// See https://www.w3.org/TR/css-text-3/#space-discard-set
// Because RN Javascript runtime doesn't support String.fromCharCode, we don't support space discarding
// for character ranges above U+FFFF
export function normalizeSpaceDiscardingCharset(data: string): string {
  return data.replace(
    new RegExp(`(${unicodeSpaceDiscarding})\n(${unicodeSpaceDiscarding})`, 'g'),
    '$1$2'
  );
}

export function replaceSegmentBreaks(data: string): string {
  return data.replace(/\n/g, ' ');
}

export function normalizeWhitespaces(data: string): string {
  return data.replace(/[ \t]+/g, ' ');
}
