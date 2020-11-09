import { TNode, TNodeInit } from './TNode';
import { TEmpty } from './TEmpty';
import { TBlock } from './TBlock';

export interface DocumentContext {
  charset: string;
  baseHref: string;
  baseTarget: '_blank' | '_self' | '_parent' | '_top';
  lang: string;
  title: string;
  meta: { name: string; value: string }[];
  links: Record<string, string>[];
}

function getDefaultDocumentContext(): DocumentContext {
  return {
    baseHref: 'about:blank',
    baseTarget: '_blank',
    charset: 'utf-8',
    title: '',
    lang: 'en',
    links: [],
    meta: []
  };
}

function extractContextFromHead(head: TNode, lang?: string) {
  const context = getDefaultDocumentContext();
  if (lang) {
    context.lang = lang;
  }
  if (head instanceof TEmpty) {
    const domNode = head.domNode;
    if (domNode?.type === 'element') {
      const children = domNode.children;
      for (const child of children) {
        if (child.type === 'element') {
          if (child.tagName === 'meta') {
            if (child.attribs.name) {
              context.meta.push(child.attribs as any);
            } else if (child.attribs.charset) {
              context.charset = child.attribs.charset.toLowerCase();
            }
          } else if (child.tagName === 'link') {
            context.links.push(child.attribs);
          } else if (child.tagName === 'title') {
            for (const titleChild of child.children) {
              if (titleChild.type === 'text') {
                context.title = titleChild.data.trim();
              }
            }
          } else if (child.tagName === 'base') {
            context.baseHref = child.attribs.href || context.baseHref;
            context.baseTarget =
              (child.attribs.target as any) || context.baseTarget;
          }
        }
      }
    }
  }

  return context;
}

export class TDocument extends TBlock {
  public readonly context: Readonly<DocumentContext>;
  constructor({ children = [], attributes }: TNodeInit) {
    super({ tagName: 'html', attributes });
    this.type = 'document';
    let head: TNode = new TEmpty({ tagName: 'head' });
    let body: TNode = new TBlock({ tagName: 'body' });
    for (const child of children) {
      if (child.tagName === 'head') {
        head = child;
      } else if (child.tagName === 'body') {
        body = child;
      }
    }
    this.children = [body];
    this.context = Object.freeze(
      extractContextFromHead(head, this.attributes.lang)
    );
  }
}
