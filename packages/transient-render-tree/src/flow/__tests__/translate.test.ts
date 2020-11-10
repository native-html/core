import { rfc002Source, href, imgSrc } from './shared';
import { translateTreeTest } from './utils';

describe('translateNode function', () => {
  it('should comply with RFC002 example (translating)', async () => {
    const ttree = await translateTreeTest(rfc002Source);
    expect(ttree).toMatchObject({
      type: 'phrasing',
      isAnchor: true,
      attributes: { href },
      children: [
        {
          type: 'text',
          attributes: {},
          tagName: null,
          data: '\nThis is\n'
        },
        {
          type: 'text',
          attributes: {},
          tagName: 'span',
          data: 'phrasing content'
        },
        {
          type: 'text',
          attributes: {},
          tagName: null,
          data: '\n'
        },
        {
          type: 'block',
          attributes: { src: imgSrc },
          tagName: 'img'
        },
        {
          type: 'text',
          attributes: {},
          tagName: null,
          data: '\n    and this is '
        },
        {
          type: 'text',
          attributes: {},
          tagName: 'strong',
          data: 'too'
        },
        {
          type: 'text',
          attributes: {},
          tagName: null,
          data: '.\n'
        }
      ]
    });
    expect(ttree).toMatchSnapshot();
  });
  it('should translate styles', async () => {
    const ttree = await translateTreeTest(
      '<div style="font-size: 18px"></div>'
    );
    expect(ttree).toMatchObject({
      type: 'block',
      isAnchor: false,
      attributes: {},
      styles: {
        nativeTextFlow: { fontSize: 18 }
      },
      children: []
    });
    expect(ttree?.attributes).toEqual({});
  });
});
