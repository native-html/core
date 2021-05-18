import { CSSProperties, CSSProcessedProps } from '@native-html/css-processor';
import nil from 'ramda/src/isNil';
import not from 'ramda/src/not';
import compose from 'ramda/src/compose';

const notNil = compose(not, nil);
/**
 * A merge properties from left to right.
 *
 * @param child
 * @param parent
 */
function inheritProperties(
  ...properties: Array<CSSProperties | null | undefined>
): CSSProperties {
  const realProperties = properties.filter(notNil) as CSSProperties[];
  if (realProperties.length === 1) {
    return realProperties[0];
  }
  if (Object.keys(realProperties[0]).length === 0) {
    return realProperties[1];
  }
  return realProperties.reduce(
    (prev, curr) => ({ ...prev, ...curr }),
    Object.prototype as CSSProperties
  ) as CSSProperties;
}

/**
 * A record of styles organized in logical chunks:
 *
 * - wether they are supported in React Native (native) and others (web).
 * - wether they target native Views (block) or Text (text).
 * - wether they are inherited by this node's children (flow) or not (retain).
 *
 * @public
 */
export interface TStylesShape {
  readonly nativeTextFlow: CSSProcessedProps['native']['text']['flow'];
  readonly nativeBlockFlow: CSSProcessedProps['native']['block']['flow'];
  readonly nativeTextRet: CSSProcessedProps['native']['text']['retain'];
  readonly nativeBlockRet: CSSProcessedProps['native']['block']['retain'];
  readonly webTextFlow: CSSProcessedProps['web']['text']['flow'];
  readonly webBlockRet: CSSProcessedProps['web']['block']['retain'];
}

export class TStyles implements TStylesShape {
  public readonly nativeTextFlow: CSSProcessedProps['native']['text']['flow'];
  public readonly nativeBlockFlow: CSSProcessedProps['native']['block']['flow'];
  public readonly nativeTextRet: CSSProcessedProps['native']['text']['retain'];
  public readonly nativeBlockRet: CSSProcessedProps['native']['block']['retain'];
  public readonly webTextFlow: CSSProcessedProps['web']['text']['flow'];
  public readonly webBlockRet: CSSProcessedProps['web']['block']['retain'];

  constructor(
    ownProcessedProps: CSSProcessedProps,
    parentStyles?: TStyles | null
  ) {
    this.nativeTextFlow = inheritProperties(
      parentStyles?.nativeTextFlow,
      ownProcessedProps.native.text.flow
    );
    this.nativeBlockFlow = inheritProperties(
      parentStyles?.nativeBlockFlow,
      ownProcessedProps.native.block.flow
    );
    this.webTextFlow = inheritProperties(
      parentStyles?.webTextFlow,
      ownProcessedProps.web.text.flow
    );
    // In theory, we shouldn't merge those properties. However, these
    // properties being textDecoration*, we actually want children nodes to
    // inherit from them. A cleaner solution would be to to let each TNode
    // handle its merging logic, because only TPhrasing and TText nodes would
    // need to merge these.
    this.nativeTextRet = inheritProperties(
      parentStyles?.nativeTextRet,
      ownProcessedProps.native.text.retain
    );
    this.nativeBlockRet = ownProcessedProps.native.block.retain;
    this.webBlockRet = ownProcessedProps.web.block.retain;
  }

  static empty(): TStyles {
    return new TStyles(new CSSProcessedProps());
  }
}
