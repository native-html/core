import { translateNode } from '../translate';
import { parseHtml } from '../parse-html';
import { imgSrc, rfc002Source, href } from './shared';
import { hoist } from '../hoist';
import { TNode } from '../../tree/TNode';

async function makeTTree(source: string) {
  const documentTree = await parseHtml(source);
  const ttree = translateNode(documentTree[0]);
  return hoist(ttree as TNode);
}

describe('hoist function', () => {
  it('should comply with RFC002 example (hoisting) ', async () => {
    const hoistedTree = await makeTTree(rfc002Source);
    expect(hoistedTree).toMatchObject({
      type: 'block',
      isAnchor: false,
      attributes: { href }, // Should preserve attributes in TBlock
      children: [
        {
          type: 'phrasing',
          isAnchor: true,
          href,
          attributes: {}
        },
        {
          type: 'block',
          isAnchor: true,
          tagName: 'img',
          href,
          attributes: {
            src: imgSrc
          }
        },
        {
          type: 'phrasing',
          isAnchor: true,
          attributes: {},
          href
        }
      ]
    });
    expect(hoistedTree).toMatchSnapshot();
  });
});
