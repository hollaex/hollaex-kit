# React Truncate Markup

[![Travis](https://img.shields.io/travis/parsable/react-truncate-markup.svg?style=flat-square)](https://travis-ci.org/parsable/react-truncate-markup)
[![version](https://img.shields.io/npm/v/react-truncate-markup.svg?style=flat-square)](https://www.npmjs.com/package/react-truncate-markup)
[![License](https://img.shields.io/npm/l/react-truncate-markup.svg?style=flat-square)](https://github.com/parsable/react-truncate-markup/blob/master/LICENSE.md)

React component for truncating JSX markup.

[Examples with code snippets](https://react-truncate-markup-ovpiqisenk.now.sh)  
[CodeSandbox demo](https://codesandbox.io/s/4w2jrplym4)

## Why?

Few use cases for using JS truncating instead of the CSS one:

- you need to support IE, Firefox or Edge (and cannot use `webkit-line-clamp`) for multi-line truncation
- you need a custom ellipsis, potentially with more text (`show more` link, indicator of how many records were hidden by truncation, etc.)

---

Most solutions that already exist (like [react-truncate](https://github.com/One-com/react-truncate) or [React-Text-Truncate](https://github.com/ShinyChang/React-Text-Truncate)) use HTML5 `canvas` (and its `measureText` method) for measuring text width to determine whether (and where) the provided text should be truncated.

While this approach is valid, it has its limitations - it works only for **plain text**, and not for **JSX markup**. You might want to use JSX when parts of the text have different style (like `color` or `font-weight`).

## How?

Because we need to determine how to truncate provided content _after_ all the layout and styles were applied, we need to actually render it in browser (instead of rendering it off-screen in canvas).

By using a binary search approach (_splitting JSX in half and checking if the text + ellipsis fit the container, and if not, splitting it in half again, and so on_), depending on the size (and depth) of the markup, it usually takes only a few rerenders to get the final, truncated markup.

Performance was not an issue for our use cases (e.g. using `TruncateMarkup` twice per list item in a dropdown list containing dozens of items), there is no text movement visible on the screen (but YMMV).

> **_Note:_** Because this package depends on browser rendering, all elements inside `<TruncateMarkup />` need to be visible. If you need to hide or show some parts of your UI, consider conditionally rendering them instead of setting `display: none`/`display: block` style on the elements.

## Installation

```bash
npm install --save react-truncate-markup
# or
yarn add react-truncate-markup
```

> This package also depends on `react` and `prop-types`. Please make sure you have those installed as well.

Importing:

```js
// using ES6 modules
import TruncateMarkup from 'react-truncate-markup';

// using CommonJS modules
const TruncateMarkup = require('react-truncate-markup').default;
```

Or using script tags and globals:

```html
<script src="https://unpkg.com/react-truncate-markup/umd/react-truncate-markup.min.js"></script>
```

And accessing the global variable:

```js
const TruncateMarkup = ReactTruncateMarkup.default;
```

## Usage

```jsx
<div style={{ width: '200px' }}> /* or any wrapper */
  <TruncateMarkup lines={2}>
    <div>
      /* ... any markup ... */
      <span style={{ color: 'red' }}>
        <strong>{this.props.subject}:</strong>
      </span>
      {` `}
      {this.props.message}
    </div>
  </TruncateMarkup>
</div>
```

> #### :warning: Warning
>
> Only inlined [DOM elements](https://reactjs.org/docs/dom-elements.html) are supported when using this library. When trying to truncate React components (class or function), `<TruncateMarkup />` will warn about it, skip truncation and display the whole content instead. For more details, please read [this comment](https://github.com/parsable/react-truncate-markup/issues/12#issuecomment-444761758).

## Props

### `children`

It's required that only 1 element is passed as `children`.

> Correct:

```jsx
<TruncateMarkup>
  <div>
    /* ... markup ... */
  </div>
</TruncateMarkup>
```

> Incorrect:

```jsx
<TruncateMarkup>
  /* ... markup ... */
  <div>/* ... */</div>
  <div>/* ... */</div>
</TruncateMarkup>
```

### `lines`

> default value: `1`

Maximum number of displayed lines of text.

### `ellipsis`

> default value: `...`

Appended to the truncated text.

One of type: `[string, JSX Element, function]`

- `string`: `...`
- `JSX Element`: `<span>... <button>read more</button></span>`
- `function`: `function(jsxElement) { /* ... */ }`

Ellipsis callback function receives new _(truncated)_ `<TruncateMarkup />` children as an argument so it can be used for determining what the final ellipsis should look like.

```jsx
const originalText = '/* ... */';

const wordsLeftEllipsis = (rootEl) => {
  const originalWordCount = originalText.match(/\S+/g).length;
  const newTruncatedText = rootEl.props.children;
  const currentWordCount = newTruncatedText.match(/\S+/g).length;

  return `... (+${originalWordCount - currentWordCount} words)`;
}

<TruncateMarkup ellipsis={wordsLeftEllipsis}>
  <div>
    {originalText}
  </div>
</TruncateMarkup>
```

### `lineHeight`

> default value: auto-detected

Numeric value for desired line height in pixels. Generally it will be auto-detected but it can be useful in some cases when the auto-detected value needs to be overridden.

### `onAfterTruncate`

> function(wasTruncated: bool) | optional

A callback that gets called after truncation. It receives a bool value - `true` if the input markup was truncated, `false` when no truncation was needed.

> _Note_: To prevent infinite loops, _onAfterTruncate_ callback gets called only after the initial run (on mount), any subsequent props/children updates will trigger a recomputation, but _onAfterTruncate_ won't get called for these updates.
>
> If you, however, wish to have _onAfterTruncate_ called after some update, [change the `key` prop](https://reactjs.org/docs/reconciliation.html#keys) on the `<TruncateMarkup />` component - it will make React to remount the component, instead of updating it.

## Contributing

Read more about project setup and contributing in [CONTRIBUTING.md](https://github.com/parsable/react-truncate-markup/blob/master/CONTRIBUTING.md)

## License

Released under Apache-2.0 license.

Copyright &copy; 2017-present Parsable Inc.
