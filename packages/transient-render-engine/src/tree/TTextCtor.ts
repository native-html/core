import { Text } from '../dom/dom-utils';
import HTMLContentModel from '../model/HTMLContentModel';

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
import TNodeCtor, { GenericTNodeCtor, Mutable } from './TNodeCtor';

export interface TTextInit extends TNodeInit {
  readonly textNode: Text;
}

export interface TTextImpl extends TNodeImpl<TTextInit> {
  readonly data: string;
  /**
   * True when tagName is defined and should be substituted with text when
   * rendering. E.g. <br> tags.
   */
  readonly isVoid: boolean;
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

const TTextCtor = function TText(this: Mutable<TTextImpl>, init: TTextInit) {
  this.initialize(init);
  this.isVoid = this.elementModel ? this.elementModel.isVoid : false;
} as Function as GenericTNodeCtor<TTextInit, TTextImpl>;

//@ts-ignore
TTextCtor.prototype = new TNodeCtor('text', 'TText', {
  data: {
    get(this: TTextImpl) {
      return this.init.textNode.data;
    },
    set(this: TTextImpl, data: string) {
      this.init.textNode.data = data;
    }
  }
});

TTextCtor.prototype.matchContentModel = function matchContentModel(
  contentModel: HTMLContentModel
) {
  return (
    contentModel === HTMLContentModel.textual ||
    contentModel === HTMLContentModel.mixed
  );
};

TTextCtor.prototype.isCollapsibleLeft = function isCollapsibleLeft(
  this: TTextImpl
) {
  return (
    this.hasWhiteSpaceCollapsingEnabled &&
    !this.isEmpty() &&
    this.data[0] === ' '
  );
};

TTextCtor.prototype.isCollapsibleRight = function isCollapsibleRight(
  this: TTextImpl
) {
  return (
    this.hasWhiteSpaceCollapsingEnabled &&
    !this.isEmpty() &&
    (this.isVoid || this.data[this.data.length - 1] === ' ')
  );
};

TTextCtor.prototype.isEmpty = function isEmpty(this: TTextImpl) {
  // Only anonymous text nodes can be considered "empty"
  return this.tagName === null && !this.data.length;
};

TTextCtor.prototype.trimLeft = function trimLeft(this: Mutable<TTextImpl>) {
  if (this.isCollapsibleLeft()) {
    this.data = this.data.slice(1);
  }
};

TTextCtor.prototype.trimRight = function trimRight(this: Mutable<TTextImpl>) {
  if (this.isCollapsibleRight()) {
    this.data = this.data.substr(0, this.data.length - 1);
  }
};

TTextCtor.prototype.collapseChildren = function collapseChildren(
  this: Mutable<TTextImpl>
) {
  if (this.hasWhiteSpaceCollapsingEnabled) {
    if (this.init.context.removeLineBreaksAroundEastAsianDiscardSet) {
      this.data = collapseWhiteSpacesWithEastAsianCharset(this.data);
    } else {
      this.data = collapseWhiteSpaces(this.data);
    }
  }
  return null;
};

export default TTextCtor;

export { TTextCtor };
