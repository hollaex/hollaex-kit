import { expect } from 'chai';

import separateStyles from '../../src/utils/separateStyles';

describe('separateStyles', () => {
  it('Return class names', () => {
    const { classNames } = separateStyles(['a', { color: 'blue' }, 'b', 'c', { color: 'red' }]);
    expect(classNames).to.deep.equal(['a', 'b', 'c']);
  });

  it('Return no inline styles', () => {
    const { hasInlineStyles, inlineStyles } = separateStyles(['a', 'b', 'c']);
    expect(hasInlineStyles).to.equal(false);
    expect(inlineStyles).to.deep.equal({});
  });

  it('Return inline styles', () => {
    const { hasInlineStyles, inlineStyles } = separateStyles([
      { color: 'blue' },
      { fontSize: '1rem' },
      { height: '10px', color: 'black', padding: '1rem' },
    ]);
    expect(hasInlineStyles).to.equal(true);
    expect(inlineStyles).to.deep.equal({
      fontSize: '1rem',
      height: '10px',
      color: 'black',
      padding: '1rem',
    });
  });
});
