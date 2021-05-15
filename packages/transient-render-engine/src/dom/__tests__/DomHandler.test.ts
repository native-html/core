import { Element } from 'domhandler';
import render from 'dom-serializer';
import parseDocument from '../parseDocument';

function expectRendersHtml(doc: any, target: string) {
  expect(render(doc)).toBe(target);
}

describe('DOMParser', () => {
  it('should parse', () => {
    const html = '<div><span>Text</span><div></div></div>';
    expectRendersHtml(parseDocument(html), html);
  });
  describe('ignoreTags option', () => {
    it('should support ignoredTags', () => {
      const doc = parseDocument('<div><span></span></div>', {
        ignoredTags: ['span']
      });
      expectRendersHtml(doc, '<div></div>');
    });
    it('should ignore children of ignoredTags', () => {
      const doc = parseDocument(
        '<div><span><strong><em></em><mark></mark></strong>Text node!</span></div>',
        {
          ignoredTags: ['span']
        }
      );
      expectRendersHtml(doc, '<div></div>');
    });
    it('should include siblings of ignoredTags', () => {
      const doc = parseDocument(
        '<div><span></span>Text<strong></strong></div>',
        {
          ignoredTags: ['span']
        }
      );
      expectRendersHtml(doc, '<div>Text<strong></strong></div>');
    });
  });
  describe('ignoreNode option', () => {
    it('should ignore element nodes', () => {
      const doc = parseDocument('<div><span></span></div>', {
        ignoreNode: (node) => (node as Element).name === 'span'
      });
      expectRendersHtml(doc, '<div></div>');
    });
    it('should ignore text nodes', () => {
      const doc = parseDocument('<div>Text!</div>', {
        ignoreNode: (node) => node.type === 'text'
      });
      expectRendersHtml(doc, '<div></div>');
    });
    it('should ignore children elements of ignored nodes', () => {
      const doc = parseDocument(
        '<div><span><strong><em></em><mark></mark></strong>Text node!</span></div>',
        {
          ignoreNode: (node) => (node as Element).name === 'span'
        }
      );
      expectRendersHtml(doc, '<div></div>');
    });
    it('should provide parent in ignoreNode', () => {
      const html = '<p><a></a></p>';
      const ignoreNode = jest.fn((node, parent) => {
        expect(parent).not.toBeNull();
        return false;
      });
      parseDocument(html, {
        ignoreNode
      });
    });
    it('should retain sibling text nodes of ignored nodes', () => {
      const doc = parseDocument(
        '<div><a href="">you a noisy one</a>Can you see the anchor? It has been ignored!</div>',
        {
          ignoreNode: (node) => (node as Element).name === 'a'
        }
      );
      expectRendersHtml(
        doc,
        '<div>Can you see the anchor? It has been ignored!</div>'
      );
    });
    it('should retain next siblings elements of ignored nodes', () => {
      const doc = parseDocument(
        '<div><span></span>Text<strong></strong></div>',
        {
          ignoreNode: (node) => (node as Element).name === 'span'
        }
      );
      expectRendersHtml(doc, '<div>Text<strong></strong></div>');
    });
    it('should retain previous siblings elements of ignored nodes', () => {
      const html = '<div> <a>A</a>B</div>';
      const doc = parseDocument(html, {
        ignoreNode: (node) => (node as Element).name === 'a'
      });
      expectRendersHtml(doc, '<div> B</div>');
    });
  });
  describe('visitors option', () => {
    it('should support visitors.onElement', () => {
      const onElement = jest.fn();
      parseDocument('<div><span></span>Text<strong></strong></div>', {
        visitors: {
          onElement
        }
      });
      expect(onElement).toHaveBeenCalledTimes(3);
    });

    it('should support visitors.onText', () => {
      const onText = jest.fn();
      parseDocument('<div><span></span>Text<strong></strong></div>', {
        visitors: { onText }
      });
      expect(onText).toHaveBeenCalledTimes(1);
    });
    it('should support visitors.onDocument', () => {
      const onDocument = jest.fn();
      parseDocument('<div></div>', {
        visitors: { onDocument }
      });
      expect(onDocument).toHaveBeenCalledTimes(1);
    });

    it('should call visitor.onElement when the element children have been parsed', () => {
      parseDocument('<div><span></span><strong></strong>Text</div>', {
        visitors: {
          onElement(element) {
            if (element.tagName === 'div') {
              expect(element.children).toHaveLength(3);
            }
          }
        }
      });
    });

    it('should call visitor.onDocument when the document children have been parsed', () => {
      parseDocument('<span></span><strong></strong>Text', {
        visitors: {
          onDocument(document) {
            expect(document.children).toHaveLength(3);
          }
        }
      });
    });
  });
});
