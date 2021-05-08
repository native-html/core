import { Document } from 'domhandler';
import { Parser, ParserOptions } from 'htmlparser2';
import DomHandler, { DomHandlerOptions } from './DomHandler';
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
export default function parseDocument(
  data: string,
  options: ParserOptions & DomHandlerOptions = {}
): Document {
  const handler = new DomHandler(options);
  new Parser(handler, options).end(data);
  return handler.root;
}
