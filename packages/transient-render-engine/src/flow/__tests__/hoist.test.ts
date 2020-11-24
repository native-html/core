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
      tagName: 'a',
      attributes: { href },
      children: [
        {
          type: 'phrasing',
          tagName: null,
          attributes: {}
        },
        {
          type: 'block',
          tagName: 'img',
          attributes: {
            src: imgSrc
          }
        },
        {
          type: 'phrasing',
          tagName: null,
          attributes: {}
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
  it('should preserve text of encompassing blocks', () => {
    const tdoc = makeTTree(
      '<a href="http://google.fr"><div>This is text!</div></a>'
    );
    expect(tdoc).toMatchObject({
      type: 'block',
      tagName: 'a',
      children: [
        {
          type: 'block',
          tagName: 'div',
          children: [
            {
              type: 'phrasing',
              tagName: null,
              children: [
                {
                  type: 'text',
                  tagName: null,
                  data: 'This is text!'
                }
              ]
            }
          ]
        }
      ]
    });
    expect(tdoc.children).toHaveLength(1);
  });
});
