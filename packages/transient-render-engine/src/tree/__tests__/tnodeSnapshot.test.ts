import tnodeSnapshot from '../tnodeSnapshot';
import { translateTreeTest } from '../../flow/__tests__/utils';
import { TNode, TNodePrintOptions } from '../tree-types';

function runTNodeSnapshot(
  html: string,
  params: TNodePrintOptions = { withNodeIndex: true, withStyles: true }
) {
  return tnodeSnapshot(translateTreeTest(html) as unknown as TNode, params);
}
describe('tnodeToString', () => {
  it('should handle deeply nested tags', () => {
    const result = runTNodeSnapshot(
      '<div><div><span>A<em>a</em></span><span>B</span></div><span>C<strong>D</strong></span></div>'
    );
    expect(result).toMatchSnapshot();
  });
  it('should print ids, classes and anchors', () => {
    const result = runTNodeSnapshot(
      '<a href="https://" id="first" class="special"></a>'
    );
    expect(result).toMatchSnapshot();
  });
  it('should cut data strings over 24 characters with ellipsis', () => {
    const result = runTNodeSnapshot(
      '<span>This very long string should be truncated and end with an ellipsis.</span>'
    );

    expect(result).toMatchSnapshot();
  });
  it('should print styles when withStyles is enabled', () => {
    const result = runTNodeSnapshot('<span style="color: blue;">Blue!</span>', {
      withStyles: true,
      withNodeIndex: false
    });
    expect(result).toMatchSnapshot();
  });
  it('should not print styles when withStyles is disabled', () => {
    const result = runTNodeSnapshot('<span style="color: blue;">Blue!</span>', {
      withStyles: false,
      withNodeIndex: false
    });
    expect(result).toMatchSnapshot();
  });
});
