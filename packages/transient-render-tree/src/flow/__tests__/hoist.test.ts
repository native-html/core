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
      tagName: 'a',
      attributes: { href }, // Should preserve attributes in TBlock
      children: [
        {
          type: 'phrasing',
          isAnchor: true,
          tagName: null,
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
          tagName: null,
          attributes: {},
          href
        }
      ]
    });
    expect(hoistedTree).toMatchSnapshot();
  });
  it('should preserve styles of encompassing blocks', () => {
    const tdoc = makeTTree(
      '<a href="http://google.fr"><div style="background-color: red;"></div></a>'
    );
    const tdiv = tdoc.children[0];
    expect(tdiv).toMatchObject({
      type: 'block',
      tagName: 'div'
    });
    expect(tdoc.children).toHaveLength(1);
    expect(tdiv.styles.nativeBlockRet.backgroundColor).toBe('red');
  });
});
