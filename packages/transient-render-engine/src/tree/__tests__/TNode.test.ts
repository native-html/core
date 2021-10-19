import { Element, Text } from '../../dom/dom-utils';
import TNodeCtor, { Mutable } from '../TNodeCtor';
import TTextCtor from '../TTextCtor';
import { defaultInit } from './shared';
import { TNodeImpl, TNodeInit } from '../tree-types';
import HTMLContentModel from '../../model/HTMLContentModel';
import HTMLElementModel from '../../model/HTMLElementModel';
import { AccessibilityRole } from 'react-native';

const TTest = function (this: Mutable<TNodeImpl>, init: TNodeInit) {
  this.initialize(init);
};

//@ts-ignore
TTest.prototype = new TNodeCtor('block', 'TTest');

function newTNode(init?: Partial<TNodeInit>) {
  //@ts-ignore
  return new TTest({ ...defaultInit, ...init }) as TNodeImpl;
}

describe('TNode class', () => {
  describe('isCollapsibleLeft method', () => {
    it('should return false when node has no children', () => {
      const node = newTNode();
      expect(node.isCollapsibleLeft()).toBe(false);
    });
  });
  describe('isCollapsibleRight method', () => {
    it('should return false when node has no children', () => {
      const node = newTNode();
      expect(node.isCollapsibleRight()).toBe(false);
    });
    it('should return true when node has one collapsible-right children', () => {
      const node = newTNode();
      const collapsibleChild = new TTextCtor({
        textNode: new Text('  '),
        ...defaultInit
      });
      node.bindChildren([collapsibleChild]);
      expect(node.isCollapsibleRight()).toBe(true);
    });
  });
  describe('cloneInitParams', () => {
    it('sould be immutable', () => {
      const node = newTNode();
      const nodeChildren = [newTNode()];
      node.bindChildren(nodeChildren);
      const nextNode = new TTextCtor({
        ...node.cloneInitParams(),
        parentStyles: undefined,
        styles: undefined,
        textNode: new Text('  '),
        domNode: new Element('span', { style: 'color: blue;' }),
        elementModel: null,
        nodeIndex: 10
      });
      nextNode.bindChildren([]);
      expect(node.children).toBe(nodeChildren);
      expect(node.children).toHaveLength(1);
      expect(nextNode.children).toHaveLength(0);
      expect(nextNode.type).toBe('text');
      expect(nextNode.tagName).toBe('span');
      expect(nextNode.styles.nativeTextFlow.color).toBe('blue');
    });
  });
  describe('bindChildren', () => {
    it('should not mutate prototype', () => {
      const node = newTNode();
      const nodeChildren = [newTNode()];
      node.bindChildren(nodeChildren);
      expect(TTest.prototype.children).toHaveLength(0);
    });
  });
  describe('matchContentModel', () => {
    it('should return false by default', () => {
      const node = newTNode();
      expect(node.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
  });
  describe('contentModel', () => {
    it('should return null when no elementModel is available', () => {
      const node = newTNode();
      expect(node.contentModel).toBe(null);
    });
  });
  describe('getReactNativeProps', () => {
    it("should return null when neither 'reactNativeProps' nor 'getReactNativeProps' are defined for this element model.", () => {
      const node = newTNode({
        elementModel: HTMLElementModel.fromCustomModel({
          tagName: 'foo',
          contentModel: HTMLContentModel.block
        })
      });
      expect(node.getReactNativeProps()).toBeNull();
    });
    it('should return null for anonymous nodes', () => {
      const node = newTNode();
      expect(node.getReactNativeProps()).toBeNull();
    });
    it("should support 'reactNativeProps' from the element model", () => {
      const node = newTNode({
        elementModel: HTMLElementModel.fromCustomModel({
          contentModel: HTMLContentModel.block,
          tagName: 'foo',
          reactNativeProps: {
            native: {
              accessibilityLabel: 'Hello'
            }
          }
        })
      });
      expect(node.getReactNativeProps()).toMatchObject({
        text: {
          accessibilityLabel: 'Hello'
        },
        view: {
          accessibilityLabel: 'Hello'
        }
      });
    });
    it("should support 'getReactNativeProps' returning null from the element model", () => {
      const node = newTNode({
        elementModel: HTMLElementModel.fromCustomModel({
          contentModel: HTMLContentModel.block,
          tagName: 'foo',
          getReactNativeProps() {
            return null;
          }
        })
      });
      expect(node.getReactNativeProps()).toBeNull();
      // Test twice to make sure the cache is working
      expect(node.getReactNativeProps()).toBeNull();
    });
    it("should support 'getReactNativeProps' returning non-null from the element model", () => {
      const node = newTNode({
        domNode: new Element('foo', {
          'data-rn-accessibility-label': 'Hello'
        }),
        elementModel: HTMLElementModel.fromCustomModel({
          contentModel: HTMLContentModel.block,
          tagName: 'foo',
          getReactNativeProps(tnode) {
            if (tnode.attributes['data-rn-accessibility-label']) {
              return {
                text: {
                  accessibilityLabel:
                    tnode.attributes['data-rn-accessibility-label']
                }
              };
            }
          }
        })
      });
      expect(node.getReactNativeProps()).toEqual({
        text: {
          accessibilityLabel: 'Hello'
        },
        view: {}
      });
    });
    it("should merge props from 'reactNativeProps' and 'getReactNativeProps'", () => {
      const node = newTNode({
        domNode: new Element('foo', {
          class: 'header'
        }),
        elementModel: HTMLElementModel.fromCustomModel({
          contentModel: HTMLContentModel.block,
          tagName: 'foo',
          reactNativeProps: {
            text: {
              accessibilityLabel: 'The Article Title'
            },
            native: {
              testID: 'article-title'
            }
          },
          getReactNativeProps(tnode) {
            if (tnode.hasClass('header')) {
              return {
                native: {
                  accessibilityRole: 'header'
                }
              };
            }
          }
        })
      });
      expect(node.getReactNativeProps()).toEqual({
        text: {
          accessibilityLabel: 'The Article Title',
          accessibilityRole: 'header',
          testID: 'article-title'
        },
        view: {
          accessibilityRole: 'header',
          testID: 'article-title'
        }
      });
    });
    it('should support `user-select: none;` CSS property', () => {
      const node = newTNode({
        domNode: new Element('div', {
          style: 'user-select: none;'
        })
      });
      expect(node.getReactNativeProps()).toEqual({
        text: {
          selectable: false
        }
      });
    });
    it('should support `user-select: text;` CSS property', () => {
      const node = newTNode({
        domNode: new Element('div', {
          style: 'user-select: text;'
        })
      });
      expect(node.getReactNativeProps()).toEqual({
        text: {
          selectable: true
        }
      });
    });
    it('should support `aria-label` HTML attribute', () => {
      const node = newTNode({
        domNode: new Element('div', {
          'aria-label': 'La vie est belle'
        })
      });
      expect(node.getReactNativeProps()).toEqual({
        view: {
          accessibilityLabel: 'La vie est belle'
        },
        text: {
          accessibilityLabel: 'La vie est belle'
        }
      });
    });

    const rolesMap: Record<string, AccessibilityRole | null> = {
      img: 'image',
      button: 'button',
      switch: 'switch',
      checkbox: 'checkbox',
      heading: 'header',
      link: 'link',
      dialog: 'alert',
      radio: 'radio',
      radiogroup: 'radiogroup',
      presentation: 'none',
      search: 'search',
      foo: null
    };
    for (const [ariaRole, accessibleRole] of Object.entries(rolesMap)) {
      it(`should support role='${ariaRole}' HTML attribute`, () => {
        const node = newTNode({
          domNode: new Element('div', {
            role: ariaRole
          })
        });
        expect(node.getReactNativeProps()).toEqual(
          accessibleRole
            ? {
                text: {
                  accessibilityRole: accessibleRole
                },
                view: {
                  accessibilityRole: accessibleRole
                }
              }
            : null
        );
      });
    }
  });
  describe('snapshot', () => {
    it('should provide a JSX representation', () => {
      const node = newTNode({
        styles: {
          nativeBlockRet: { backgroundColor: 'red' },
          nativeBlockFlow: {},
          nativeTextFlow: {},
          nativeTextRet: {},
          webTextFlow: {},
          webBlockRet: {}
        }
      });
      expect(
        node.snapshot({ withNodeIndex: true, withStyles: true })
      ).toMatchSnapshot();
      expect(node.toString()).toBe(node.snapshot(/*false*/));
    });
  });
  describe('hasClass', () => {
    it('should return true when underlying DOM node has class', () => {
      const node = newTNode({
        domNode: new Element('div', {
          class: 'a b c d efg'
        })
      });
      expect(node.hasClass('efg')).toBe(true);
    });
  });
});
