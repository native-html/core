import { TStyles } from '../../styles/TStyles';
import { TBlock } from '../../tree/TBlock';
import { mapNodeList } from '../translate';
import { rfc002Source, href, imgSrc } from './shared';
import { defaultStylesMerger, translateTreeTest } from './utils';

describe('translateNode function', () => {
  it('should comply with RFC002 example (translating)', () => {
    const ttree = translateTreeTest(rfc002Source);
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
  it('should translate styles (1)', () => {
    const ttree = translateTreeTest('<div style="font-size: 18px"></div>');
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
  it('should translate styles (2)', () => {
    const tdoc = translateTreeTest(
      '<a href="http://google.fr"><div style="background-color: red;"></div></a>'
    );
    expect(tdoc.children[0].styles.nativeBlockRet.backgroundColor).toBe('red');
  });
  it('should translate a phrasing element with one text child node to a TText element', () => {
    const ttree = translateTreeTest('<span><strong>Hello!</strong></span>');
    expect(ttree).toMatchObject({
      type: 'phrasing',
      tagName: 'span',
      children: [
        {
          type: 'text',
          tagName: 'strong',
          data: 'Hello!'
        }
      ]
    });
  });
  describe('regarding opaque blocks', () => {
    const pictureSrc =
      '<picture><source srcset="/media/cc0-images/surfer-240-200.jpg" media="(min-width: 800px)"><img src="/media/cc0-images/painted-hand-298-332.jpg" alt="" /></picture>';
    const ttree = translateTreeTest(pictureSrc);
    it('should translate to TBlock', () => {
      expect(ttree).toBeInstanceOf(TBlock);
    });
    it('should set domChildren attribute', () => {
      expect(ttree).toMatchObject({
        domChildren: expect.any(Array)
      });
    });
    it('should translate children', () => {
      expect(ttree.children).toHaveLength(2);
    });
  });
});

describe('mapNodeList function', () => {
  it('should ignore untranslated nodes', () => {
    expect(
      mapNodeList([null] as any, null, {
        stylesMerger: defaultStylesMerger,
        baseStyles: TStyles.empty()
      })
    ).toHaveLength(0);
  });
});
