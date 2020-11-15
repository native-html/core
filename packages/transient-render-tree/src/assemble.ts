import { collapse } from './flow/collapse';
import { hoist } from './flow/hoist';
import { translateDocument } from './flow/translate';
import { TDocument } from './tree/TDocument';
import { parseDOM, ParserOptions } from 'htmlparser2';
import { CSSProcessorConfig } from '@native-html/css-processor';
import { StylesConfig } from './styles/types';
import { TStylesMerger } from './styles/TStylesMerger';
import { defaultStylesConfig } from './styles/defaults';
import { TStyles } from './styles/TStyles';

export interface AssembleTTreeOptions {
  /**
   * Customization for CSS inline processing.
   */
  readonly cssProcessorConfig?: CSSProcessorConfig;
  /**
   * Options for htmlparser2 library parser.
   */
  readonly htmlParserOptions?: Readonly<ParserOptions>;
  /**
   * Various configuration for styling.
   */
  readonly stylesConfig?: StylesConfig;
}

export function assembleTTree(
  html: string,
  options?: AssembleTTreeOptions
): TDocument {
  const documentTree = parseDOM(html, {
    decodeEntities: true,
    ...options?.htmlParserOptions
  });
  const stylesConfig: Required<StylesConfig> = {
    ...defaultStylesConfig,
    ...options?.stylesConfig,
    baseStyles: {
      ...defaultStylesConfig.baseStyles,
      ...options?.stylesConfig?.baseStyles
    }
  };
  const stylesMerger = new TStylesMerger(
    stylesConfig,
    options?.cssProcessorConfig
  );
  const tdoc = translateDocument(documentTree, {
    stylesMerger: stylesMerger,
    baseStyles: new TStyles(
      stylesMerger.compileStyleDeclaration(stylesConfig.baseStyles)
    )
  });
  return collapse(hoist(tdoc)) as TDocument;
}
