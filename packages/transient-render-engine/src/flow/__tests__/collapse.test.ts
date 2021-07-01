import { TBlockCtor } from '../../tree/TBlockCtor';
import { TNodeImpl } from '../../tree/tree-types';
import { TPhrasingCtor } from '../../tree/TPhrasingCtor';
import { TTextCtor, TTextImpl } from '../../tree/TTextCtor';
import { collapse } from '../collapse';
import { hoist } from '../hoist';
import {
  deeplyNestedSource,
  nestedHyperlinksSource,
  recursiveHoisting,
  rfc002Source
} from './shared';
import { defaultInit, translateTreeTest } from './utils';
import { Text } from '../../dom/dom-utils';

function makeTTree(
  html: string,
  removeLineBreaksAroundEastAsianDiscardSet = false
): TNodeImpl {
  return collapse(
    hoist(
      translateTreeTest(html, { removeLineBreaksAroundEastAsianDiscardSet })
    )
  );
}

function makeTextChildren() {
  return [new TTextCtor({ textNode: new Text(''), ...defaultInit })];
}

describe('collapse function', () => {
  it('should collapse a tree such as specified in RFC002 example', () => {
    const ttree = makeTTree(rfc002Source);
    expect(ttree).toMatchSnapshot();
  });
  it('should collapse adjacent tags', () => {
    const ttree = makeTTree('<span><span>foo </span><span> bar</span></span>');
    expect(ttree).toMatchSnapshot();
  });
  it('should handle nested anchors', () => {
    const ttree = makeTTree(nestedHyperlinksSource);
    expect(ttree).toMatchSnapshot();
  });
  it('should handle deeply nested HTML', () => {
    const ttree = makeTTree(deeplyNestedSource);
    expect(ttree).toMatchSnapshot();
  });
  it('should hoist blocks recursively', () => {
    const ttree = makeTTree(recursiveHoisting);
    expect(ttree).toMatchSnapshot();
  });
  it('should handle body tag', () => {
    const html = `<body><div>
    <span>Hello world!</span>
</div></body>`;
    const ttree = makeTTree(html);
    expect(ttree).toMatchSnapshot();
  });
  it('should remove empty children from TBlock nodes', () => {
    const ttree = new TBlockCtor(defaultInit);
    ttree.bindChildren(makeTextChildren());
    expect(collapse(ttree).children).toHaveLength(0);
  });
  it('should remove empty anonymous TText children from TPhrasing nodes', () => {
    const ttree = new TPhrasingCtor(defaultInit);
    ttree.bindChildren(makeTextChildren());
    expect(collapse(ttree).children).toHaveLength(0);
  });
  it('should remove empty anonymous TPhrasing children from TPhrasing nodes', () => {
    const ttree = new TPhrasingCtor(defaultInit);
    const tphrasing = new TPhrasingCtor(defaultInit);
    tphrasing.bindChildren(makeTextChildren());
    ttree.bindChildren([tphrasing]);
    const collapsed = collapse(ttree);
    expect(collapsed.children).toHaveLength(0);
    expect(collapsed).toMatchSnapshot();
  });
  it('should remove children from TPhrasing nodes which are empty after timming', () => {
    const ttree = new TPhrasingCtor(defaultInit);
    ttree.bindChildren([
      // This node will be empty after trimming right, and should be removed
      new TTextCtor({ textNode: new Text(' '), ...defaultInit }),
      new TTextCtor({ textNode: new Text(' Foo'), ...defaultInit }),
      new TTextCtor({ textNode: new Text(' Bar'), ...defaultInit })
    ]);
    const collapsed = collapse(ttree);
    expect(collapsed.children).toHaveLength(2);
    expect(collapsed).toMatchSnapshot();
  });
  it('should handle direct style inheritance', () => {
    const ttree = makeTTree(
      '<div style="font-size: 18px;border-width: 20px;"><span style="color: red;">This is nice!</span></div>'
    );
    expect(ttree).toMatchSnapshot();
  });
  it('should handle indirect style inheritance', () => {
    const ttree = makeTTree(
      '<div style="font-size: 18px;"><div style="border-width: 20px;">This is great!</div></div>'
    );
    expect(ttree).toMatchSnapshot();
  });
  it('should not collapse when white-space CSS property is set to "pre"', () => {
    const ttree = makeTTree(
      '<div style="white-space: pre;">  This is great!  </div>'
    );
    expect(ttree).toMatchSnapshot();
  });
  it('should collapse when white-space CSS property is set to "normal"', () => {
    const ttree = makeTTree(
      '<div style="white-space: normal;">  This is great!  </div>'
    );
    expect(ttree).toMatchSnapshot();
  });
  it('should collapse when white-space CSS property is not set', () => {
    const ttree = makeTTree('<div>  This is great!  </div>');
    expect(ttree).toMatchSnapshot();
  });
  it('should collapse a node with white-space set to "normal" while its parent has white-space set to "pre"', () => {
    const ttree = makeTTree(
      '<div style="white-space: pre;"><span> This is nice </span><strong style="white-space: normal"> Should collapse </strong></div>'
    );
    // left space of <strong> child DOMTextNode should be spared, since left
    // sibling is not collapsible (tested in Mozilla Firefox and Chromium)
    expect(ttree).toMatchSnapshot();
  });
  it('should withold TEmpty nodes', () => {
    const ttree = makeTTree(
      '<div><span>Hi!</span><link rel="author" href="mailto:don@company.com" /></div>'
    );
    expect(ttree).toMatchSnapshot();
  });
  it('should support removeLineBreaksAroundEastAsianDiscardSet param', () => {
    const span = makeTTree('<span>\u2F00\n\u2FDA</span>', true) as TTextImpl;
    expect(span).toMatchSnapshot();
    expect(span.data).toBe('\u2F00\u2FDA');
  });
  it('should set `nodeIndex` field corresponding to the actual index relative to parent', () => {
    const src = `<table>
    <tr>
      <th>Month</th>
      <th>Fortnight</th>
      <th>Savings</th>
    </tr>
    <tr>
      <td>January</td>
      <td>first</td>
      <td>$50</td>
    </tr>
    <tr>
      <td>second</td>
      <td>$80</td>
      <td>$80</td>
    </tr>
  </table>`;
    const ttree = makeTTree(src);
    expect(ttree.tagName).toBe('table');
    ttree.children.forEach((child, i) => {
      expect(child.nodeIndex).toBe(i);
    });
  });
  it('should handle <br> tags', () => {
    const src = `<p>
    should<br>
    collapse
    </p>`;
    const ttree = makeTTree(src);
    expect(ttree).toMatchSnapshot();
  });
  it('should retain whitespaces between block and textual nodes', () => {
    const src = '<div><strong>Tags:</strong>\n<a href="">hello</a>';
    const ttree = makeTTree(src);
    expect(ttree).toMatchSnapshot();
  });
});
