function printTableStyles(styles = {}) {
  const allStyles = {
    ...styles.nativeTextFlow,
    ...styles.nativeBlockFlow,
    ...styles.webTextFlow,
    ...styles.nativeTextRet,
    ...styles.nativeBlockRet
  };
  const entries = Object.entries(allStyles);
  if (!entries) {
    return '';
  }
  return entries.reduce((prev, [name, val]) => {
    return `${prev}${prev ? ',' : ''} ${name}: ${val}`;
  }, '');
}

function tnodePropertiesString(tnode) {
  const tagPrint = tnode.tagName ? `tagName="${tnode.tagName}"` : 'anonymous';
  const idPrint = tnode.id ? `id=${tnode.id}` : null;
  const classesPrint = tnode.classes?.length
    ? `classes={[${tnode.classes.join(', ')}]}`
    : null;
  const dataPrint =
    tnode.type === 'text' ? `data=${JSON.stringify(tnode.data)}` : null;
  const anchorPrint =
    typeof tnode.attributes.href === 'string'
      ? `href="${tnode.attributes.href}"`
      : null;
  const pstyles = printTableStyles(tnode.styles);
  const stylesPrint = pstyles ? `styles={{${pstyles} }}` : null;
  const detailsPrint = [
    tagPrint,
    idPrint,
    classesPrint,
    dataPrint,
    anchorPrint,
    stylesPrint
  ]
    .filter((p) => p !== null)
    .join(' ');
  return `<${tnode.displayName} ${detailsPrint}`;
}

export default function serializeTNode(tnode, params = {}) {
  const { parentLeftPrefix = '', isChild = false, isLast = false } = params;
  const prefix = isChild ? '  ' : '';
  const totalPrefixLeft = parentLeftPrefix + prefix;
  const childrenPrint = tnode.children
    .map((c, i) =>
      serializeTNode(c, {
        parentLeftPrefix: parentLeftPrefix + ' '.padStart(prefix.length, ' '),
        isChild: true,
        isLast: i === tnode.children.length - 1
      })
    )
    .join('');
  return `${totalPrefixLeft}${tnodePropertiesString(tnode)}${
    childrenPrint
      ? `>\n${childrenPrint}\n${totalPrefixLeft}</${tnode.displayName}>`
      : ` />`
  }${isLast ? '' : '\n'}`;
}
