import { CSSProcessedProps } from '../CSSProcessedProps';
import { CSSPropertySpecs } from '../processor-types';

const testCSSSpecs: CSSPropertySpecs = {
  compatCategory: 'native',
  displayCategory: 'block',
  propagationCategory: 'retain'
};

describe('CSSProcessedProps', () => {
  describe('merge method', () => {
    it('should merge categorized properties from left to right', () => {
      const mergee = CSSProcessedProps.new().withProperty(
        'backgroundColor',
        'red',
        testCSSSpecs
      );
      const overriders = [
        CSSProcessedProps.new().withProperty(
          'backgroundColor',
          'blue',
          testCSSSpecs
        ),
        CSSProcessedProps.new().withProperty(
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
