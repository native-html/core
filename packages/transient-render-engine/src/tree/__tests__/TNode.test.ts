import { TNode } from '../TNode';
import { TText } from '../TText';
import { defaultInit } from './shared';

class TTest extends TNode {
  public readonly displayName = 'TTest';

  matchContentModel() {
    return false;
  }
}

function newTNode() {
  return new TTest(defaultInit, 'block');
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
        data: '  ',
        ...defaultInit
      });
      node.bindChildren([collapsibleChild]);
      expect(node.isCollapsibleRight()).toBe(true);
    });
  });
});
