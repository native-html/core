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

export interface HTMLElementModelProperties<
  T extends string,
  M extends HTMLContentModel
> {
  readonly tagName: T;
  readonly contentModel: M;
  readonly isOpaque: boolean;
  readonly mixedUAStyles?: MixedStyleDeclaration;
  /**
   * Examples:
   *
   * - "width" and "height" attributes for &lt;img&gt; tag;
   * - "cite" attribute for &lt;blockquote&gt; tag.
   */
  readonly getUADerivedStyleFromAttributes?: (
    attributes: Record<string, string>
  ) => MixedStyleDeclaration | null;
}

export default class HTMLElementModel<
  T extends string,
  M extends HTMLContentModel
> implements HTMLElementModelProperties<T, M> {
  public readonly tagName: T;
  public readonly contentModel: M;
  public readonly isOpaque: boolean;
  public readonly mixedUAStyles?: MixedStyleDeclaration;
  public readonly getUADerivedStyleFromAttributes: NativeElementModel['getUADerivedStyleFromAttributes'];

  private constructor({
    tagName,
    contentModel,
    isOpaque,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: HTMLElementModelProperties<T, M>) {
    this.tagName = tagName;
    this.contentModel = contentModel;
    this.isOpaque = isOpaque;
    this.mixedUAStyles = mixedUAStyles;
    this.getUADerivedStyleFromAttributes = getUADerivedStyleFromAttributes;
  }

  static fromCustomModel<T extends string, M extends HTMLContentModel>({
    contentModel,
    tagName,
    isOpaque = false,
    ...optionalFields
  }: CustomElementModel<Exclude<T, TagName>, M>) {
    return new HTMLElementModel<Exclude<T, TagName>, M>({
      tagName,
      contentModel,
      isOpaque,
      ...optionalFields
    });
  }

  static fromNativeModel<T extends TagName, E extends ElementCategory>({
    tagName,
    category,
    isOpaque,
    mixedUAStyles,
    getUADerivedStyleFromAttributes
  }: NativeElementModel<T, E>) {
    const isPhrasing = phrasingCategories.indexOf(category) !== -1;
    const isTranslatable =
      isPhrasing || translatableBlockCategories.indexOf(category) !== -1;
    const contentModel =
      category === 'anchor' || category === 'edits'
        ? HTMLContentModel.mixed
        : isPhrasing
        ? HTMLContentModel.textual
        : isTranslatable
        ? HTMLContentModel.block
        : HTMLContentModel.none;
    return new HTMLElementModel<
      T,
      E extends 'edits' | 'anchor'
        ? HTMLContentModel.mixed
        : E extends 'embedded' | 'sectioning' | 'grouping'
        ? HTMLContentModel.block
        : E extends 'textual'
        ? HTMLContentModel.textual
        : HTMLContentModel.none
    >({
      tagName,
      contentModel: contentModel as any,
      mixedUAStyles,
      isOpaque: isOpaque ?? category === 'embedded',
      getUADerivedStyleFromAttributes
    });
  }

  isTranslatableBlock(): boolean {
    return this.contentModel === HTMLContentModel.block;
  }

  isTranslatableTextual() {
    return (
      this.contentModel === HTMLContentModel.textual ||
      this.contentModel === HTMLContentModel.mixed
    );
  }

  extend<N extends HTMLContentModel>(
    props: Partial<HTMLElementModelProperties<T, N>>
  ): HTMLElementModel<T, N> {
    return new HTMLElementModel<T, N>({
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
