import HTMLContentModel from '../../model/HTMLContentModel';
import { TBlock } from '../TBlock';
import { defaultInit } from './shared';

describe('TBlock class', () => {
  describe('matchContentModel method', () => {
    it('should match block content model', () => {
      const text = new TBlock({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.block)).toBe(true);
    });
    it('should match mixed content model', () => {
      const text = new TBlock({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.mixed)).toBe(true);
    });
    it('should not match textual content model', () => {
      const text = new TBlock({
        ...defaultInit
      });
      expect(text.matchContentModel(HTMLContentModel.textual)).toBe(false);
    });
  });
});
