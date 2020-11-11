import { collapse } from './collapse';
import { hoist } from './hoist';
import { translateDocument } from './translate';
import { TDocument } from '../tree/TDocument';
import { parseDOM } from 'htmlparser2';

export function asssembleTDocument(html: string): TDocument {
  const documentTree = parseDOM(html);
  const tdoc = translateDocument(documentTree);
  return collapse(hoist(tdoc)) as TDocument;
}
