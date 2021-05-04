import { TNodeImpl, TNodeInit, TNodeInvariants, TNodeType } from './tree-types';

export type TNodeCtor<Init = TNodeInit, Impl = TNodeImpl> = {
  new (init: Init): Impl;
  prototype: Impl;
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

function updateNodeIndexes(node: Mutable<TNodeImpl>, i: number) {
  node.nodeIndex = i;
}

const emptyAttrs = {};

const prototype: Omit<TNodeImpl, keyof TNodeInvariants> & {
  // TODO remove
  className: string;
} = {
  children: Object.freeze([]) as any,
  init: Object.freeze({}) as any,
  __classes: null,
  __styles: null,
  __nodeIndex: null,
  __trimmedLeft: false,
  __trimmedRight: false,
  get attributes() {
    return this.domNode?.attribs || emptyAttrs;
  },

  get hasWhiteSpaceCollapsingEnabled() {
    return typeof this.styles.webTextFlow.whiteSpace === 'string'
      ? this.styles.webTextFlow.whiteSpace === 'normal'
      : true;
  },

  get contentModel() {
    return this.elementModel?.contentModel || null;
  },

  get parentStyles() {
    return this.init.parentStyles || this.parent?.styles || null;
  },

  get id() {
    return this.attributes.id || null;
  },

  get classes() {
    if (this.__classes === null) {
      this.__classes = this.attributes.class?.split(/\s+/) || [];
    }
    return this.__classes;
  },

  get className() {
    // TODO remove
    return this.attributes.class;
  },

  get domNode() {
    return this.init.domNode || null;
  },

  get elementModel() {
    return this.init.elementModel;
  },

  get stylesMerger() {
    return this.init.stylesMerger;
  },

  get styles() {
    if (this.__styles === null) {
      const self = (this as unknown) as TNodeImpl;
      this.__styles =
        self.init.styles ||
        self.init.stylesMerger.buildStyles(
          self.attributes.style,
          self.parentStyles || null,
          (this as unknown) as any
        );
    }
    return this.__styles;
  },

  get tagName() {
    return this.init.domNode?.name || null;
  },

  get parent() {
    return this.init.parent || null;
  },

  get nodeIndex() {
    if (this.__nodeIndex === null) {
      this.__nodeIndex = this.init.nodeIndex || 0;
    }
    return this.__nodeIndex;
  },

  set nodeIndex(nodeIndex: number) {
    this.__nodeIndex = nodeIndex;
  },

  bindChildren(children, shouldUpdateNodeIndexes = false) {
    //@ts-ignore
    this.children = children;
    if (shouldUpdateNodeIndexes) {
      children.forEach(updateNodeIndexes);
    }
  },

  cloneInitParams(partial) {
    return Object.assign({}, this.init, partial) as any;
  },

  isCollapsibleLeft() {
    if (this.children.length) {
      return (
        this.hasWhiteSpaceCollapsingEnabled &&
        this.children[0].isCollapsibleLeft()
      );
    }
    return false;
  },

  isCollapsibleRight() {
    if (this.children.length) {
      return (
        this.hasWhiteSpaceCollapsingEnabled &&
        this.children[this.children.length - 1].isCollapsibleRight()
      );
    }
    return false;
  },

  isWhitespace() {
    return false;
  },

  isEmpty() {
    return false;
  },

  trimLeft() {
    if (!this.__trimmedLeft && this.children.length) {
      const firstChild = this.children[0];
      firstChild.trimLeft();
      if (firstChild.isEmpty()) {
        //@ts-ignore
        this.children.splice(0, 1);
      }
      this.__trimmedLeft = true;
    }
  },

  trimRight() {
    if (!this.__trimmedRight && this.children.length) {
      const lastChild = this.children[this.children.length - 1];
      lastChild.trimRight();
      if (lastChild.isEmpty()) {
        //@ts-ignore
        this.children.splice(-1, 1);
      }
      this.__trimmedRight = true;
    }
  },

  matchContentModel() {
    return false;
  },

  spliceChildren(indexesToSplice) {
    if (indexesToSplice) {
      let offset = 0;
      for (const i of indexesToSplice) {
        //@ts-ignore
        this.children.splice(i - offset, 1);
        offset += 1;
      }
    }
  },

  collapse(params) {
    this.collapseChildren(params);
    this.bindChildren(this.children, true);
  },

  collapseChildren() {
    return;
  }
};

export function initialize<Impl extends TNodeImpl<any> = TNodeImpl>(
  self: Mutable<Impl>,
  init: Impl['init']
) {
  // self.init = init;
  Object.defineProperty(self, 'init', {
    get: () => init,
    enumerable: false
  });
}

const PCtor = (function PCtor(
  this: Mutable<TNodeImpl>,
  type: TNodeType,
  displayName: string
) {
  this.type = type;
  this.displayName = displayName;
} as unknown) as {
  new (type: TNodeType, displayName: string): TNodeImpl;
  prototype: TNodeImpl;
};

PCtor.prototype = (prototype as unknown) as TNodeImpl;

export default function makeTNodePrototype<Impl = TNodeImpl>(
  type: TNodeType,
  displayName: string,
  extraAccessors?: {
    [k in Exclude<keyof Impl, keyof TNodeImpl>]?: {
      get: () => any;
      set?: (val: any) => void;
    };
  }
): Impl {
  //@ts-ignore
  return Object.create(new PCtor(type, displayName), extraAccessors);
}
