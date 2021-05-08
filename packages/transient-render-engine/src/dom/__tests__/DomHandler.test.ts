import { NodeWithChildren, Element } from 'domhandler';
import parseDocument from '../parseDocument';

describe('DOMParser', () => {
  it('should parse', () => {
    const doc = parseDocument('<div><span>Text</span><div></div></div>');
    expect((doc.children[0] as NodeWithChildren).children).toHaveLength(2);
    expect(
      ((doc.children[0] as NodeWithChildren).children[0] as NodeWithChildren)
        .children
    ).toHaveLength(1);
  });
  describe('ignoreTags option', () => {
    it('should support ignoredTags', () => {
      const doc = parseDocument('<div><span></span></div>', {
        ignoredTags: ['span']
      });
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(0);
    });
    it('should ignore children of ignoredTags', () => {
      const doc = parseDocument(
        '<div><span><strong><em></em><mark></mark></strong>Text node!</span></div>',
        {
          ignoredTags: ['span']
        }
      );
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(0);
    });
    it('should include siblings of ignoredTags', () => {
      const doc = parseDocument(
        '<div><span></span>Text<strong></strong></div>',
        {
          ignoredTags: ['span']
        }
      );
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(2);
    });
  });
  describe('ignoreNode option', () => {
    it('should ignore element nodes', () => {
      const doc = parseDocument('<div><span></span></div>', {
        ignoreNode: (node) => (node as Element).name === 'span'
      });
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(0);
    });
    it('should ignore text nodes', () => {
      const doc = parseDocument('<div>Text!</div>', {
        ignoreNode: (node) => node.type === 'text'
      });
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(0);
    });
    it('should ignore children of ignored nodes', () => {
      const doc = parseDocument(
        '<div><span><strong><em></em><mark></mark></strong>Text node!</span></div>',
        {
          ignoreNode: (node) => (node as Element).name === 'span'
        }
      );
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(0);
    });
    it('should include siblings of ignored nodes', () => {
      const doc = parseDocument(
        '<div><span></span>Text<strong></strong></div>',
        {
          ignoreNode: (node) => (node as Element).name === 'span'
        }
      );
      expect((doc.children[0] as NodeWithChildren).children).toHaveLength(2);
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
