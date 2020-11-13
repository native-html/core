import { CSSParseRun } from './CSSParseRun';
import { MixedStyleDeclaration } from './CSSProcessor';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { ExtraNativeTextStyle, ExtraNativeViewStyle } from './native-types';

const extraViewStyles: Record<keyof ExtraNativeViewStyle, 'block'> = {
  borderBottomEndRadius: 'block',
  borderBottomStartRadius: 'block',
  borderEndColor: 'block',
  borderEndWidth: 'block',
  borderStartColor: 'block',
  borderStartWidth: 'block',
  borderTopEndRadius: 'block',
  borderTopStartRadius: 'block',
  elevation: 'block',
  end: 'block',
  marginEnd: 'block',
  marginHorizontal: 'block',
  marginStart: 'block',
  marginVertical: 'block',
  overflow: 'block',
  overlayColor: 'block',
  paddingEnd: 'block',
  paddingHorizontal: 'block',
  paddingStart: 'block',
  paddingVertical: 'block',
  resizeMode: 'block',
  rotation: 'block',
  scaleX: 'block',
  scaleY: 'block',
  shadowColor: 'block',
  shadowOffset: 'block',
  shadowOpacity: 'block',
  shadowRadius: 'block',
  start: 'block',
  testID: 'block',
  tintColor: 'block',
  transformMatrix: 'block',
  translateX: 'block',
  translateY: 'block'
};

const extraTextStyles: Record<keyof ExtraNativeTextStyle, 'text'> = {
  includeFontPadding: 'text',
  textAlignVertical: 'text',
  textShadowColor: 'text',
  textShadowOffset: 'text',
  textShadowRadius: 'text',
  writingDirection: 'text'
};

const extraStylesRegistry = {
  ...extraTextStyles,
  ...extraViewStyles
};

export class CSSNativeParseRun extends CSSParseRun {
  private declaration: MixedStyleDeclaration;

  constructor(
    declaration: MixedStyleDeclaration,
    registry: CSSPropertiesValidationRegistry
  ) {
    super(registry);
    this.declaration = declaration;
  }

  protected fillRegistry(): void {
    const declaration = this.declaration;
    for (const key of Object.keys(declaration) as Array<
      keyof MixedStyleDeclaration
    >) {
      const validator = this.validationMap.getValidatorForProperty(key);
      if (validator) {
        this.registry.withProperty(key, declaration[key], validator);
      } else {
        const extraNativeDisplay =
          extraStylesRegistry[key as keyof typeof extraStylesRegistry];
        if (extraNativeDisplay) {
          this.registry.withProperty(key, declaration[key], {
            compatCategory: 'native',
            displayCategory: extraNativeDisplay,
            propagationCategory: 'retain'
          });
        } else {
          console.warn(
            `Native style property "${key}" has been ignored. If it is a shorthand property, use the equivalent longhand instead.`
          );
        }
      }
    }
  }
}
