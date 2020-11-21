import { MixedStyleDeclaration } from '@native-html/css-processor';
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

const UA_ANCHOR_COL = '#245dc1';
const UA_GRAY = '#CCC';
const UA_MARGIN_HZ = 30;

const bigMarginTopBottomStyle: MixedStyleDeclaration = {
  marginTop: '1em',
  marginBottom: '1em'
};

const shortMarginTopBottomStyle: MixedStyleDeclaration = {
  marginTop: '.5em',
  marginBottom: '.5em'
};

const lineThroughStyle: MixedStyleDeclaration = {
  textDecorationLine: 'line-through'
};

const italicStyle: MixedStyleDeclaration = {
  fontStyle: 'italic'
};

const monoStyle: MixedStyleDeclaration = {
  fontFamily: 'monospace'
};

const boldStyle: MixedStyleDeclaration = {
  fontWeight: 'bold'
};

const spacedBlockStyle: MixedStyleDeclaration = {
  ...bigMarginTopBottomStyle,
  marginLeft: UA_MARGIN_HZ,
  marginRight: UA_MARGIN_HZ
};

const anchorStyle: MixedStyleDeclaration = {
  color: UA_ANCHOR_COL,
  textDecorationLine: 'underline',
  textDecorationColor: UA_ANCHOR_COL
};

const leftBorderQuoteStyle: MixedStyleDeclaration = {
  borderLeftWidth: 2,
  borderLeftColor: UA_GRAY
};

const dottedUnderlineStyle: MixedStyleDeclaration = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted'
};

const solidUnderlineStyle: MixedStyleDeclaration = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'solid'
};

// TODO, support directional styles
const listStyles: MixedStyleDeclaration = {
  ...bigMarginTopBottomStyle,
  paddingLeft: 30
};

const preStyles: MixedStyleDeclaration = {
  whiteSpace: 'pre',
  ...monoStyle,
  ...bigMarginTopBottomStyle
};

function headerStyle(
  fontSize: string,
  marginSize: string
): MixedStyleDeclaration {
  return {
    fontSize,
    marginTop: marginSize,
    marginBottom: marginSize,
    ...boldStyle
  };
}

const sectioningModelMap: ModelRegistry<SectioningTagNames> = {
  address: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'address',
    mixedUAStyles: italicStyle
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
    mixedUAStyles: headerStyle('2em', '.67em')
  }),
  h2: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h2',
    mixedUAStyles: headerStyle('1.5em', '.83em')
  }),
  h3: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h3',
    mixedUAStyles: headerStyle('1.17em', '1em')
  }),
  h4: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h4',
    mixedUAStyles: headerStyle('1em', '1.33em')
  }),
  h5: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h5',
    mixedUAStyles: headerStyle('.83em', '1.67em')
  }),
  h6: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h6',
    mixedUAStyles: headerStyle('.67em', '2.33em')
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
    getUADerivedStyleFromAttributes: (attributes) => {
      if (attributes.type === 'cite') {
        return leftBorderQuoteStyle;
      }
      return null;
    },
    mixedUAStyles: spacedBlockStyle
  }),
  dd: new HTMLElementModel({
    tagName: 'dd',
    category: 'grouping',
    mixedUAStyles: {
      marginLeft: UA_MARGIN_HZ
    }
  }),
  div: new HTMLElementModel({
    tagName: 'div',
    category: 'grouping'
  }),
  dl: new HTMLElementModel({
    tagName: 'dl',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  dt: new HTMLElementModel({
    tagName: 'dt',
    category: 'grouping',
    mixedUAStyles: boldStyle
  }),
  figcaption: new HTMLElementModel({
    tagName: 'figcaption',
    category: 'grouping',
    mixedUAStyles: {
      ...italicStyle,
      textAlign: 'center'
    }
  }),
  figure: new HTMLElementModel({
    tagName: 'figure',
    category: 'grouping',
    mixedUAStyles: spacedBlockStyle
  }),
  hr: new HTMLElementModel({
    tagName: 'hr',
    category: 'grouping',
    mixedUAStyles: {
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 1,
      width: '100%',
      backgroundColor: UA_GRAY,
      ...shortMarginTopBottomStyle
    }
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
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'decimal'
    }
  }),
  p: new HTMLElementModel({
    tagName: 'p',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  pre: new HTMLElementModel({
    tagName: 'pre',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  xmp: new HTMLElementModel({
    tagName: 'xmp',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  listing: new HTMLElementModel({
    tagName: 'listing',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  plaintext: new HTMLElementModel({
    tagName: 'plaintext',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  ul: new HTMLElementModel({
    tagName: 'ul',
    category: 'grouping',
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'disc'
    }
  }),
  dir: new HTMLElementModel({
    tagName: 'dir',
    category: 'grouping',
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'disc'
    }
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
    mixedUAStyles: solidUnderlineStyle
  }),
  del: new HTMLElementModel({
    tagName: 'del',
    category: 'edits',
    mixedUAStyles: lineThroughStyle
  })
};

const textLevelModelMap: ModelRegistry<TextLevelTagNames> = {
  em: new HTMLElementModel({
    tagName: 'em',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  strong: new HTMLElementModel({
    tagName: 'strong',
    category: 'textual',
    mixedUAStyles: boldStyle
  }),
  small: new HTMLElementModel({
    tagName: 'small',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'smaller'
    }
  }),
  big: new HTMLElementModel({
    tagName: 'big',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'larger'
    }
  }),
  s: new HTMLElementModel({
    tagName: 's',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  strike: new HTMLElementModel({
    tagName: 'strike',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  cite: new HTMLElementModel({
    tagName: 'cite',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  q: new HTMLElementModel({
    tagName: 'q',
    category: 'textual'
    // default style, content: "open,close-quote"
  }),
  dfn: new HTMLElementModel({
    tagName: 'dfn',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  abbr: new HTMLElementModel({
    tagName: 'abbr',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
  }),
  acronym: new HTMLElementModel({
    tagName: 'acronym',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
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
    mixedUAStyles: monoStyle
  }),
  tt: new HTMLElementModel({
    tagName: 'tt',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  var: new HTMLElementModel({
    tagName: 'var',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  samp: new HTMLElementModel({
    tagName: 'samp',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  kbd: new HTMLElementModel({
    tagName: 'kbd',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  sub: new HTMLElementModel({
    tagName: 'sub',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'bottom',
      fontSize: 'smaller'
    }
  }),
  sup: new HTMLElementModel({
    tagName: 'sup',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'top',
      fontSize: 'smaller'
    }
  }),
  i: new HTMLElementModel({
    tagName: 'i',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  b: new HTMLElementModel({
    tagName: 'b',
    category: 'textual'
  }),
  u: new HTMLElementModel({
    tagName: 'u',
    category: 'textual',
    mixedUAStyles: solidUnderlineStyle
  }),
  mark: new HTMLElementModel({
    tagName: 'mark',
    category: 'textual',
    mixedUAStyles: {
      backgroundColor: 'yellow',
      color: 'black'
    }
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
    getUADerivedStyleFromAttributes: (attributes) => {
      if (typeof attributes.href === 'string') {
        return anchorStyle;
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
