import { MixedStyleDeclaration } from '@native-html/css-processor';

export type ElementCategory =
  | 'anchor'
  | 'textual'
  | 'tabular'
  | 'edits'
  | 'embedded'
  | 'sectioning'
  | 'grouping'
  | 'interactive'
  | 'custom'
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

export type CustomElementModel = ElementModelBase<string, 'custom'>;

export interface ElementModelBase<T = TagName, C = ElementCategory> {
  tagName: T;
  category: C;
  /**
   * An opaque element children should not be translated. Instead, a reference
   * to the dom node children should be used for rendering. Example: XML
   */
  isOpaque?: boolean;
  /**
   * Void elements such as specified in HTML4. Void elements cannot have children.
   */
  isVoid?: boolean;
  /**
   * Equivalent of "user-agent" styles.
   */
  mixedUAStyles?: MixedStyleDeclaration;
  /**
   * For example, "width" and "height" attributes for &lt;img&gt; tags.
   */
  getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}

const phrasingCategories: ElementCategory[] = ['textual', 'edits'];
const translatableBlockCategories: ElementCategory[] = [
  'embedded',
  'tabular',
  'grouping',
  'sectioning',
  'custom'
];

export class HTMLElementModel<T extends string> {
  public readonly tagName: T;
  public readonly isOpaque: boolean;
  public readonly isDocument: boolean;
  public readonly isAnchor: boolean;
  public readonly isPhrasing: boolean;
  public readonly isTranslatableBlock: boolean;
  public readonly isVoid: boolean;
  public readonly mixedUAStyles: MixedStyleDeclaration | null;
  private readonly _getDerivedStylesFromAttributes: ElementModelBase['getUADerivedStyleFromAttributes'];
  constructor({
    tagName,
    category,
    isOpaque,
    isVoid,
    mixedUAStyles: defaultCSSPropsRegistry,
    getUADerivedStyleFromAttributes: getDerivedStylesFromAttributes
  }: ElementModelBase<T, ElementCategory>) {
    this.tagName = tagName;
    this.isOpaque = isOpaque ?? category === 'embedded';
    this.isVoid = isVoid ?? false;
    this.isAnchor = category === 'anchor';
    this.isDocument = tagName === 'html';
    this.isPhrasing = phrasingCategories.indexOf(category) !== -1;
    this.isTranslatableBlock =
      translatableBlockCategories.indexOf(category) !== -1;
    this.mixedUAStyles = defaultCSSPropsRegistry || null;
    this._getDerivedStylesFromAttributes = getDerivedStylesFromAttributes;
  }

  getUADerivedCSSProcessedPropsFromAttributes(
    attributes: Record<string, string>
  ): MixedStyleDeclaration | null {
    if (this._getDerivedStylesFromAttributes) {
      return this._getDerivedStylesFromAttributes(attributes);
    }
    return null;
  }
}
