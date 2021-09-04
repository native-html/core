import { MixedStyleDeclaration } from '@native-html/css-processor';
import { ReactNativePropsDefinitions } from '../helper-types';
import {
  Markers,
  SetMarkersForTNode,
  TNodeDescriptor,
  TNodeShape,
  TNodeType
} from '../tree/tree-types';
import HTMLContentModel from './HTMLContentModel';
import HTMLElementModel from './HTMLElementModel';

export type ElementCategory =
  | 'anchor'
  | 'textual'
  | 'tabular'
  | 'edits'
  | 'embedded'
  | 'sectioning'
  | 'grouping'
  | 'interactive'
  | 'untranslatable';

export type TagName =
  | AnchorTagName
  | TextLevelTagNames
  | EditsTagNames
  | EmbeddedTagNames
  | TabularTagNames
  | GroupingTagNames
  | SectioningTagNames
  | InteractiveTagNames
  | UntranslatableTagNames;

export type AnchorTagName = 'a';

export type TabularTagNames =
  | 'table'
  | 'tbody'
  | 'thead'
  | 'tfoot'
  | 'tr'
  | 'td'
  | 'th';

export type GroupingTagNames =
  | 'p'
  | 'hr'
  | 'pre'
  | 'blockquote'
  | 'ol'
  | 'ul'
  | 'dir'
  | 'menu'
  | 'li'
  | 'dl'
  | 'dt'
  | 'dd'
  | 'figure'
  | 'figcaption'
  | 'main'
  | 'div'
  | 'xmp' // deprecated, behaves like pre
  | 'listing' // deprecated, behaves like pre
  | 'plaintext'; // deprecated, behaves like pre

export type AttribTagNames =
  | 'accesskey' // Attribute for fieldset
  | 'datalist' // Attribute for input by id
  | 'source' // Attribute for pictures / videos / audio
  | 'track' // Attribute for videos
  | 'caption' // Attribute for table
  | 'colgroup' // Attribute for table
  | 'col' //  Attribute for colgroup
  | 'option' // Attribute for optgroup, select
  | 'optgroup' // Attribute for select
  | 'param'; // Attribute for object

export type MetadataTagNames = 'head' | 'title' | 'base' | 'link' | 'meta';

export type InteractiveTagNames =
  | 'form'
  | 'label'
  | 'input'
  | 'button'
  | 'select'
  | 'progress'
  | 'meter'
  | 'fieldset'
  | 'legend'
  | 'textarea'
  | 'output'
  | 'details'
  | 'summary'
  | 'dialog';

export type UnsupportedTagNames = 'area' | 'map';
export type UntranslatableTagNames =
  | AttribTagNames
  | UnsupportedTagNames
  | MetadataTagNames;

export type EmbeddedTagNames =
  | 'audio'
  | 'canvas'
  | 'embed'
  | 'iframe'
  | 'img'
  | 'math'
  | 'object'
  | 'picture'
  | 'svg'
  | 'video';

export type EditsTagNames = 'ins' | 'del';

export type SectioningTagNames =
  | 'body'
  | 'article'
  | 'section'
  | 'nav'
  | 'aside'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hgroup'
  | 'header'
  | 'footer'
  | 'address';

export type TextLevelTagNames =
  | 'em'
  | 'strong'
  | 'strike'
  | 'small'
  | 'big'
  | 's'
  | 'cite'
  | 'q'
  | 'dfn'
  | 'abbr'
  | 'acronym'
  | 'ruby'
  | 'rt'
  | 'rp'
  | 'data'
  | 'time'
  | 'tt'
  | 'code'
  | 'var'
  | 'samp'
  | 'kbd'
  | 'sup'
  | 'sub'
  | 'i'
  | 'b'
  | 'u'
  | 'mark'
  | 'bdi'
  | 'bdo'
  | 'span'
  | 'br'
  | 'wbr';

/**
 * @public
 */
export type HTMLModelRecord<
  T extends string = TagName,
  M extends HTMLContentModel = HTMLContentModel
> = {
  [k in T]: HTMLElementModel<k, M>;
};

/**
 * @typeParam T - The name of the tag to which the model will apply.
 */
export interface ElementModelBase<T extends string> {
  /**
   * The tag name associated with this model.
   */
  readonly tagName: T;

  /**
   * An opaque element translated {@link TNode} will have no translated {@link TNode}
   * children.
   */
  readonly isOpaque?: boolean;

  /**
   * Equivalent of "user-agent" styles. The default styles for the element.
   *
   * @remarks These styles will be merged over by `tagsStyles`.
   */
  readonly mixedUAStyles?: MixedStyleDeclaration;

  /**
   * React Native props to pass to renderers.
   */
  readonly reactNativeProps?: ReactNativePropsDefinitions;

  /**
   * `true` when the associated tag is a {@link https://html.spec.whatwg.org/multipage/syntax.html#void-elements | void element}.
   *
   * @remarks
   *
   * - Void elements cannot have children.
   * - TText-translated void elements will be preserved even though they don't
   *   have children.
   */
  readonly isVoid?: boolean;

  /**
   * Derive markers for one TNode.
   */
  setMarkersForTNode?: SetMarkersForTNode;

  /**
   * A function to create conditional "user-agent" styles.
   *
   * @remarks For example, &lt;a&gt; tags will have underline decoration and be
   * colored blue only when `href` is defined.
   *
   * @deprecated Use {@link ElementModelBase.getUADynamicMixedStyles} instead.
   */
  getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>,
    markers: Markers
  ) => MixedStyleDeclaration | null;

  /**
   * A function to create conditional "user-agent" styles.
   *
   * @remarks For example, &lt;a&gt; tags will have underline decoration and be
   * colored blue only when `href` is defined.
   */
  getUADynamicMixedStyles?: (
    tnode: TNodeDescriptor
  ) => MixedStyleDeclaration | null | undefined | void;

  /**
   * A function to create conditional React Native props for a specific TNode.
   */
  getDynamicReactNativeProps?: (
    tnode: TNodeShape<TNodeType>
  ) => ReactNativePropsDefinitions | null | undefined | void;
}

/**
 * An object to specify custom tags.
 *
 * @typeParam T - The name of the tag to which the model will apply.
 * @typeParam M - The {@link HTMLContentModel} associated with this tag.
 */
export interface CustomElementModel<
  T extends string,
  M extends HTMLContentModel
> extends ElementModelBase<T> {
  /**
   * The {@link HTMLContentModel} attached to this model.
   */
  readonly contentModel: M;
  /**
   * The tag name associated with this model.
   */
  readonly tagName: Exclude<T, TagName>;
}

/**
 * An object to specify tags parts of the HTML4 and HTML5 standards.
 *
 * @typeParam T - The name of the tag to which the model will apply.
 * @typeParam C - The {@link ElementCategory} associated with this tag.
 */
export interface NativeElementModel<
  T extends string = TagName,
  C = ElementCategory
> extends ElementModelBase<T> {
  /**
   * The category of this element as per HTML5 standard.
   */
  readonly category: C;
}
