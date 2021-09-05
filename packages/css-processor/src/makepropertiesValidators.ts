import { CSSProcessorConfig } from './config';
import { LongFontFamilyPropertyValidator } from './validators/LongFontFamilyPropertyValidator';
import { LongFloatNumberCSSPropertyValidator } from './validators/LongFloatNumberCSSPropertyValidator';
import { LongBorderWidthCSSPropertyValidator } from './validators/LongBorderWidthCSSPropertyValidator';
import { LongFontSizeCSSValidator } from './validators/LongFontSizeCSSValidator';
import { LongSizeCSSPropertyValidator } from './validators/LongSizeCSSPropertyValidator';
import { LongAspectRatioPropertyValidator } from './validators/LongAspectRatioPropertyValidator';
import { LongEnumerationListCSSPropertyValidator } from './validators/LongEnumerationListCSSPropertyValidator';
import { LongBorderStyleCSSPropertyValidator } from './validators/LongBorderStyleCSSPropertyValidator';
import { LongEnumerationCSSPropertyValidator } from './validators/LongEnumerationCSSPropertyValidator';
import { LongColorCSSPropertyValidator } from './validators/LongColorCSSPropertyValidator';
import { ShortFontCSSValidator } from './validators/ShortFontCSSValidator';
import { ShortCSSToReactNativeValidator } from './validators/ShortCSSToReactNativeValidator';
import { ShortFlexCSSPropertyValidator } from './validators/ShortFlexCSSPropertyValidator';
import { LongCSSToReactNativeValidator } from './validators/LongCSSToReactNativeValidator';
import { ShortCardinalCSSpropertyValidator } from './validators/ShortCardinalCSSPropertyValidator';
import { ShortDualNativepropertyValidator } from './validators/ShortDualNativePropertyValidator';
import { LongForgivingCSSPropertyValidator } from './validators/LongForgivingCSSPropertyValidator';
import { LongNonPercentSizeCSSPropertyValidator } from './validators/LongNonPercentSizeCSSPropertyValidator';

const nativeTranslatableBlockFlowModel = {
  inheritable: true,
  native: true,
  translatable: true,
  display: 'block'
} as const;

const nativeTranslatableBlockRetainModel = {
  inheritable: false,
  native: true,
  translatable: true,
  display: 'block'
} as const;

const nativeUntranslatableBlockRetainModel = {
  inheritable: false,
  native: true,
  translatable: false,
  display: 'block'
} as const;

const nativeTranslatableTextFlowModel = {
  inheritable: true,
  native: true,
  translatable: true,
  display: 'text'
} as const;

const nativeTranslatableTextRetainModel = {
  inheritable: false,
  native: true,
  translatable: true,
  display: 'text'
} as const;

const webTextFlowModel = {
  inheritable: true,
  native: false,
  translatable: false,
  display: 'text'
} as const;

const webBlockRetainModel = {
  inheritable: false,
  native: false,
  translatable: false,
  display: 'block'
} as const;

export type ValidatorsType = ReturnType<typeof makepropertiesValidators>;

export default function makepropertiesValidators(config: CSSProcessorConfig) {
  return {
    background: new ShortCSSToReactNativeValidator({
      config,
      model: nativeTranslatableBlockRetainModel,
      propertyName: 'background'
    }),
    border: new ShortCSSToReactNativeValidator({
      config,
      model: nativeTranslatableBlockRetainModel,
      propertyName: 'border'
    }),
    borderRadius: new ShortCardinalCSSpropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'borderRadius'
      },
      {
        top: 'borderTopLeftRadius',
        right: 'borderTopRightRadius',
        bottom: 'borderBottomRightRadius',
        left: 'borderBottomLeftRadius'
      }
    ),
    borderColor: new ShortCardinalCSSpropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'borderColor'
      },
      {
        top: 'borderTopColor',
        right: 'borderRightColor',
        bottom: 'borderBottomColor',
        left: 'borderLeftColor'
      }
    ),
    borderStyle: new LongBorderStyleCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'borderStyle'
      },
      ['solid', 'dotted', 'dashed']
    ),
    borderWidth: new ShortCardinalCSSpropertyValidator(
      {
        config,
        propertyName: 'borderWidth',
        model: nativeTranslatableBlockRetainModel
      },
      {
        top: 'borderTopWidth',
        right: 'borderRightWidth',
        bottom: 'borderBottomWidth',
        left: 'borderLeftWidth'
      }
    ),
    flex: new ShortFlexCSSPropertyValidator({
      config,
      propertyName: 'flex',
      model: nativeTranslatableBlockRetainModel
    }),
    flexFlow: new ShortCSSToReactNativeValidator({
      config,
      model: nativeTranslatableBlockRetainModel,
      propertyName: 'flexFlow'
    }),
    font: new ShortFontCSSValidator({
      config,
      model: nativeTranslatableTextFlowModel,
      propertyName: 'font'
    }),
    margin: new ShortCardinalCSSpropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'margin'
      },
      {
        top: 'marginTop',
        right: 'marginRight',
        bottom: 'marginBottom',
        left: 'marginLeft'
      }
    ),
    objectFit: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: webBlockRetainModel,
        propertyName: 'objectFit'
      },
      ['fill', 'contain', 'cover', 'none', 'scale-down']
    ),
    padding: new ShortCardinalCSSpropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'padding'
      },
      {
        top: 'paddingTop',
        right: 'paddingRight',
        bottom: 'paddingBottom',
        left: 'paddingLeft'
      }
    ),
    marginHorizontal: new ShortDualNativepropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'marginHorizontal'
      },
      ['marginLeft', 'marginRight']
    ),
    marginVertical: new ShortDualNativepropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'marginVertical'
      },
      ['marginTop', 'marginBottom']
    ),
    paddingHorizontal: new ShortDualNativepropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'paddingHorizontal'
      },
      ['paddingLeft', 'paddingRight']
    ),
    paddingVertical: new ShortDualNativepropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'paddingVertical'
      },
      ['paddingTop', 'paddingBottom']
    ),
    textDecoration: new ShortCSSToReactNativeValidator({
      config,
      model: nativeTranslatableTextRetainModel,
      propertyName: 'textDecoration'
    }),
    textDecorationColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'textDecorationColor',
      model: nativeTranslatableTextRetainModel
    }),
    textDecorationLine: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextRetainModel,
        propertyName: 'textDecorationLine'
      },
      ['none', 'underline', 'line-through', 'underline line-through'] // 'overline' not supported by RN
    ),
    textDecorationStyle: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextRetainModel,
        propertyName: 'textDecorationStyle'
      },
      ['solid', 'double', 'dotted', 'dashed'] // 'wavy' unsupported
    ),
    color: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'color',
      model: nativeTranslatableTextFlowModel
    }),
    fontFamily: new LongFontFamilyPropertyValidator({
      config,
      propertyName: 'fontFamily',
      model: nativeTranslatableTextFlowModel
    }),
    fontSize: new LongFontSizeCSSValidator({
      config,
      propertyName: 'fontSize',
      model: nativeTranslatableTextFlowModel
    }),
    fontStyle: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextFlowModel,
        propertyName: 'fontStyle'
      },
      ['normal', 'italic'] // 'oblique' not supported
    ),
    fontVariant: new LongEnumerationListCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextFlowModel,
        propertyName: 'fontVariant'
      },
      [
        'small-caps',
        'oldstyle-nums',
        'lining-nums',
        'tabular-nums',
        'proportional-nums'
      ]
    ),
    fontWeight: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextFlowModel,
        propertyName: 'fontWeight'
      },
      [
        'normal',
        'bold',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900'
      ]
    ),
    letterSpacing: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'letterSpacing',
      model: nativeTranslatableTextFlowModel
    }),
    // TODO handle unitless heights
    lineHeight: new LongNonPercentSizeCSSPropertyValidator({
      config,
      propertyName: 'lineHeight',
      model: nativeTranslatableTextFlowModel
    }),
    textAlign: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextFlowModel,
        propertyName: 'textAlign'
      },
      ['auto', 'left', 'right', 'center', 'justify']
    ),
    textTransform: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableTextFlowModel,
        propertyName: 'textTransform'
      },
      ['none', 'capitalize', 'uppercase', 'lowercase']
    ),
    whiteSpace: new LongEnumerationCSSPropertyValidator(
      { config, model: webTextFlowModel, propertyName: 'whiteSpace' },
      ['normal', 'pre']
    ),
    listStyleType: new LongForgivingCSSPropertyValidator({
      config,
      model: webTextFlowModel,
      propertyName: 'listStyleType'
    }),
    userSelect: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: webTextFlowModel,
        propertyName: 'userSelect'
      },
      ['auto', 'text', 'none', 'contain', 'all']
    ),
    alignContent: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'alignContent'
      },
      [
        'flex-start',
        'flex-end',
        'center',
        'stretch',
        'space-between',
        'space-around'
      ]
    ),
    alignItems: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'alignItems'
      },
      ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
    ),
    alignSelf: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'alignSelf'
      },
      ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline']
    ),
    aspectRatio: new LongAspectRatioPropertyValidator({
      config,
      model: nativeTranslatableBlockRetainModel,
      propertyName: 'aspectRatio'
    }),
    bottom: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'bottom',
      model: nativeTranslatableBlockRetainModel
    }),
    display: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'display'
      },
      ['flex', 'none']
    ),
    flexBasis: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'flexBasis',
      model: nativeTranslatableBlockRetainModel
    }),
    flexDirection: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'flexDirection'
      },
      ['row', 'column', 'row-reverse', 'column-reverse']
    ),
    flexGrow: new LongFloatNumberCSSPropertyValidator({
      config,
      propertyName: 'flexGrow',
      model: nativeTranslatableBlockRetainModel
    }),
    flexShrink: new LongFloatNumberCSSPropertyValidator({
      config,
      propertyName: 'flexShrink',
      model: nativeTranslatableBlockRetainModel
    }),
    flexWrap: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'flexWrap'
      },
      ['wrap', 'nowrap', 'wrap-reverse']
    ),
    justifyContent: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'justifyContent'
      },
      [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly'
      ]
    ),
    left: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'left',
      model: nativeTranslatableBlockRetainModel
    }),
    position: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeUntranslatableBlockRetainModel,
        propertyName: 'position'
      },
      ['absolute', 'relative']
    ),
    right: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'right',
      model: nativeTranslatableBlockRetainModel
    }),
    top: new LongSizeCSSPropertyValidator({
      config,
      model: nativeTranslatableBlockRetainModel,
      propertyName: 'top'
    }),
    backfaceVisibility: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockRetainModel,
        propertyName: 'backfaceVisibility'
      },
      ['visible', 'hidden']
    ),
    backgroundColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'backgroundColor',
      model: nativeTranslatableBlockRetainModel
    }),
    borderBottomColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'borderBottomColor',
      model: nativeTranslatableBlockRetainModel
    }),
    borderBottomLeftRadius: new LongNonPercentSizeCSSPropertyValidator({
      config,
      propertyName: 'borderBottomLeftRadius',
      model: nativeTranslatableBlockRetainModel
    }),
    borderBottomRightRadius: new LongNonPercentSizeCSSPropertyValidator({
      config,
      propertyName: 'borderBottomRightRadius',
      model: nativeTranslatableBlockRetainModel
    }),
    borderBottomWidth: new LongBorderWidthCSSPropertyValidator({
      config,
      propertyName: 'borderBottomWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    borderLeftColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'borderLeftColor',
      model: nativeTranslatableBlockRetainModel
    }),
    borderLeftWidth: new LongBorderWidthCSSPropertyValidator({
      config,
      propertyName: 'borderLeftWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    borderRightColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'borderRightColor',
      model: nativeTranslatableBlockRetainModel
    }),
    borderRightWidth: new LongBorderWidthCSSPropertyValidator({
      config,
      propertyName: 'borderRightWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    borderTopColor: new LongColorCSSPropertyValidator({
      config,
      propertyName: 'borderTopColor',
      model: nativeTranslatableBlockRetainModel
    }),
    borderTopLeftRadius: new LongNonPercentSizeCSSPropertyValidator({
      config,
      propertyName: 'borderTopLeftRadius',
      model: nativeTranslatableBlockRetainModel
    }),
    borderTopRightRadius: new LongNonPercentSizeCSSPropertyValidator({
      config,
      propertyName: 'borderTopRightRadius',
      model: nativeTranslatableBlockRetainModel
    }),
    borderTopWidth: new LongBorderWidthCSSPropertyValidator({
      config,
      propertyName: 'borderTopWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    height: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'height',
      model: nativeTranslatableBlockRetainModel
    }),
    marginBottom: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'marginBottom',
      model: nativeTranslatableBlockRetainModel
    }),
    marginLeft: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'marginLeft',
      model: nativeTranslatableBlockRetainModel
    }),
    marginRight: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'marginRight',
      model: nativeTranslatableBlockRetainModel
    }),
    marginTop: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'marginTop',
      model: nativeTranslatableBlockRetainModel
    }),
    maxHeight: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'maxHeight',
      model: nativeTranslatableBlockRetainModel
    }),
    maxWidth: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'maxWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    minHeight: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'minHeight',
      model: nativeTranslatableBlockRetainModel
    }),
    minWidth: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'minWidth',
      model: nativeTranslatableBlockRetainModel
    }),
    opacity: new LongFloatNumberCSSPropertyValidator({
      config,
      propertyName: 'opacity',
      model: nativeTranslatableBlockRetainModel
    }),
    paddingBottom: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'paddingBottom',
      model: nativeTranslatableBlockRetainModel
    }),
    paddingLeft: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'paddingLeft',
      model: nativeTranslatableBlockRetainModel
    }),
    paddingRight: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'paddingRight',
      model: nativeTranslatableBlockRetainModel
    }),
    paddingTop: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'paddingTop',
      model: nativeTranslatableBlockRetainModel
    }),
    transform: new LongCSSToReactNativeValidator({
      config,
      propertyName: 'transform',
      model: nativeTranslatableBlockRetainModel
    }),
    width: new LongSizeCSSPropertyValidator({
      config,
      propertyName: 'width',
      model: nativeTranslatableBlockRetainModel
    }),
    zIndex: new LongFloatNumberCSSPropertyValidator({
      config,
      propertyName: 'zIndex',
      model: nativeTranslatableBlockRetainModel
    }),
    direction: new LongEnumerationCSSPropertyValidator(
      {
        config,
        model: nativeTranslatableBlockFlowModel,
        propertyName: 'direction'
      },
      ['auto', 'ltr', 'rtl']
    )
  };
}
