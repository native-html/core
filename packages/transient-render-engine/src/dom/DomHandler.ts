import {
  DomHandler as OriginalDomHandler,
  DomHandlerOptions as OriginalDomHandlerOptions,
  Document,
  Element,
  Node,
  Text
} from 'domhandler';
import { isDOMText } from './dom-utils';

/**
 * A record of callback to visit the DOM.
 *
 * @public
 */
export interface DomVisitorCallbacks {
  /**
   * A callback invoked when encountering a DOMDocument.
   *
   * @param document - The document to visit.
   *
   */
  onDocument?(document: Document): void;
  /**
   * A callback invoked when encountering a DOMElement.
   *
   * @param document - The element to visit.
   *
   * @returns - Nothing if the walk should continue, `true` if the walk
   * should stop.
   */
  onElement?(element: Element): void | boolean;
  /**
   * A callback invoked when encountering a DOMText.
   *
   * @param text - The text to visit.
   *
   * @returns - Nothing if the walk should continue, `true` if the walk
   * should stop.
   */
  onText?(text: Text): void | boolean;
}

export interface DomHandlerOptions extends OriginalDomHandlerOptions {
  ignoredTags?: string[];
  visitors?: DomVisitorCallbacks;
  ignoreNode?: (node: Node) => boolean;
}

export default class DomHandler extends OriginalDomHandler {
  private ignoredTags: Record<string, boolean>;
  private ignoredTagsCount = -1;
  private visitors: DomVisitorCallbacks;

  constructor(options: DomHandlerOptions) {
    super(undefined, options, undefined);
    let ignoredTags: DomHandler['ignoredTags'] = {};
    for (const tag of options.ignoredTags || []) {
      ignoredTags[tag] = true;
    }
    this.ignoredTags = ignoredTags;
    this.visitors = options.visitors || {};
    const isIgnored = this.isIgnored.bind(this);
    if (options.ignoreNode) {
      this.isIgnored = (node) => {
        return isIgnored(node) || options.ignoreNode!(node);
      };
    }
  }

  isIgnored(node: Node): boolean {
    return (
      (this.ignoredTags[(node as Element).name] as boolean) ||
      this.ignoredTagsCount > -1
    );
  }

  addNode(node: Node): void {
    if (this.isIgnored(node)) {
      this.ignoredTagsCount++;
    } else {
      super.addNode(node);
      if (isDOMText(node)) {
        this.visitors.onText?.(node);
      }
    }
  }

  onopentag(name: string, attribs: any): void {
    super.onopentag(name, attribs);
  }

  onclosetag() {
    // Call onElement on close to give access to this node children
    this.visitors.onElement?.(
      this.tagStack[this.tagStack.length - 1] as Element
    );
    super.onclosetag();
    if (this.ignoredTagsCount > -1) {
      this.ignoredTagsCount--;
    }
  }

  onend(): void {
    this.visitors.onDocument?.(this.root);
  }
}