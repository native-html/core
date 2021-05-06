import HTMLContentModel from '../../model/HTMLContentModel';
import TEmptyCtor from '../TEmptyCtor';
import { defaultInit } from './shared';

const init = {
  ...defaultInit,
  domNode: {} as any,
  isUnregistered: false
};

describe('TEmpty class', () => {
  describe('matchContentModel method', () => {
    it('should not match block content model', () => {
      const text = new TEmptyCtor(init);
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
    it('should not match mixed content model', () => {
      const text = new TEmptyCtor(init);
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(false);
    });
    it('should not match textual content model', () => {
      const text = new TEmptyCtor(init);
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(false);
    });
    it('should match none content model', () => {
      const text = new TEmptyCtor(init);
      expect(text.matchContentModel(HTMLContentModel.none)).toBe(true);
    });
  });
});
