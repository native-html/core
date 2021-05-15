import { CSSParseRun } from './CSSParseRun';
import { MixedStyleDeclaration } from './CSSProcessor';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { lookupRecord } from './helpers';
import {
  ExtraNativeTextStyle,
  NativeDirectionalStyleKeys,
  ExtraNativeLongViewStyleKeys
} from './native-types';
import { CSSPropertySpecs } from './processor-types';
import { ShortMergeRequest } from './ShortMergeRequest';

const nativeDirectionalStyleKeys: Record<NativeDirectionalStyleKeys, 'block'> =
  {
    borderBottomEndRadius: 'block',
    borderBottomStartRadius: 'block',
    borderEndColor: 'block',
    borderEndWidth: 'block',
    borderStartColor: 'block',
    borderStartWidth: 'block',
    borderTopEndRadius: 'block',
    borderTopStartRadius: 'block',
    end: 'block',
    marginEnd: 'block',
    marginStart: 'block',
    paddingEnd: 'block',
    paddingStart: 'block',
    start: 'block'
  };

const extraLongViewStyles: Record<ExtraNativeLongViewStyleKeys, 'block'> = {
  elevation: 'block',
  overflow: 'block',
  overlayColor: 'block',
  resizeMode: 'block',
  rotation: 'block',
  scaleX: 'block',
  scaleY: 'block',
  shadowColor: 'block',
  shadowOffset: 'block',
  shadowOpacity: 'block',
  shadowRadius: 'block',
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
  ...extraLongViewStyles
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

  private fillProp<K extends keyof MixedStyleDeclaration>(
    key: K,
    value: any
  ): void {
    const validator = this.validationMap.getValidatorForProperty(key);
    if (validator) {
      const normalizedValue = validator.normalizeNativeValue(value);
      if (normalizedValue instanceof ShortMergeRequest) {
        normalizedValue.forEach(([innerKey, innerValue]) => {
          this.fillProp(innerKey as any, innerValue);
        });
      } else {
        // assume longhand merge
        this.processedProps.withProperty(
          key,
          normalizedValue,
          validator as CSSPropertySpecs
        );
      }
    } else if (lookupRecord(extraStylesRegistry, key)) {
      this.processedProps.withProperty(key, value, {
        compatCategory: 'native',
        displayCategory: extraStylesRegistry[key],
        propagationCategory: 'retain'
      });
    } else if (lookupRecord(nativeDirectionalStyleKeys, key)) {
      console.warn(
        `Native style property "${key}" is a directional style property. These are not yet supported.`
      );
    } else {
      console.warn(
        `Native style property "${key}" is not supported and has been ignored.`
      );
    }
  }

  protected fillProcessedProps(): void {
    const declaration = this.declaration;
    for (const key of Object.keys(declaration) as Array<
      keyof MixedStyleDeclaration
    >) {
      this.fillProp(key, this.declaration[key]);
    }
  }
}
