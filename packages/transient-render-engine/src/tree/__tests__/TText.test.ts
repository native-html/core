import HTMLContentModel from '../../model/HTMLContentModel';
import { TText } from '../TText';
import { defaultInit } from './shared';

describe('TText class', () => {
  describe('trimLeft method', () => {
    it('should remove the first character', () => {
      const text = new TText({
        data: ' This is Great',
        ...defaultInit
      });
      text.trimLeft();
      expect(text.data).toBe('This is Great');
    });
  });
  describe('trimRight method', () => {
    it('should remove the last character', () => {
      const text = new TText({
        data: 'This is Great ',
        ...defaultInit
      });
      text.trimRight();
      expect(text.data).toBe('This is Great');
    });
  });
  describe('matchContentModel method', () => {
    it('should not match block content model', () => {
      const text = new TText({
        data: 'This is Great ',
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
    it('should match mixed content model', () => {
      const text = new TText({
        data: 'This is Great ',
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(true);
    });
    it('should match textual content model', () => {
      const text = new TText({
        data: 'This is Great ',
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(true);
    });
  });
});
