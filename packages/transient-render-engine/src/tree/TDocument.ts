import { TNodeInit } from './TNode';
import { TEmpty } from './TEmpty';
import { TBlock } from './TBlock';
import {
  isSerializableElement,
  isSerializableText
} from '../dom/to-serializable';
import HTMLElementModel from '../model/HTMLElementModel';
import defaultHTMLElementModels from '../model/defaultHTMLElementModels';

export interface DocumentContext {
  charset: string;
  baseHref: string;
  baseTarget: '_blank' | '_self' | '_parent' | '_top';
  lang: string;
  title: string;
  meta: { name: string; value: string }[];
  links: Record<string, string>[];
}

const defaultContextBase: DocumentContext = Object.freeze({
  baseHref: 'about:blank',
  baseTarget: '_self',
  charset: 'utf-8',
  title: '',
  lang: 'en',
  links: [],
  meta: []
});

function getDefaultDocumentContext(): DocumentContext {
  return Object.assign({}, defaultContextBase, { links: [], meta: [] });
}

function extractContextFromHead(head: TEmpty, lang?: string) {
  const context = getDefaultDocumentContext();
  if (lang) {
    context.lang = lang;
  }
  const domNode = head.domNode;
  const children = domNode.children;
  children.filter(isSerializableElement).forEach((child) => {
    if (child.tagName === 'meta') {
      if (child.attribs.name) {
        context.meta.push(child.attribs as any);
      } else if (child.attribs.charset) {
        context.charset = child.attribs.charset.toLowerCase();
      }
    } else if (child.tagName === 'link') {
      context.links.push(child.attribs);
    } else if (child.tagName === 'title') {
      for (const titleChild of child.children.filter(isSerializableText)) {
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

export class TDocument extends TBlock {
  public readonly context: Readonly<DocumentContext>;
  public readonly displayName = 'TDocument';
  constructor({
    attributes,
    stylesMerger,
    styles,
    domNode
  }: Omit<TNodeInit, 'contentModel' | 'elementModel' | 'parentStyles'>) {
    super({
      tagName: 'html',
      styles,
      attributes,
      contentModel: htmlModel.contentModel,
      elementModel: htmlModel,
      parentStyles: null,
      stylesMerger,
      domNode,
      nodeIndex: 0,
      parent: null
    });
    // @ts-ignore
    this.type = 'document';
    this.context = defaultContextBase;
  }

  /**
   * Iterate over children and extract meta-information into context field.
   * Replace children with a single-element array containing the body.
   */
  parseChildren() {
    let head: TEmpty | undefined;
    let body: TBlock | undefined;
    for (const child of this.children) {
      if (head && body) {
        break;
      }
      if (child.tagName === 'head') {
        head = child as TEmpty;
      } else if (child.tagName === 'body') {
        body = child;
      }
    }
    this.bindChildren([
      body ||
        new TBlock({
          tagName: 'body',
          contentModel: defaultHTMLElementModels.body.contentModel,
          elementModel: defaultHTMLElementModels.body,
          stylesMerger: this.stylesMerger,
          parentStyles: this.styles,
          domNode: null,
          nodeIndex: 0,
          parent: this
        })
    ]);
    //@ts-ignore
    this.context = Object.freeze(
      extractContextFromHead(
        head ||
          new TEmpty({
            tagName: 'head',
            isUnregistered: false,
            stylesMerger: this.stylesMerger,
            parentStyles: null,
            contentModel: defaultHTMLElementModels.head.contentModel,
            elementModel: defaultHTMLElementModels.head,
            domNode: {
              type: 'element',
              attribs: {},
              children: [],
              tagName: 'head'
            },
            nodeIndex: 0,
            parent: this
          }),
        this.attributes.lang
      )
    );
  }
}
