import { DOMElement, DOMText } from '../../dom/dom-utils';
import { initialize, Mutable } from '../makeTNodePrototype';
import makeTNodePrototype from '../makeTNodePrototype';
import TText from '../TText';
import { defaultInit } from './shared';
import { TNodeImpl, TNodeInit } from '../tree-types';

const TTest = function (this: Mutable<TNodeImpl>, init: TNodeInit) {
  initialize(this, init);
};

TTest.prototype = makeTNodePrototype('block', 'TTest');

function newTNode(init = defaultInit) {
  //@ts-ignore
  return new TTest(init) as TNodeImpl;
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
      const collapsibleChild = new TText({
        textNode: new DOMText('  '),
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
      const nextNode = new TText({
        ...node.cloneInitParams(),
        parentStyles: undefined,
        styles: undefined,
        textNode: new DOMText('  '),
        domNode: new DOMElement('span', { style: 'color: blue;' }),
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
});
