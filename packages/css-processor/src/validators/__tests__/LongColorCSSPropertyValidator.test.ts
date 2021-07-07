import { registryFromConfig } from './helpers';

describe('LongColorCSSPropertyValidator', () => {
  const registry = registryFromConfig({});
  const validator = registry.validators.color;
  describe('normalizeRawInlineCSSValue method', () => {
    it('should support CSS color functions', () => {
      expect(validator.normalizeRawInlineCSSValue('rgb(10,10,10)')).toBe(
        'rgb(10,10,10)'
      );
    });
    it('should support CSS color functions with argument containing spaces', () => {
      expect(validator.normalizeRawInlineCSSValue('rgb(10, 10, 10)')).toBe(
        'rgb(10, 10, 10)'
      );
      expect(validator.normalizeRawInlineCSSValue('rgb(10 , 10 , 10)')).toBe(
        'rgb(10 , 10 , 10)'
      );
    });
    it('should support hex colors', () => {
      expect(validator.normalizeRawInlineCSSValue('#121010')).toBe('#121010');
    });
    it('should support named colors', () => {
      expect(validator.normalizeRawInlineCSSValue('red')).toBe('red');
    });
    it('should reject empty values', () => {
      expect(validator.normalizeRawInlineCSSValue(' ')).toBe(null);
    });
  });
});
