import canUseDOM from './canUseDOM';

// Adapted from Modernizr
// https://github.com/Modernizr/Modernizr/blob/acb3f0d9/feature-detects/dom/passiveeventlisteners.js#L26-L37
function testPassiveEventListeners() {
  if (!canUseDOM) {
    return false;
  }

  if (!window.addEventListener || !window.removeEventListener || !Object.defineProperty) {
    return false;
  }

  let supportsPassiveOption = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      // eslint-disable-next-line getter-return
      get() {
        supportsPassiveOption = true;
      },
    });
    const noop = () => {};
    window.addEventListener('testPassiveEventSupport', noop, opts);
    window.removeEventListener('testPassiveEventSupport', noop, opts);
  } catch (e) {
    // do nothing
  }

  return supportsPassiveOption;
}

let memoized;

export default function canUsePassiveEventListeners() {
  if (memoized === undefined) {
    memoized = testPassiveEventListeners();
  }
  return memoized;
}
