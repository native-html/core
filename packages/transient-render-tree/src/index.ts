export type { StylesConfig, MixedStyleRecord } from './styles/types';
export type { DocumentContext } from './tree/TDocument';
export { TDocument } from './tree/TDocument';
export { TBlock } from './tree/TBlock';
export { TNode } from './tree/TNode';
export { TText } from './tree/TText';
export { TPhrasing } from './tree/TPhrasing';
export { TEmpty } from './tree/TEmpty';
export type {
  SerializableElement,
  SerializableNode,
  SerializableText
} from './dom/to-serializable';
export {
  isSerializableElement,
  isSerializableText
} from './dom/to-serializable';
export {
  Node as DOMNode,
  Text as DOMText,
  Element as DOMElement
} from 'domhandler';
export { TTreeBuilder } from './TTreeBuilder';
export type { TTreeBuilderOptions } from './TTreeBuilder';
