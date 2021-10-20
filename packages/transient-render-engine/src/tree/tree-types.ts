import { Element, Text } from '../dom/dom-utils';
import { ReactNativePropsSwitch } from '../helper-types';
import HTMLContentModel from '../model/HTMLContentModel';
import HTMLElementModel from '../model/HTMLElementModel';
import { TStylesShape } from '../styles/TStyles';
import { TStylesMerger } from '../styles/TStylesMerger';

export interface TNodeInit {
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly context: {
    readonly stylesMerger: TStylesMerger;
    readonly setMarkersForTNode?: SetMarkersForTNode;
    readonly removeLineBreaksAroundEastAsianDiscardSet: boolean;
  };
  readonly parent?: TNodeImpl | null;
  readonly domNode?: Element | null;
  readonly styles?: TStylesShape | null;
  readonly parentStyles?: TStylesShape | null;
  readonly nodeIndex?: number;
  readonly isUnregistered?: boolean;
}

/**
 * A minimal TNode shape accessible at instantiation.
 *
 * @public
 */
export interface TNodeDescriptor {
  /**
   * Attributes for this tag.
   */
  readonly attributes: Record<string, string>;
  /**
   * The id for this node, extracted from the id attribute of the
   * underlying {@link Node}.
   */
  readonly id: string | null;
  /**
   * A list of classes for this node, extracted from the class attribute of the
   * underlying {@link Node}.
   */
  readonly classes: string[];
  /**
   * A reference to the underlying DOM node.
   */
  readonly domNode: Element | null;
  /**
   * The tag name for this node.
   *
   * @remarks Anonymous nodes generated during hoisting won't have a tag name.
   * Also, some TText nodes don't have a tagName.
   */
  readonly tagName: string | null;
  /**
   * Markers form an abstraction in which one node provides semantic information
   * to itself and all its descendants. For example, `ins` elements, which stand
   * for "insertion" of content in the context of an edit will provide the {
   * edits: 'ins' } marker to all its descendants.
   *
   * @remarks This attribute must be considered immutable. Never try to
   * change it by hand, or you might update the markers of an anscestor! For
   * performance reasons, markers instances might be shared from parent to
   * children when they are equal.
   */
  readonly markers: Readonly<Markers>;

  /**
   * Check if this {@link TNode} has the given `className`.
   *
   * @param className - The class to check.
   */
  hasClass(className: string): boolean;
}

/**
 * A function to set markers for a specific {@link TNode}.
 *
 * @param targetMarkers - The markers instance to alter.
 * @param parentMarkers - Th direct ascendant markers instance for this tnode.
 * @param tnode - The minimalistic {@link TNodeDescriptor} to which the
 * `targetMarkers` will be attached.
 *
 * @public
 */
export type SetMarkersForTNode = (
  targetMarkers: Markers,
  parentMarkers: Readonly<Markers>,
  tnode: TNodeDescriptor
) => void;

/**
 * Markers form an abstraction in which one node provides semantic information
 * to itself and all its descendants. For example, `ins` elements, which stand
 * for "insertion" of content in the context of an edit will provide the {
 * edits: 'ins' } marker to all its descendants.
 *
 * @remarks
 * Custom renderers can use markers to change their layout and convey their
 * semantic meaning. Markers can be derived from attributes, such as `lang` and
 * `dir` attributes, or tag names, such as `a`, `ins`, `del`...
 *
 * **TypeScript users**: You can add fields to the {@link Markers} interface via
 * {@link https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation | module augmentation}:
 *
 * ```ts
 * declare module '@native-html/transient-render-engine' {
 *   interface Markers {
 *     customField?: boolean;
 *   }
 * }
 * ```
 */
export interface Markers {
  /**
   * If this node is an `a` or has one as ancestor, this field will be set to
   * `true`.
   *
   * @defaultValue false
   */
  anchor: boolean;
  /**
   * If this node is a `del` or `ins` or has either as ancestor, this field
   * will be set accordingly. Otherwise, it will be set to 'none'.
   *
   * https://html.spec.whatwg.org/#edits
   *
   * @defaultValue 'none'
   */
  edits: 'ins' | 'del' | 'none';
  /**
   * The direction for this content. Follows `dir` attribute.
   *
   * https://html.spec.whatwg.org/#the-dir-attribute
   *
   * @defaultValue 'ltr'
   */
  direction: 'ltr' | 'rtl';
  /**
   * The language for this content. Follows `lang` attribute.
   *
   * https://html.spec.whatwg.org/#the-lang-and-xml:lang-attributes
   */
  lang: string;
  /**
   * * -1: this node is not an `ol` and has no `ol` parents
   * * 0: this node is an `ol` or has one `ol` parent
   * * 1: ...
   */
  olNestLevel: number;
  /**
   * * -1: this node is not an `ul` and has no `ul` parents
   * * 0: this node is an `ul` or has one `ul` parent
   * * 1: ...
   */
  ulNestLevel: number;
  /**
   * Create a new marker instance which extends this markers.
   */
  extend(this: Markers): Markers;
  /**
   * Return a string represenation of this marker, including inherited
   * properties from parent markers.
   */
  toString(): string;
}

/**
 * @public
 */
export interface TNodePrintOptions {
  /**
   * Include styles in snapshot.
   */
  withStyles: boolean;
  /**
   * Include node index in snapshot.
   */
  withNodeIndex: boolean;
}

/**
 * Processed styles which can be passed to `View` elements.
 *
 * @public
 */
export type NativeBlockStyles = TStylesShape['nativeBlockFlow'] &
  TStylesShape['nativeBlockRet'];

/**
 * Processed styles which can be passed to `Text` elements.
 *
 * @public
 */
export type NativeTextStyles = TStylesShape['nativeBlockFlow'] &
  TStylesShape['nativeBlockRet'] &
  TStylesShape['nativeTextFlow'] &
  TStylesShape['nativeTextRet'];

/**
 * Processed Web text styles.
 *
 * @public
 */
export type WebTextStyles = TStylesShape['webTextFlow'];

/**
 * Processed Web block styles.
 *
 * @public
 */
export type WebBlockStyles = TStylesShape['webBlockRet'];

/**
 * Shared properties for all {@link TNode} types.
 *
 * @public
 */
export interface TNodeShape<T extends TNodeType> {
  /**
   * Attributes for this tag.
   */
  readonly attributes: Record<string, string>;
  /**
   * The id for this node, extracted from the id attribute of the
   * underlying {@link Node}.
   */
  readonly id: string | null;
  /**
   * A list of classes for this node, extracted from the class attribute of the
   * underlying {@link Node}.
   */
  readonly classes: string[];
  /**
   * Non-anonymous nodes will hold a reference to a DOM node.
   */
  readonly domNode: Element | null;
  /**
   * The tag name for this node.
   *
   * @remarks Anonymous nodes generated during hoisting won't have a tag name.
   * Also, some TText nodes don't have a tagName.
   */
  readonly tagName: string | null;
  /**
   * The parent of this node before hoisting.
   *
   * @remarks
   * "Before hoisting" implies that this parent will not match "anonymous"
   * parents.
   */
  readonly parent: TDocument | TBlock | TPhrasing | null;
  /**
   * The position of this element relatively to its parents, after hoisting and
   * collapsing.
   */
  readonly nodeIndex: number;
  /**
   * Children of this node.
   */
  readonly children: ReadonlyArray<TNode>;

  /**
   * Used for debugging purposes.
   */
  readonly displayName: string;

  /**
   * The type of this tnode.
   */
  readonly type: T;

  /**
   * `true` when this tag is not a valid HTML tag **and** there is no custom
   * renderer for this tag.
   */
  readonly isUnregistered: boolean;

  /**
   * Markers form an abstraction in which one node provides semantic information
   * to itself and all its descendants. For example, `ins` elements, which stand
   * for "insertion" of content in the context of an edit will provide the {
   * edits: 'ins' } marker to all its descendants.
   *
   * @remarks This attribute must be considered immutable. Never try to
   * change it by hand, or you might update the markers of an anscestor! For
   * performance reasons, markers instances might be shared from parent to
   * children when they are equal.
   */
  readonly markers: Readonly<Markers>;

  /**
   * TStyles for this TNode. You should not use these unless required.
   * Use {@link TNodeShape.getNativeStyles} instead.
   */
  readonly styles: TStylesShape;

  /**
   * Create a JSX string representation of this node and its children.
   *
   * @remarks The snapshot is _just_ a representation. For example, it will
   * print `href` as an attribute of the TNode, while if you want to access
   * `href` programatically, you'll need to access it via
   * `tnode.attributes.href`.
   *
   * @param options - Customize what should be displayed.
   */
  snapshot(options?: Partial<TNodePrintOptions>): string;

  /**
   * Check if this {@link TNode} has the given `className`.
   *
   * @param className - The class to check.
   */
  hasClass(className: string): boolean;

  /**
   * Test if the given content model matches this TNode content model.
   *
   * @param contentModel - The content model to test against.
   */
  matchContentModel(contentModel: HTMLContentModel): boolean;

  /**
   * Get own native styles.
   */
  getNativeStyles(): T extends 'text' | 'phrasing'
    ? NativeTextStyles
    : NativeBlockStyles;

  /**
   * Get styles that cannot be handled by React Native.
   */
  getWebStyles(): WebTextStyles & WebBlockStyles;

  /**
   * Get React Native `View`, `Text` or mixed `View`/`Text` props for this {@link TNodeShape}.
   */
  getReactNativeProps: () => ReactNativePropsSwitch | null;
}

/**
 * Metainformation extracted from `<head>` tag.
 *
 * @public
 */
export interface DocumentContext {
  charset: string;
  baseHref: string;
  baseTarget: '_blank' | '_self' | '_parent' | '_top';
  lang: string;
  dir: 'ltr' | 'rtl';
  title: string;
  meta: { name: string; value: string }[];
  links: Record<string, string>[];
}

/**
 * A transient render node (TNode) is a ready-to-render data structure.
 */
export type TNode = TBlock | TDocument | TEmpty | TPhrasing | TText;

/**
 * Utilitary type to extract TNode from its literal type.
 */
export type ExtractTNodeFromType<Type> = Type extends TNodeType
  ? Type extends 'block'
    ? TBlock
    : Type extends 'phrasing'
    ? TPhrasing
    : Type extends 'text'
    ? TText
    : Type extends 'empty'
    ? TEmpty
    : Type extends 'document'
    ? TDocument
    : never
  : never;

/**
 * Transient render nodes to be rendered in React Native `Views`.
 */
export interface TBlock extends TNodeShape<'block'> {
  readonly tagName: string;
  readonly domNode: Element;
}

/**
 * The root of a transient render tree. It has a special
 * `context` field holding metadata about the page.
 */
export interface TDocument extends TNodeShape<'document'> {
  /**
   * An object containing special information for this document, such as lang,
   * dir, charset, baseHref...
   */
  readonly context: Readonly<DocumentContext>;
}

/**
 * Transient render nodes for a non-renderable elements, e.g.
 * for elements which have an {@link HTMLContentModel} set to **none**.
 */
export interface TEmpty extends TNodeShape<'empty'> {
  readonly domNode: Element;
}

/**
 * Transient render nodes to be rendered in React Native `Text`
 * components. TPhrasing nodes have {@link TText}, {@link TPhrasing} or
 * {@link TEmpty} children.
 */
export interface TPhrasing extends TNodeShape<'phrasing'> {}

/**
 * Transient render nodes to be rendered in React Native `Text`
 * components. They don't have children, and have a special `data` field
 * holding the text to be rendered.
 */
export interface TText extends TNodeShape<'text'> {
  readonly data: string;
  readonly textNode: Text;
}

/**
 * Distinct {@link TNode} types.
 */
export type TNodeType = 'block' | 'phrasing' | 'text' | 'empty' | 'document';

export interface TNodeMethods {
  bindChildren(
    this: TNodeImpl,
    children: ReadonlyArray<TNodeImpl>,
    shouldUpdateNodeIndexes?: boolean
  ): void;
  cloneInitParams<T extends TNodeInit = TNodeInit>(
    this: TNodeImpl,
    partial?: Partial<T>
  ): T;
  isCollapsibleLeft(this: TNodeImpl): boolean;
  isCollapsibleRight(this: TNodeImpl): boolean;
  isEmpty(this: TNodeImpl): boolean;
  trimLeft(this: TNodeImpl): void;
  trimRight(this: TNodeImpl): void;
  matchContentModel(contentModel: HTMLContentModel): boolean;
  collapse(this: TNodeImpl): void;
  hasClass(className: string): boolean;
  /**
   * Collpase this node children.
   *
   * @param params
   * @returns A list of indexes to splice
   */
  collapseChildren(this: TNodeImpl): void;
  spliceChildren(this: TNodeImpl, indexes: number[]): void;
  snapshot(options?: Partial<TNodePrintOptions>): string;
  toString(): string;
  initialize(init: TNodeInit): void;
  setMarkers: SetMarkersForTNode;
  getReactNativeProps: () => ReactNativePropsSwitch | null;
}

export interface TNodeImpl<T = TNodeInit>
  extends TNodeMethods,
    Omit<TNodeShape<TNodeType>, 'children' | 'parent'> {
  __nodeIndex: number | null;
  __trimmedLeft: boolean;
  __trimmedRight: boolean;
  __nativeProps: ReactNativePropsSwitch | null | false;
  __nativeStyles: ReturnType<TNodeShape<TNodeType>['getNativeStyles']> | false;
  __webStyles: ReturnType<TNodeShape<TNodeType>['getWebStyles']> | false;
  __generateDynamicNativePropsFromModel: (
    autogeneratedProps: ReactNativePropsSwitch | null
  ) => ReactNativePropsSwitch | null;
  __generateNativePropsFromTNode: () => ReactNativePropsSwitch | null;
  readonly children: ReadonlyArray<TNodeImpl>;
  readonly init: T;
  readonly parent: TNodeImpl | null;
  readonly hasWhiteSpaceCollapsingEnabled: boolean;
  readonly parentStyles: TStylesShape | null;
  readonly elementModel: HTMLElementModel<string, HTMLContentModel> | null;
  readonly contentModel: HTMLContentModel | null;
}
