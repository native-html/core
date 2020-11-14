import { ShortMergeRequest } from '../../ShortMergeRequest';
import { registryFromConfig } from './helpers';

describe('ShortFontCSSValidator', () => {
  describe('normalizeInlineCSSValue method', () => {
    it('should return the font mapped by config.isFontSupported when it returns string', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return 'GreatFont';
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'GreatFont',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
    it('should return the first validated font identified by config.isFontSupported invalidate', () => {
      const registry = registryFromConfig({
        isFontSupported(fontName: string) {
          return fontName === 'serif';
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
    it('should return special "system" font when config.isFontSupported invalidate all font names', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return false;
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'system',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
  });
});
