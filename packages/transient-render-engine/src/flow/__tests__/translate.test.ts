import { ReactNativePropsSwitch } from '../../helper-types';
import HTMLModelRegistry from '../../model/HTMLModelRegistry';
import { TStyles } from '../../styles/TStyles';
import { TEmptyCtor } from '../../tree/TEmptyCtor';
import { mapNodeList } from '../translate';
import { rfc002Source } from './shared';
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
  it('should pass regression with rgb() including spaces', () => {
    const span = translateTreeTest(
      '<span style="color: rgb(101, 123, 131);">A</span>'
    );
    expect(span).toMatchSnapshot();
  });
  describe('regarding `getMixedUAStyles`', () => {
    it('should be able to set styles conditionnaly', () => {
      const tdoc = translateTreeTest(
        '<div><span class="hello" data-custom="true">text</span></div>',
        {
          modelRegistry: new HTMLModelRegistry((models) => ({
            ...models,
            span: models.span.extend({
              getMixedUAStyles(tnode) {
                if (
                  tnode.hasClass('hello') &&
                  tnode.attributes['data-custom']
                ) {
                  return { color: 'blue' };
                }
              }
            })
          }))
        }
      );
      const span = tdoc.children[0];
      expect(span.tagName).toBe('span');
      expect(span.styles.nativeTextFlow.color).toBe('blue');
    });
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
  describe('regarding images accessiblity', () => {
    it('should not provide accessibility to images with role="presentation"', () => {
      const ttree = translateTreeTest(
        '<img role="presentation" alt="foo" src="https://" />'
      );
      expect(ttree.getReactNativeProps()).toEqual<ReactNativePropsSwitch>({
        text: {
          accessibilityRole: 'none'
        },
        view: {
          accessibilityRole: 'none'
        }
      });
    });

    it('should provide accessibility to images with role="image" and non-empty alt', () => {
      const ttree = translateTreeTest(
        '<img role="image" alt="foo" src="https://" />'
      );
      expect(ttree.getReactNativeProps()).toEqual<ReactNativePropsSwitch>({
        text: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        },
        view: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        }
      });
    });
    it('should provide accessibility to images with role="image" and non-empty aria-label', () => {
      const ttree = translateTreeTest(
        '<img role="image" aria-label="foo" src="https://" />'
      );
      expect(ttree.getReactNativeProps()).toEqual<ReactNativePropsSwitch>({
        text: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        },
        view: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        }
      });
    });

    it('should prefer aria-label over alt to generate an accessibilityLabel prop', () => {
      const ttree = translateTreeTest(
        '<img role="image" aria-label="foo" alt="bar" src="https://" />'
      );
      expect(ttree.getReactNativeProps()).toEqual<ReactNativePropsSwitch>({
        text: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        },
        view: {
          accessibilityLabel: 'foo',
          accessibilityRole: 'image'
        }
      });
    });
  });
  describe('regarding markers', () => {
    it('should set an anchor marker with <a> elements', () => {
      const ttree = translateTreeTest('<a href="hello">Yo!</a>');
      expect(ttree.markers.anchor).toBe(true);
      ttree.children.forEach((c) => {
        expect(c.markers.anchor).toBe(true);
      });
    });
    it('should set an ulNestLevel marker with <ul> elements', () => {
      const ttree = translateTreeTest('<ul><li></li></ul>');
      expect(ttree.markers.ulNestLevel).toBe(0);
      ttree.children.forEach((c) => {
        expect(c.markers.ulNestLevel).toBe(0);
      });
    });
    it('should set an olNestLevel marker with <ol> elements', () => {
      const ttree = translateTreeTest('<ol><li></li></ol>');
      expect(ttree.markers.olNestLevel).toBe(0);
      ttree.children.forEach((c) => {
        expect(c.markers.olNestLevel).toBe(0);
      });
    });
    it('should set an edit marker with <ins> elements', () => {
      const ttree = translateTreeTest('<ins>Text</ins>');
      expect(ttree.markers.edits).toBe('ins');
      ttree.children.forEach((c) => {
        expect(c.markers.edits).toBe('ins');
      });
    });
    it('should set an edit marker with <del> elements', () => {
      const ttree = translateTreeTest('<del>Text</del>');
      expect(ttree.markers.edits).toBe('del');
      ttree.children.forEach((c) => {
        expect(c.markers.edits).toBe('del');
      });
    });
    it('should set a lang marker with lang attributes', () => {
      const ttree = translateTreeTest('<div lang="fr">Text</div>');
      expect(ttree.markers.lang).toBe('fr');
      ttree.children.forEach((c) => {
        expect(c.markers.lang).toBe('fr');
      });
    });
    it('should set a direction marker with dir attributes', () => {
      const ttree = translateTreeTest('<div dir="rtl">Text</div>');
      expect(ttree.markers.direction).toBe('rtl');
      ttree.children.forEach((c) => {
        expect(c.markers.direction).toBe('rtl');
      });
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
