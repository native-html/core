import { TNode } from './tree/TNode';
import { TText } from './tree/TText';

function tnodePropertiesString(tnode: TNode) {
  const tagPrint = tnode.tagName ? `tag=${tnode.tagName}` : 'anonymous';
  const idPrint = tnode.id ? `id=${tnode.id}` : null;
  const classesPrint = tnode.className ? `classes=${tnode.className}` : null;
  const dataPrint =
    tnode instanceof TText
      ? `data[${
          tnode.data.length > 24
            ? JSON.stringify(tnode.data.substring(0, 24)) + '…'
            : JSON.stringify(tnode.data)
        }]`
      : null;
  // @ts-ignore
  const anchorPrint = tnode.isAnchor ? `anchor[${tnode.href}]` : null;
  const detailsPrint = [tagPrint, idPrint, classesPrint, dataPrint, anchorPrint]
    .filter((p) => p !== null)
    .join(',');
  return `•${tnode.displayName}(${detailsPrint})`;
}

interface TNodePrintState {
  parentLeftPrefix: string;
  isChild: boolean;
  isLast: boolean;
}

export default function tnodeToString(
  tnode: TNode,
  {
    parentLeftPrefix = '',
    isChild = false,
    isLast = false
  }: Partial<TNodePrintState> = {}
) {
  const prefix = isChild ? (isLast ? '└─' : '├─') : '';
  const totalPrefixLeft = parentLeftPrefix + prefix;
  const childrenPrint: string = tnode.children
    .map((c, i) =>
      tnodeToString(c, {
        parentLeftPrefix:
          parentLeftPrefix +
          ' '.padStart(prefix.length, isChild && isLast ? ' ' : '│'),
        isChild: true,
        isLast: i === tnode.children.length - 1
      })
    )
    .join('');
  return `${totalPrefixLeft}${tnodePropertiesString(tnode)}\n${childrenPrint}`;
}
