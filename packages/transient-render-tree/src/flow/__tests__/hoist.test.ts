import { imgSrc, rfc002Source, href } from './shared';
import { hoist } from '../hoist';
import { translateTreeTest } from './utils';

function makeTTree(source: string) {
  return hoist(translateTreeTest(source));
}

describe('hoist function', () => {
  it('should comply with RFC002 example (hoisting) ', () => {
    const hoistedTree = makeTTree(rfc002Source);
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
