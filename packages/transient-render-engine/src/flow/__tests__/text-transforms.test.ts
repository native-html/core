import {
  removeLineBreaksAroundEastAsianDiscardSet,
  normalizeZeroWidthWhitespaces,
  removeCollapsibleAroundSegmentBreak,
  removeConsecutiveSegmentBreaks,
  replaceSegmentBreaks
} from '../text-transforms';

describe('removeCollapsibleAroundSegmentBreak function', () => {
  it('should remove spaces and tabs before and after segment breaks', () => {
    expect(removeCollapsibleAroundSegmentBreak('This is   \n Great')).toEqual(
      'This is\nGreat'
    );
  });
  it('should perform on multiple lines', () => {
    expect(
      removeCollapsibleAroundSegmentBreak(
        'This is \n Great \n I Believe \n In angels'
      )
    ).toEqual('This is\nGreat\nI Believe\nIn angels');
  });
  it('should handle form feed', () => {
    expect(
      removeCollapsibleAroundSegmentBreak(
        'This is \f Great \f I Believe \f In angels'
      )
    ).toEqual('This is\nGreat\nI Believe\nIn angels');
  });
  it('should work with sequences of carriage return and line feed', () => {
    expect(removeCollapsibleAroundSegmentBreak('This is \r\n Great')).toEqual(
      'This is\nGreat'
    );
  });
  it('should work with sequences line feeds', () => {
    expect(removeCollapsibleAroundSegmentBreak('This is \n\n\n Great')).toEqual(
      'This is\nGreat'
    );
  });
  it('should not remove zero-width space before and after segment breaks', () => {
    expect(
      removeCollapsibleAroundSegmentBreak('This is\u200b\n\u200bGreat')
    ).toEqual('This is\u200b\n\u200bGreat');
  });
});

describe('removeConsecutiveSegmentBreaks function', () => {
  it('should remove consecutive segment breaks', () => {
    expect(removeConsecutiveSegmentBreaks('This is\n\n\nGreat')).toEqual(
      'This is\nGreat'
    );
  });
  it('should handle form feed', () => {
    expect(removeConsecutiveSegmentBreaks('This is\f\f\fGreat')).toEqual(
      'This is\nGreat'
    );
  });
});

describe('normalizeZeroWidthWhitespaces function', () => {
  it('should replace line feeds preceded with zero-width whitespace with a zero-width whitespace', () => {
    expect(normalizeZeroWidthWhitespaces('This is\u200b\nGreat')).toEqual(
      'This is\u200bGreat'
    );
  });
  it('should replace line feeds followed by a zero-width whitespace with a zero-width whitespace', () => {
    expect(normalizeZeroWidthWhitespaces('This is\n\u200bGreat')).toEqual(
      'This is\u200bGreat'
    );
  });
  it('should replace line feeds both preceded and followed by a zero-width whitespace with a zero-width whitespace', () => {
    expect(normalizeZeroWidthWhitespaces('This is\u200b\n\u200bGreat')).toEqual(
      'This is\u200bGreat'
    );
  });
});

describe('removeLineBreaksAroundEastAsianDiscardSet function', () => {
  it('should remove new line characters surrounded by dpace discarding characters', () => {
    expect(removeLineBreaksAroundEastAsianDiscardSet('\u2F00\n\u2FDA')).toEqual(
      '\u2F00\u2FDA'
    );
  });
});

describe('replaceSegmentBreaks function', () => {
  it('should replace segment breaks with space characters', () => {
    expect(replaceSegmentBreaks('\nThis is\n')).toEqual(' This is ');
  });
});
