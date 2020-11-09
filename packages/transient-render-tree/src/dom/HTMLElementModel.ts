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
  | 'menu'
  | 'li'
  | 'dl'
  | 'dt'
  | 'dd'
  | 'figure'
  | 'figcaption'
  | 'main'
  | 'div';

export type AttribTagNames =
  | 'accesskey' // Attribute for fieldset
  | 'datalist' // Attribute for input by id
  | 'source' // Attribute for pictures / videos / audio
  | 'track' // Attribute for videos
  | 'caption' // Attribute for table
  | 'colgroup' // Attribute for table
  | 'col' //  Attribute for colgroup
  | 'option' // Attribute for optgroup, select
  | 'optgroup'; // Attribute for select

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
  | 'small'
  | 's'
  | 'cite'
  | 'q'
  | 'dfn'
  | 'abbr'
  | 'ruby'
  | 'rt'
  | 'rp'
  | 'data'
  | 'time'
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
  constructor({
    tagName,
    category,
    isOpaque
  }: ElementModelBase<T, ElementCategory>) {
    this.tagName = tagName;
    this.isOpaque = isOpaque ?? category === 'embedded';
    this.isAnchor = category === 'anchor';
    this.isDocument = tagName === 'html';
    this.isPhrasing = phrasingCategories.indexOf(category) !== -1;
    this.isTranslatableBlock =
      translatableBlockCategories.indexOf(category) !== -1;
  }
}
