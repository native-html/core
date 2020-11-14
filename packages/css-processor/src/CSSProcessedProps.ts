import { CSSProperties } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { MixedStyleDeclaration } from './CSSProcessor';
import {
  CSSPropertyCompatCategory,
  CSSDisplayRegistry,
  WebTextFlowProperties,
  CSSPropertySpecs,
  CSSPropertyDisplayCategory,
  CSSPropertyPropagationCategory
} from './processor-types';
import {
  CSSLongNativeTranslatableBlockFlowedPropKey,
  CSSLongNativeTranslatableBlockRetainedPropKey,
  CSSLongNativeTranslatableTextFlowedPropKey,
  CSSLongNativeTranslatableTextRetainedPropKey,
  CSSLongNativeUntranslatableBlockFlowedPropKey,
  CSSLongNativeUntranslatableBlockPropKey,
  CSSLongWebTextRetainedPropKey
} from './property-types';

const compatCategories: ReadonlyArray<CSSPropertyCompatCategory> = [
  'native',
  'web'
];
const displayCategories: ReadonlyArray<CSSPropertyDisplayCategory> = [
  'text',
  'block'
];
const propagationCategories: ReadonlyArray<CSSPropertyPropagationCategory> = [
  'flow',
  'retain'
];

/**
 * An object representing categorized style props. Props are categorized
 * depending on their inheritability (flow, retain), target (block, text)
 * and (react) native support (native, web).
 */
export class CSSProcessedProps
  implements Record<CSSPropertyCompatCategory, CSSDisplayRegistry> {
  readonly native: {
    text: {
      flow: Partial<
        Pick<TextStyle, CSSLongNativeTranslatableTextFlowedPropKey>
      >;
      retain: Partial<
        Pick<TextStyle, CSSLongNativeTranslatableTextRetainedPropKey>
      >;
    };
    block: {
      flow: Partial<
        Pick<ViewStyle, CSSLongNativeTranslatableBlockFlowedPropKey>
      >;
      retain: Partial<
        Pick<ViewStyle, CSSLongNativeTranslatableBlockRetainedPropKey>
      >;
    };
  };
  readonly web: {
    text: {
      flow: Partial<WebTextFlowProperties> & CSSProperties;
      retain: Partial<Record<CSSLongWebTextRetainedPropKey, any>> &
        CSSProperties;
    };
    block: {
      flow: Partial<
        Pick<ViewStyle, CSSLongNativeUntranslatableBlockFlowedPropKey>
      > &
        CSSProperties;
      retain: Partial<
        Pick<ViewStyle, CSSLongNativeUntranslatableBlockPropKey>
      > &
        CSSProperties;
    };
  };

  constructor() {
    this.native = this.newCompatCategory<'native'>();
    this.web = this.newCompatCategory<'web'>();
  }

  private newCompatCategory<
    T extends CSSPropertyCompatCategory
  >(): CSSProcessedProps[T] {
    return {
      block: {
        retain: {},
        flow: {}
      },
      text: {
        retain: {},
        flow: {}
      }
    };
  }

  public withProperty<K extends keyof MixedStyleDeclaration>(
    propertyName: K,
    propertyValue: MixedStyleDeclaration[K],
    { compatCategory, displayCategory, propagationCategory }: CSSPropertySpecs
  ) {
    if (propertyValue !== null) {
      (this[compatCategory][displayCategory][propagationCategory] as any)[
        propertyName
      ] = propertyValue;
    }
    return this;
  }

  /**
   * Create a new processed prop object by merging the 'overriders' parameters
   * into this object.
   *
   * @param overriders - The processed props which will be merged into this
   * processed prop. Rightmost props will override leftmost props.
   */
  public merge(...overriders: CSSProcessedProps[]) {
    const next = new CSSProcessedProps();
    for (const compat of compatCategories) {
      for (const display of displayCategories) {
        for (const propagation of propagationCategories) {
          next[compat][display][propagation] = Object.assign(
            {},
            this[compat][display][propagation],
            ...overriders.map((o) => o[compat][display][propagation])
          );
        }
      }
    }
    return next;
  }

  static new() {
    return new CSSProcessedProps();
  }
}
