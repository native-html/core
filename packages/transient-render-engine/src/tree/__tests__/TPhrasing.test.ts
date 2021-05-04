import HTMLContentModel from '../../model/HTMLContentModel';
import TPhrasing from '../TPhrasing';
import { defaultInit } from './shared';

describe('TPhrasing class', () => {
  describe('matchContentModel method', () => {
    it('should not match block content model', () => {
      const text = new TPhrasing({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
    it('should match mixed content model', () => {
      const text = new TPhrasing({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(true);
    });
    it('should match textual content model', () => {
      const text = new TPhrasing({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(true);
    });
  });
});
