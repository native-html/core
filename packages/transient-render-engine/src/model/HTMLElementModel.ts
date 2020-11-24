import { MixedStyleDeclaration } from '@native-html/css-processor';
import { ElementCategory, TagName } from './model-types';

export type CustomElementModel = ElementModelBase<string, 'custom'>;

export interface ElementModelBase<T = TagName, C = ElementCategory> {
  tagName: T;
  category: C;
  /**
   * An opaque element children should not be translated. Instead, a reference
   * to the dom node children should be used for rendering. Example: SVG, MathML...
   */
  isOpaque?: boolean;
  /**
   * Void elements such as specified in HTML4. Void elements cannot have children.
   */
  isVoid?: boolean;
  /**
   * Equivalent of "user-agent" styles.
   */
  mixedUAStyles?: MixedStyleDeclaration;
  /**
   * For example, "width" and "height" attributes for &lt;img&gt; tags.
   */
  getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}

const phrasingCategories: ElementCategory[] = ['textual', 'edits'];
const translatableBlockCategories: ElementCategory[] = [
  'embedded',
  'tabular',
  'grouping',
  'sectioning',
  'custom'
];

export interface HTMLElementModelProperties<T extends string> {
  readonly tagName: T;
  readonly isOpaque: boolean;
  readonly isPhrasing: boolean;
  readonly isVoid: boolean;
  readonly isTranslatableBlock: boolean;
  readonly mixedUAStyles?: MixedStyleDeclaration;
  /**
   * For example, "width" and "height" attributes for &lt;img&gt; tags.
   */
  readonly getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}

export default class HTMLElementModel<T extends string>
  implements HTMLElementModelProperties<T> {
  public readonly tagName: T;
  public readonly isOpaque: boolean;
  public readonly isPhrasing: boolean;
  public readonly isVoid: boolean;
  public readonly isTranslatableBlock: boolean;
  public readonly mixedUAStyles?: MixedStyleDeclaration;
  public readonly getUADerivedStyleFromAttributes: ElementModelBase['getUADerivedStyleFromAttributes'];

  private constructor({
    tagName,
    isOpaque,
    isPhrasing,
    isVoid,
    isTranslatableBlock,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: HTMLElementModelProperties<T>) {
    this.tagName = tagName;
    this.isOpaque = isOpaque;
    this.isPhrasing = isPhrasing;
    this.isVoid = isVoid;
    this.isTranslatableBlock = isTranslatableBlock;
    this.mixedUAStyles = mixedUAStyles;
    this.getUADerivedStyleFromAttributes = getUADerivedStyleFromAttributes;
  }

  static fromModelBase<T extends string>({
    tagName,
    category,
    isOpaque,
    isVoid,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: ElementModelBase<T, ElementCategory>) {
    const isPhrasing = phrasingCategories.indexOf(category) !== -1;
    return new HTMLElementModel<T>({
      tagName,
      isVoid: isVoid || false,
      mixedUAStyles,
      isOpaque: isOpaque ?? category === 'embedded',
      isPhrasing: isPhrasing,
      isTranslatableBlock: translatableBlockCategories.indexOf(category) !== -1,
      getUADerivedStyleFromAttributes
    });
  }

  extend(props: Partial<HTMLElementModelProperties<T>>): HTMLElementModel<T> {
    return new HTMLElementModel({
      ...this,
      ...props
    });
  }

  getUADerivedCSSProcessedPropsFromAttributes(
    attributes: Record<string, string>
  ): MixedStyleDeclaration | null {
    if (this.getUADerivedStyleFromAttributes) {
      return this.getUADerivedStyleFromAttributes(attributes);
    }
    return null;
  }
}
