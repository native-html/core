import { MixedStyleDeclaration } from '@native-html/css-processor';
import HTMLElementModel from './HTMLElementModel';
import {
  TagName,
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
  UntranslatableTagNames,
  HTMLModelRecord
} from './model-types';

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

const sectioningModelMap: HTMLModelRecord<SectioningTagNames> = {
  address: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'address',
    mixedUAStyles: italicStyle
  }),
  article: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'article'
  }),
  aside: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'aside'
  }),
  body: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'body'
  }),
  footer: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'footer'
  }),
  h1: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h1',
    mixedUAStyles: headerStyle('2em', '.67em')
  }),
  h2: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h2',
    mixedUAStyles: headerStyle('1.5em', '.83em')
  }),
  h3: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h3',
    mixedUAStyles: headerStyle('1.17em', '1em')
  }),
  h4: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h4',
    mixedUAStyles: headerStyle('1em', '1.33em')
  }),
  h5: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h5',
    mixedUAStyles: headerStyle('.83em', '1.67em')
  }),
  h6: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'h6',
    mixedUAStyles: headerStyle('.67em', '2.33em')
  }),
  header: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'header'
  }),
  hgroup: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'hgroup'
  }),
  nav: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'nav'
  }),
  section: HTMLElementModel.fromModelBase({
    category: 'sectioning',
    tagName: 'section'
  })
};

const unsupportedModelMap: HTMLModelRecord<UnsupportedTagNames> = {
  area: HTMLElementModel.fromModelBase({
    tagName: 'area',
    category: 'untranslatable',
    isVoid: true
  }),
  map: HTMLElementModel.fromModelBase({
    tagName: 'map',
    category: 'untranslatable'
  })
};

const attribsModelMap: HTMLModelRecord<AttribTagNames> = {
  accesskey: HTMLElementModel.fromModelBase({
    tagName: 'accesskey',
    category: 'untranslatable'
  }),
  caption: HTMLElementModel.fromModelBase({
    tagName: 'caption',
    category: 'untranslatable'
  }),
  col: HTMLElementModel.fromModelBase({
    tagName: 'col',
    category: 'untranslatable',
    isVoid: true
  }),
  colgroup: HTMLElementModel.fromModelBase({
    tagName: 'colgroup',
    category: 'untranslatable'
  }),
  datalist: HTMLElementModel.fromModelBase({
    tagName: 'datalist',
    category: 'untranslatable'
  }),
  source: HTMLElementModel.fromModelBase({
    tagName: 'source',
    category: 'untranslatable',
    isVoid: true
  }),
  track: HTMLElementModel.fromModelBase({
    tagName: 'track',
    category: 'untranslatable',
    isVoid: true
  }),
  optgroup: HTMLElementModel.fromModelBase({
    tagName: 'optgroup',
    category: 'untranslatable'
  }),
  option: HTMLElementModel.fromModelBase({
    tagName: 'option',
    category: 'untranslatable'
  }),
  param: HTMLElementModel.fromModelBase({
    tagName: 'param',
    category: 'untranslatable',
    isVoid: true
  })
};

const interactiveModelMap: HTMLModelRecord<InteractiveTagNames> = {
  button: HTMLElementModel.fromModelBase({
    tagName: 'button',
    category: 'interactive'
  }),
  fieldset: HTMLElementModel.fromModelBase({
    tagName: 'fieldset',
    category: 'interactive'
  }),
  form: HTMLElementModel.fromModelBase({
    tagName: 'form',
    category: 'interactive'
  }),
  input: HTMLElementModel.fromModelBase({
    tagName: 'input',
    category: 'interactive',
    isVoid: true
  }),
  label: HTMLElementModel.fromModelBase({
    tagName: 'label',
    category: 'interactive'
  }),
  legend: HTMLElementModel.fromModelBase({
    tagName: 'legend',
    category: 'interactive'
  }),
  meter: HTMLElementModel.fromModelBase({
    tagName: 'meter',
    category: 'interactive'
  }),
  progress: HTMLElementModel.fromModelBase({
    tagName: 'progress',
    category: 'interactive'
  }),
  select: HTMLElementModel.fromModelBase({
    tagName: 'select',
    category: 'interactive'
  }),
  details: HTMLElementModel.fromModelBase({
    tagName: 'details',
    category: 'interactive'
  }),
  dialog: HTMLElementModel.fromModelBase({
    tagName: 'dialog',
    category: 'interactive'
  }),
  output: HTMLElementModel.fromModelBase({
    tagName: 'output',
    category: 'interactive'
  }),
  summary: HTMLElementModel.fromModelBase({
    tagName: 'summary',
    category: 'interactive'
  }),
  textarea: HTMLElementModel.fromModelBase({
    tagName: 'textarea',
    category: 'interactive'
  })
};

const metadataModelMap: HTMLModelRecord<MetadataTagNames> = {
  base: HTMLElementModel.fromModelBase({
    tagName: 'base',
    category: 'untranslatable',
    isVoid: true
  }),
  head: HTMLElementModel.fromModelBase({
    tagName: 'head',
    category: 'untranslatable',
    isOpaque: true
  }),
  link: HTMLElementModel.fromModelBase({
    tagName: 'link',
    category: 'untranslatable',
    isVoid: true
  }),
  meta: HTMLElementModel.fromModelBase({
    tagName: 'meta',
    category: 'untranslatable',
    isVoid: true
  }),
  title: HTMLElementModel.fromModelBase({
    tagName: 'title',
    category: 'untranslatable'
  })
};

const untranslatableModelMap: HTMLModelRecord<UntranslatableTagNames> = {
  ...attribsModelMap,
  ...interactiveModelMap,
  ...unsupportedModelMap,
  ...metadataModelMap
};

const groupingModelMap: HTMLModelRecord<GroupingTagNames> = {
  blockquote: HTMLElementModel.fromModelBase({
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
  dd: HTMLElementModel.fromModelBase({
    tagName: 'dd',
    category: 'grouping',
    mixedUAStyles: {
      marginLeft: UA_MARGIN_HZ
    }
  }),
  div: HTMLElementModel.fromModelBase({
    tagName: 'div',
    category: 'grouping'
  }),
  dl: HTMLElementModel.fromModelBase({
    tagName: 'dl',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  dt: HTMLElementModel.fromModelBase({
    tagName: 'dt',
    category: 'grouping',
    mixedUAStyles: boldStyle
  }),
  figcaption: HTMLElementModel.fromModelBase({
    tagName: 'figcaption',
    category: 'grouping',
    mixedUAStyles: {
      ...italicStyle,
      textAlign: 'center'
    }
  }),
  figure: HTMLElementModel.fromModelBase({
    tagName: 'figure',
    category: 'grouping',
    mixedUAStyles: spacedBlockStyle
  }),
  hr: HTMLElementModel.fromModelBase({
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
  li: HTMLElementModel.fromModelBase({
    tagName: 'li',
    category: 'grouping'
  }),
  main: HTMLElementModel.fromModelBase({
    tagName: 'main',
    category: 'grouping'
  }),
  menu: HTMLElementModel.fromModelBase({
    tagName: 'menu',
    category: 'grouping'
  }),
  ol: HTMLElementModel.fromModelBase({
    tagName: 'ol',
    category: 'grouping',
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'decimal'
    }
  }),
  p: HTMLElementModel.fromModelBase({
    tagName: 'p',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  pre: HTMLElementModel.fromModelBase({
    tagName: 'pre',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  xmp: HTMLElementModel.fromModelBase({
    tagName: 'xmp',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  listing: HTMLElementModel.fromModelBase({
    tagName: 'listing',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  plaintext: HTMLElementModel.fromModelBase({
    tagName: 'plaintext',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  ul: HTMLElementModel.fromModelBase({
    tagName: 'ul',
    category: 'grouping',
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'disc'
    }
  }),
  dir: HTMLElementModel.fromModelBase({
    tagName: 'dir',
    category: 'grouping',
    mixedUAStyles: {
      ...listStyles,
      listStyleType: 'disc'
    }
  })
};

const tabularModelMap: HTMLModelRecord<TabularTagNames> = {
  table: HTMLElementModel.fromModelBase({
    tagName: 'table',
    category: 'tabular'
  }),
  tbody: HTMLElementModel.fromModelBase({
    tagName: 'tbody',
    category: 'tabular'
  }),
  td: HTMLElementModel.fromModelBase({
    tagName: 'td',
    category: 'tabular'
  }),
  tfoot: HTMLElementModel.fromModelBase({
    tagName: 'tfoot',
    category: 'tabular'
  }),
  th: HTMLElementModel.fromModelBase({
    tagName: 'th',
    category: 'tabular'
  }),
  thead: HTMLElementModel.fromModelBase({
    tagName: 'thead',
    category: 'tabular'
  }),
  tr: HTMLElementModel.fromModelBase({
    tagName: 'tr',
    category: 'tabular'
  })
};

// Embedded elements are considered "opaque", i.e. no children are meant to be
// translated. A reference to domChildren will be available on the rendering
// end.
const embeddedModelMap: HTMLModelRecord<EmbeddedTagNames> = {
  audio: HTMLElementModel.fromModelBase({
    tagName: 'audio',
    category: 'embedded',
    isVoid: false // allows tracks
  }),
  canvas: HTMLElementModel.fromModelBase({
    tagName: 'canvas',
    category: 'embedded',
    isVoid: false // allows specific content
  }),
  embed: HTMLElementModel.fromModelBase({
    tagName: 'embed',
    category: 'embedded',
    isVoid: true
  }),
  iframe: HTMLElementModel.fromModelBase({
    tagName: 'iframe',
    category: 'embedded',
    isVoid: true
  }),
  img: HTMLElementModel.fromModelBase({
    tagName: 'img',
    category: 'embedded',
    isVoid: true
  }),
  math: HTMLElementModel.fromModelBase({
    tagName: 'math',
    category: 'embedded',
    isVoid: false // allows mathml elems
  }),
  object: HTMLElementModel.fromModelBase({
    tagName: 'object',
    category: 'embedded',
    isVoid: false // allows params
  }),
  picture: HTMLElementModel.fromModelBase({
    tagName: 'picture',
    category: 'embedded',
    isVoid: false // allows source and img
  }),
  svg: HTMLElementModel.fromModelBase({
    tagName: 'svg',
    category: 'embedded',
    isVoid: false // allows svg elems
  }),
  video: HTMLElementModel.fromModelBase({
    tagName: 'video',
    category: 'embedded',
    isVoid: false // allows source, tracks + transparent
  })
};

const editsModelMap: HTMLModelRecord<EditsTagNames> = {
  ins: HTMLElementModel.fromModelBase({
    tagName: 'ins',
    category: 'edits',
    mixedUAStyles: solidUnderlineStyle
  }),
  del: HTMLElementModel.fromModelBase({
    tagName: 'del',
    category: 'edits',
    mixedUAStyles: lineThroughStyle
  })
};

const textLevelModelMap: HTMLModelRecord<TextLevelTagNames> = {
  em: HTMLElementModel.fromModelBase({
    tagName: 'em',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  strong: HTMLElementModel.fromModelBase({
    tagName: 'strong',
    category: 'textual',
    mixedUAStyles: boldStyle
  }),
  small: HTMLElementModel.fromModelBase({
    tagName: 'small',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'smaller'
    }
  }),
  big: HTMLElementModel.fromModelBase({
    tagName: 'big',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'larger'
    }
  }),
  s: HTMLElementModel.fromModelBase({
    tagName: 's',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  strike: HTMLElementModel.fromModelBase({
    tagName: 'strike',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  cite: HTMLElementModel.fromModelBase({
    tagName: 'cite',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  q: HTMLElementModel.fromModelBase({
    tagName: 'q',
    category: 'textual'
    // default style, content: "open,close-quote"
  }),
  dfn: HTMLElementModel.fromModelBase({
    tagName: 'dfn',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  abbr: HTMLElementModel.fromModelBase({
    tagName: 'abbr',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
  }),
  acronym: HTMLElementModel.fromModelBase({
    tagName: 'acronym',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
  }),
  ruby: HTMLElementModel.fromModelBase({
    tagName: 'ruby',
    category: 'textual'
  }),
  rt: HTMLElementModel.fromModelBase({
    tagName: 'rt',
    category: 'textual'
  }),
  rp: HTMLElementModel.fromModelBase({
    tagName: 'rp',
    category: 'textual'
  }),
  data: HTMLElementModel.fromModelBase({
    tagName: 'data',
    category: 'textual'
  }),
  time: HTMLElementModel.fromModelBase({
    tagName: 'time',
    category: 'textual'
  }),
  code: HTMLElementModel.fromModelBase({
    tagName: 'code',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  tt: HTMLElementModel.fromModelBase({
    tagName: 'tt',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  var: HTMLElementModel.fromModelBase({
    tagName: 'var',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  samp: HTMLElementModel.fromModelBase({
    tagName: 'samp',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  kbd: HTMLElementModel.fromModelBase({
    tagName: 'kbd',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  sub: HTMLElementModel.fromModelBase({
    tagName: 'sub',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'bottom',
      fontSize: 'smaller'
    }
  }),
  sup: HTMLElementModel.fromModelBase({
    tagName: 'sup',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'top',
      fontSize: 'smaller'
    }
  }),
  i: HTMLElementModel.fromModelBase({
    tagName: 'i',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  b: HTMLElementModel.fromModelBase({
    tagName: 'b',
    category: 'textual'
  }),
  u: HTMLElementModel.fromModelBase({
    tagName: 'u',
    category: 'textual',
    mixedUAStyles: solidUnderlineStyle
  }),
  mark: HTMLElementModel.fromModelBase({
    tagName: 'mark',
    category: 'textual',
    mixedUAStyles: {
      backgroundColor: 'yellow',
      color: 'black'
    }
  }),
  bdi: HTMLElementModel.fromModelBase({
    tagName: 'bdi',
    category: 'textual'
    // unicode-bidi: isolate;
  }),
  bdo: HTMLElementModel.fromModelBase({
    tagName: 'bdo',
    category: 'textual'
    //  unicode-bidi: isolate-override;
  }),
  span: HTMLElementModel.fromModelBase({
    tagName: 'span',
    category: 'textual'
  }),
  br: HTMLElementModel.fromModelBase({
    tagName: 'br',
    category: 'textual',
    isVoid: true
  }),
  wbr: HTMLElementModel.fromModelBase({
    tagName: 'wbr',
    category: 'textual',
    isVoid: true
  })
};

const defaultHTMLModelRecord: HTMLModelRecord<TagName> = {
  a: HTMLElementModel.fromModelBase({
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

export default defaultHTMLModelRecord;
