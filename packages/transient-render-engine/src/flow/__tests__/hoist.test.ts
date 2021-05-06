import { rfc002Source } from './shared';
import { hoist } from '../hoist';
import { translateTreeTest } from './utils';
import { TNodeImpl } from '../../tree/tree-types';

function makeTTree(source: string) {
  return hoist(translateTreeTest(source));
}

describe('hoist function', () => {
  it('should comply with RFC002 example (hoisting) ', () => {
    const hoistedTree = makeTTree(rfc002Source);
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
    expect(tdoc).toMatchSnapshot();
  });
  it('should preserve void text elements', () => {
    const tbr = makeTTree('<br/>');
    expect(tbr).toMatchSnapshot();
  });
  it('should preserve text of encompassing blocks', () => {
    const tdoc = makeTTree(
      '<a href="http://google.fr"><div>This is text!</div></a>'
    );
    expect(tdoc).toMatchSnapshot();
  });
  it('should not let TEmpty tags break inline context ', () => {
    const tspan = makeTTree('<span>test<c>Yo!</c> ahah</span>');
    expect(tspan).toMatchSnapshot();
  });
  it('should preserve parents before hoisting', () => {
    const tspan = makeTTree('<span><strong>hello</strong><img /></span>');
    expect(tspan).toMatchSnapshot();
    const tstrong = tspan.children[0].children[0];
    expect(tstrong.tagName).toBe('strong');
    expect(tstrong.parent).toBeDefined();
    expect(tstrong.parent!.tagName).toBe('span');
  });
  it('should not hoist blocks', () => {
    const tdiv = makeTTree('<div><div><div></div></div></div></div>');
    function testChildren(node: TNodeImpl) {
      for (const c of node.children) {
        expect(c.tagName).toBe('div');
        expect(c.type).toBe('block');
        testChildren(c);
      }
    }
    testChildren(tdiv);
  });
});
