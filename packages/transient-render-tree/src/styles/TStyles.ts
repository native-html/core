import { CSSProperties, CSSProcessedProps } from '@native-html/css-processor';

/**
 * A cheap merge method using prototype inheritance.
 *
 * @param child
 * @param parent
 */
function inheritProperties(
  child: CSSProperties,
  parent: CSSProperties | undefined
) {
  if (!parent) {
    return child;
  }
  return {
    ...parent,
    ...child
  };
}

export class TStyles {
  public readonly nativeTextFlow: CSSProcessedProps['native']['text']['flow'];
  public readonly nativeBlockFlow: CSSProcessedProps['native']['block']['flow'];
  public readonly nativeTextRet: CSSProcessedProps['native']['text']['retain'];
  public readonly nativeBlockRet: CSSProcessedProps['native']['block']['retain'];
  public readonly webTextFlow: CSSProcessedProps['web']['text']['flow'];
  constructor(
    ownProcessedProps: CSSProcessedProps,
    parentStyles?: TStyles | null
  ) {
    this.nativeTextFlow = inheritProperties(
      ownProcessedProps.native.text.flow,
      parentStyles?.nativeTextFlow
    );
    this.nativeBlockFlow = inheritProperties(
      ownProcessedProps.native.block.flow,
      parentStyles?.nativeBlockFlow
    );
    this.webTextFlow = inheritProperties(
      ownProcessedProps.web.text.flow,
      parentStyles?.webTextFlow
    );
    this.nativeTextRet = ownProcessedProps.native.text.retain;
    this.nativeBlockRet = ownProcessedProps.native.block.retain;
  }

  static empty(): TStyles {
    return new TStyles(new CSSProcessedProps());
  }
}
