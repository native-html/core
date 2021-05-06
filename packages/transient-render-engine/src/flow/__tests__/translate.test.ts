import { TStyles } from '../../styles/TStyles';
import { TEmptyCtor } from '../../tree/TEmptyCtor';
import { mapNodeList } from '../translate';
import { rfc002Source, href, imgSrc } from './shared';
import {
  defaultModelRegistry,
  defaultStylesMerger,
  translateTreeTest
} from './utils';

describe('translateNode function', () => {
  it('should comply with RFC002 example (translating)', () => {
    const ttree = translateTreeTest(rfc002Source);
    expect(ttree).toMatchSnapshot();
  });
  it('should translate styles (1)', () => {
    const ttree = translateTreeTest('<div style="font-size: 18px"></div>');
    expect(ttree).toMatchSnapshot();
  });
  it('should translate styles (2)', () => {
    const tdoc = translateTreeTest(
      '<a href="http://google.fr"><div style="background-color: red;"></div></a>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should set parent', () => {
    const tdoc = translateTreeTest(rfc002Source);
    expect(tdoc.children).toHaveLength(7);
    for (const child of tdoc.children) {
      expect(child.parent).toBe(tdoc);
    }
  });
  it('should translate a phrasing element with one text child node to a TText element', () => {
    const ttree = translateTreeTest('<span><strong>Hello!</strong></span>');
    expect(ttree).toMatchSnapshot();
  });
  it('should ignore unregistered tags', () => {
    const ttree = translateTreeTest('<nonexistingtag></nonexistingtag>');
    expect(ttree).toMatchSnapshot();
  });
  describe('regarding opaque blocks', () => {
    const svgSrc = '<svg><path /></svg>';
    const ttree = translateTreeTest(svgSrc);
    it('should translate to TEmpty', () => {
      expect(ttree).toBeInstanceOf(TEmptyCtor);
    });
    it('should set domNode attribute', () => {
      expect(ttree.domNode).toBeDefined();
    });
    it('should not translate children', () => {
      expect(ttree.children).toHaveLength(0);
    });
  });
  describe('should add a `nodeIndex` field with the index of this node relative to its parent', () => {
    const src = `<table>
    <tr>
      <th>Month</th>
      <th>Fortnight</th>
      <th>Savings</th>
    </tr>
    <tr>
      <td>January</td>
      <td>first</td>
      <td >$50</td>
    </tr>
    <tr>
      <td >second</td>
      <td>$80</td>
      <td>$80</td>
    </tr>
  </table>`;
    const ttree = translateTreeTest(src);
    expect(ttree.tagName).toBe('table');
    ttree.children.forEach((child, i) => {
      expect(child.nodeIndex).toBe(i);
    });
  });
});

describe('mapNodeList function', () => {
  it('should ignore untranslated nodes', () => {
    expect(
      mapNodeList({
        nodeList: [null] as any,
        parent: null,
        params: {
          stylesMerger: defaultStylesMerger,
          modelRegistry: defaultModelRegistry,
          baseStyles: TStyles.empty(),
          removeLineBreaksAroundEastAsianDiscardSet: false
        }
      })
    ).toHaveLength(0);
  });
});
