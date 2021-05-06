import HTMLContentModel from '../../model/HTMLContentModel';
import TPhrasingCtor from '../TPhrasingCtor';
import { defaultInit } from './shared';

describe('TPhrasing class', () => {
  describe('matchContentModel method', () => {
    it('should not match block content model', () => {
      const text = new TPhrasingCtor({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(false);
    });
    it('should match mixed content model', () => {
      const text = new TPhrasingCtor({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(true);
    });
    it('should match textual content model', () => {
      const text = new TPhrasingCtor({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(true);
    });
  });
});
