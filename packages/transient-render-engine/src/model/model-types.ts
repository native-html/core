import { MixedStyleDeclaration } from '@native-html/css-processor';
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

export type HTMLModelRecord<T extends string = TagName> = {
  [k in T]: HTMLElementModel<k>;
};

export interface ElementModelBase<T extends string> {
  /**
   * The tag name associated with this model.
   */
  tagName: T;
  /**
   * An opaque element will have access to the DOM tree.
   */
  isOpaque?: boolean;
  /**
   * Equivalent of "user-agent" styles. The default styles for the element.
   *
   * @remarks These styles will get merged over by `tagsStyles`.
   */
  mixedUAStyles?: MixedStyleDeclaration;
  /**
   * Conditional "user-agent" styles.
   *
   * @remarks For example, &lt;a&gt; tags will have underline decoration and be
   * colored blue only when `href` is defined.
   */
  getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}

/**
 * An object to specify custom tags.
 */
export interface CustomElementModel<T extends string>
  extends ElementModelBase<T> {
  tagName: Exclude<T, TagName>;
  contentModel: HTMLContentModel;
}

/**
 * An object to specify tags parts of the HTML4 and HTML5 standards.
 */
export interface NativeElementModel<
  T extends string = TagName,
  C = ElementCategory
> extends ElementModelBase<T> {
  category: C;
  /**
   * Void elements such as specified in HTML4. Void elements cannot have children.
   */
  isVoid?: boolean;
  /**
   * For example, "width" and "height" attributes for &lt;img&gt; tags.
   */
  getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}
