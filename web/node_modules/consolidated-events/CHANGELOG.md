## v2.0.1

- Move TargetEventHandlers methods to prototype ([#15](https://github.com/lencioni/consolidated-events/pull/15))

## v2.0.0

- Now built with rollup ([#8](https://github.com/lencioni/consolidated-events/pull/8))
- Deprecated `removeEventListener` export removed ([#13](https://github.com/lencioni/consolidated-events/pull/13))
- Passive event listener test is now removed after being added ([#11](https://github.com/lencioni/consolidated-events/pull/11))
- Reduced bundle size impact by replacing a class with a function ([#12](https://github.com/lencioni/consolidated-events/pull/12))

## v1.1.1

- Prevent event handlers from being mutated during current iteration.

## v1.1.0

- Return an unsubscribe function from `addEventListener` and deprecate
  `removeEventListener`.

## v1.0.1

- Fix bug with `handleEvent()`.

## v1.0.0

- Initial release.
