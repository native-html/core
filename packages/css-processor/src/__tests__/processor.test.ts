import { CSSProcessor } from '../CSSProcessor';
import { paramCase } from 'param-case';
import { TextStyle, ViewStyle } from 'react-native';
import { defaultCSSProcessorConfig } from '../default';
import {
  CSSRulesCompatCategory,
  CSSRulesDisplayCategory,
  CSSRulesPropagationCategory
} from '../processor-types';

const processor = new CSSProcessor(defaultCSSProcessorConfig);
const propertiesValidators = processor.registry.validators;

type Specs = {
  readonly in: ReadonlyArray<string>;
  readonly outValues?: ReadonlyArray<any>;
  readonly outProps?: ReadonlyArray<Record<string, any> | null>;
  readonly propagation: CSSRulesPropagationCategory;
  readonly display: CSSRulesDisplayCategory;
  readonly compat: CSSRulesCompatCategory;
};

type SpecsModel = Pick<Specs, 'compat' | 'display' | 'propagation'>;

const sizeSpec: Pick<Required<Specs>, 'in' | 'outValues'> = {
  in: [
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
    '1ex',
    '1rem',
    '1vw',
    '1vh',
    'not-a-dimension!'
  ],
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
    null, // 1em
    null, // 1ex
    null, // 1rem
    null, // 1vw
    null, // 1vh
    null // not-a-dimension!
  ]
};

const colorSpec: Pick<Required<Specs>, 'in'> = {
  in: ['red', 'blue']
};

const numberSpec: Pick<Required<Specs>, 'in' | 'outValues'> = {
  in: ['10', 'Not a Number!'],
  outValues: [10, null]
};

function testSpecs(examples: Record<string, Specs>) {
  for (const key in examples) {
    const spec = examples[key];
    const validator = processor.registry.getValidatorForRule(key);
    spec.in.forEach((v, i) => {
      const outProp = spec.outProps?.[i];
      const outValue = spec.outValues ? spec.outValues[i] : v;
      const expectedValue =
        outProp !== undefined
          ? outProp
          : outValue != null
          ? { [key]: outValue }
          : null;
      it(`should ${expectedValue === null ? 'ignore' : 'register'} "${paramCase(
        key
      )}" ${
        validator?.isShorthand() ? 'shorhand' : 'longhand'
      } CSS property with value "${v}"`, () => {
        const output = processor.compileCss(`${paramCase(key)}: ${v}`);
        expect(output).toMatchObject({
          [spec.compat]: {
            [spec.display]: {
              [spec.propagation]: expectedValue === null ? {} : expectedValue
            }
          }
        });
        if (outProp === null) {
          expect(
            Object.keys(output[spec.compat][spec.display][spec.propagation])
          ).toHaveLength(0);
        }
      });
    });
  }
}

describe('compileCss function', () => {
  it('should ignore malformed strings', () => {
    expect(processor.compileCss('this is not a rule')).toMatchObject({});
  });
  it('should ignore unknown rules', () => {
    expect(
      processor.compileCss('non-existing-css-property: miscellaneous;')
    ).toMatchObject({});
  });
  describe('regarding specific CSS properties', () => {
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
    const nativeRetainedViewSpec: SpecsModel = {
      compat: 'native',
      display: 'block',
      propagation: 'retain'
    };
    const nativeRetainedBlockColorSpecModel = {
      ...colorSpec,
      ...nativeRetainedViewSpec
    };
    const nativeRetainedBlockSizeSpecModel = {
      ...sizeSpec,
      ...nativeRetainedViewSpec
    };
    const retainedWebBlockSpec: SpecsModel = {
      compat: 'web',
      display: 'block',
      propagation: 'retain'
    };
    const retainedWebBlockSizeSpec = {
      ...retainedWebBlockSpec,
      ...sizeSpec
    };
    const borderWidthSpec: Specs = {
      ...nativeRetainedViewSpec,
      in: [...sizeSpec.in, 'thin', 'medium', 'thick'],
      outValues: [
        ...sizeSpec.outValues!,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      ]
    };
    const examples: Record<keyof typeof propertiesValidators, Specs> = {
      display: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.display.allowedList
      },
      alignContent: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.alignContent.allowedList
      },
      alignItems: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.alignItems.allowedList
      },
      alignSelf: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.alignSelf.allowedList
      },
      aspectRatio: {
        ...retainedWebBlockSpec,
        in: ['7/2', '3', '2/3', 'not a ratio'],
        outValues: [7 / 2, 3, 2 / 3, null]
      },
      bottom: retainedWebBlockSizeSpec,
      flexBasis: retainedWebBlockSizeSpec,
      flexDirection: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.flexDirection.allowedList
      },
      flexGrow: {
        ...numberSpec,
        ...retainedWebBlockSpec
      },
      flexShrink: {
        ...numberSpec,
        ...retainedWebBlockSpec
      },
      flexWrap: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.flexWrap.allowedList
      },
      justifyContent: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.justifyContent.allowedList
      },
      left: retainedWebBlockSizeSpec,
      position: {
        ...retainedWebBlockSpec,
        in: propertiesValidators.position.allowedList
      },
      right: retainedWebBlockSizeSpec,
      top: retainedWebBlockSizeSpec,
      direction: {
        compat: 'native',
        display: 'block',
        propagation: 'flow',
        in: propertiesValidators.direction.allowedList
      },
      backfaceVisibility: {
        ...nativeRetainedViewSpec,
        in: propertiesValidators.backfaceVisibility.allowedList
      },
      backgroundColor: nativeRetainedBlockColorSpecModel,
      borderBottomColor: nativeRetainedBlockColorSpecModel,
      borderBottomLeftRadius: nativeRetainedBlockSizeSpecModel,
      borderBottomRightRadius: nativeRetainedBlockSizeSpecModel,
      borderBottomWidth: borderWidthSpec,
      borderLeftColor: nativeRetainedBlockColorSpecModel,
      borderLeftWidth: borderWidthSpec,
      borderRightColor: nativeRetainedBlockColorSpecModel,
      borderRightWidth: borderWidthSpec,
      borderTopColor: nativeRetainedBlockColorSpecModel,
      borderTopLeftRadius: nativeRetainedBlockSizeSpecModel,
      borderTopRightRadius: nativeRetainedBlockSizeSpecModel,
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
        ...nativeRetainedViewSpec,
        in: ['0.5'],
        outValues: [0.5]
      },
      paddingBottom: nativeRetainedBlockSizeSpecModel,
      paddingLeft: nativeRetainedBlockSizeSpecModel,
      paddingRight: nativeRetainedBlockSizeSpecModel,
      paddingTop: nativeRetainedBlockSizeSpecModel,
      transform: {
        ...nativeRetainedViewSpec,
        in: ['scaleX(10)', 'matrix(1, 2, 3, 4, 5, 6)'],
        outValues: [
          [
            {
              scaleX: 10
            }
          ],
          null
        ]
      },
      width: nativeRetainedBlockSizeSpecModel,
      zIndex: {
        ...numberSpec,
        ...nativeRetainedViewSpec
      },
      whiteSpace: {
        ...flowedWebTextSpec,
        in: [...propertiesValidators.whiteSpace.allowedList, 'pre-warp'],
        outValues: [...propertiesValidators.whiteSpace.allowedList, null]
      },
      color: { ...flowedNativeTextSpec, ...colorSpec },
      fontFamily: {
        ...flowedNativeTextSpec,
        in: ['Helvetica', '"Gill Sans", sans-serif', 'Georgia, serif'],
        outValues: ['Helvetica', 'Gill Sans', 'Georgia']
      },
      fontSize: {
        ...flowedNativeTextSpec,
        in: [
          ...sizeSpec.in,
          'medium',
          'x-small',
          'xx-small',
          'small',
          'large',
          'x-large',
          'xx-large'
        ],
        outValues: [
          ...sizeSpec.outValues,
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
        in: [...propertiesValidators.fontStyle.allowedList, 'oblique'],
        outValues: [...propertiesValidators.fontStyle.allowedList, null]
      },
      fontVariant: {
        ...flowedNativeTextSpec,
        in: [...propertiesValidators.fontVariant.allowedList, 'non-existing'],
        outValues: [
          ...propertiesValidators.fontVariant.allowedList.map((e) => [e]),
          null
        ]
      },
      fontWeight: {
        ...flowedNativeTextSpec,
        in: [...propertiesValidators.fontWeight.allowedList, 'not-allowed'],
        outValues: [...propertiesValidators.fontWeight.allowedList, null]
      },
      letterSpacing: { ...flowedNativeTextSpec, ...sizeSpec },
      lineHeight: { ...flowedNativeTextSpec, ...sizeSpec },
      textAlign: {
        ...flowedNativeTextSpec,
        in: propertiesValidators.textAlign.allowedList
      },
      textTransform: {
        ...flowedNativeTextSpec,
        in: propertiesValidators.textTransform.allowedList
      },
      textDecorationColor: { ...retainedNativeTextSpec, ...colorSpec },
      textDecorationLine: {
        ...retainedNativeTextSpec,
        in: [
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
        in: [...propertiesValidators.textDecorationStyle.allowedList, 'wavy'],
        outValues: [
          ...propertiesValidators.textDecorationStyle.allowedList,
          null
        ]
      },
      borderColor: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        in: ['red yellow green blue', 'red', 'red blue', 'red yellow green'],
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
        in: ['transparent', 'red content-box', 'url("paper.gif")'],
        outProps: [
          {
            backgroundColor: 'transparent'
          },
          {
            backgroundColor: 'red'
          },
          {
            // Ignore unsupported backgroundImage
          }
        ]
      },
      borderRadius: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        in: ['30px', '30pt', '10% 30% 50% 70%', '1px 4px 3px', '20px / 10px'],
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
          {
            borderBottomLeftRadius: '70%',
            borderBottomRightRadius: '50%',
            borderTopLeftRadius: '10%',
            borderTopRightRadius: '30%'
          },
          {
            borderTopLeftRadius: 1,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 3
          },
          {} // Slash syntax for horizontal radius / vertical radius, unsupported in RN
        ] as ViewStyle[]
      },
      borderWidth: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        in: [
          '1px',
          '1px 3px',
          '1px 4px 2px',
          '1px 2px 3px 4px',
          'medium',
          'thin',
          'thick',
          'medium thick'
        ],
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
        compat: 'web',
        display: 'block',
        propagation: 'retain',
        in: ['row wrap'],
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
        in: ['underline red dashed'],
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
        in: ['dotted', 'dotted double', ''],
        outProps: [
          {
            borderStyle: 'dotted'
          },
          {
            // RN doesn't support borderStyle on specific sides
            borderStyle: 'dotted'
          },
          null
        ]
      },
      border: {
        compat: 'native',
        display: 'block',
        propagation: 'retain',
        in: ['2px dashed #f00', '2px dashed', '2px'],
        outProps: [
          {
            borderWidth: 2,
            borderColor: '#f00',
            borderStyle: 'dashed'
          },
          {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed'
          },
          {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid'
          }
        ] as ViewStyle[]
      },
      flex: {
        compat: 'web',
        display: 'block',
        propagation: 'retain',
        in: ['1 2 3px', '1 2 3pt', '1 2', '2 2px'],
        outProps: [
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
        in: [
          'bold italic small-caps 16px/18px "Helvetica"',
          'italic small-caps bold 12px/30px "Georgia", serif'
        ],
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
        in: ['auto', '0 auto', '2px 3px auto', '1px 2px 3px 4px'],
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
        in: ['1px 2px 3px 4px', '1px 2px 3px', '1px 2px', '1px'],
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
          }
        ]
      }
    };
    testSpecs(examples);
  });
});
