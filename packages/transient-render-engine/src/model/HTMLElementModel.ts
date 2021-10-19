/* eslint-disable no-dupe-class-members */
import { MixedStyleDeclaration } from '@native-html/css-processor';
import { ReactNativePropsDefinitions } from '../helper-types';
import { SetMarkersForTNode } from '../tree/tree-types';
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

/**
 * An object to specify custom tags.
 *
 * @typeParam T - The name of the tag to which the model will apply.
 * @typeParam M - The {@link HTMLContentModel} associated with this tag.
 */
export interface HTMLElementModelProperties<
  T extends string,
  M extends HTMLContentModel
> extends ElementModelBase<T> {
  /**
   * The {@link HTMLContentModel} attached to this model.
   */
  readonly contentModel: M;
  /**
   * `true` when the associated tag is a {@link https://html.spec.whatwg.org/multipage/syntax.html#void-elements | void element}.
   *
   * @remarks
   *
   * - Void elements cannot have children.
   * - TText-translated void elements will be preserved even though they don't
   *   have children.
   */
  readonly isVoid: boolean;
}

/**
 * An object defining engine internals for tags, such as default styles
 * (UAStyles), content model (how this tag is treated during hoisting)... etc.
 *
 * @typeParam T - The name of the tag to which the model will apply.
 * @typeParam M - The {@link HTMLContentModel} associated with this tag.
 */
export default class HTMLElementModel<
  T extends string,
  M extends HTMLContentModel
> implements HTMLElementModelProperties<T, M>
{
  /**
   * The tag name associated with this model.
   */
  public readonly tagName: T;
  /**
   * The {@link HTMLContentModel} attached to this model.
   */
  public readonly contentModel: M;
  /**
   * An opaque element translated {@link TNode} will have no translated {@link TNode}
   * children.
   */
  public readonly isOpaque: boolean;
  /**
   * `true` when the associated tag is a {@link https://html.spec.whatwg.org/multipage/syntax.html#void-elements | void element}.
   *
   * @remarks
   *
   * - Void elements cannot have children.
   * - TText-translated void elements will be preserved even though they don't
   *   have children.
   */
  public readonly isVoid: boolean;
  /**
   * Equivalent of "user-agent" styles. The default styles for the element.
   *
   * @remarks These styles will be merged over by `tagsStyles`.
   */
  public readonly mixedUAStyles?: MixedStyleDeclaration;
  /**
   * Default react Native props to pass to renderers.
   *
   * @remarks Some props might be overriden by props derived from the
   * {@link TNode} attributes. For example, if you pass `accessibilityLabel`
   * and there is an `aria-label` attribute attached to one node, the
   * `aria-label` will be used. If you want to be able to override the
   * `aria-label`, use {@link getReactNativeProps} instead.
   */
  readonly reactNativeProps?: ReactNativePropsDefinitions;
  /**
   * A function to create conditional "user-agent" styles.
   *
   * @remarks For example, &lt;a&gt; tags will have underline decoration and be
   * colored blue only when `href` is defined.
   *
   * @deprecated Use {@link HTMLElementModel.getMixedUAStyles} instead.
   */
  public readonly getUADerivedStyleFromAttributes: NativeElementModel['getUADerivedStyleFromAttributes'];
  /**
   * A function to create conditional "user-agent" styles.
   *
   * @remarks For example, &lt;a&gt; tags will have underline decoration and be
   * colored blue only when `href` is defined.
   */
  public readonly getMixedUAStyles: NativeElementModel['getMixedUAStyles'];

  /**
   * A function to create conditional React Native props for a specific TNode.
   * Those props will be deep-merged over the pre-generated props. You can
   * preserve some of the pre-generated props since you receive them as second
   * argument.
   *
   * **Merge strategy** (rightmost overrides leftmost): _static props from model_,
   * _auto-generated props from attributes_, _props returned by this function_.
   *
   * @param tnode - The TNode for which to create React Native props.
   * @param preGeneratedProps - The props that were pre-generated for the TNode
   * based on attributes (style, aria-* ...) and
   * {@link HTMLELementModel.reactNativeProps}.
   */
  public readonly getReactNativeProps: NativeElementModel['getReactNativeProps'];

  /**
   * Derive markers for one TNode.
   */
  public readonly setMarkersForTNode?: SetMarkersForTNode;

  private constructor({
    tagName,
    contentModel,
    isOpaque,
    mixedUAStyles,
    isVoid,
    getUADerivedStyleFromAttributes,
    getMixedUAStyles,
    setMarkersForTNode,
    getReactNativeProps,
    reactNativeProps
  }: HTMLElementModelProperties<T, M>) {
    this.tagName = tagName;
    this.contentModel = contentModel;
    this.isOpaque = isOpaque || false;
    this.isVoid = isVoid;
    this.mixedUAStyles = mixedUAStyles;
    this.getUADerivedStyleFromAttributes = getUADerivedStyleFromAttributes;
    this.getMixedUAStyles = getMixedUAStyles;
    this.setMarkersForTNode = setMarkersForTNode;
    this.getReactNativeProps = getReactNativeProps;
    this.reactNativeProps = reactNativeProps;
  }

  /**
   * Create an {@link HTMLElementModel} from a custom description.
   *
   * @param customElementModel - The custom model declaration.
   */
  static fromCustomModel<
    CustomTags extends string,
    ContentModel extends HTMLContentModel
  >(
    customElementModel: CustomElementModel<
      Exclude<CustomTags, TagName>,
      ContentModel
    >
  ) {
    const {
      contentModel,
      tagName,
      isOpaque = false,
      isVoid = false,
      ...optionalFields
    } = customElementModel;
    return new HTMLElementModel<Exclude<CustomTags, TagName>, ContentModel>({
      tagName,
      contentModel,
      isOpaque,
      isVoid,
      ...optionalFields
    });
  }

  /**
   * Create an {@link HTMLElementModel} from a native description.
   *
   * @param nativeElementModel - The native model declaration.
   */
  static fromNativeModel<TN extends TagName, E extends ElementCategory>(
    nativeElementModel: NativeElementModel<TN, E>
  ) {
    const {
      category,
      isOpaque,
      isVoid = false,
      ...otherProps
    } = nativeElementModel;
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
      TN,
      E extends 'edits' | 'anchor'
        ? HTMLContentModel.mixed
        : E extends 'sectioning' | 'grouping' | 'tabular'
        ? HTMLContentModel.block
        : E extends 'textual'
        ? HTMLContentModel.textual
        : HTMLContentModel.none
    >({
      isVoid,
      contentModel: contentModel as any,
      isOpaque: isOpaque ?? category === 'embedded',
      ...otherProps
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

  /**
   * Create a new {@link HTMLElementModel} by shallow-merging properties into this model.
   *
   * @param merger - A function to generate the new properties to shallow-merge into this model.
   * @typeParam CM - The {@link HTMLContentModel} attached to the new model.
   */
  extend<CM extends HTMLContentModel>(
    merger: (
      properties: HTMLElementModelProperties<T, CM>
    ) => Partial<HTMLElementModelProperties<T, CM>>
  ): HTMLElementModel<T, CM>;
  /**
   * Create a new {@link HTMLElementModel} by shallow-merging properties into this model.
   *
   * @param properties - The {@link HTMLElementModelProperties} to shallow-merge into this model.
   * @typeParam CM - The {@link HTMLContentModel} attached to the new model.
   */
  extend<CM extends HTMLContentModel>(
    properties: Partial<HTMLElementModelProperties<T, CM>>
  ): HTMLElementModel<T, CM>;
  extend<CM extends HTMLContentModel>(
    arg:
      | ((
          fields: HTMLElementModel<T, M>
        ) => Partial<HTMLElementModelProperties<T, CM>>)
      | Partial<HTMLElementModelProperties<T, CM>>
  ): HTMLElementModel<T, CM> {
    const properties = typeof arg === 'function' ? arg(this) : arg;
    return new HTMLElementModel<T, CM>({
      ...this,
      ...properties
    });
  }
}
