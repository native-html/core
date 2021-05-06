import tnodeToString from '../tnodeToString';
import { translateTreeTest } from '../flow/__tests__/utils';
import { TNode } from '../tree/tree-types';

describe('tnodeToString', () => {
  it('should handle deeply nested tags', () => {
    const result = tnodeToString(
      (translateTreeTest(
        '<div><div><span>A<em>a</em></span><span>B</span></div><span>C<strong>D</strong></span></div>'
      ) as unknown) as TNode
    );
    expect(result).toMatchSnapshot();
  });
  it('should print ids, classes and anchors', () => {
    const result = tnodeToString(
      (translateTreeTest(
        '<a href="https://" id="first" class="special"></a>'
      ) as unknown) as TNode
    );
    expect(result).toMatchSnapshot();
  });
  it('should cut data strings over 24 characters with ellipsis', () => {
    const result = tnodeToString(
      (translateTreeTest(
        '<span>This very long string should be truncated and end with an ellipsis.</span>'
      ) as unknown) as TNode
    );
    expect(result).toMatchSnapshot();
  });
  it('should print styles when withStyles is enabled', () => {
    const result = tnodeToString(
      (translateTreeTest(
        '<span style="color: blue;">Blue!</span>'
      ) as unknown) as TNode,
      {
        withStyles: true
      }
    );
    expect(result).toMatchSnapshot();
  });
  it('should not print styles when withStyles is disabled', () => {
    const result = tnodeToString(
      (translateTreeTest(
        '<span style="color: blue;">Blue!</span>'
      ) as unknown) as TNode,
      {
        withStyles: false
      }
    );
    expect(result).toMatchSnapshot();
  });
});
