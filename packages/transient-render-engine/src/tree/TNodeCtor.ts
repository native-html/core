import {
  ReactNativePropsSwitch,
  ReactNativePropsDefinitions
} from '../helper-types';
import { TStyles } from '../styles/TStyles';
import markersProtype from './markersProtype';
import tnodeToString from './tnodeSnapshot';
import {
  Markers,
  TNodeDescriptor,
  TNodeImpl,
  TNodeInit,
  TNodeType
} from './tree-types';

export type GenericTNodeCtor<Init = TNodeInit, Impl = TNodeImpl> = {
  new (init: Init): Impl;
  prototype: Impl;
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

function updateNodeIndexes(node: Mutable<TNodeImpl>, i: number) {
  node.nodeIndex = i;
}

const emptyAttrs = Object.freeze({});
const emptyClasses = Object.freeze([]);

function setMarkersFromAttributes(
  targetMarkers: Markers,
  _parentMarkers: Readonly<Markers>,
  { attributes }: TNodeDescriptor
): void {
  if ('dir' in attributes) {
    targetMarkers.direction = attributes.dir as 'rtl';
  }
  if ('lang' in attributes) {
    targetMarkers.lang = attributes.lang;
  }
}

function transformPropsDefinitionsToSwitch(
  definition?: ReactNativePropsDefinitions | null
): ReactNativePropsSwitch | null {
  if (!definition) {
    return null;
  }
  return {
    text: {
      ...definition.all,
      ...definition.text
    },
    view: {
      ...definition.all,
      ...definition.view
    }
  };
}

const prototype: Omit<TNodeImpl, 'displayName' | 'type'> = {
  children: Object.freeze([]) as any,
  init: Object.freeze({}) as any,
  classes: Object.freeze([]) as any,
  styles: Object.freeze(TStyles.empty()) as any,
  markers: markersProtype,
  __nodeIndex: null,
  __trimmedLeft: false,
  __trimmedRight: false,
  __nativeProps: false,
  __generateNativeProps() {
    const elm = this.elementModel;
    if (elm) {
      if (!elm.getDynamicReactNativeProps && !elm.reactNativeProps) {
        return null;
      }
      const staticSwitchProps = transformPropsDefinitionsToSwitch(
        elm.reactNativeProps
      );
      if (!elm.getDynamicReactNativeProps) {
        return staticSwitchProps;
      }
      const derivedSwitch = transformPropsDefinitionsToSwitch(
        elm.getDynamicReactNativeProps(this as any) || null
      );
      if (staticSwitchProps && derivedSwitch) {
        return {
          view: {
            ...staticSwitchProps.view,
            ...derivedSwitch.view
          },
          text: {
            ...staticSwitchProps.text,
            ...derivedSwitch.text
          }
        };
      }
      return derivedSwitch;
    }
    return null;
  },
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

  get domNode() {
    return this.init.domNode || null;
  },

  get elementModel() {
    return this.init.elementModel;
  },

  get tagName() {
    return this.init.domNode?.name || null;
  },

  get parent() {
    return (this.init.parent as any) || null;
  },

  get nodeIndex() {
    if (this.__nodeIndex === null) {
      this.__nodeIndex = this.init.nodeIndex || 0;
    }
    return this.__nodeIndex;
  },

  get isUnregistered() {
    return this.init.isUnregistered || false;
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
    let offset = 0;
    for (const i of indexesToSplice) {
      //@ts-ignore
      this.children.splice(i - offset, 1);
      offset += 1;
    }
  },

  collapse() {
    this.collapseChildren();
    this.bindChildren(this.children, true);
  },

  getNativeStyles() {
    return {
      ...this.styles.nativeBlockFlow,
      ...this.styles.nativeBlockRet,
      ...this.styles.nativeTextFlow,
      ...this.styles.nativeTextRet
    };
  },

  getWebStyles() {
    return {
      ...this.styles.webTextFlow,
      ...this.styles.webBlockRet
    } as any;
  },

  collapseChildren() {
    return;
  },

  snapshot(options = {}) {
    const { withStyles = false, withNodeIndex = false } = options;
    return tnodeToString(this as any, { withStyles, withNodeIndex });
  },

  hasClass(className) {
    return this.classes.indexOf(className) > -1;
  },

  toString() {
    return this.snapshot();
  },

  setMarkers(targetMarkers, parentMarkers) {
    if (this.elementModel?.setMarkersForTNode) {
      this.elementModel.setMarkersForTNode(targetMarkers, parentMarkers, this);
    }
    setMarkersFromAttributes(targetMarkers, parentMarkers, this);
    this.init.context.setMarkersForTNode?.(targetMarkers, parentMarkers, this);
  },

  getReactNativeProps() {
    if (this.__nativeProps === false) {
      this.__nativeProps = this.__generateNativeProps();
    }
    return this.__nativeProps;
  },

  initialize<Impl extends TNodeImpl<TNodeInit> = TNodeImpl>(
    this: Mutable<Impl>,
    init: Impl['init']
  ) {
    this.init = init;
    this.classes = this.attributes.class?.split(/\s+/) || emptyClasses;
    const parentMarkers = init.parent
      ? init.parent.markers
      : markersProtype.extend();
    this.markers = parentMarkers.extend();
    this.setMarkers(this.markers, parentMarkers, this);
    // Avoid very long prototype chains by assigning parent to current
    // when current has no own properties
    if (Object.keys(this.markers).length === 0) {
      this.markers = parentMarkers;
    }
    this.styles =
      init.styles ||
      init.context.stylesMerger.buildStyles(
        this.attributes.style,
        this.parentStyles || null,
        this
      );
  }
};

const TNodeCtor = function TNode<Impl extends TNodeImpl = TNodeImpl>(
  this: Mutable<TNodeImpl>,
  type: TNodeType,
  displayName: string,
  extraAccessors?: {
    [k in Exclude<keyof Impl, keyof TNodeImpl>]: {
      get: () => any;
      set?: (val: any) => void;
    };
  }
) {
  this.type = type;
  this.displayName = displayName;
  extraAccessors && Object.defineProperties(this, extraAccessors);
};

TNodeCtor.prototype = prototype as any;

export default TNodeCtor;
