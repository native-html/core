import {
  CSSProcessedProps,
  CSSPropertySpecs
} from '@native-html/css-processor';
import {
  TagName,
  HTMLElementModel,
  ElementCategory,
  AttribTagNames,
  EditsTagNames,
  EmbeddedTagNames,
  GroupingTagNames,
  InteractiveTagNames,
  MetadataTagNames,
  SectioningTagNames,
  TabularTagNames,
  TextLevelTagNames,
  UnsupportedTagNames,
  UntranslatableTagNames
} from './HTMLElementModel';

export type { ElementCategory, TagName };

export type ModelRegistry<T extends TagName> = {
  [k in T]: HTMLElementModel<k>;
};

const nativeTextFlow: CSSPropertySpecs = {
  compatCategory: 'native',
  displayCategory: 'text',
  propagationCategory: 'flow'
};

const nativeBlockRetain: CSSPropertySpecs = {
  compatCategory: 'native',
  displayCategory: 'block',
  propagationCategory: 'retain'
};

const nativeTextRetain: CSSPropertySpecs = {
  compatCategory: 'native',
  displayCategory: 'text',
  propagationCategory: 'retain'
};

const webTextFlow: CSSPropertySpecs = {
  compatCategory: 'web',
  displayCategory: 'text',
  propagationCategory: 'flow'
};

const bigMarginTopBottomPropsRegistry = CSSProcessedProps.new()
  .withProperty('marginTop', 16, nativeBlockRetain) // TODO: 1em
  .withProperty('marginBottom', 16, nativeBlockRetain); // TODO: 1em

const shortMarginTopBottomPropsRegistry = CSSProcessedProps.new()
  .withProperty('marginTop', 8, nativeBlockRetain) // TODO: .5em
  .withProperty('marginBottom', 8, nativeBlockRetain); // TODO: .5em

const lineThroughPropsRegistry = CSSProcessedProps.new().withProperty(
  'textDecorationLine',
  'line-through',
  nativeTextRetain
);

const italicPropsRegistry = CSSProcessedProps.new().withProperty(
  'fontStyle',
  'italic',
  nativeTextFlow
);

const monoPropsRegistry = CSSProcessedProps.new().withProperty(
  'fontFamily',
  'monospace',
  nativeTextFlow
);

const boldPropsRegistry = CSSProcessedProps.new().withProperty(
  'fontWeight',
  'bold',
  nativeTextFlow
);

const whiteSpacePrePropsRegistry = CSSProcessedProps.new().withProperty(
  'whiteSpace',
  'pre',
  webTextFlow
);

const spacedBlockPropsRegistry = CSSProcessedProps.new()
  .withProperty('marginLeft', 40, nativeBlockRetain)
  .withProperty('marginRight', 40, nativeBlockRetain)
  .merge(bigMarginTopBottomPropsRegistry);

const anchorPropsRegistry = CSSProcessedProps.new()
  .withProperty('color', '#245dc1', nativeTextFlow)
  .withProperty('textDecorationLine', 'underline', nativeTextRetain)
  .withProperty('textDecorationColor', '#245dc1', nativeTextRetain);

const leftBorderQuote = CSSProcessedProps.new()
  .withProperty('borderLeftWidth', 2, nativeBlockRetain)
  .withProperty('borderLeftColor', 'gray', nativeBlockRetain);

const dottedUnderlinePropsRegistry = CSSProcessedProps.new()
  .withProperty('textDecorationLine', 'underline', nativeTextRetain)
  .withProperty('textDecorationStyle', 'dotted', nativeTextRetain);

const solidUnderlinePropsRegistry = CSSProcessedProps.new()
  .withProperty('textDecorationLine', 'underline', nativeTextRetain)
  .withProperty('textDecorationStyle', 'solid', nativeTextRetain);

const listPropsRegistry = CSSProcessedProps.new()
  .withProperty('paddingLeft', 40, nativeBlockRetain) // TODO, support directional styles
  .merge(bigMarginTopBottomPropsRegistry);

// whitespace + mono + spacing
const prePropsRegistry = whiteSpacePrePropsRegistry
  .merge(monoPropsRegistry)
  .merge(bigMarginTopBottomPropsRegistry);

const sectioningModelMap: ModelRegistry<SectioningTagNames> = {
  address: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'address',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  article: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'article'
  }),
  aside: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'aside'
  }),
  body: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'body'
  }),
  footer: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'footer'
  }),
  h1: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h1',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 32, nativeTextFlow) // TODO 2em
      .withProperty('marginTop', 10.72, nativeTextFlow) // TODO 0.67em
      .withProperty('marginBottom', 10.72, nativeTextFlow) // TODO 0.67em
      .merge(boldPropsRegistry)
  }),
  h2: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h2',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 24, nativeTextFlow) // TODO 1.5em
      .withProperty('marginTop', 13.28, nativeTextFlow) // TODO .83em
      .withProperty('marginBottom', 13.28, nativeTextFlow) // TODO .83em
      .merge(boldPropsRegistry)
  }),
  h3: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h3',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 18.72, nativeTextFlow) // TODO 1.17em
      .withProperty('marginTop', 16, nativeTextFlow) // TODO 1em
      .withProperty('marginBottom', 16, nativeTextFlow) // TODO 1em
      .merge(boldPropsRegistry)
  }),
  h4: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h4',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 16, nativeTextFlow) // TODO 1em
      .withProperty('marginTop', 21.28, nativeTextFlow) // TODO 1.33em
      .withProperty('marginBottom', 21.28, nativeTextFlow) // TODO 1.33em
      .merge(boldPropsRegistry)
  }),
  h5: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h5',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 13.28, nativeTextFlow) // TODO .83em
      .withProperty('marginTop', 26.72, nativeTextFlow) // TODO 1.67em
      .withProperty('marginBottom', 26.72, nativeTextFlow) // TODO 1.67em
      .merge(boldPropsRegistry)
  }),
  h6: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h6',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('fontSize', 10.72, nativeTextFlow) // TODO .67em
      .withProperty('marginTop', 37.28, nativeTextFlow) // TODO 2.33em
      .withProperty('marginBottom', 37.28, nativeTextFlow) // TODO 2.33em
      .merge(boldPropsRegistry)
  }),
  header: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'header'
  }),
  hgroup: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'hgroup'
  }),
  nav: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'nav'
  }),
  section: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'section'
  })
};

const unsupportedModelMap: ModelRegistry<UnsupportedTagNames> = {
  area: new HTMLElementModel({
    tagName: 'area',
    category: 'untranslatable',
    isVoid: true
  }),
  map: new HTMLElementModel({
    tagName: 'map',
    category: 'untranslatable'
  })
};

const attribsModelMap: ModelRegistry<AttribTagNames> = {
  accesskey: new HTMLElementModel({
    tagName: 'accesskey',
    category: 'untranslatable'
  }),
  caption: new HTMLElementModel({
    tagName: 'caption',
    category: 'untranslatable'
  }),
  col: new HTMLElementModel({
    tagName: 'col',
    category: 'untranslatable',
    isVoid: true
  }),
  colgroup: new HTMLElementModel({
    tagName: 'colgroup',
    category: 'untranslatable'
  }),
  datalist: new HTMLElementModel({
    tagName: 'datalist',
    category: 'untranslatable'
  }),
  source: new HTMLElementModel({
    tagName: 'source',
    category: 'untranslatable',
    isVoid: true
  }),
  track: new HTMLElementModel({
    tagName: 'track',
    category: 'untranslatable',
    isVoid: true
  }),
  optgroup: new HTMLElementModel({
    tagName: 'optgroup',
    category: 'untranslatable'
  }),
  option: new HTMLElementModel({
    tagName: 'option',
    category: 'untranslatable'
  }),
  param: new HTMLElementModel({
    tagName: 'param',
    category: 'untranslatable',
    isVoid: true
  })
};

const interactiveModelMap: ModelRegistry<InteractiveTagNames> = {
  button: new HTMLElementModel({
    tagName: 'button',
    category: 'interactive'
  }),
  fieldset: new HTMLElementModel({
    tagName: 'fieldset',
    category: 'interactive'
  }),
  form: new HTMLElementModel({
    tagName: 'form',
    category: 'interactive'
  }),
  input: new HTMLElementModel({
    tagName: 'input',
    category: 'interactive',
    isVoid: true
  }),
  label: new HTMLElementModel({
    tagName: 'label',
    category: 'interactive'
  }),
  legend: new HTMLElementModel({
    tagName: 'legend',
    category: 'interactive'
  }),
  meter: new HTMLElementModel({
    tagName: 'meter',
    category: 'interactive'
  }),
  progress: new HTMLElementModel({
    tagName: 'progress',
    category: 'interactive'
  }),
  select: new HTMLElementModel({
    tagName: 'select',
    category: 'interactive'
  }),
  details: new HTMLElementModel({
    tagName: 'details',
    category: 'interactive'
  }),
  dialog: new HTMLElementModel({
    tagName: 'dialog',
    category: 'interactive'
  }),
  output: new HTMLElementModel({
    tagName: 'output',
    category: 'interactive'
  }),
  summary: new HTMLElementModel({
    tagName: 'summary',
    category: 'interactive'
  }),
  textarea: new HTMLElementModel({
    tagName: 'textarea',
    category: 'interactive'
  })
};

const metadataModelMap: ModelRegistry<MetadataTagNames> = {
  base: new HTMLElementModel({
    tagName: 'base',
    category: 'untranslatable',
    isVoid: true
  }),
  head: new HTMLElementModel({
    tagName: 'head',
    category: 'untranslatable',
    isOpaque: true
  }),
  link: new HTMLElementModel({
    tagName: 'link',
    category: 'untranslatable',
    isVoid: true
  }),
  meta: new HTMLElementModel({
    tagName: 'meta',
    category: 'untranslatable',
    isVoid: true
  }),
  title: new HTMLElementModel({
    tagName: 'title',
    category: 'untranslatable'
  })
};

const untranslatableModelMap: ModelRegistry<UntranslatableTagNames> = {
  ...attribsModelMap,
  ...interactiveModelMap,
  ...unsupportedModelMap,
  ...metadataModelMap
};

const groupingModelMap: ModelRegistry<GroupingTagNames> = {
  blockquote: new HTMLElementModel({
    tagName: 'blockquote',
    category: 'grouping',
    getUADerivedCSSProcessedPropsFromAttributes: (attributes) => {
      if (attributes.type === 'cite') {
        return leftBorderQuote;
      }
      return null;
    },
    defaultUACSSProcessedProps: spacedBlockPropsRegistry
  }),
  dd: new HTMLElementModel({
    tagName: 'dd',
    category: 'grouping',
    defaultUACSSProcessedProps: CSSProcessedProps.new().withProperty(
      'marginLeft', // TODO support directional styles
      40,
      nativeBlockRetain
    )
  }),
  div: new HTMLElementModel({
    tagName: 'div',
    category: 'grouping'
  }),
  dl: new HTMLElementModel({
    tagName: 'dl',
    category: 'grouping',
    defaultUACSSProcessedProps: bigMarginTopBottomPropsRegistry
  }),
  dt: new HTMLElementModel({
    tagName: 'dt',
    category: 'grouping',
    defaultUACSSProcessedProps: boldPropsRegistry
  }),
  figcaption: new HTMLElementModel({
    tagName: 'figcaption',
    category: 'grouping',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('textAlign', 'center', nativeTextFlow)
      .merge(italicPropsRegistry)
  }),
  figure: new HTMLElementModel({
    tagName: 'figure',
    category: 'grouping',
    defaultUACSSProcessedProps: spacedBlockPropsRegistry
  }),
  hr: new HTMLElementModel({
    tagName: 'hr',
    category: 'grouping',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('marginLeft', 'auto', nativeBlockRetain)
      .withProperty('marginRight', 'auto', nativeBlockRetain)
      .withProperty('height', 1, nativeBlockRetain)
      .withProperty('width', '100%', nativeBlockRetain)
      .withProperty('backgroundColor', 'gray', nativeBlockRetain)
      .merge(shortMarginTopBottomPropsRegistry)
  }),
  li: new HTMLElementModel({
    tagName: 'li',
    category: 'grouping'
  }),
  main: new HTMLElementModel({
    tagName: 'main',
    category: 'grouping'
  }),
  menu: new HTMLElementModel({
    tagName: 'menu',
    category: 'grouping'
  }),
  ol: new HTMLElementModel({
    tagName: 'ol',
    category: 'grouping',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('listStyleType', 'decimal', webTextFlow)
      .merge(listPropsRegistry)
  }),
  p: new HTMLElementModel({
    tagName: 'p',
    category: 'grouping',
    defaultUACSSProcessedProps: bigMarginTopBottomPropsRegistry
  }),
  pre: new HTMLElementModel({
    tagName: 'pre',
    category: 'grouping',
    defaultUACSSProcessedProps: prePropsRegistry
  }),
  xmp: new HTMLElementModel({
    tagName: 'xmp',
    category: 'grouping',
    defaultUACSSProcessedProps: prePropsRegistry
  }),
  listing: new HTMLElementModel({
    tagName: 'listing',
    category: 'grouping',
    defaultUACSSProcessedProps: prePropsRegistry
  }),
  plaintext: new HTMLElementModel({
    tagName: 'plaintext',
    category: 'grouping',
    defaultUACSSProcessedProps: prePropsRegistry
  }),
  ul: new HTMLElementModel({
    tagName: 'ul',
    category: 'grouping',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('listStyleType', 'disc', webTextFlow)
      .merge(listPropsRegistry)
  }),
  dir: new HTMLElementModel({
    tagName: 'dir',
    category: 'grouping',
    // TODO list-style-type: disc;
    defaultUACSSProcessedProps: listPropsRegistry
  })
};

const tabularModelMap: ModelRegistry<TabularTagNames> = {
  table: new HTMLElementModel({
    tagName: 'table',
    category: 'tabular'
  }),
  tbody: new HTMLElementModel({
    tagName: 'tbody',
    category: 'tabular'
  }),
  td: new HTMLElementModel({
    tagName: 'td',
    category: 'tabular'
  }),
  tfoot: new HTMLElementModel({
    tagName: 'tfoot',
    category: 'tabular'
  }),
  th: new HTMLElementModel({
    tagName: 'th',
    category: 'tabular'
  }),
  thead: new HTMLElementModel({
    tagName: 'thead',
    category: 'tabular'
  }),
  tr: new HTMLElementModel({
    tagName: 'tr',
    category: 'tabular'
  })
};

// Embedded elements are considered "opaque", i.e. no children are meant to be
// translated. A reference to domChildren will be available on the rendering
// end.
const embeddedModelMap: ModelRegistry<EmbeddedTagNames> = {
  audio: new HTMLElementModel({
    tagName: 'audio',
    category: 'embedded',
    isVoid: false // allows tracks
  }),
  canvas: new HTMLElementModel({
    tagName: 'canvas',
    category: 'embedded',
    isVoid: false // allows specific content
  }),
  embed: new HTMLElementModel({
    tagName: 'embed',
    category: 'embedded',
    isVoid: true
  }),
  iframe: new HTMLElementModel({
    tagName: 'iframe',
    category: 'embedded',
    isVoid: true
  }),
  img: new HTMLElementModel({
    tagName: 'img',
    category: 'embedded',
    isVoid: true
  }),
  math: new HTMLElementModel({
    tagName: 'math',
    category: 'embedded',
    isVoid: false // allows mathml elems
  }),
  object: new HTMLElementModel({
    tagName: 'object',
    category: 'embedded',
    isVoid: false // allows params
  }),
  picture: new HTMLElementModel({
    tagName: 'picture',
    category: 'embedded',
    isVoid: false // allows source and img
  }),
  svg: new HTMLElementModel({
    tagName: 'svg',
    category: 'embedded',
    isVoid: false // allows svg elems
  }),
  video: new HTMLElementModel({
    tagName: 'video',
    category: 'embedded',
    isVoid: false // allows source, tracks + transparent
  })
};

const editsModelMap: ModelRegistry<EditsTagNames> = {
  ins: new HTMLElementModel({
    tagName: 'ins',
    category: 'edits',
    defaultUACSSProcessedProps: solidUnderlinePropsRegistry
  }),
  del: new HTMLElementModel({
    tagName: 'del',
    category: 'edits',
    defaultUACSSProcessedProps: lineThroughPropsRegistry
  })
};

const textLevelModelMap: ModelRegistry<TextLevelTagNames> = {
  em: new HTMLElementModel({
    tagName: 'em',
    category: 'textual',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  strong: new HTMLElementModel({
    tagName: 'strong',
    category: 'textual',
    defaultUACSSProcessedProps: boldPropsRegistry
  }),
  small: new HTMLElementModel({
    tagName: 'small',
    category: 'textual',
    defaultUACSSProcessedProps: CSSProcessedProps.new().withProperty(
      'fontSize',
      12, // TODO fix with "smaller"
      nativeTextFlow
    )
  }),
  big: new HTMLElementModel({
    tagName: 'big',
    category: 'textual',
    defaultUACSSProcessedProps: CSSProcessedProps.new().withProperty(
      'fontSize',
      24, // TODO fix with "larger"
      nativeTextFlow
    )
  }),
  s: new HTMLElementModel({
    tagName: 's',
    category: 'textual',
    defaultUACSSProcessedProps: lineThroughPropsRegistry
  }),
  strike: new HTMLElementModel({
    tagName: 'strike',
    category: 'textual',
    defaultUACSSProcessedProps: lineThroughPropsRegistry
  }),
  cite: new HTMLElementModel({
    tagName: 'cite',
    category: 'textual',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  q: new HTMLElementModel({
    tagName: 'q',
    category: 'textual'
    // default style, content: "open,close-quote"
  }),
  dfn: new HTMLElementModel({
    tagName: 'dfn',
    category: 'textual',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  abbr: new HTMLElementModel({
    tagName: 'abbr',
    category: 'textual',
    defaultUACSSProcessedProps: dottedUnderlinePropsRegistry
  }),
  acronym: new HTMLElementModel({
    tagName: 'acronym',
    category: 'textual',
    defaultUACSSProcessedProps: dottedUnderlinePropsRegistry
  }),
  ruby: new HTMLElementModel({
    tagName: 'ruby',
    category: 'textual'
  }),
  rt: new HTMLElementModel({
    tagName: 'rt',
    category: 'textual'
  }),
  rp: new HTMLElementModel({
    tagName: 'rp',
    category: 'textual'
  }),
  data: new HTMLElementModel({
    tagName: 'data',
    category: 'textual'
  }),
  time: new HTMLElementModel({
    tagName: 'time',
    category: 'textual'
  }),
  code: new HTMLElementModel({
    tagName: 'code',
    category: 'textual',
    defaultUACSSProcessedProps: monoPropsRegistry
  }),
  tt: new HTMLElementModel({
    tagName: 'tt',
    category: 'textual',
    defaultUACSSProcessedProps: monoPropsRegistry
  }),
  var: new HTMLElementModel({
    tagName: 'var',
    category: 'textual',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  samp: new HTMLElementModel({
    tagName: 'samp',
    category: 'textual',
    defaultUACSSProcessedProps: monoPropsRegistry
  }),
  kbd: new HTMLElementModel({
    tagName: 'kbd',
    category: 'textual',
    defaultUACSSProcessedProps: monoPropsRegistry
  }),
  sub: new HTMLElementModel({
    tagName: 'sub',
    category: 'textual',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('textAlignVertical', 'bottom', nativeTextRetain)
      .withProperty('fontSize', 12, nativeTextFlow) // TODO fix to "smaller"
  }),
  sup: new HTMLElementModel({
    tagName: 'sup',
    category: 'textual',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('textAlignVertical', 'top', nativeTextRetain)
      .withProperty('fontSize', 12, nativeTextFlow) // TODO fix to "smaller"
  }),
  i: new HTMLElementModel({
    tagName: 'i',
    category: 'textual',
    defaultUACSSProcessedProps: italicPropsRegistry
  }),
  b: new HTMLElementModel({
    tagName: 'b',
    category: 'textual'
  }),
  u: new HTMLElementModel({
    tagName: 'u',
    category: 'textual',
    defaultUACSSProcessedProps: solidUnderlinePropsRegistry
  }),
  mark: new HTMLElementModel({
    tagName: 'mark',
    category: 'textual',
    defaultUACSSProcessedProps: CSSProcessedProps.new()
      .withProperty('backgroundColor', 'yellow', nativeBlockRetain)
      .withProperty('color', 'black', nativeTextFlow)
  }),
  bdi: new HTMLElementModel({
    tagName: 'bdi',
    category: 'textual'
    // unicode-bidi: isolate;
  }),
  bdo: new HTMLElementModel({
    tagName: 'bdo',
    category: 'textual'
    //  unicode-bidi: isolate-override;
  }),
  span: new HTMLElementModel({
    tagName: 'span',
    category: 'textual'
  }),
  br: new HTMLElementModel({
    tagName: 'br',
    category: 'textual',
    isVoid: true
  }),
  wbr: new HTMLElementModel({
    tagName: 'wbr',
    category: 'textual',
    isVoid: true
  })
};

const elementsModelMap: Record<TagName, HTMLElementModel<TagName>> = {
  a: new HTMLElementModel({
    tagName: 'a',
    category: 'anchor',
    getUADerivedCSSProcessedPropsFromAttributes: (attributes) => {
      if (typeof attributes.href === 'string') {
        return anchorPropsRegistry;
      }
      return null;
    }
  }),
  ...textLevelModelMap,
  ...editsModelMap,
  ...embeddedModelMap,
  ...tabularModelMap,
  ...groupingModelMap,
  ...sectioningModelMap,
  ...interactiveModelMap,
  ...untranslatableModelMap
};

export function getElementModelFromTagName(
  tagName: string
): HTMLElementModel<string> {
  if (Object.prototype.hasOwnProperty.call(elementsModelMap, tagName)) {
    return elementsModelMap[tagName as TagName];
  }
  return new HTMLElementModel({
    tagName,
    category: 'custom'
  });
}
