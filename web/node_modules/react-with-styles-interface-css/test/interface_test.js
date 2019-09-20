import { expect } from 'chai';
import entries from 'object.entries';
import CSSInterface from '../src';

import registerCSSInterfaceNamespace from '../src/utils/registerCSSInterfaceNamespace';
import getClassName from '../src/utils/getClassName';

const { create, resolve } = CSSInterface;
const testStyles = {
  iguana: { color: 'red' },
};

describe('create', () => {
  afterEach(() => {
    registerCSSInterfaceNamespace('');
  });

  it('returns an object mapping style names to class names', () => {
    const stylesToClasses = create(testStyles);
    const { length: testStylesLength } = Object.keys(testStyles);

    expect(Object.keys(stylesToClasses)).to.have.lengthOf(testStylesLength);

    entries(stylesToClasses).forEach(([styleName, className]) => {
      const expectedClassName = getClassName('', styleName);
      expect(className).to.equal(expectedClassName);
    });
  });

  it('uses namespace in class name', () => {
    const namespace = 'Test';
    registerCSSInterfaceNamespace(namespace);

    const stylesToClasses = create(testStyles);
    const { length: testStylesLength } = Object.keys(testStyles);

    expect(Object.keys(stylesToClasses)).to.have.lengthOf(testStylesLength);

    entries(stylesToClasses).forEach(([styleName, className]) => {
      const expectedClassName = getClassName(namespace, styleName);
      expect(className).to.equal(expectedClassName);
    });
  });
});

describe('resolve', () => {
  it('accepts an array of class names and inline style objects', () => {
    const result = resolve([
      'a',
      'b',
      'c',
      { color: 'orange', width: '10px' },
      { color: 'red', height: '5px' },
    ]);
    expect(result).to.have.property('className');
    expect(result).to.have.property('style');
  });

  it('accepts an array of arrays of class names and inline style objects', () => {
    const result = resolve([
      ['a', 'b', 'c'],
      [{ color: 'orange', width: '10px' }, { color: 'red', height: '5px' }],
    ]);
    expect(result).to.have.property('className');
    expect(result).to.have.property('style');
  });

  it('returns style and className props with position suffixes', () => {
    const { className, style } = resolve([
      'a',
      'b',
      'c',
      { color: 'orange', width: '10px' },
      { color: 'red', height: '5px' },
    ]);
    expect(className).to.equal('a a_1 b b_2 c c_3');
    expect(style).to.deep.equal({ color: 'red', width: '10px', height: '5px' });
  });
});

describe('registerCSSInterfaceNamespace', () => {
  it('registers namespace with the interface', () => {
    const namespace = 'Test';
    registerCSSInterfaceNamespace(namespace);
    const stylesToClasses = create(testStyles);
    Object.keys(testStyles).forEach((styleName) => {
      expect(stylesToClasses[styleName]).to.equal(`${namespace}__${styleName}`);
    });
  });
});
