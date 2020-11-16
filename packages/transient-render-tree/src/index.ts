export * from './assemble';
export type { StylesConfig, MixedStyleRecord } from './styles/types';
export type { TDocument, DocumentContext } from './tree/TDocument';
export type { TBlock } from './tree/TBlock';
export type { TNode } from './tree/TNode';
export type { TText } from './tree/TText';
export type { TPhrasing } from './tree/TPhrasing';
export type { TEmpty } from './tree/TEmpty';
export type {
  SerializableElement,
  SerializableNode,
  SerializableText
} from './dom/to-serializable';
export {
  isSerializableElement,
  isSerializableText
} from './dom/to-serializable';
export { assembleTTree as default } from './assemble';
