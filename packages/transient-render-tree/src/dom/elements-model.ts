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

const sectioningModelMap: ModelRegistry<SectioningTagNames> = {
  address: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'address'
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
    tagName: 'h1'
  }),
  h2: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h2'
  }),
  h3: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h3'
  }),
  h4: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h4'
  }),
  h5: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h5'
  }),
  h6: new HTMLElementModel({
    category: 'sectioning',
    tagName: 'h6'
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
    category: 'grouping'
  }),
  dd: new HTMLElementModel({
    tagName: 'dd',
    category: 'grouping'
  }),
  div: new HTMLElementModel({
    tagName: 'div',
    category: 'grouping'
  }),
  dl: new HTMLElementModel({
    tagName: 'dl',
    category: 'grouping'
  }),
  dt: new HTMLElementModel({
    tagName: 'dt',
    category: 'grouping'
  }),
  figcaption: new HTMLElementModel({
    tagName: 'figcaption',
    category: 'grouping'
  }),
  figure: new HTMLElementModel({
    tagName: 'figure',
    category: 'grouping'
  }),
  hr: new HTMLElementModel({
    tagName: 'hr',
    category: 'grouping'
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
    category: 'grouping'
  }),
  p: new HTMLElementModel({
    tagName: 'p',
    category: 'grouping'
  }),
  pre: new HTMLElementModel({
    tagName: 'pre',
    category: 'grouping'
  }),
  ul: new HTMLElementModel({
    tagName: 'ul',
    category: 'grouping'
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
    category: 'edits'
  }),
  del: new HTMLElementModel({
    tagName: 'del',
    category: 'edits'
  })
};

const textLevelModelMap: ModelRegistry<TextLevelTagNames> = {
  em: new HTMLElementModel({
    tagName: 'em',
    category: 'textual'
  }),
  strong: new HTMLElementModel({
    tagName: 'strong',
    category: 'textual'
  }),
  small: new HTMLElementModel({
    tagName: 'small',
    category: 'textual'
  }),
  s: new HTMLElementModel({
    tagName: 's',
    category: 'textual'
  }),
  cite: new HTMLElementModel({
    tagName: 'cite',
    category: 'textual'
  }),
  q: new HTMLElementModel({
    tagName: 'q',
    category: 'textual'
  }),
  dfn: new HTMLElementModel({
    tagName: 'dfn',
    category: 'textual'
  }),
  abbr: new HTMLElementModel({
    tagName: 'abbr',
    category: 'textual'
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
    category: 'textual'
  }),
  var: new HTMLElementModel({
    tagName: 'var',
    category: 'textual'
  }),
  samp: new HTMLElementModel({
    tagName: 'samp',
    category: 'textual'
  }),
  kbd: new HTMLElementModel({
    tagName: 'kbd',
    category: 'textual'
  }),
  sub: new HTMLElementModel({
    tagName: 'sub',
    category: 'textual'
  }),
  sup: new HTMLElementModel({
    tagName: 'sup',
    category: 'textual'
  }),
  i: new HTMLElementModel({
    tagName: 'i',
    category: 'textual'
  }),
  b: new HTMLElementModel({
    tagName: 'b',
    category: 'textual'
  }),
  u: new HTMLElementModel({
    tagName: 'u',
    category: 'textual'
  }),
  mark: new HTMLElementModel({
    tagName: 'mark',
    category: 'textual'
  }),
  bdi: new HTMLElementModel({
    tagName: 'bdi',
    category: 'textual'
  }),
  bdo: new HTMLElementModel({
    tagName: 'bdo',
    category: 'textual'
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
    category: 'anchor'
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
