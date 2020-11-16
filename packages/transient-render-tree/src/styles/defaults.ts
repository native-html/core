import { StylesConfig } from './types';

export const defaultStylesConfig: Required<StylesConfig> = {
  classesStyles: {},
  enableCSSInlineProcessing: true,
  enableUserAgentStyles: false,
  idsStyles: {},
  tagsStyles: {},
  baseStyle: {
    fontSize: 14,
    whiteSpace: 'normal'
  }
};
