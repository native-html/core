import { Element, Text } from '../../dom/dom-utils';
import TNodeCtor, { Mutable } from '../TNodeCtor';
import TTextCtor from '../TTextCtor';
import { defaultInit } from './shared';
import { TNodeImpl, TNodeInit } from '../tree-types';
import HTMLContentModel from '../../model/HTMLContentModel';

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
});
