import { MixedStyleDeclaration } from '@native-html/css-processor';

export interface StylesConfig {
  /**
   * Custom styles for tags.
   *
   * @remarks Tags styles have a specificity of 1, in compliance with the CSS
   * standard.
   */
  readonly tagsStyles?: Readonly<Record<string, MixedStyleDeclaration>>;
  /**
   * Styles from classes.
   *
   * @remarks Classes styles have a specificity of 10, in compliance with the
   * CSS standard.
   */
  readonly classesStyles?: Readonly<Record<string, MixedStyleDeclaration>>;
  /**
   * Styles from ids.
   *
   * @remarks Ids styles have a specificity of 100, in compliance with the
   * CSS standard.
   */
  readonly idsStyles?: Readonly<Record<string, MixedStyleDeclaration>>;
  /**
   * Enable or disable inline styles.
   *
   * @defaultvalue true
   */
  readonly enableCSSInlineProcessing: boolean;
  /**
   * Enable or disable default styles for tags.
   *
   * @defaultValue false
   */
  readonly enableUserAgentStyles: boolean;
}
