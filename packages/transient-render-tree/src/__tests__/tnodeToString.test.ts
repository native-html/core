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
});
