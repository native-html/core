import { DOMText } from '../dom/dom-utils';
import HTMLContentModel from '../model/HTMLContentModel';
import makeTNodePrototype, {
  TNodeCtor,
  Mutable,
  initialize
} from './makeTNodePrototype';
import compose from 'ramda/src/compose';
import { TNodeInit, TNodeImpl } from './tree-types';
import {
  normalizeWhitespaces,
  normalizeZeroWidthWhitespaces,
  removeCollapsibleAroundSegmentBreak,
  removeConsecutiveSegmentBreaks,
  removeLineBreaksAroundEastAsianDiscardSet,
  replaceSegmentBreaks
} from '../flow/text-transforms';

export interface TTextInit extends TNodeInit {
  readonly textNode: DOMText;
}

export interface TTextImpl extends TNodeImpl<TTextInit> {
  readonly data: string;
}

const collapseWhiteSpaces = compose(
  normalizeWhitespaces,
  replaceSegmentBreaks,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
);

const collapseWhiteSpacesWithEastAsianCharset = compose(
  normalizeWhitespaces,
  replaceSegmentBreaks,
  removeLineBreaksAroundEastAsianDiscardSet,
  normalizeZeroWidthWhitespaces,
  removeConsecutiveSegmentBreaks,
  removeCollapsibleAroundSegmentBreak
);

const TText = (function TText(this: Mutable<TTextImpl>, init: TTextInit) {
  initialize(this, init);
} as Function) as TNodeCtor<TTextInit, TTextImpl>;

TText.prototype = makeTNodePrototype('text', 'TText', {
  data: {
    get(this: TTextImpl) {
      return this.init.textNode.data;
    },
    set(this: TTextImpl, data: string) {
      this.init.textNode.data = data;
    }
  }
});

TText.prototype.matchContentModel = function matchContentModel(
  contentModel: HTMLContentModel
) {
  return (
    contentModel === HTMLContentModel.textual ||
    contentModel === HTMLContentModel.mixed
  );
};

TText.prototype.isCollapsibleLeft = function isCollapsibleLeft(
  this: TTextImpl
) {
  return (
    this.hasWhiteSpaceCollapsingEnabled &&
    !this.isEmpty() &&
    this.data[0] === ' '
  );
};

TText.prototype.isCollapsibleRight = function isCollapsibleRight(
  this: TTextImpl
) {
  return (
    this.hasWhiteSpaceCollapsingEnabled &&
    !this.isEmpty() &&
    this.data[this.data.length - 1] === ' '
  );
};

TText.prototype.isEmpty = function isEmpty(this: TTextImpl) {
  // Only anonymous text nodes can be considered "empty"
  return this.tagName === null && !this.data.length;
};

TText.prototype.trimLeft = function trimLeft(this: Mutable<TTextImpl>) {
  if (this.isCollapsibleLeft()) {
    this.data = this.data.slice(1);
  }
};

TText.prototype.trimRight = function trimRight(this: Mutable<TTextImpl>) {
  if (this.isCollapsibleRight()) {
    this.data = this.data.substr(0, this.data.length - 1);
  }
};

TText.prototype.collapseChildren = function collapseChildren(
  this: Mutable<TTextImpl>,
  params
) {
  if (this.hasWhiteSpaceCollapsingEnabled) {
    if (params.removeLineBreaksAroundEastAsianDiscardSet) {
      this.data = collapseWhiteSpacesWithEastAsianCharset(this.data);
    } else {
      this.data = collapseWhiteSpaces(this.data);
    }
  }
  return null;
};

export default TText;

export { TText };
