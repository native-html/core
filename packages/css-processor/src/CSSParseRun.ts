import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import {
  CSSProcessedPropsRegistry,
  CSSDisplayRegistry,
  CSSProperties,
  CSSPropertyCompatCategory,
  CSSPropertyDisplayCategory
} from './processor-types';
import { CSSPropertyValidator } from './validators';

export class CSSParseRun implements CSSProcessedPropsRegistry {
  readonly native: CSSProcessedPropsRegistry['native'];
  readonly web: CSSProcessedPropsRegistry['web'];
  protected registry: CSSPropertiesValidationRegistry;

  protected newCompatCategory<
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

  constructor(registry: CSSPropertiesValidationRegistry) {
    this.registry = registry;
    this.native = this.newCompatCategory<'native'>();
    this.web = this.newCompatCategory<'web'>();
  }

  private normalize(reg: CSSProperties): CSSProperties {
    return reg;
  }

  private assembleDisplayCategory(
    base: CSSDisplayRegistry,
    category: CSSPropertyDisplayCategory
  ) {
    return {
      retain: this.normalize(base[category].retain),
      flow: this.normalize(base[category].flow)
    };
  }

  private assembleCompatCategory(compat: CSSPropertyCompatCategory) {
    return {
      block: this.assembleDisplayCategory(this[compat], 'block'),
      text: this.assembleDisplayCategory(this[compat], 'text')
    };
  }

  protected registerProperty(
    propertyName: string,
    propertyValue: any,
    {
      compatCategory,
      displayCategory,
      propagationCategory
    }: Pick<
      CSSPropertyValidator,
      'compatCategory' | 'displayCategory' | 'propagationCategory'
    >
  ) {
    (this[compatCategory][displayCategory][propagationCategory] as any)[
      propertyName
    ] = propertyValue;
  }

  public exec(): CSSProcessedPropsRegistry {
    return {
      native: this.assembleCompatCategory('native'),
      web: this.assembleCompatCategory('web')
    };
  }
}
