import { CSSProperties } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import {
  CSSPropertyCompatCategory,
  CSSDisplayRegistry,
  WebTextFlowProperties,
  CSSPropertySpecs
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

export class CSSProcessedPropsRegistry
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
  >(): CSSProcessedPropsRegistry[T] {
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

  public setProperty(
    propertyName: string,
    propertyValue: any,
    { compatCategory, displayCategory, propagationCategory }: CSSPropertySpecs
  ) {
    (this[compatCategory][displayCategory][propagationCategory] as any)[
      propertyName
    ] = propertyValue;
  }
}
