import { MixedStyleDeclaration } from '@native-html/css-processor';
import { textContent } from 'domutils';
import HTMLContentModel from './HTMLContentModel';
import HTMLElementModel from './HTMLElementModel';
import {
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
  HTMLModelRecord,
  ElementModelBase
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

const getReactNativePropsForHeading: ElementModelBase<any>['getReactNativeProps'] =
  ({ domNode }) => {
    const textLabel = textContent(domNode!);
    return {
      native: {
        accessible: true,
        accessibilityLabel: textLabel,
        accessibilityRole: 'header'
      }
    };
  };

const getReactNativePropsWithHref: ElementModelBase<any>['getReactNativeProps'] =
  function getReactNativePropsWithHref({ attributes }) {
    if (typeof attributes.href === 'string' && attributes.href.length > 0) {
      return {
        native: {
          accessible: true,
          accessibilityRole: 'link'
        }
      };
    }
  };

const sectioningModelMap: HTMLModelRecord<
  SectioningTagNames,
  HTMLContentModel.block
> = {
  address: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'address',
    mixedUAStyles: italicStyle
  }),
  article: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'article'
  }),
  aside: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'aside'
  }),
  body: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'body'
  }),
  footer: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'footer'
  }),
  h1: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h1',
    mixedUAStyles: headerStyle('2em', '.67em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  h2: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h2',
    mixedUAStyles: headerStyle('1.5em', '.83em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  h3: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h3',
    mixedUAStyles: headerStyle('1.17em', '1em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  h4: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h4',
    mixedUAStyles: headerStyle('1em', '1.33em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  h5: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h5',
    mixedUAStyles: headerStyle('.83em', '1.67em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  h6: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'h6',
    mixedUAStyles: headerStyle('.67em', '2.33em'),
    getReactNativeProps: getReactNativePropsForHeading
  }),
  header: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'header'
  }),
  hgroup: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'hgroup'
  }),
  nav: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'nav'
  }),
  section: HTMLElementModel.fromNativeModel({
    category: 'sectioning',
    tagName: 'section'
  })
};

const unsupportedModelMap: HTMLModelRecord<
  UnsupportedTagNames,
  HTMLContentModel.none
> = {
  area: HTMLElementModel.fromNativeModel({
    tagName: 'area',
    category: 'untranslatable',
    isVoid: true,
    getReactNativeProps: getReactNativePropsWithHref
  }),
  map: HTMLElementModel.fromNativeModel({
    tagName: 'map',
    category: 'untranslatable'
  })
};

const attribsModelMap: HTMLModelRecord<AttribTagNames, HTMLContentModel.none> =
  {
    accesskey: HTMLElementModel.fromNativeModel({
      tagName: 'accesskey',
      category: 'untranslatable'
    }),
    caption: HTMLElementModel.fromNativeModel({
      tagName: 'caption',
      category: 'untranslatable'
    }),
    col: HTMLElementModel.fromNativeModel({
      tagName: 'col',
      category: 'untranslatable',
      isVoid: true
    }),
    colgroup: HTMLElementModel.fromNativeModel({
      tagName: 'colgroup',
      category: 'untranslatable'
    }),
    datalist: HTMLElementModel.fromNativeModel({
      tagName: 'datalist',
      category: 'untranslatable'
    }),
    source: HTMLElementModel.fromNativeModel({
      tagName: 'source',
      category: 'untranslatable',
      isVoid: true
    }),
    track: HTMLElementModel.fromNativeModel({
      tagName: 'track',
      category: 'untranslatable',
      isVoid: true
    }),
    optgroup: HTMLElementModel.fromNativeModel({
      tagName: 'optgroup',
      category: 'untranslatable'
    }),
    option: HTMLElementModel.fromNativeModel({
      tagName: 'option',
      category: 'untranslatable'
    }),
    param: HTMLElementModel.fromNativeModel({
      tagName: 'param',
      category: 'untranslatable',
      isVoid: true
    })
  };

const interactiveModelMap: HTMLModelRecord<
  InteractiveTagNames,
  HTMLContentModel.none
> = {
  button: HTMLElementModel.fromNativeModel({
    tagName: 'button',
    category: 'interactive',
    reactNativeProps: {
      native: {
        accessibilityRole: 'button'
      }
    }
  }),
  fieldset: HTMLElementModel.fromNativeModel({
    tagName: 'fieldset',
    category: 'interactive'
  }),
  form: HTMLElementModel.fromNativeModel({
    tagName: 'form',
    category: 'interactive'
  }),
  input: HTMLElementModel.fromNativeModel({
    tagName: 'input',
    category: 'interactive',
    isVoid: true
  }),
  label: HTMLElementModel.fromNativeModel({
    tagName: 'label',
    category: 'interactive'
  }),
  legend: HTMLElementModel.fromNativeModel({
    tagName: 'legend',
    category: 'interactive'
  }),
  meter: HTMLElementModel.fromNativeModel({
    tagName: 'meter',
    category: 'interactive'
  }),
  progress: HTMLElementModel.fromNativeModel({
    tagName: 'progress',
    category: 'interactive'
  }),
  select: HTMLElementModel.fromNativeModel({
    tagName: 'select',
    category: 'interactive',
    reactNativeProps: {
      native: {
        accessible: true,
        accessibilityRole: 'combobox'
      }
    }
  }),
  details: HTMLElementModel.fromNativeModel({
    tagName: 'details',
    category: 'interactive'
  }),
  dialog: HTMLElementModel.fromNativeModel({
    tagName: 'dialog',
    category: 'interactive'
  }),
  output: HTMLElementModel.fromNativeModel({
    tagName: 'output',
    category: 'interactive'
  }),
  summary: HTMLElementModel.fromNativeModel({
    tagName: 'summary',
    category: 'interactive'
  }),
  textarea: HTMLElementModel.fromNativeModel({
    tagName: 'textarea',
    category: 'interactive'
  })
};

const metadataModelMap: HTMLModelRecord<
  MetadataTagNames,
  HTMLContentModel.none
> = {
  base: HTMLElementModel.fromNativeModel({
    tagName: 'base',
    category: 'untranslatable',
    isVoid: true
  }),
  head: HTMLElementModel.fromNativeModel({
    tagName: 'head',
    category: 'untranslatable',
    isOpaque: true
  }),
  link: HTMLElementModel.fromNativeModel({
    tagName: 'link',
    category: 'untranslatable',
    isVoid: true
  }),
  meta: HTMLElementModel.fromNativeModel({
    tagName: 'meta',
    category: 'untranslatable',
    isVoid: true
  }),
  title: HTMLElementModel.fromNativeModel({
    tagName: 'title',
    category: 'untranslatable'
  })
};

const untranslatableModelMap: HTMLModelRecord<
  UntranslatableTagNames,
  HTMLContentModel.none
> = {
  ...attribsModelMap,
  ...interactiveModelMap,
  ...unsupportedModelMap,
  ...metadataModelMap
};

const groupingModelMap: HTMLModelRecord<
  GroupingTagNames,
  HTMLContentModel.block
> = {
  blockquote: HTMLElementModel.fromNativeModel({
    tagName: 'blockquote',
    category: 'grouping',
    getMixedUAStyles: ({ attributes }) => {
      if (attributes.type === 'cite') {
        return leftBorderQuoteStyle;
      }
    },
    mixedUAStyles: spacedBlockStyle
  }),
  dd: HTMLElementModel.fromNativeModel({
    tagName: 'dd',
    category: 'grouping',
    mixedUAStyles: {
      marginLeft: UA_MARGIN_HZ
    }
  }),
  div: HTMLElementModel.fromNativeModel({
    tagName: 'div',
    category: 'grouping'
  }),
  dl: HTMLElementModel.fromNativeModel({
    tagName: 'dl',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  dt: HTMLElementModel.fromNativeModel({
    tagName: 'dt',
    category: 'grouping',
    mixedUAStyles: boldStyle
  }),
  figcaption: HTMLElementModel.fromNativeModel({
    tagName: 'figcaption',
    category: 'grouping',
    mixedUAStyles: {
      ...italicStyle,
      textAlign: 'center'
    }
  }),
  figure: HTMLElementModel.fromNativeModel({
    tagName: 'figure',
    category: 'grouping',
    mixedUAStyles: spacedBlockStyle
  }),
  hr: HTMLElementModel.fromNativeModel({
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
  li: HTMLElementModel.fromNativeModel({
    tagName: 'li',
    category: 'grouping'
  }),
  main: HTMLElementModel.fromNativeModel({
    tagName: 'main',
    category: 'grouping'
  }),
  menu: HTMLElementModel.fromNativeModel({
    tagName: 'menu',
    category: 'grouping'
  }),
  ol: HTMLElementModel.fromNativeModel({
    tagName: 'ol',
    category: 'grouping',
    mixedUAStyles: listStyles,
    setMarkersForTNode(targetMarkers, parentMarkers) {
      targetMarkers.olNestLevel = parentMarkers.olNestLevel + 1;
    }
  }),
  p: HTMLElementModel.fromNativeModel({
    tagName: 'p',
    category: 'grouping',
    mixedUAStyles: bigMarginTopBottomStyle
  }),
  pre: HTMLElementModel.fromNativeModel({
    tagName: 'pre',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  xmp: HTMLElementModel.fromNativeModel({
    tagName: 'xmp',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  listing: HTMLElementModel.fromNativeModel({
    tagName: 'listing',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  plaintext: HTMLElementModel.fromNativeModel({
    tagName: 'plaintext',
    category: 'grouping',
    mixedUAStyles: preStyles
  }),
  ul: HTMLElementModel.fromNativeModel({
    tagName: 'ul',
    category: 'grouping',
    mixedUAStyles: listStyles,
    setMarkersForTNode(targetMarkers, parentMarkers) {
      targetMarkers.ulNestLevel = parentMarkers.ulNestLevel + 1;
    }
  }),
  dir: HTMLElementModel.fromNativeModel({
    tagName: 'dir',
    category: 'grouping',
    mixedUAStyles: listStyles
  })
};

const tabularModelMap: HTMLModelRecord<
  TabularTagNames,
  HTMLContentModel.block
> = {
  table: HTMLElementModel.fromNativeModel({
    tagName: 'table',
    category: 'tabular'
  }),
  tbody: HTMLElementModel.fromNativeModel({
    tagName: 'tbody',
    category: 'tabular'
  }),
  td: HTMLElementModel.fromNativeModel({
    tagName: 'td',
    category: 'tabular',
    mixedUAStyles: {
      padding: 2,
      flex: 1
    }
  }),
  tfoot: HTMLElementModel.fromNativeModel({
    tagName: 'tfoot',
    category: 'tabular'
  }),
  th: HTMLElementModel.fromNativeModel({
    tagName: 'th',
    category: 'tabular',
    mixedUAStyles: {
      padding: 2,
      flex: 1,
      fontWeight: 'bold'
    }
  }),
  thead: HTMLElementModel.fromNativeModel({
    tagName: 'thead',
    category: 'tabular'
  }),
  tr: HTMLElementModel.fromNativeModel({
    tagName: 'tr',
    category: 'tabular',
    mixedUAStyles: {
      flexDirection: 'row',
      flexWrap: 'nowrap'
    }
  })
};

// These emnbedded should be rendered by default.
const renderedEmbeddedModelMap: HTMLModelRecord<
  Extract<EmbeddedTagNames, 'picture' | 'img'>,
  HTMLContentModel.block
> = {
  img: HTMLElementModel.fromNativeModel({
    tagName: 'img',
    category: 'embedded',
    isVoid: true,
    getReactNativeProps({ attributes }, props) {
      // see https://w3c.github.io/html-aria/#el-img
      const label = attributes['aria-label'] || attributes.alt;
      if (label && (!props?.view || props.view.accessibilityRole !== 'none')) {
        return {
          native: {
            accessibilityLabel: label,
            accessibilityRole: 'image'
          }
        };
      }
      return {
        native: {
          accessibilityRole: 'none'
        }
      };
    }
  }).extend({
    contentModel: HTMLContentModel.block
  }),
  picture: HTMLElementModel.fromNativeModel({
    tagName: 'picture',
    category: 'embedded',
    isOpaque: false,
    isVoid: false // allows source and img
  }).extend({
    contentModel: HTMLContentModel.block
  })
};

// Embedded elements content model is "none" by default.
const emptyEmbeddedModelMap: HTMLModelRecord<
  Exclude<EmbeddedTagNames, 'img' | 'picture'>,
  HTMLContentModel.none
> = {
  audio: HTMLElementModel.fromNativeModel({
    tagName: 'audio',
    category: 'embedded',
    isVoid: false // allows tracks
  }),
  canvas: HTMLElementModel.fromNativeModel({
    tagName: 'canvas',
    category: 'embedded',
    isVoid: false // allows specific content
  }),
  embed: HTMLElementModel.fromNativeModel({
    tagName: 'embed',
    category: 'embedded',
    isVoid: true
  }),
  iframe: HTMLElementModel.fromNativeModel({
    tagName: 'iframe',
    category: 'embedded',
    isVoid: true
  }),
  math: HTMLElementModel.fromNativeModel({
    tagName: 'math',
    category: 'embedded',
    isVoid: false, // allows mathml elems
    isOpaque: true
  }),
  object: HTMLElementModel.fromNativeModel({
    tagName: 'object',
    category: 'embedded',
    isVoid: false // allows params
  }),
  svg: HTMLElementModel.fromNativeModel({
    tagName: 'svg',
    category: 'embedded',
    isVoid: false, // allows svg elems
    isOpaque: true,
    getReactNativeProps({ attributes }) {
      if (attributes['aria-label']) {
        return {
          native: {
            accessibilityLabel: attributes['aria-label'],
            accessibilityRole: 'image'
          }
        };
      }
      return {
        native: {
          accessibilityRole: 'none'
        }
      };
    }
  }),
  video: HTMLElementModel.fromNativeModel({
    tagName: 'video',
    category: 'embedded',
    isVoid: false // allows source, tracks + transparent
  })
};

const editsModelMap: HTMLModelRecord<EditsTagNames, HTMLContentModel.mixed> = {
  ins: HTMLElementModel.fromNativeModel({
    tagName: 'ins',
    category: 'edits',
    mixedUAStyles: solidUnderlineStyle,
    setMarkersForTNode(targetMarkers) {
      targetMarkers.edits = 'ins';
    }
  }),
  del: HTMLElementModel.fromNativeModel({
    tagName: 'del',
    category: 'edits',
    mixedUAStyles: lineThroughStyle,
    setMarkersForTNode(targetMarkers) {
      targetMarkers.edits = 'del';
    }
  })
};

const textLevelModelMap: HTMLModelRecord<
  TextLevelTagNames,
  HTMLContentModel.textual
> = {
  em: HTMLElementModel.fromNativeModel({
    tagName: 'em',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  strong: HTMLElementModel.fromNativeModel({
    tagName: 'strong',
    category: 'textual',
    mixedUAStyles: boldStyle
  }),
  small: HTMLElementModel.fromNativeModel({
    tagName: 'small',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'smaller'
    }
  }),
  big: HTMLElementModel.fromNativeModel({
    tagName: 'big',
    category: 'textual',
    mixedUAStyles: {
      fontSize: 'larger'
    }
  }),
  s: HTMLElementModel.fromNativeModel({
    tagName: 's',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  strike: HTMLElementModel.fromNativeModel({
    tagName: 'strike',
    category: 'textual',
    mixedUAStyles: lineThroughStyle
  }),
  cite: HTMLElementModel.fromNativeModel({
    tagName: 'cite',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  q: HTMLElementModel.fromNativeModel({
    tagName: 'q',
    category: 'textual'
    // default style, content: "open,close-quote"
  }),
  dfn: HTMLElementModel.fromNativeModel({
    tagName: 'dfn',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  abbr: HTMLElementModel.fromNativeModel({
    tagName: 'abbr',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
  }),
  acronym: HTMLElementModel.fromNativeModel({
    tagName: 'acronym',
    category: 'textual',
    mixedUAStyles: dottedUnderlineStyle
  }),
  ruby: HTMLElementModel.fromNativeModel({
    tagName: 'ruby',
    category: 'textual'
  }),
  rt: HTMLElementModel.fromNativeModel({
    tagName: 'rt',
    category: 'textual'
  }),
  rp: HTMLElementModel.fromNativeModel({
    tagName: 'rp',
    category: 'textual'
  }),
  data: HTMLElementModel.fromNativeModel({
    tagName: 'data',
    category: 'textual'
  }),
  time: HTMLElementModel.fromNativeModel({
    tagName: 'time',
    category: 'textual'
  }),
  code: HTMLElementModel.fromNativeModel({
    tagName: 'code',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  tt: HTMLElementModel.fromNativeModel({
    tagName: 'tt',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  var: HTMLElementModel.fromNativeModel({
    tagName: 'var',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  samp: HTMLElementModel.fromNativeModel({
    tagName: 'samp',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  kbd: HTMLElementModel.fromNativeModel({
    tagName: 'kbd',
    category: 'textual',
    mixedUAStyles: monoStyle
  }),
  sub: HTMLElementModel.fromNativeModel({
    tagName: 'sub',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'bottom',
      fontSize: 'smaller'
    }
  }),
  sup: HTMLElementModel.fromNativeModel({
    tagName: 'sup',
    category: 'textual',
    mixedUAStyles: {
      textAlignVertical: 'top',
      fontSize: 'smaller'
    }
  }),
  i: HTMLElementModel.fromNativeModel({
    tagName: 'i',
    category: 'textual',
    mixedUAStyles: italicStyle
  }),
  b: HTMLElementModel.fromNativeModel({
    tagName: 'b',
    category: 'textual',
    mixedUAStyles: boldStyle
  }),
  u: HTMLElementModel.fromNativeModel({
    tagName: 'u',
    category: 'textual',
    mixedUAStyles: solidUnderlineStyle
  }),
  mark: HTMLElementModel.fromNativeModel({
    tagName: 'mark',
    category: 'textual',
    mixedUAStyles: {
      backgroundColor: 'yellow',
      color: 'black'
    }
  }),
  bdi: HTMLElementModel.fromNativeModel({
    tagName: 'bdi',
    category: 'textual'
    // unicode-bidi: isolate;
  }),
  bdo: HTMLElementModel.fromNativeModel({
    tagName: 'bdo',
    category: 'textual'
    //  unicode-bidi: isolate-override;
  }),
  span: HTMLElementModel.fromNativeModel({
    tagName: 'span',
    category: 'textual'
  }),
  br: HTMLElementModel.fromNativeModel({
    tagName: 'br',
    category: 'textual',
    isVoid: true
  }),
  wbr: HTMLElementModel.fromNativeModel({
    tagName: 'wbr',
    category: 'textual',
    isVoid: true
  })
};

const defaultHTMLElementModels = {
  a: HTMLElementModel.fromNativeModel({
    tagName: 'a',
    category: 'anchor',
    getMixedUAStyles: ({ attributes }) => {
      if (typeof attributes.href === 'string') {
        return anchorStyle;
      }
    },
    getReactNativeProps: getReactNativePropsWithHref,
    setMarkersForTNode(targetMarkers) {
      targetMarkers.anchor = true;
    }
  }),
  ...textLevelModelMap,
  ...editsModelMap,
  ...renderedEmbeddedModelMap,
  ...emptyEmbeddedModelMap,
  ...tabularModelMap,
  ...groupingModelMap,
  ...sectioningModelMap,
  ...interactiveModelMap,
  ...untranslatableModelMap
};

export type DefaultHTMLElementModelsStatic = typeof defaultHTMLElementModels;

export default defaultHTMLElementModels;
