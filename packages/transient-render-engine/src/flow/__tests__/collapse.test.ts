import { TBlock } from '../../tree/TBlock';
import { TNode } from '../../tree/TNode';
import { TPhrasing } from '../../tree/TPhrasing';
import { TText } from '../../tree/TText';
import { collapse } from '../collapse';
import { hoist } from '../hoist';
import {
  deeplyNestedSource,
  href,
  imgSrc,
  nestedHyperlinksSource,
  recursiveHoisting,
  rfc002Source,
  secondaryHref
} from './shared';
import { defaultDataFlowParams, defaultInit, translateTreeTest } from './utils';

function makeTTree(
  html: string,
  removeLineBreaksAroundEastAsianDiscardSet = false
): TNode {
  return collapse(hoist(translateTreeTest(html)), {
    ...defaultDataFlowParams,
    removeLineBreaksAroundEastAsianDiscardSet
  });
}

describe('collapse function', () => {
  it('should collapse a tree such as specified in RFC002 example', () => {
    const ttree = makeTTree(rfc002Source);
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: { href },
      children: [
        {
          type: 'phrasing',
          children: [
            {
              type: 'text',
              data: 'This is '
            },
            {
              type: 'text',
              data: 'phrasing content',
              tagName: 'span'
            }
          ]
        },
        {
          type: 'block',
          tagName: 'img',
          attributes: {
            src: imgSrc
          }
        },
        {
          type: 'phrasing',
          children: [
            {
              type: 'text',
              data: 'and this is '
            },
            {
              type: 'text',
              tagName: 'strong',
              data: 'too'
            },
            {
              type: 'text',
              data: '.'
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should collapse adjacent tags', () => {
    const ttree = makeTTree('<span><span>foo </span><span> bar</span></span>');
    expect(ttree).toMatchObject({
      type: 'phrasing',
      tagName: 'span',
      children: [
        {
          type: 'text',
          tagName: 'span',
          data: 'foo'
        },
        {
          type: 'text',
          tagName: 'span',
          data: ' bar'
        }
      ]
    });
  });
  it('should handle nested anchors', () => {
    const ttree = makeTTree(nestedHyperlinksSource);
    expect(ttree).toMatchObject({
      type: 'phrasing',
      attributes: { href },
      children: [
        {
          type: 'text',
          data: 'This is '
        },
        {
          type: 'text',
          tagName: 'span',
          data: 'phrasing content'
        },
        {
          type: 'text',
          data: ' '
        },
        {
          type: 'phrasing',
          attributes: { href: secondaryHref },
          children: [
            {
              type: 'text',
              data: 'and this is '
            },
            {
              type: 'text',
              tagName: 'strong',
              data: 'too'
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should handle deeply nested HTML', () => {
    const ttree = makeTTree(deeplyNestedSource);
    expect(ttree).toMatchObject({
      type: 'block',
      tagName: 'article',
      children: [
        {
          type: 'phrasing',
          tagName: null,
          children: [
            {
              type: 'text',
              data: 'First implicit paragraph.'
            }
          ]
        },
        {
          type: 'block',
          tagName: 'div',
          children: [
            {
              type: 'phrasing',
              tagName: null,
              children: [
                {
                  type: 'text',
                  data: 'Second implicit paragraph'
                }
              ]
            },
            {
              type: 'block',
              tagName: 'p',
              children: [
                {
                  type: 'phrasing',
                  children: [
                    {
                      type: 'text',
                      data: 'A new paragraph.'
                    },
                    {
                      type: 'text',
                      tagName: 'span',
                      data: ' And a span within'
                    }
                  ]
                },
                {
                  type: 'block',
                  tagName: 'img'
                }
              ]
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should hoist blocks recursively', () => {
    const ttree = makeTTree(recursiveHoisting);
    expect(ttree).toMatchObject({
      type: 'block',
      tagName: 'span',
      children: [
        {
          type: 'phrasing',
          tagName: null,
          children: [
            {
              type: 'text',
              data: 'Line1',
              tagName: null
            }
          ]
        },
        {
          type: 'block',
          tagName: 'strong',
          children: [
            {
              type: 'phrasing',
              tagName: null,
              children: [
                {
                  type: 'text',
                  data: 'Line2',
                  tagName: null
                },
                {
                  type: 'text',
                  data: ' Line3',
                  tagName: 'span'
                }
              ]
            },
            {
              type: 'block',
              tagName: 'img',
              attributes: { src: imgSrc }
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should handle body tag', () => {
    const html = `<body><div>
    <span>Hello world!</span>
</div></body>`;
    const ttree = makeTTree(html);
    expect(ttree).toMatchObject({
      type: 'block',
      tagName: 'body',
      children: [
        {
          type: 'block',
          tagName: 'div',
          children: [
            {
              type: 'phrasing',
              tagName: null,
              children: [
                {
                  type: 'text',
                  tagName: 'span',
                  data: 'Hello world!'
                }
              ]
            }
          ]
        }
      ]
    });
  });
  it('should remove empty children from TBlock nodes', () => {
    const ttree = new TBlock(defaultInit);
    ttree.bindChildren([new TText({ data: '', ...defaultInit })]);
    expect(collapse(ttree, defaultDataFlowParams).children).toHaveLength(0);
  });
  it('should remove empty anonymous TText children from TPhrasing nodes', () => {
    const ttree = new TPhrasing(defaultInit);
    ttree.bindChildren([new TText({ data: '', ...defaultInit })]);
    expect(collapse(ttree, defaultDataFlowParams).children).toHaveLength(0);
  });
  it('should remove empty anonymous TPhrasing children from TPhrasing nodes', () => {
    const ttree = new TPhrasing(defaultInit);
    const tphrasing = new TPhrasing(defaultInit);
    tphrasing.bindChildren([new TText({ data: '', ...defaultInit })]);
    ttree.bindChildren([tphrasing]);
    expect(collapse(ttree, defaultDataFlowParams).children).toHaveLength(0);
  });
  it('should remove children from TPhrasing nodes which are not TText or TPhrasing nodes', () => {
    const ttree = new TPhrasing(defaultInit);
    const forbiddenChild = new TBlock(defaultInit);
    ttree.bindChildren([forbiddenChild]);
    expect(collapse(ttree, defaultDataFlowParams).children).toHaveLength(0);
  });
  it('should remove children from TPhrasing nodes which are empty after timming', () => {
    const ttree = new TPhrasing(defaultInit);
    ttree.bindChildren([
      // This node will be empty after trimming right, and should be removed
      new TText({ data: ' ', ...defaultInit }),
      new TText({ data: ' Foo', ...defaultInit }),
      new TText({ data: ' Bar', ...defaultInit })
    ]);
    expect(collapse(ttree, defaultDataFlowParams).children).toHaveLength(2);
  });
  it('should handle direct style inheritance', () => {
    const ttree = makeTTree(
      '<div style="font-size: 18px;border-width: 20px;"><span style="color: red;">This is nice!</span></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {
        nativeTextFlow: { fontSize: 18 },
        nativeBlockRet: {
          borderTopWidth: 20,
          borderRightWidth: 20,
          borderBottomWidth: 20,
          borderLeftWidth: 20
        }
      },
      children: [
        {
          type: 'phrasing',
          attributes: {},
          styles: {
            nativeTextFlow: { fontSize: 18 },
            nativeBlockRet: {}
          },
          children: [
            {
              type: 'text',
              tagName: 'span',
              data: 'This is nice!',
              styles: {
                nativeTextFlow: { color: 'red' }
              }
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should handle indirect style inheritance', () => {
    const ttree = makeTTree(
      '<div style="font-size: 18px;"><div style="border-width: 20px;">This is great!</div></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {
        nativeTextFlow: { fontSize: 18 }
      },
      children: [
        {
          type: 'block',
          tagName: 'div',
          styles: {
            nativeTextFlow: { fontSize: 18 },
            nativeBlockRet: {
              borderTopWidth: 20,
              borderRightWidth: 20,
              borderBottomWidth: 20,
              borderLeftWidth: 20
            }
          },
          children: [
            {
              type: 'phrasing',
              tagName: null,
              styles: {
                nativeTextFlow: { fontSize: 18 }
              },
              children: [
                {
                  type: 'text',
                  data: 'This is great!',
                  tagName: null
                }
              ]
            }
          ]
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should not collapse when white-space CSS property is set to "pre"', () => {
    const ttree = makeTTree(
      '<div style="white-space: pre;">  This is great!  </div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {
        webTextFlow: { whiteSpace: 'pre' }
      },
      children: [
        {
          type: 'phrasing',
          tagName: null,
          styles: {
            webTextFlow: { whiteSpace: 'pre' }
          },
          children: [
            {
              type: 'text',
              tagName: null,
              data: '  This is great!  ',
              styles: {
                webTextFlow: { whiteSpace: 'pre' }
              }
            }
          ]
        }
      ]
    });
  });
  it('should collapse when white-space CSS property is set to "normal"', () => {
    const ttree = makeTTree(
      '<div style="white-space: normal;">  This is great!  </div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {
        webTextFlow: { whiteSpace: 'normal' }
      },
      children: [
        {
          type: 'phrasing',
          tagName: null,
          styles: {
            webTextFlow: { whiteSpace: 'normal' }
          },
          children: [
            {
              type: 'text',
              tagName: null,
              data: 'This is great!'
            }
          ]
        }
      ]
    });
  });
  it('should collapse when white-space CSS property is not set', () => {
    const ttree = makeTTree('<div>  This is great!  </div>');
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {},
      children: [
        {
          type: 'phrasing',
          tagName: null,
          styles: {},
          children: [
            {
              type: 'text',
              tagName: null,
              data: 'This is great!'
            }
          ]
        }
      ]
    });
  });
  it('should collapse a node with white-space set to "normal" while its parent has white-space set to "pre"', () => {
    const ttree = makeTTree(
      '<div style="white-space: pre;"><span> This is nice </span><strong style="white-space: normal"> Should collapse </strong></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      attributes: {},
      tagName: 'div',
      styles: {},
      children: [
        {
          type: 'phrasing',
          tagName: null,
          styles: {},
          children: [
            {
              type: 'text',
              tagName: 'span',
              data: ' This is nice '
            },
            {
              type: 'text',
              tagName: 'strong',
              // left space should be spared, since left sibling is not
              // collapsible (tested in Mozilla Firefox and Chromium)
              data: ' Should collapse'
            }
          ]
        }
      ]
    });
  });
  it('should withold TEmpty nodes', () => {
    const ttree = makeTTree(
      '<div><span>Hi!</span><link rel="author" href="mailto:don@company.com" /></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      tagName: 'div',
      children: [
        {
          type: 'phrasing',
          tagName: null
        },
        {
          type: 'empty',
          tagName: 'link'
        }
      ]
    });
  });
  it('should support removeLineBreaksAroundEastAsianDiscardSet param', () => {
    const ttree = makeTTree('<span>\u2F00\n\u2FDA</span>', true);
    expect(ttree).toMatchObject({
      type: 'text',
      tagName: 'span',
      data: '\u2F00\u2FDA'
    });
  });
});
