import tnodeToString from '../tnodeToString';
import { translateTreeTest } from '../flow/__tests__/utils';

describe('tnodeToString', () => {
  it('should handle deeply nested tags', () => {
    const result = tnodeToString(
      translateTreeTest(
        '<div><div><span>A<em>a</em></span><span>B</span></div><span>C<strong>D</strong></span></div>'
      )
    );
    expect(result).toMatchSnapshot();
  });
  it('should print ids, classes and anchors', () => {
    const result = tnodeToString(
      translateTreeTest('<a href="https://" id="first" class="special"></a>')
    );
    expect(result).toMatchSnapshot();
  });
  it('should cut data strings over 24 characters with ellipsis', () => {
    const result = tnodeToString(
      translateTreeTest(
        '<span>This very long string should be truncated and end with an ellipsis.</span>'
      )
    );
    expect(result).toMatchSnapshot();
  });
});
