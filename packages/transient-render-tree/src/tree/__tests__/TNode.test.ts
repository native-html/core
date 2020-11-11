import { TNode } from '../TNode';
import { TText } from '../TText';

class TTest extends TNode {}

function newTNode() {
  return new TTest(
    {
      parentStyles: null
    },
    'block'
  );
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
        parentStyles: null
      });
      node.bindChildren([collapsibleChild]);
      expect(node.isCollapsibleRight()).toBe(true);
    });
  });
});
