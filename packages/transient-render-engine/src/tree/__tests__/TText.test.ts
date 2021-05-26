import { Text } from '../../dom/dom-utils';
import HTMLContentModel from '../../model/HTMLContentModel';
import TTextCtor from '../TTextCtor';
import { defaultInit } from './shared';

const textNode = new Text(' This is Great!');

describe('TText class', () => {
  describe('trimLeft method', () => {
    it('should remove the first character', () => {
      const text = new TTextCtor({
        textNode: new Text(' This is Great'),
        ...defaultInit
      });
      text.trimLeft();
      expect(text.data).toBe('This is Great');
    });
  });
  describe('trimRight method', () => {
    it('should remove the last character', () => {
      const text = new TTextCtor({
        textNode: new Text('This is Great '),
        ...defaultInit
      });
      text.trimRight();
      expect(text.data).toBe('This is Great');
    });
  });
  describe('matchContentModel method', () => {
    it('should not match block content model', () => {
      const text = new TTextCtor({
        textNode,
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
    it('should match mixed content model', () => {
      const text = new TTextCtor({
        textNode,
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(true);
    });
    it('should match textual content model', () => {
      const text = new TTextCtor({
        textNode,
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(true);
    });
  });
});
