/* eslint-disable import/first */
jest.mock('../src/canUsePassiveEventListeners');

import canUsePassiveEventListeners from '../src/canUsePassiveEventListeners';
import normalizeEventOptions from '../src/normalizeEventOptions';

it('is undefined when event options are undefined', () => {
  expect(normalizeEventOptions(undefined)).toBe(undefined);
});

it('is undefined when event options are null', () => {
  expect(normalizeEventOptions(null)).toBe(undefined);
});

it('is undefined when event options are false', () => {
  expect(normalizeEventOptions(false)).toBe(undefined);
});

describe('when able to use passive event listeners', () => {
  beforeEach(() => {
    canUsePassiveEventListeners.mockImplementation(() => true);
  });

  it('passes the eventOptions object through', () => {
    expect(normalizeEventOptions({ passive: true }))
      .toEqual({ passive: true });

    expect(normalizeEventOptions({ capture: true }))
      .toEqual({ capture: true });

    expect(normalizeEventOptions({ capture: true, passive: true }))
      .toEqual({ capture: true, passive: true });
  });
});

describe('when not able to use passive event listeners', () => {
  beforeEach(() => {
    canUsePassiveEventListeners.mockImplementation(() => false);
  });

  it('is true when the capture option is on', () => {
    expect(normalizeEventOptions({ capture: true })).toBe(true);
  });

  it('is false when the capture option is off', () => {
    expect(normalizeEventOptions({ capture: false })).toBe(false);
  });

  it('is false when the capture option is missing', () => {
    expect(normalizeEventOptions({ passive: true })).toBe(false);
  });
});
