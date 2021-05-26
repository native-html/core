import { GenericTNodeCtor, Mutable } from './TNodeCtor';
import HTMLElementModel from '../model/HTMLElementModel';
import { isDomElement, isDomText } from '../dom/dom-utils';
import { TEmptyImpl } from './TEmptyCtor';
import { TNodeInit, TNodeImpl, DocumentContext } from './tree-types';
import TBlockImpl from './TBlockCtor';

export type TDocumentInit = Omit<TNodeInit, 'elementModel'>;

export interface TDocumentImpl extends TNodeImpl<TNodeInit> {
  readonly context: Readonly<DocumentContext>;
  /**
   * Iterate over children and extract meta-information into context field.
   * Replace children with a single-element array containing the body.
   */
  parseChildren(): void;
}

const defaultContextBase: DocumentContext = Object.freeze({
  baseHref: 'about:blank',
  baseTarget: '_self',
  charset: 'utf-8',
  title: '',
  lang: 'en',
  dir: 'ltr',
  links: [],
  meta: []
});

function getDefaultDocumentContext(): DocumentContext {
  return Object.assign({}, defaultContextBase, { links: [], meta: [] });
}

function extractContextFromHead(head: TEmptyImpl, lang?: string, dir?: string) {
  const context = getDefaultDocumentContext();
  if (lang) {
    context.lang = lang;
  }
  if (dir) {
    context.dir = 'rtl';
  }
  const domNode = head.domNode;
  const children = domNode.children;
  children.filter(isDomElement).forEach((child) => {
    if (child.tagName === 'meta') {
      if (child.attribs.name) {
        context.meta.push(child.attribs as any);
      } else if (child.attribs.charset) {
        context.charset = child.attribs.charset.toLowerCase();
      }
    } else if (child.tagName === 'link') {
      context.links.push(child.attribs);
    } else if (child.tagName === 'title') {
      for (const titleChild of child.children.filter(isDomText)) {
        context.title = titleChild.data.trim();
        break;
      }
    } else if (child.tagName === 'base') {
      context.baseHref = child.attribs.href || context.baseHref;
      context.baseTarget = (child.attribs.target as any) || context.baseTarget;
    }
  });
  return context;
}

const htmlModel = HTMLElementModel.fromNativeModel({
  tagName: 'html' as any,
  category: 'grouping'
});

const TDocumentCtor = function TDocument(
  this: Mutable<TDocumentImpl>,
  init: TDocumentInit
) {
  this.initialize(init as TNodeInit);
} as Function as GenericTNodeCtor<TDocumentInit, TDocumentImpl>;

TDocumentCtor.prototype = Object.create(TBlockImpl.prototype);

Object.defineProperty(TDocumentCtor.prototype, 'tagName', {
  value: 'html',
  writable: false
});

Object.defineProperty(TDocumentCtor.prototype, 'type', {
  value: 'document',
  writable: false
});

Object.defineProperty(TDocumentCtor.prototype, 'displayName', {
  value: 'TDocument',
  writable: false
});

Object.defineProperty(TDocumentCtor.prototype, 'elementModel', {
  value: htmlModel,
  writable: false
});

TDocumentCtor.prototype.parseChildren = function parseChildren(
  this: Mutable<TDocumentImpl>
) {
  let head: TEmptyImpl | undefined;
  for (const child of this.children) {
    if (child.tagName === 'head') {
      head = child as unknown as TEmptyImpl;
      break;
    }
  }
  this.context = Object.freeze(
    head
      ? extractContextFromHead(
          head,
          this.attributes!.lang,
          this.attributes!.dir
        )
      : {
          ...getDefaultDocumentContext(),
          lang: this.attributes!.lang,
          dir: this.attributes!.dir as any
        }
  );
};

export { TDocumentCtor };

export default TDocumentCtor;
