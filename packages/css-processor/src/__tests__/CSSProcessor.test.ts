import { CSSProcessor, MixedStyleDeclaration } from '../CSSProcessor';
import { paramCase } from 'param-case';
import { TextStyle, ViewStyle } from 'react-native';
import { defaultCSSProcessorConfig } from '../default';
import {
  CSSPropertyCompatCategory,
  CSSPropertyDisplayCategory,
  CSSPropertyPropagationCategory
} from '../processor-types';
import { CSSProcessedProps } from '../CSSProcessedProps';
import { ExtraNativeShortViewStyleKeys } from '../native-types';

const processor = new CSSProcessor(defaultCSSProcessorConfig);
const propertiesValidators = processor.registry.validators;

type Specs = {
  readonly inlineIncomingValues: ReadonlyArray<string>;
  readonly mixedIncomingValues: ReadonlyArray<any> | null;
  readonly outValues?: ReadonlyArray<any>;
  readonly outProps?: ReadonlyArray<Record<string, any> | null>;
  readonly propagation: CSSPropertyPropagationCategory;
  readonly display: CSSPropertyDisplayCategory;
  readonly compat: CSSPropertyCompatCategory;
};

type SpecsModel = Pick<Specs, 'compat' | 'display' | 'propagation'>;

const lengthSamples = [
  '0', // no-unit
  'auto', // special value
  '20%',
  '1cm',
  '1in',
  '1mm',
  '1pc',
  '1pt',
  '12px',
  '1em',
  '.67em', // floating point
  '1ex',
  '1rem',
  '1vw',
  '1vh',
  'inherit', // should be ignored
  'calc(100% - 80px)', // should be ignored
  'var(--main-bg-color)', // should be ignored
  'not-a-dimension!' // should be ignored
];

const sizeSpec: Pick<
  Required<Specs>,
  'inlineIncomingValues' | 'mixedIncomingValues' | 'outValues'
> = {
  mixedIncomingValues: lengthSamples,
  inlineIncomingValues: lengthSamples,
  outValues: [
    0, // 0
    'auto',
    '20%', // 20%
    96 * 2.54, // 1cm
    96, // 1in
    (96 * 2.54) / 10, // 1mm
    (4 / 3) * 12, // 1pc
    (4 / 3) * 1, // 1pt
    12, // 12px
    16, // 1em
    16 * 0.67, // .67em
    16 * 0.63, // 1ex
    16, // 1rem
    null, // 1vw
    null, // 1vh
    null, // inherit
    null, // calc(...)
    null, // var(...)
    null // not-a-dimension!
  ]
};

const colorSpec: Pick<
  Required<Specs>,
  'mixedIncomingValues' | 'inlineIncomingValues' | 'outValues'
> = {
  inlineIncomingValues: [
    'red',
    'blue',
    'hsl(360,100%,100%)',
    'hsla(360,100%,100%,1.0)',
    'rgb(0,0,0)',
    'rgba(0,0,0,1)',
    '#ffffff',
    'var(--main-bg-color)'
  ],
  mixedIncomingValues: [
    'red',
    'blue',
    'hsl(360,100%,100%)',
    'hsla(360,100%,100%,1.0)',
    'rgb(0,0,0)',
    'rgba(0,0,0,1)',
    '#ffffff',
    null
  ],
  outValues: [
    'red',
    'blue',
    'hsl(360,100%,100%)',
    'hsla(360,100%,100%,1.0)',
    'rgb(0,0,0)',
    'rgba(0,0,0,1)',
    '#ffffff',
    null
  ]
};

const numberSpec: Pick<
  Required<Specs>,
  'mixedIncomingValues' | 'inlineIncomingValues' | 'outValues'
> = {
  mixedIncomingValues: [10, 'Not a Number!'],
  inlineIncomingValues: ['10', 'Not a Number!'],
  outValues: [10, null]
};

function testSpecs(examples: Record<string, Specs>) {
  for (const key in examples) {
    const spec = examples[key];
    const validator = processor.registry.getValidatorForProperty(
      key as keyof MixedStyleDeclaration
    );
    spec.inlineIncomingValues.forEach((v, i) => {
      const outProp = spec.outProps?.[i];
      const outValue = spec.outValues ? spec.outValues[i] : v;
      const expectedValue =
        outProp !== undefined
          ? outProp
          : outValue != null
          ? { [key]: outValue }
          : null;
      it(`compileInlineCSS method should ${
        expectedValue === null ? 'ignore' : 'register'
      } "${paramCase(key)}" ${
        validator?.isShorthand() ? 'shorhand' : 'longhand'
      } CSS inline property with value "${v}"`, () => {
        const output = processor.compileInlineCSS(`${paramCase(key)}: ${v}`);
        expect(
          output[spec.compat][spec.display][spec.propagation]
        ).toStrictEqual(expectedValue === null ? {} : expectedValue);
        if (outProp === null) {
          expect(
            Object.keys(output[spec.compat][spec.display][spec.propagation])
          ).toHaveLength(0);
        }
      });
    });
    if (spec.mixedIncomingValues) {
      spec.mixedIncomingValues.forEach((v, i) => {
        const outProp = spec.outProps?.[i];
        const outValue = spec.outValues ? spec.outValues[i] : v;
        const expectedValue =
          outProp !== undefined
            ? outProp
            : outValue != null
            ? { [key]: outValue }
            : null;
        it(`compileStyleDeclaration should ${
          expectedValue === null ? 'ignore' : 'register'
        } "${key}" ${
          validator?.isShorthand() ? 'shorhand' : 'longhand'
        } Native mixed style property with value "${v}"`, () => {
          const output = processor.compileStyleDeclaration({ [key]: v });
          expect(
            output[spec.compat][spec.display][spec.propagation]
          ).toStrictEqual(expectedValue === null ? {} : expectedValue);
          if (outProp === null) {
            expect(
              Object.keys(output[spec.compat][spec.display][spec.propagation])
            ).toHaveLength(0);
          }
        });
      });
    }
  }
}

describe('CSSProcessor', () => {
  describe('compileStyleDeclaration', () => {
    it('should pack known supported longhand properties', () => {
      expect(
        processor.compileStyleDeclaration({
          backgroundColor: 'red',
          color: 'blue',
          whiteSpace: 'pre'
        })
      ).toMatchObject({
        native: {
          block: {
            retain: {
              backgroundColor: 'red'
            }
          },
          text: {
            flow: {
              color: 'blue'
            }
          }
        },
        web: {
          text: {
            flow: {
              whiteSpace: 'pre'
            }
          }
        }
      });
    });
    it('should pack known extra longhand properties', () => {
      expect(
        processor.compileStyleDeclaration({
          testID: 'test'
        })
      ).toMatchObject({
        native: {
          block: {
            retain: {
              testID: 'test'
            }
          }
        }
      });
    });
    it('should pack supported CSS shorthand properties', () => {
      expect(
        processor.compileStyleDeclaration({
          padding: 10
        }).native.block.retain
      ).toStrictEqual({
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
      });
      expect(
        processor.compileStyleDeclaration({
          margin: 10
        }).native.block.retain
      ).toStrictEqual({
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
      });
      expect(
        processor.compileStyleDeclaration({
          borderColor: 'red'
        }).native.block.retain
      ).toStrictEqual({
        borderTopColor: 'red',
        borderRightColor: 'red',
        borderBottomColor: 'red',
        borderLeftColor: 'red'
      });
      expect(
        processor.compileStyleDeclaration({
          borderRadius: 10
        }).native.block.retain
      ).toStrictEqual({
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10
      });
      expect(
        processor.compileStyleDeclaration({
          borderWidth: 10
        }).native.block.retain
      ).toStrictEqual({
        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10
      });
      expect(
        processor.compileStyleDeclaration({
          marginHorizontal: 10
        }).native.block.retain
      ).toStrictEqual({
        marginLeft: 10,
        marginRight: 10
      });
      expect(
        processor.compileStyleDeclaration({
          marginVertical: 10
        }).native.block.retain
      ).toStrictEqual({
        marginTop: 10,
        marginBottom: 10
      });
      expect(
        processor.compileStyleDeclaration({
          paddingHorizontal: 10
        }).native.block.retain
      ).toStrictEqual({
        paddingLeft: 10,
        paddingRight: 10
      });
      expect(
        processor.compileStyleDeclaration({
          paddingVertical: 10
        }).native.block.retain
      ).toStrictEqual({
        paddingTop: 10,
        paddingBottom: 10
      });
      expect(
        processor.compileStyleDeclaration({
          flex: 1
        }).native.block.retain
      ).toStrictEqual({
        flex: 1
      });
    });
    it('should ignore unsupported shorthand properties', () => {
      expect(
        processor.compileStyleDeclaration({
          font: 'italic small-caps bold 12px/30px Georgia, serif'
        } as any)
      ).toStrictEqual(new CSSProcessedProps());
    });
    it('should pack extra supported native shorthand properties', () => {
      expect(
        processor.compileStyleDeclaration({
          paddingHorizontal: 10
        })
      ).toMatchObject({
        native: {
          block: {
            retain: {
              paddingLeft: 10,
              paddingRight: 10
            }
          }
        }
      });
    });
    it('should ignore with a special message directional properties', () => {
      console.warn = jest.fn();
      expect(
        processor.compileStyleDeclaration({
          borderEndColor: 'blue'
        } as any)
      ).toEqual(new CSSProcessedProps());
    });
    it('should ignore unknown properties', () => {
      console.warn = jest.fn();
      expect(
        processor.compileStyleDeclaration({
          unknownProp: 'test'
        } as any)
      ).toEqual(new CSSProcessedProps());
      expect(console.warn).toHaveBeenCalled();
    });
  });
  describe('compileInlineCSS method', () => {
    it('should ignore malformed strings', () => {
      expect(processor.compileInlineCSS('this is not a rule')).toStrictEqual(
        new CSSProcessedProps()
      );
    });
    it('should ignore unknown rules', () => {
      expect(
        processor.compileInlineCSS('non-existing-css-property: miscellaneous;')
      ).toStrictEqual(new CSSProcessedProps());
    });
    it('should ignore native-exclusive rules', () => {
      expect(
        processor.compileInlineCSS('padding-horizontal: 10px;')
      ).toStrictEqual(new CSSProcessedProps());
    });
    it('should ignore rules from the inlinePropertiesBlacklist config array', () => {
      const processorWithIgnoreStyles = new CSSProcessor({
        ...defaultCSSProcessorConfig,
        inlinePropertiesBlacklist: ['backgroundColor']
      });
      expect(
        processorWithIgnoreStyles.compileInlineCSS('background-color: red;')
      ).toStrictEqual(new CSSProcessedProps());
    });
    it('should only allow rules from the inlinePropertiesWhitelist config array when non-null', () => {
      const processorWithIgnoreStyles = new CSSProcessor({
        ...defaultCSSProcessorConfig,
        inlinePropertiesWhitelist: ['backgroundColor']
      });
      expect(
        processorWithIgnoreStyles.compileInlineCSS(
          'background-color: red; color: blue;'
        )
      ).toStrictEqual(
        new CSSProcessedProps().withProperty(
          'backgroundColor',
          'red',
          propertiesValidators.backgroundColor
        )
      );
    });
  });
  describe('regarding specific properties', () => {
    const retainedNativeTextSpec: SpecsModel = {
      propagation: 'retain',
      compat: 'native',
      display: 'text'
    };
    const flowedNativeTextSpec: SpecsModel = {
      propagation: 'flow',
      compat: 'native',
      display: 'text'
    };
    const flowedWebTextSpec: SpecsModel = {
      propagation: 'flow',
      compat: 'web',
      display: 'text'
    };
    const nativeRetainedBlockSpec: SpecsModel = {
      compat: 'native',
      display: 'block',
      propagation: 'retain'
    };
    const nativeRetainedBlockColorSpecModel = {
      ...colorSpec,
      ...nativeRetainedBlockSpec
    };
    const nativeRetainedBlockSizeSpecModel = {
      ...sizeSpec,
      ...nativeRetainedBlockSpec
    };
    const nativeRetainedBlockNonPercentSizeSpecModel: Specs = {
      ...sizeSpec,
      ...nativeRetainedBlockSpec,
      inlineIncomingValues: ['10px', '10%'],
      mixedIncomingValues: [10, '10%'],
      outValues: [10, null]
    };
    const retainedWebBlockSpec: SpecsModel = {
      compat: 'web',
      display: 'block',
      propagation: 'retain'
    };
    const retainedNativeBlockSizeSpec = {
      ...nativeRetainedBlockSpec,
      ...sizeSpec
    };
    const borderWidthValues = [
      ...sizeSpec.inlineIncomingValues,
      'thin',
      'medium',
      'thick'
    ];
    const fontSizeValues = [
      ...sizeSpec.inlineIncomingValues,
      'medium',
      'x-small',
      'xx-small',
      'small',
      'large',
      'x-large',
      'xx-large',
      'smaller',
      'larger'
    ];
    const borderWidthSpec: Specs = {
      ...nativeRetainedBlockSpec,
      inlineIncomingValues: borderWidthValues,
      mixedIncomingValues: borderWidthValues,
      outValues: [
        ...sizeSpec.outValues!.map((v) => {
          if (typeof v === 'string' && v.match(/%$/)) {
            return null;
          }
          return v;
        }),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      ]
    };
    const examples: Record<
      Exclude<keyof typeof propertiesValidators, ExtraNativeShortViewStyleKeys>,
      Specs
    > = {
      display: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.display.allowedList,
        mixedIncomingValues: propertiesValidators.display.allowedList
      },
      alignContent: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.alignContent.allowedList,
        mixedIncomingValues: propertiesValidators.alignContent.allowedList
      },
      alignItems: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.alignItems.allowedList,
        mixedIncomingValues: propertiesValidators.alignItems.allowedList
      },
      alignSelf: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.alignSelf.allowedList,
        mixedIncomingValues: propertiesValidators.alignSelf.allowedList
      },
      aspectRatio: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: ['7/2', '3', '2/3', 'not a ratio', '1/0'],
        mixedIncomingValues: [7 / 2, 3, 2 / 3, 'not a ratio', null],
        outValues: [7 / 2, 3, 2 / 3, null, null]
      },
      objectFit: {
        ...retainedWebBlockSpec,
        inlineIncomingValues: propertiesValidators.objectFit.allowedList,
        mixedIncomingValues: propertiesValidators.objectFit.allowedList
      },
      flexBasis: nativeRetainedBlockSizeSpecModel,
      flexDirection: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.flexDirection.allowedList,
        mixedIncomingValues: propertiesValidators.flexDirection.allowedList
      },
      flexGrow: {
        ...numberSpec,
        ...nativeRetainedBlockSpec
      },
      flexShrink: {
        ...numberSpec,
        ...nativeRetainedBlockSpec
      },
      flexWrap: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.flexWrap.allowedList,
        mixedIncomingValues: propertiesValidators.flexWrap.allowedList
      },
      justifyContent: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: propertiesValidators.justifyContent.allowedList,
        mixedIncomingValues: propertiesValidators.justifyContent.allowedList
      },
      position: {
        ...retainedWebBlockSpec,
        inlineIncomingValues: propertiesValidators.position.allowedList,
        mixedIncomingValues: propertiesValidators.position.allowedList
      },
      left: retainedNativeBlockSizeSpec,
      right: retainedNativeBlockSizeSpec,
      top: retainedNativeBlockSizeSpec,
      bottom: retainedNativeBlockSizeSpec,
      direction: {
        compat: 'native',
        display: 'block',
        propagation: 'flow',
        inlineIncomingValues: propertiesValidators.direction.allowedList,
        mixedIncomingValues: propertiesValidators.direction.allowedList
      },
      backfaceVisibility: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues:
          propertiesValidators.backfaceVisibility.allowedList,
        mixedIncomingValues: propertiesValidators.backfaceVisibility.allowedList
      },
      backgroundColor: nativeRetainedBlockColorSpecModel,
      borderBottomColor: nativeRetainedBlockColorSpecModel,
      borderBottomLeftRadius: nativeRetainedBlockNonPercentSizeSpecModel,
      borderBottomRightRadius: nativeRetainedBlockNonPercentSizeSpecModel,
      borderTopLeftRadius: nativeRetainedBlockNonPercentSizeSpecModel,
      borderTopRightRadius: nativeRetainedBlockNonPercentSizeSpecModel,
      borderBottomWidth: borderWidthSpec,
      borderLeftColor: nativeRetainedBlockColorSpecModel,
      borderLeftWidth: borderWidthSpec,
      borderRightColor: nativeRetainedBlockColorSpecModel,
      borderRightWidth: borderWidthSpec,
      borderTopColor: nativeRetainedBlockColorSpecModel,
      borderTopWidth: borderWidthSpec,
      height: nativeRetainedBlockSizeSpecModel,
      marginBottom: nativeRetainedBlockSizeSpecModel,
      marginLeft: nativeRetainedBlockSizeSpecModel,
      marginRight: nativeRetainedBlockSizeSpecModel,
      marginTop: nativeRetainedBlockSizeSpecModel,
      maxHeight: nativeRetainedBlockSizeSpecModel,
      maxWidth: nativeRetainedBlockSizeSpecModel,
      minHeight: nativeRetainedBlockSizeSpecModel,
      minWidth: nativeRetainedBlockSizeSpecModel,
      opacity: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: ['0.5'],
        mixedIncomingValues: [0.5],
        outValues: [0.5]
      },
      paddingBottom: nativeRetainedBlockSizeSpecModel,
      paddingLeft: nativeRetainedBlockSizeSpecModel,
      paddingRight: nativeRetainedBlockSizeSpecModel,
      paddingTop: nativeRetainedBlockSizeSpecModel,
      transform: {
        ...nativeRetainedBlockSpec,
        inlineIncomingValues: ['scaleX(10)', 'matrix(1, 2, 3, 4, 5, 6)'],
        mixedIncomingValues: [
          [
            {
              scaleX: 10
            }
          ],
          null
        ],
        outValues: [
          [
            {
              scaleX: 10
            }
          ],
          null
        ]
      },
      listStyleType: {
        ...flowedWebTextSpec,
        inlineIncomingValues: ['disc'],
        mixedIncomingValues: ['disc'],
        outValues: ['disc']
      },
      width: nativeRetainedBlockSizeSpecModel,
      zIndex: {
        ...numberSpec,
        ...nativeRetainedBlockSpec
      },
      userSelect: {
        ...flowedWebTextSpec,
        inlineIncomingValues: ['auto', 'text', 'none', 'contain', 'all'],
        mixedIncomingValues: ['auto', 'text', 'none', 'contain', 'all'],
        outValues: ['auto', 'text', 'none', 'contain', 'all']
      },
      whiteSpace: {
        ...flowedWebTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.whiteSpace.allowedList,
          'pre-warp'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.whiteSpace.allowedList,
          'pre-warp'
        ],
        outValues: [...propertiesValidators.whiteSpace.allowedList, null]
      },
      color: { ...flowedNativeTextSpec, ...colorSpec },
      fontFamily: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: [
          'Helvetica',
          '"Gill Sans", sans-serif',
          'Georgia, serif'
        ],
        mixedIncomingValues: [
          'Helvetica',
          '"Gill Sans", sans-serif',
          'Georgia, serif'
        ],
        outValues: ['Helvetica', 'Gill Sans', 'Georgia']
      },
      fontSize: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: fontSizeValues,
        mixedIncomingValues: fontSizeValues,
        outValues: [
          ...sizeSpec.outValues.map((v) => (v === '20%' ? 3.2 : v)), // Percents are handled differently for fontSize (equivalent to em)
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number)
        ]
      },
      fontStyle: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.fontStyle.allowedList,
          'oblique'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.fontStyle.allowedList,
          'oblique'
        ],
        outValues: [...propertiesValidators.fontStyle.allowedList, null]
      },
      fontVariant: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.fontVariant.allowedList,
          'non-existing'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.fontVariant.allowedList.map((e) => [e]),
          null
        ],
        outValues: [
          ...propertiesValidators.fontVariant.allowedList.map((e) => [e]),
          null
        ]
      },
      fontWeight: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.fontWeight.allowedList,
          'not-allowed'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.fontWeight.allowedList,
          'not-allowed'
        ],
        outValues: [...propertiesValidators.fontWeight.allowedList, null]
      },
      letterSpacing: { ...flowedNativeTextSpec, ...sizeSpec },
      lineHeight: {
        compat: 'native',
        display: 'text',
        propagation: 'flow',
        inlineIncomingValues: ['1px', '1em'],
        mixedIncomingValues: null,
        outValues: [1, 16]
      },
      textAlign: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: propertiesValidators.textAlign.allowedList,
        mixedIncomingValues: propertiesValidators.textAlign.allowedList
      },
      textTransform: {
        ...flowedNativeTextSpec,
        inlineIncomingValues: propertiesValidators.textTransform.allowedList,
        mixedIncomingValues: propertiesValidators.textTransform.allowedList
      },
      textDecorationColor: { ...retainedNativeTextSpec, ...colorSpec },
      textDecorationLine: {
        ...retainedNativeTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.textDecorationLine.allowedList,
          'overline'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.textDecorationLine.allowedList,
          'overline'
        ],
        outValues: [
          ...propertiesValidators.textDecorationLine.allowedList,
          null
        ]
      },
      textDecorationStyle: {
        ...retainedNativeTextSpec,
        inlineIncomingValues: [
          ...propertiesValidators.textDecorationStyle.allowedList,
          'wavy'
        ],
        mixedIncomingValues: [
          ...propertiesValidators.textDecorationStyle.allowedList,
          'wavy'
        ],
        outValues: [
          ...propertiesValidators.textDecorationStyle.allowedList,
          null
        ]
      },
      borderColor: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          'red yellow green blue',
          'red',
          'red blue',
          'red yellow green'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            borderTopColor: 'red',
            borderRightColor: 'yellow',
            borderBottomColor: 'green',
            borderLeftColor: 'blue'
          },
          {
            borderTopColor: 'red',
            borderRightColor: 'red',
            borderBottomColor: 'red',
            borderLeftColor: 'red'
          },
          {
            borderTopColor: 'red',
            borderRightColor: 'blue',
            borderBottomColor: 'red',
            borderLeftColor: 'blue'
          },
          {
            borderTopColor: 'red',
            borderRightColor: 'yellow',
            borderBottomColor: 'green',
            borderLeftColor: 'yellow'
          }
        ] as ViewStyle[]
      },
      background: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          'transparent',
          'red content-box',
          'url("paper.gif")'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            backgroundColor: 'transparent'
          },
          {
            backgroundColor: 'red'
          },
          null
        ]
      },
      borderRadius: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          '30px',
          '30pt',
          '10% 30% 50% 70%',
          '1px 4px 3px',
          '20px / 10px'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30
          },
          {
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40
          },
          null, // Percent radius, unsupported in RN
          {
            borderTopLeftRadius: 1,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 3
          },
          null // Slash syntax for horizontal radius / vertical radius, unsupported in RN
        ] as ViewStyle[]
      },
      borderWidth: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          '1px',
          '1px 3px',
          '1px 4px 2px',
          '1px 2px 3px 4px',
          'medium',
          'thin',
          'thick',
          'medium thick'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1
          },
          {
            borderTopWidth: 1,
            borderRightWidth: 3,
            borderBottomWidth: 1,
            borderLeftWidth: 3
          },
          {
            borderTopWidth: 1,
            borderRightWidth: 4,
            borderBottomWidth: 2,
            borderLeftWidth: 4
          },
          {
            borderTopWidth: 1,
            borderRightWidth: 2,
            borderBottomWidth: 3,
            borderLeftWidth: 4
          },
          {
            borderTopWidth: expect.any(Number),
            borderRightWidth: expect.any(Number),
            borderBottomWidth: expect.any(Number),
            borderLeftWidth: expect.any(Number)
          },
          {
            borderTopWidth: expect.any(Number),
            borderRightWidth: expect.any(Number),
            borderBottomWidth: expect.any(Number),
            borderLeftWidth: expect.any(Number)
          },
          {
            borderTopWidth: expect.any(Number),
            borderRightWidth: expect.any(Number),
            borderBottomWidth: expect.any(Number),
            borderLeftWidth: expect.any(Number)
          },
          {
            borderTopWidth: expect.any(Number),
            borderRightWidth: expect.any(Number),
            borderBottomWidth: expect.any(Number),
            borderLeftWidth: expect.any(Number)
          }
        ] as ViewStyle[]
      },
      flexFlow: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: ['row wrap'],
        mixedIncomingValues: null,
        outProps: [
          {
            flexDirection: 'row',
            flexWrap: 'wrap'
          }
        ] as ViewStyle[]
      },
      textDecoration: {
        compat: 'native',
        display: 'text',
        propagation: 'retain',
        inlineIncomingValues: ['underline red dashed'],
        mixedIncomingValues: null,
        outProps: [
          {
            textDecorationLine: 'underline',
            textDecorationColor: 'red',
            textDecorationStyle: 'dashed'
          }
        ] as TextStyle[]
      },
      borderStyle: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: ['dotted', 'dotted double', ''],
        mixedIncomingValues: ['dotted', 'dotted', ''],
        outValues: ['dotted', 'dotted', null]
      },
      border: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: ['2px dashed #f00', '2px dashed', '2px'],
        mixedIncomingValues: null,
        outProps: [
          {
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderTopColor: '#f00',
            borderRightColor: '#f00',
            borderBottomColor: '#f00',
            borderLeftColor: '#f00',
            borderStyle: 'dashed'
          },
          {
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderTopColor: 'black',
            borderRightColor: 'black',
            borderBottomColor: 'black',
            borderLeftColor: 'black',
            borderStyle: 'dashed'
          },
          {
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderTopColor: 'black',
            borderRightColor: 'black',
            borderBottomColor: 'black',
            borderLeftColor: 'black',
            borderStyle: 'solid'
          }
        ] as ViewStyle[]
      },
      flex: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: ['1', '1 2 3px', '1 2 3pt', '1 2', '2 2px'],
        mixedIncomingValues: null,
        outProps: [
          {
            flexGrow: 1,
            flexBasis: 0,
            flexShrink: 1
          },
          {
            flexGrow: 1,
            flexShrink: 2,
            flexBasis: 3
          },
          {
            flexGrow: 1,
            flexShrink: 2,
            flexBasis: 4
          },
          {
            flexGrow: 1,
            flexShrink: 2,
            flexBasis: 0
          },
          {
            flexGrow: 2,
            flexShrink: 1,
            flexBasis: 2
          }
        ] as ViewStyle[]
      },
      font: {
        compat: 'native',
        display: 'text',
        propagation: 'flow',
        inlineIncomingValues: [
          'bold italic small-caps 16px/18px "Helvetica"',
          'italic small-caps bold 12px/30px "Georgia", serif'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            fontFamily: 'Helvetica',
            fontSize: 16,
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontVariant: ['small-caps'],
            lineHeight: 18
          },
          {
            fontFamily: 'serif',
            fontSize: 12,
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontVariant: ['small-caps'],
            lineHeight: 30
          }
        ] as TextStyle[]
      },
      margin: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          'auto',
          '0 auto',
          '2px 3px auto',
          '1px 2px 3px 4px'
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            marginTop: 'auto',
            marginRight: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto'
          },
          {
            marginTop: 0,
            marginRight: 'auto',
            marginBottom: 0,
            marginLeft: 'auto'
          },
          {
            marginTop: 2,
            marginRight: 3,
            marginBottom: 'auto',
            marginLeft: 3
          },
          {
            marginTop: 1,
            marginRight: 2,
            marginBottom: 3,
            marginLeft: 4
          }
        ]
      },
      padding: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        inlineIncomingValues: [
          '1px 2px 3px 4px',
          '1px 2px 3px',
          '1px 2px',
          '1px',
          '1px 1px 1px 1px 1px' // illegal
        ],
        mixedIncomingValues: null,
        outProps: [
          {
            paddingTop: 1,
            paddingRight: 2,
            paddingBottom: 3,
            paddingLeft: 4
          },
          {
            paddingTop: 1,
            paddingRight: 2,
            paddingBottom: 3,
            paddingLeft: 2
          },
          {
            paddingTop: 1,
            paddingRight: 2,
            paddingBottom: 1,
            paddingLeft: 2
          },
          {
            paddingTop: 1,
            paddingRight: 1,
            paddingBottom: 1,
            paddingLeft: 1
          },
          null
        ]
      }
    };
    testSpecs(examples);
  });
});
