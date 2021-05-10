import { MixedStyleDeclaration } from '@native-html/css-processor';
import { Markers, SetMarkersForTNode } from '../tree/tree-types';
import HTMLContentModel from './HTMLContentModel';
import {
  CustomElementModel,
  ElementCategory,
  ElementModelBase,
  NativeElementModel,
  TagName
} from './model-types';

const phrasingCategories: ElementCategory[] = ['textual', 'edits', 'anchor'];
const translatableBlockCategories: ElementCategory[] = [
  'tabular',
  'grouping',
  'sectioning'
];

export interface HTMLElementModelProperties<
  T extends string,
  M extends HTMLContentModel
> extends ElementModelBase<T> {
  readonly contentModel: M;
  readonly isVoid: boolean;
}

/**
 * An object defining engine internals for tags, such as default styles
 * (UAStyles), content model (how this tag is treated during hoisting)... etc.
 */
export default class HTMLElementModel<
  T extends string,
  M extends HTMLContentModel
> implements HTMLElementModelProperties<T, M> {
  public readonly tagName: T;
  public readonly contentModel: M;
  public readonly isOpaque: boolean;
  public readonly isVoid: boolean;
  public readonly mixedUAStyles?: MixedStyleDeclaration;
  public readonly getUADerivedStyleFromAttributes: NativeElementModel['getUADerivedStyleFromAttributes'];
  public readonly setMarkersForTNode?: SetMarkersForTNode;

  private constructor({
    tagName,
    contentModel,
    isOpaque,
    mixedUAStyles,
    isVoid,
    getUADerivedStyleFromAttributes,
    setMarkersForTNode
  }: HTMLElementModelProperties<T, M>) {
    this.tagName = tagName;
    this.contentModel = contentModel;
    this.isOpaque = isOpaque || false;
    this.isVoid = isVoid;
    this.mixedUAStyles = mixedUAStyles;
    this.getUADerivedStyleFromAttributes = getUADerivedStyleFromAttributes;
    this.setMarkersForTNode = setMarkersForTNode;
  }

  static fromCustomModel<T extends string, M extends HTMLContentModel>({
    contentModel,
    tagName,
    isOpaque = false,
    isVoid = false,
    ...optionalFields
  }: CustomElementModel<Exclude<T, TagName>, M>) {
    return new HTMLElementModel<Exclude<T, TagName>, M>({
      tagName,
      contentModel,
      isOpaque,
      isVoid,
      ...optionalFields
    });
  }

  static fromNativeModel<T extends TagName, E extends ElementCategory>({
    tagName,
    category,
    isOpaque,
    mixedUAStyles,
    isVoid = false,
    getUADerivedStyleFromAttributes,
    setMarkersForTNode: getMarkersForTNode
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
        : E extends 'sectioning' | 'grouping' | 'tabular'
        ? HTMLContentModel.block
        : E extends 'textual'
        ? HTMLContentModel.textual
        : HTMLContentModel.none
    >({
      tagName,
      isVoid,
      contentModel: contentModel as any,
      mixedUAStyles,
      isOpaque: isOpaque ?? category === 'embedded',
      getUADerivedStyleFromAttributes,
      setMarkersForTNode: getMarkersForTNode
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
    attributes: Record<string, string>,
    markers: Markers
  ): MixedStyleDeclaration | null {
    if (this.getUADerivedStyleFromAttributes) {
      return this.getUADerivedStyleFromAttributes(attributes, markers);
    }
    return null;
  }
}
