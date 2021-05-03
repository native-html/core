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
  describe('newEmpty method', () => {
    it('should not have side effects', () => {
      const old = new TPhrasing({
        ...defaultInit,
        domNode: null
      });
      old.bindChildren([new TPhrasing(defaultInit)]);
      const newT = old.newEmpty();
      expect(newT.children).toHaveLength(0);
      newT.bindChildren([
        new TPhrasing(defaultInit),
        new TPhrasing(defaultInit)
      ]);
      expect(newT.children).toHaveLength(2);
      expect(old.children).toHaveLength(1);
    });
  });
});
