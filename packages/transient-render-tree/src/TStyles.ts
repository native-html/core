import CSCProcessor, {
  CSSPropertiesRegistry,
  defaultCSSProcessorConfig
} from '@native-html/css-processor';

const processor = new CSCProcessor(defaultCSSProcessorConfig);

const emptyRegistry: CSSPropertiesRegistry = Object.freeze({});

/**
 * A cheap merge method using prototype inheritance.
 *
 * @param child
 * @param parent
 */
function inherit(
  child: CSSPropertiesRegistry | undefined,
  parent: CSSPropertiesRegistry | undefined
) {
  if (!child && !parent) {
    return emptyRegistry;
  }
  let childDescriptor: any = {};
  const safeChild: CSSPropertiesRegistry = child || emptyRegistry;
  for (const key of Object.keys(child || emptyRegistry)) {
    childDescriptor[key] = { value: safeChild[key], writable: true };
  }
  return Object.create(parent || emptyRegistry, childDescriptor);
}

export class TStyles {
  public readonly nativeTextFlow: CSSPropertiesRegistry;
  public readonly nativeBlockFlow: CSSPropertiesRegistry;
  public readonly webTextFlow: CSSPropertiesRegistry;
  public readonly nativeTextRet: CSSPropertiesRegistry;
  public readonly nativeBlockRet: CSSPropertiesRegistry;
  constructor(inlineStyles: string | undefined, parentStyles?: TStyles | null) {
    const processedProps = inlineStyles
      ? processor.compileCss(inlineStyles)
      : null;
    this.nativeTextFlow = inherit(
      processedProps?.native.text.flow,
      parentStyles?.nativeTextFlow
    );
    this.nativeBlockFlow = inherit(
      processedProps?.native.block.flow,
      parentStyles?.nativeBlockFlow
    );
    this.webTextFlow = inherit(
      processedProps?.web.text.flow,
      parentStyles?.webTextFlow
    );
    this.nativeTextRet = processedProps?.native.text.retain || emptyRegistry;
    this.nativeBlockRet = processedProps?.native.block.retain || emptyRegistry;
  }
}
