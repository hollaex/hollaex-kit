import React from 'react';
import sd from 'skin-deep';
import { expect } from 'chai';
import Rectangle, { calculateAspectRatio } from '../src/rectangle';

describe('Rectangle', () => {
  it('should exist', () => { expect(Rectangle).to.be.ok; });

  describe('exist', () => {
    const tree = sd.shallowRender(<Rectangle />);
    const vdom = tree.getRenderOutput();

    it('should render', () => {
      expect(tree).to.be.ok;
      expect(vdom).to.be.ok;
    });

    it('should render a react component', () => {
      expect(vdom).to.have.property('type', 'div');
    });
  });

  describe('props', () => {
    it('should pass children', () => {
      const tree = sd.shallowRender(<Rectangle>Text</Rectangle>);
      const instance = tree.getMountedInstance();

      expect(instance.props).to.have.property('children', 'Text');
    });

    it('should pass aspectRatio as number', () => {
      const tree = sd.shallowRender(<Rectangle aspectRatio={1} />);
      const instance = tree.getMountedInstance();

      expect(instance.props).to.have.property('aspectRatio', 1);
    });
  });

  describe('calculateAspectRatio', () => {
    it('should calculate aspect ratio when a number passed', () => {
      expect(calculateAspectRatio(2)).to.equal(0.5);
    });

    it('should calculate aspect ratio when an array passed', () => {
      expect(calculateAspectRatio([4, 1])).to.equal(0.25);
    });

    it('should calculate aspect ratio when an object passed', () => {
      expect(calculateAspectRatio({ width: 1, height: 2 })).to.equal(2);
    });

    it('should calculate aspect ratio when a string passed', () => {
      expect(calculateAspectRatio('0.5')).to.equal(2);
    });

    it('should throw when an invalid argument passed', () => {
      expect(() => calculateAspectRatio(Symbol())).to.throw(Error);
    });

    it('should throw when an invalid string passed', () => {
      expect(() => calculateAspectRatio('bad number')).to.throw(Error);
    });
  });
});
