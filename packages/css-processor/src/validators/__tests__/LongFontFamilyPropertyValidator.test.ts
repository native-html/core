import { registryFromConfig } from './helpers';

describe('FontFamilyPropertyValidator', () => {
  describe('normalizeInlineCSSValue method', () => {
    it('should return null when config.isFontSupported invalidate all font families', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return false;
        }
      });
      expect(
        registry.validators.fontFamily.normalizeInlineCSSValue(
          'Helvetica, sans-serif'
        )
      ).toBeNull();
    });
    it('should return the first validated font identified by config.isFontSupported invalidate', () => {
      const registry = registryFromConfig({
        isFontSupported(fontName: string) {
          return fontName === 'sans-serif';
        }
      });
      expect(
        registry.validators.fontFamily.normalizeInlineCSSValue(
          'Helvetica, sans-serif'
        )
      ).toBe('sans-serif');
    });
    it('should return the font mapped by config.isFontSupported when it returns string', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return 'GreatFont';
        }
      });
      expect(
        registry.validators.fontFamily.normalizeInlineCSSValue(
          'Helvetica, sans-serif'
        )
      ).toBe('GreatFont');
    });
  });
});
