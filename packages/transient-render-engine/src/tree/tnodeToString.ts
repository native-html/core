import { TStyles } from '../styles/TStyles';
import { TNode, TNodePrintOptions } from './tree-types';

function printTableStyles(styles: TStyles) {
  const allStyles = {
    ...styles.nativeTextFlow,
    ...styles.nativeBlockFlow,
    ...styles.webTextFlow,
    ...styles.nativeTextRet,
    ...styles.nativeBlockRet
  };
  const entries = Object.entries(allStyles);
  return entries.reduce((prev, [name, val]) => {
    return `${prev}${prev ? ',' : ''} ${name}: ${JSON.stringify(val)}`;
  }, '');
}

function tnodePropertiesString(tnode: TNode, withStyles: boolean) {
  const tagPrint = tnode.tagName ? `tagName="${tnode.tagName}"` : 'anonymous';
  const unregisteredPrint = tnode.isUnregistered ? 'unregistered' : null;
  const indexPrint = `nodeIndex={${tnode.nodeIndex}}`;
  const idPrint = tnode.id ? `id=${tnode.id}` : null;
  const classesPrint = tnode.classes?.length
    ? `classes={[${tnode.classes.join(', ')}]}`
    : null;
  const dataPrint =
    tnode.type === 'text' ? `data=${JSON.stringify(tnode.data)}` : null;
  const anchorPrint =
    typeof tnode.attributes.href === 'string'
      ? `href=${JSON.stringify(tnode.attributes.href)}`
      : null;
  const srcPrint =
    typeof tnode.attributes.src === 'string'
      ? `src=${JSON.stringify(tnode.attributes.src)}`
      : null;
  const pstyles = withStyles ? printTableStyles(tnode.styles) : null;
  const stylesPrint = pstyles ? `styles={{${pstyles} }}` : null;
  const detailsPrint = [
    tagPrint,
    unregisteredPrint,
    indexPrint,
    idPrint,
    classesPrint,
    dataPrint,
    anchorPrint,
    srcPrint,
    stylesPrint
  ]
    .filter((p) => p !== null)
    .join(' ');
  return `<${tnode.displayName} ${detailsPrint}`;
}

interface TNodePrintState {
  parentLeftPrefix: string;
  isChild: boolean;
  isLast: boolean;
}

export default function serializeTNode(
  tnode: TNode,
  params: Partial<TNodePrintState & TNodePrintOptions> = {}
): string {
  const {
    parentLeftPrefix = '',
    isChild = false,
    isLast = false,
    withStyles = true,
    withNodeIndex = true,
  } = params;
  const prefix = isChild ? '  ' : '';
  const totalPrefixLeft = parentLeftPrefix + prefix;
  const childrenPrint = tnode.children
    .map((c, i) =>
      serializeTNode(c, {
        parentLeftPrefix: parentLeftPrefix + ' '.padStart(prefix.length, ' '),
        isChild: true,
        isLast: i === tnode.children.length - 1,
        withStyles,
        withNodeIndex
      })
    )
    .join('');
  return `${totalPrefixLeft}${tnodePropertiesString(tnode, withStyles)}${
    childrenPrint
      ? `>\n${childrenPrint}\n${totalPrefixLeft}</${tnode.displayName}>`
      : ' />'
  }${isLast ? '' : '\n'}`;
}
