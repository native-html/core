import { MixedStyleDeclaration } from '@native-html/css-processor';
import HTMLContentModel from './HTMLContentModel';
import {
  CustomElementModel,
  ElementCategory,
  NativeElementModel,
  TagName
} from './model-types';

const phrasingCategories: ElementCategory[] = ['textual', 'edits', 'anchor'];
const translatableBlockCategories: ElementCategory[] = [
  'embedded',
  'tabular',
  'grouping',
  'sectioning'
];

export interface HTMLElementModelProperties<T extends string> {
  readonly tagName: T;
  readonly contentModel: HTMLContentModel;
  readonly isTranslatable: boolean;
  readonly isOpaque: boolean;
  readonly isVoid: boolean;
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
  public readonly contentModel: HTMLContentModel;
  public readonly isTranslatable: boolean;
  public readonly isOpaque: boolean;
  public readonly isVoid: boolean;
  public readonly mixedUAStyles?: MixedStyleDeclaration;
  public readonly getUADerivedStyleFromAttributes: NativeElementModel['getUADerivedStyleFromAttributes'];

  private constructor({
    tagName,
    contentModel,
    isTranslatable,
    isOpaque,
    isVoid,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: HTMLElementModelProperties<T>) {
    this.tagName = tagName;
    this.contentModel = contentModel;
    this.isTranslatable = isTranslatable;
    this.isOpaque = isOpaque;
    this.isVoid = isVoid;
    this.mixedUAStyles = mixedUAStyles;
    this.getUADerivedStyleFromAttributes = getUADerivedStyleFromAttributes;
  }

  static fromCustomModel<T extends string>({
    contentModel,
    tagName,
    isOpaque = false,
    ...optionalFields
  }: CustomElementModel<T>) {
    return new HTMLElementModel<Exclude<T, TagName>>({
      tagName,
      contentModel,
      isOpaque,
      isTranslatable: true,
      isVoid: false,
      ...optionalFields
    });
  }
  static fromNativeModel<T extends TagName>({
    tagName,
    category,
    isOpaque,
    isVoid,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: NativeElementModel<T, ElementCategory>) {
    const isPhrasing = phrasingCategories.indexOf(category) !== -1;
    const contentModel =
      category === 'anchor'
        ? HTMLContentModel.mixed
        : isPhrasing
        ? HTMLContentModel.textual
        : HTMLContentModel.block;
    const isTranslatable =
      contentModel !== HTMLContentModel.block ||
      translatableBlockCategories.indexOf(category) !== -1;
    return new HTMLElementModel<T>({
      tagName,
      contentModel,
      isTranslatable,
      isVoid: isVoid || false,
      mixedUAStyles,
      isOpaque: isOpaque ?? category === 'embedded',
      getUADerivedStyleFromAttributes
    });
  }

  isTranslatableBlock(): boolean {
    return this.isTranslatable && this.contentModel === HTMLContentModel.block;
  }

  isTranslatableTextual() {
    return (
      this.contentModel === HTMLContentModel.textual ||
      this.contentModel === HTMLContentModel.mixed
    );
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
