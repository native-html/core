import { collapse } from './collapse';
import { hoist } from './hoist';
import { parseHtml } from './parse-html';
import { translateDocument } from './translate';
import { TDocument } from '../tree/TDocument';

export async function asssembleTDocument(html: string): Promise<TDocument> {
  const documentTree = await parseHtml(html);
  const tdoc = translateDocument(documentTree);
  return collapse(hoist(tdoc)) as TDocument;
}
