import { imgSrc, rfc002Source, href } from './shared';
import { hoist } from '../hoist';
import { translateTreeTest } from './utils';
import { TNodeImpl } from '../../tree/tree-types';

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
  it('should hoist multiple blocks', () => {
    const hoistedTree = makeTTree('<span><div></div>Hello<img /></span');
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
  it('should preserve void text elements', () => {
    const ttree = makeTTree('<br/>');
    expect(ttree).toMatchObject({
      type: 'text',
      tagName: 'br'
    });
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
  it('should not let TEmpty tags break inline context ', () => {
    const tspan = makeTTree('<span>test<c>Yo!</c> ahah</span>');
    expect(tspan).toMatchObject({
      type: 'phrasing',
      tagName: 'span',
      children: [
        {
          type: 'text',
          data: 'test'
        },
        {
          type: 'empty',
          tagName: 'c'
        },
        {
          type: 'text',
          data: ' ahah'
        }
      ]
    });
  });
  it('should preserve parents before hoisting', () => {
    const span = makeTTree('<span><strong>hello</strong><img /></span>');
    const strong = span.children[0].children[0];
    expect(strong.tagName).toBe('strong');
    expect(strong.parent).toBeDefined();
    expect(strong.parent?.tagName).toBe('span');
  });
  it('should not hoist blocks', () => {
    const div = makeTTree('<div><div><div></div></div></div></div>');
    function testChildren(node: TNodeImpl) {
      for (const c of node.children) {
        expect(c.tagName).toBe('div');
        expect(c.type).toBe('block');
        testChildren(c);
      }
    }
    testChildren(div);
  });
});
