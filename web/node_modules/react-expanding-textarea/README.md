# react-expanding-textarea
![](https://img.shields.io/npm/dm/react-expanding-textarea.svg)
![](https://img.shields.io/npm/v/react-expanding-textarea.svg)

React textarea component to automatically expand and contract your textareas.

You can [view the demo here](http://rpearce.github.io/react-expanding-textarea/).

## Installation
Install the package via NPM:
```
$ npm install --save react-expanding-textarea
```

## Usage
Use this exactly like you would a normal `<textarea>`; the only
difference is that it is doing some simple expanding work behind the scenes for you!
```js
import Textarea from 'react-expanding-textarea'

const handleChange = (e) => {
  console.log('Changed value to: ', e.target.value)
}

const myComponent = () =>
  <Textarea
    maxLength="3000"
    className="textarea"
    name="post[notes]"
    placeholder="Notes"
    onChange={ handleChange } />
```

### `rows`
If you pass a `rows` prop, then this component will perform a calculation based
on computed `lineHeight`, `paddingTop` and `paddingBottom` to deduce what the
minimum height-in-rows the component should be.

## Development
1. Make your changes to `src/ExpandingTextarea.js` and/or `example/src` and/or `example/sass`
1. Run make to build the JS output as well as the example code
1. Run `$ open example/index.html` to view the output

## Contribute
1. Check out the [issues](https://github.com/rpearce/react-expanding-textarea/issues)
1. Fork this repository
1. Clone your fork
1. Check out a feature branch (`$ git checkout -b my-feature`)
1. Make your changes and push your branch to your GitHub repo
1. Create a pull request from your branch to this repo's master
1. When all is merged, pull down the upstream changes to your master
1. Delete your feature branch
