import { CSSProcessedPropsRegistry } from '../CSSProcessedPropsRegistry';
import { CSSPropertySpecs } from '../processor-types';

const testCSSSpecs: CSSPropertySpecs = {
  compatCategory: 'native',
  displayCategory: 'block',
  propagationCategory: 'retain'
};

describe('CSSProcessedPropsRegistry', () => {
  describe('merge method', () => {
    it('should merge categorized properties from left to right', () => {
      const mergee = CSSProcessedPropsRegistry.new().withProperty(
        'backgroundColor',
        'red',
        testCSSSpecs
      );
      const overriders = [
        CSSProcessedPropsRegistry.new().withProperty(
          'backgroundColor',
          'blue',
          testCSSSpecs
        ),
        CSSProcessedPropsRegistry.new().withProperty(
          'backgroundColor',
          'green',
          testCSSSpecs
        )
      ];
      expect(mergee.merge(...overriders).native.block.retain).toStrictEqual({
        backgroundColor: 'green'
      });
    });
  });
});
