import {
  CSSProperties,
  CSSProcessedPropsRegistry
} from '@native-html/css-processor';

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
  let childDescriptor: any = {};
  for (const key of Object.keys(child)) {
    childDescriptor[key] = { value: child[key], writable: true };
  }
  return Object.create(parent, childDescriptor);
}

export class TStyles {
  public readonly nativeTextFlow: CSSProcessedPropsRegistry['native']['text']['flow'];
  public readonly nativeBlockFlow: CSSProcessedPropsRegistry['native']['block']['flow'];
  public readonly nativeTextRet: CSSProcessedPropsRegistry['native']['text']['retain'];
  public readonly nativeBlockRet: CSSProcessedPropsRegistry['native']['block']['retain'];
  public readonly webTextFlow: CSSProcessedPropsRegistry['web']['text']['flow'];
  constructor(
    ownProcessedProps: CSSProcessedPropsRegistry,
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
}
