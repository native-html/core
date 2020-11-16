import { MixedStyleDeclaration } from '@native-html/css-processor';

export type MixedStyleRecord<T extends string = string> = Readonly<
  Record<T, MixedStyleDeclaration>
>;

export interface StylesConfig {
  /**
   * Custom styles for tags.
   *
   * @remarks Tags styles have a specificity of 1, in compliance with the CSS
   * standard.
   */
  readonly tagsStyles?: MixedStyleRecord;
  /**
   * Styles from classes.
   *
   * @remarks Classes styles have a specificity of 10, in compliance with the
   * CSS standard.
   */
  readonly classesStyles?: MixedStyleRecord;
  /**
   * Styles from ids.
   *
   * @remarks Ids styles have a specificity of 100, in compliance with the
   * CSS standard.
   */
  readonly idsStyles?: MixedStyleRecord;
  /**
   * Style for the root element. Inheritable properties will be transferred
   * recursively to child nodes, including text styles.
   *
   * @remarks Non-inheritable properties will be ignored.
   */
  readonly baseStyle?: Readonly<MixedStyleDeclaration>;
  /**
   * Enable or disable inline styles.
   *
   * @defaultvalue true
   */
  readonly enableCSSInlineProcessing?: boolean;
  /**
   * Enable or disable default styles for tags.
   *
   * @defaultValue false
   */
  readonly enableUserAgentStyles?: boolean;
}
