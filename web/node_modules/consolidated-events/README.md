# consolidated-events <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]


Manage multiple event handlers using few event listeners.

## Example

```js
import { addEventListener } from 'consolidated-events';

const removeEventListener = addEventListener(
  window,
  'scroll',
  () => { console.log('scrolling') },
  { passive: true }
);

...

removeEventListener();
```

[npm-version-svg]: http://versionbadg.es/lencioni/consolidated-events.svg
[package-url]: https://npmjs.org/package/consolidated-events
[travis-svg]: https://travis-ci.org/lencioni/consolidated-events.svg
[travis-url]: https://travis-ci.org/lencioni/consolidated-events
[deps-svg]: https://david-dm.org/lencioni/consolidated-events.svg
[deps-url]: https://david-dm.org/lencioni/consolidated-events
[dev-deps-svg]: https://david-dm.org/lencioni/consolidated-events/dev-status.svg
[dev-deps-url]: https://david-dm.org/lencioni/consolidated-events#info=devDependencies
[license-image]: http://img.shields.io/npm/l/consolidated-events.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/consolidated-events.svg
[downloads-url]: http://npm-stat.com/charts.html?package=consolidated-events
[npm-badge-png]: https://nodei.co/npm/consolidated-events.png?downloads=true&stars=true
