import { defaultCSSProcessorConfig } from '../default';
import { CSSPropertiesValidationRegistry } from '../CSSPropertiesValidationRegistry';
import { CSSProcessorConfig } from '../config';

function registryFromConfig(config: Partial<CSSProcessorConfig>) {
  return new CSSPropertiesValidationRegistry({
    ...defaultCSSProcessorConfig,
    ...config
  });
}

describe('FontFamilyPropertyValidator', () => {
  describe('normalizeRaw method', () => {
    it('should return null when config.isFontSupported invalidate all font families', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return false;
        }
      });
      expect(
        registry.validators.fontFamily.normalizeRaw('Helvetica, sans-serif')
      ).toBeNull();
    });
    it('should return the first validated font identified by config.isFontSupported invalidate', () => {
      const registry = registryFromConfig({
        isFontSupported(fontName: string) {
          return fontName === 'sans-serif';
        }
      });
      expect(
        registry.validators.fontFamily.normalizeRaw('Helvetica, sans-serif')
      ).toBe('sans-serif');
    });
    it('should return the font mapped by config.isFontSupported when it returns string', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return 'GreatFont';
        }
      });
      expect(
        registry.validators.fontFamily.normalizeRaw('Helvetica, sans-serif')
      ).toBe('GreatFont');
    });
  });
});

describe('FontCSSValidator', () => {
  describe('normalizeBeforeCSSToRNTransform method', () => {
    it('should return the font mapped by config.isFontSupported when it returns string', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return 'GreatFont';
        }
      });
      expect(
        registry.validators.font.normalizeBeforeCSSToRNTransform(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toBe('italic small-caps bold 12px/30px GreatFont');
    });
    it('should return the first validated font identified by config.isFontSupported invalidate', () => {
      const registry = registryFromConfig({
        isFontSupported(fontName: string) {
          return fontName === 'serif';
        }
      });
      expect(
        registry.validators.font.normalizeBeforeCSSToRNTransform(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toBe('italic small-caps bold 12px/30px serif');
    });
    it('should return special "system" font when config.isFontSupported invalidate all font names', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return false;
        }
      });
      expect(
        registry.validators.font.normalizeBeforeCSSToRNTransform(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toBe('italic small-caps bold 12px/30px system');
    });
  });
});
