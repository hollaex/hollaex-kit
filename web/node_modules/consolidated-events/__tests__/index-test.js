import { addEventListener } from '../src';
import TargetEventHandlers from '../src/TargetEventHandlers';

class MockTarget {
  constructor() {
    this.addEventListener = jest.fn();
  }
}

const EVENT_HANDLERS_KEY = '__consolidated_events_handlers__';

describe('addEventListener()', () => {
  it('initializes an instance of TargetEventHandlers on new targets', () => {
    const target = new MockTarget();
    addEventListener(target, 'scroll', () => {});
    expect(target[EVENT_HANDLERS_KEY]).toBeInstanceOf(TargetEventHandlers);
    expect(target[EVENT_HANDLERS_KEY].target).toBe(target);
  });

  it('normalizes event options', () => {
    const target = new MockTarget();
    addEventListener(target, 'scroll', () => {}, { capture: true });

    expect(target.addEventListener)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function), true);
  });

  it('returns an unsubscribe function', () => {
    const target = new MockTarget();
    const remove = addEventListener(target, 'scroll', () => {}, { capture: true });

    expect(typeof remove).toBe('function');
  });
});
