import { TNode } from '../../tree/TNode';
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
import { translateTreeTest } from './utils';

async function makeTTree(html: string): Promise<TNode> {
  return collapse(hoist(await translateTreeTest(html)));
}

describe('collapse function', () => {
  it('should collapse a tree such as specified in RFC002 example', async () => {
    const ttree = await makeTTree(rfc002Source);
    expect(ttree).toMatchObject({
      type: 'block',
      isAnchor: false,
      children: [
        {
          type: 'phrasing',
          isAnchor: true,
          href,
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
          isAnchor: true,
          tagName: 'img',
          attributes: {
            src: imgSrc
          }
        },
        {
          type: 'phrasing',
          isAnchor: true,
          href,
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
  it('should handle nested anchors', async () => {
    const ttree = await makeTTree(nestedHyperlinksSource);
    expect(ttree).toMatchObject({
      type: 'phrasing',
      isAnchor: true,
      href: href,
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
          isAnchor: true,
          href: secondaryHref,
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
  it('should handle deeply nested HTML', async () => {
    const ttree = await makeTTree(deeplyNestedSource);
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
  it('should hoist blocks recursively', async () => {
    const ttree = await makeTTree(recursiveHoisting);
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
  it('should handle body tag', async () => {
    const html = `<body><div>
    <span>Hello world!</span>
</div></body>`;
    const ttree = await makeTTree(html);
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
  it('should handle direct style inheritance', async () => {
    const ttree = await makeTTree(
      '<div style="font-size: 18px;border-width: 20px;"><span style="color: red;">This is nice!</span></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      isAnchor: false,
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
          isAnchor: false,
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
  it('should handle indirect style inheritance', async () => {
    const ttree = await makeTTree(
      '<div style="font-size: 18px;"><div style="border-width: 20px;">This is great!</div></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      isAnchor: false,
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
});
