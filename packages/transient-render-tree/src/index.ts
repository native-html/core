export * from './assemble';
export type { StylesConfig } from './styles/types';
export type { TDocument, DocumentContext } from './tree/TDocument';
export type { TBlock } from './tree/TBlock';
export type { TNode } from './tree/TNode';
export type { TText } from './tree/TText';
export type { TPhrasing } from './tree/TPhrasing';
export type { TEmpty } from './tree/TEmpty';
export { assembleTTree as default } from './assemble';