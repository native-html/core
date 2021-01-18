import alterDOMNodes from '../alterDOMNodes';
import { parseDOM } from 'htmlparser2';
import { Element } from 'domhandler';

describe('alterDOMNodes', () => {
  it('should support alterDOMData', () => {
    const documentTree = parseDOM('<em>Hello world.</em>');
    const alteredTree = alterDOMNodes(documentTree, {
      alterDOMData() {
        return 'hey';
      }
    });
    expect((alteredTree[0] as Element).children[0]).toMatchObject({
      data: 'hey'
    });
  });
  it('should support alterDOMElement', () => {
    const documentTree = parseDOM('<em>Hello world.</em>');
    const alteredTree = alterDOMNodes(documentTree, {
      alterDOMElement(node) {
        node.tagName = 'div';
        return node;
      }
    });
    expect(alteredTree[0]).toMatchObject({
      tagName: 'div'
    });
  });
  it('should support alterDOMChildren', () => {
    const documentTree = parseDOM('<div><em>ho</em></div>');
    const alteredTree = alterDOMNodes(documentTree, {
      alterDOMChildren() {
        return [];
      }
    });
    expect(alteredTree[0]).toMatchObject({
      children: []
    });
  });
  it('should support hooks which return false or void', () => {
    const documentTree = parseDOM('<div><em>ho</em></div><script></script>');
    const alteredTree = alterDOMNodes(documentTree, {
      alterDOMChildren() {},
      alterDOMData() {},
      alterDOMElement() {}
    });
    expect(alteredTree[0]).toMatchObject({
      tagName: 'div'
    });
  });
  it('should ignore special tags', () => {
    const documentTree = parseDOM('<script></script>');
    const alteredTree = alterDOMNodes(documentTree, {});
    expect(alteredTree[0]).toMatchObject({
      type: 'script'
    });
  });
});
