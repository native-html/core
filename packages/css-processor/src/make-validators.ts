import { CSSProcessorConfig } from './config';
import {
  ForgivingCSSPropertyValidator,
  ColorCSSPropertyValidator,
  EnumerationCSSPropertyValidator,
  BorderWidthMultiCSSPropertyValidator,
  EnumerationListCSSPropertyValidator,
  FontFamilyPropertyValidator,
  SizeCSSPropertyValidator,
  FloatNumberCSSPropertyValidator,
  AspectRatioPropertyValidator,
  BorderWidthCSSPropertyValidator,
  FontCSSValidator,
  FontSizeCSSValidator
} from './validators';

const lngNtrBlkFloModel = {
  inheritable: true as true,
  native: true as true,
  translatable: true as true,
  shorthand: false as false,
  display: 'block' as 'block'
};

const lngNtrBlkRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: true as true,
  shorthand: false as false,
  display: 'block' as 'block'
};

const lngNunBlkRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: false as false,
  shorthand: false as false,
  display: 'block' as 'block'
};

const lngNtrTxtFloModel = {
  inheritable: true as true,
  native: true as true,
  translatable: true as true,
  shorthand: false as false,
  display: 'text' as 'text'
};

const lngNtrTxtRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: true as true,
  shorthand: false as false,
  display: 'text' as 'text'
};

const lngWebTxtFloModel = {
  inheritable: true as true,
  native: false as false,
  translatable: false as false,
  shorthand: false as false,
  display: 'text' as 'text'
};

const shtNunBlkRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: false as false,
  shorthand: true as true,
  display: 'block' as 'block'
};

const shtNtrBlkRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: true as true,
  shorthand: true as true,
  display: 'block' as 'block'
};

const shtNtrTxtRetModel = {
  inheritable: false as false,
  native: true as true,
  translatable: true as true,
  shorthand: true as true,
  display: 'text' as 'text'
};

export type ValidatorsType = ReturnType<typeof makepropertiesValidators>;

export function makepropertiesValidators(config: CSSProcessorConfig) {
  return {
    background: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    border: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    borderRadius: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    borderColor: new ColorCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel,
      ignoreTransform: false
    }),
    borderStyle: new EnumerationCSSPropertyValidator(
      { config, model: shtNtrBlkRetModel },
      ['solid', 'dotted', 'dashed']
    ),
    borderWidth: new BorderWidthMultiCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    flex: new ForgivingCSSPropertyValidator({
      config,
      model: shtNunBlkRetModel
    }),
    flexFlow: new ForgivingCSSPropertyValidator({
      config,
      model: shtNunBlkRetModel
    }),
    font: new FontCSSValidator({ config, model: shtNtrTxtRetModel }),
    margin: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    padding: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrBlkRetModel
    }),
    textDecoration: new ForgivingCSSPropertyValidator({
      config,
      model: shtNtrTxtRetModel
    }),
    textDecorationColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrTxtRetModel
    }),
    textDecorationLine: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtRetModel },
      ['none', 'underline', 'line-through', 'underline line-through'] // 'overline' not supported by RN
    ),
    textDecorationStyle: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtRetModel },
      ['solid', 'double', 'dotted', 'dashed'] // 'wavy' unsupported
    ),
    color: new ColorCSSPropertyValidator({ config, model: lngNtrTxtFloModel }),
    fontFamily: new FontFamilyPropertyValidator({
      config,
      model: lngNtrTxtFloModel
    }),
    fontSize: new FontSizeCSSValidator({
      config,
      model: lngNtrTxtFloModel
    }),
    fontStyle: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtFloModel },
      ['normal', 'italic'] // 'oblique' not supported
    ),
    fontVariant: new EnumerationListCSSPropertyValidator(
      { config, model: lngNtrTxtFloModel },
      [
        'small-caps',
        'oldstyle-nums',
        'lining-nums',
        'tabular-nums',
        'proportional-nums'
      ]
    ),
    fontWeight: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtFloModel },
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
    letterSpacing: new SizeCSSPropertyValidator({
      config,
      model: lngNtrTxtFloModel
    }),
    lineHeight: new SizeCSSPropertyValidator({
      config,
      model: lngNtrTxtFloModel
    }),
    textAlign: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtFloModel },
      ['auto', 'left', 'right', 'center', 'justify']
    ),
    textTransform: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrTxtFloModel },
      ['none', 'capitalize', 'uppercase', 'lowercase']
    ),
    whiteSpace: new EnumerationCSSPropertyValidator(
      { config, model: lngWebTxtFloModel },
      ['normal', 'pre']
    ),
    alignContent: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      [
        'flex-start',
        'flex-end',
        'center',
        'stretch',
        'space-between',
        'space-around'
      ]
    ),
    alignItems: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
    ),
    alignSelf: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline']
    ),
    aspectRatio: new AspectRatioPropertyValidator({
      config,
      model: lngNunBlkRetModel,
      ignoreTransform: true
    }),
    bottom: new SizeCSSPropertyValidator({ config, model: lngNunBlkRetModel }),
    display: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      [
        'inline',
        'block',
        'contents',
        'flex',
        'grid',
        'inline-block',
        'inline-flex',
        'inline-grid',
        'inline-table',
        'list-item',
        'run-in',
        'table',
        'table-caption',
        'table-column-group',
        'table-header-group',
        'table-footer-group',
        'table-row-group',
        'table-cell',
        'table-column',
        'table-row',
        'none'
      ]
    ),
    flexBasis: new SizeCSSPropertyValidator({
      config,
      model: lngNunBlkRetModel
    }),
    flexDirection: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      ['row', 'column', 'row-reverse', 'column-reverse']
    ),
    flexGrow: new FloatNumberCSSPropertyValidator({
      config,
      model: lngNunBlkRetModel
    }),
    flexShrink: new FloatNumberCSSPropertyValidator({
      config,
      model: lngNunBlkRetModel
    }),
    flexWrap: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      ['wrap', 'nowrap', 'wrap-reverse']
    ),
    justifyContent: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly'
      ]
    ),
    left: new SizeCSSPropertyValidator({ config, model: lngNunBlkRetModel }),
    position: new EnumerationCSSPropertyValidator(
      { config, model: lngNunBlkRetModel },
      ['absolute', 'relative']
    ),
    right: new SizeCSSPropertyValidator({ config, model: lngNunBlkRetModel }),
    top: new SizeCSSPropertyValidator({ config, model: lngNunBlkRetModel }),
    backfaceVisibility: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrBlkRetModel },
      ['visible', 'hidden']
    ),
    backgroundColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderBottomColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderBottomLeftRadius: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderBottomRightRadius: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderBottomWidth: new BorderWidthCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderLeftColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderLeftWidth: new BorderWidthCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderRightColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderRightWidth: new BorderWidthCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderTopColor: new ColorCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderTopLeftRadius: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderTopRightRadius: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    borderTopWidth: new BorderWidthCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    height: new SizeCSSPropertyValidator({ config, model: lngNtrBlkRetModel }),
    marginBottom: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    marginLeft: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    marginRight: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    marginTop: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    maxHeight: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    maxWidth: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    minHeight: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    minWidth: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    opacity: new FloatNumberCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    paddingBottom: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    paddingLeft: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    paddingRight: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    paddingTop: new SizeCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    transform: new ForgivingCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    width: new SizeCSSPropertyValidator({ config, model: lngNtrBlkRetModel }),
    zIndex: new FloatNumberCSSPropertyValidator({
      config,
      model: lngNtrBlkRetModel
    }),
    direction: new EnumerationCSSPropertyValidator(
      { config, model: lngNtrBlkFloModel },
      ['auto', 'ltr', 'rtl']
    )
  };
}
