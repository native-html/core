import { imgSrc, rfc002Source, href } from './shared';
import { hoist } from '../hoist';
import { translateTreeTest } from './utils';

async function makeTTree(source: string) {
  return hoist(await translateTreeTest(source));
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
