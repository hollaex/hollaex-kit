# react-with-direction <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Components to support both right-to-left (RTL) and left-to-right (LTR) layouts in React.

Supporting RTL or switching between different directions can be tricky. Most browsers have [built-in support](https://www.w3.org/International/questions/qa-html-dir) for displaying markup like paragraphs, lists, and tables. But what about interactive or complex custom UI components? In a right-to-left layout, a photo carousel should advance in the opposite direction, and the primary tab in a navigation control should the rightmost, for example.

This package provides components to simplify that effort.

## withDirection

Use `withDirection` when your component needs to change based on the layout direction. `withDirection` is an HOC that consumes the direction from React context and passes it as a `direction` prop to the wrapped component. The wrapped component can then pivot its logic to accommodate each direction.

Usage example:

```js
import withDirection, { withDirectionPropTypes, DIRECTIONS } from 'react-with-direction';

function ForwardsLabel({ direction }) {
  return (
    <div>
      Forwards
      {direction === DIRECTIONS.LTR && <img src="arrow-right.png" />}
      {direction === DIRECTIONS.RTL && <img src="arrow-left.png" />}
    </div>
  );
}
ForwardsLabel.propTypes = {
  ...withDirectionPropTypes,
};

export default withDirection(ForwardsLabel);
```

## DirectionProvider

Use `DirectionProvider` at the top of your app to set the direction context, which can then be consumed by components using `withDirection`.

You should set the `direction` prop based on the language of the content being rendered; for example, `DIRECTIONS.RTL` (right-to-left) for Arabic or Hebrew, or `DIRECTIONS.LTR` (left-to-right) for English or most other languages.

`DirectionProvider` components can also be nested, so that the direction can be overridden for certain branches of the React tree.

`DirectionProvider` will render its children inside of a `<div>` element with a `dir` attribute set to match the `direction` prop, for example: `<div dir="rtl">`. This maintains consistency when being rendered in a browser. To render inside of a `<span>` instead of a div, set the `inline` prop to `true`.

Usage example:

```js
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';
```

```js
<DirectionProvider direction={DIRECTIONS.RTL}>
  <div>
    <ForwardsLabel />
  </div>
</DirectionProvider>
```

## AutoDirectionProvider

Use `AutoDirectionProvider` around, for example, user-generated content where the text direction is unknown or may change. This renders a `DirectionProvider` with the `direction` prop automatically set based on the `text` prop provided.

Direction will be determined based on the first strong LTR/RTL character in the `text` string. Strings with no strong direction (e.g., numbers) will inherit the direction from its nearest `DirectionProvider` ancestor or default to LTR.

Usage example:

```js
import AutoDirectionProvider from 'react-with-direction/dist/AutoDirectionProvider';
```

```js
<AutoDirectionProvider text={userGeneratedContent}>
  <ExampleComponent>
    {userGeneratedContent}
  </ExampleComponent>
</AutoDirectionProvider>
```

[package-url]: https://npmjs.org/package/react-with-direction
[npm-version-svg]: http://versionbadg.es/airbnb/react-with-direction.svg
[travis-svg]: https://travis-ci.org/airbnb/react-with-direction.svg
[travis-url]: https://travis-ci.org/airbnb/react-with-direction
[deps-svg]: https://david-dm.org/airbnb/react-with-direction.svg
[deps-url]: https://david-dm.org/airbnb/react-with-direction
[dev-deps-svg]: https://david-dm.org/airbnb/react-with-direction/dev-status.svg
[dev-deps-url]: https://david-dm.org/airbnb/react-with-direction#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/react-with-direction.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/react-with-direction.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-with-direction.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-with-direction
