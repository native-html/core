import {
  DomHandler as OriginalDomHandler,
  DomHandlerOptions as OriginalDomHandlerOptions,
  Document,
  Element,
  Node,
  Text,
  NodeWithChildren
} from 'domhandler';
import { isDomElement, isDomText } from './dom-utils';

/**
 * A record of callback to visit the DOM.
 *
 * @public
 */
export interface DomVisitorCallbacks {
  /**
   * A callback invoked when encountering a {@link Document}.
   *
   * @param document - The document to visit.
   *
   */
  onDocument?(document: Document): void;
  /**
   * A callback invoked when encountering an {@link Element}.
   *
   * @param element - The element to visit.
   */
  onElement?(element: Element): void;
  /**
   * A callback invoked when encountering a {@link Text} node.
   *
   * @param text - The text to visit.
   */
  onText?(text: Text): void;
}

export interface DomHandlerOptions extends OriginalDomHandlerOptions {
  ignoredTags?: string[];
  visitors?: DomVisitorCallbacks;
  ignoreNode?: (
    node: Node,
    parent: NodeWithChildren
  ) => boolean | void | unknown;
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
        return (
          isIgnored(node) ||
          options.ignoreNode!(node, this.tagStack[this.tagStack.length - 1])
        );
      };
    }
  }

  isIgnored(node: Node): boolean | unknown | void {
    return (
      (this.ignoredTags[(node as Element).name] as boolean) ||
      this.ignoredTagsCount > -1
    );
  }

  addNode(node: Node): void {
    if (this.isIgnored(node) === true) {
      // increment only for elements.
      if (isDomElement(node)) {
        this.ignoredTagsCount++;
      }
    } else {
      super.addNode(node);
      if (isDomText(node)) {
        this.visitors.onText?.(node);
      }
    }
  }

  ontext(text: string) {
    // Only include text when out of an
    // ignoring session.
    if (this.ignoredTagsCount < 0) {
      super.ontext(text);
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
