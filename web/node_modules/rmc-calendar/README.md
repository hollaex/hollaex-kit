# rmc-calendar
---

React Mobile Calendar Component (web)


[![NPM version][npm-image]][npm-url]
![react](https://img.shields.io/badge/react-%3E%3D_15.2.0-green.svg)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-calendar.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-calendar
[travis-image]: https://img.shields.io/travis/react-component/m-calendar.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-calendar
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-calendar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-calendar?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-calendar.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-calendar
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-calendar.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-calendar

## Screenshots

<!-- <img src="https://os.alipayobjects.com/rmsportal/fOaDvpIJukLYznc.png" width="288"/> -->


## Development

```
npm i 
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/m-calendar/

## react-native (TBC)

```
./node_modules/rc-tools run react-native-init
npm run watch-tsc
react-native start
react-native run-ios
```

## install

[![rmc-calendar](https://nodei.co/npm/rmc-calendar.png)](https://npmjs.org/package/rmc-calendar)


# docs

## Usage
```jsx
import React, { Component } from 'react';

import { Calendar } from 'rmc-calendar';
import 'rmc-calendar/assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  setVisiable = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <div className="App">
        <Calendar
          visible={this.state.visible}
          onCancel={this.setVisiable}
          onConfirm={this.setVisiable}
        />
      </div>
    );
  }
}

export default App;
```

## API

### Calendar props
```ts
interface PropsType {
    /** enter direction，default: vertical */
    enterDirection?: 'horizontal' | 'vertical';
    /** locale */
    locale?: GlobalModels.Locale;
    onCancel?: () => void;
    onConfirm?: (startDateTime?: Date, endDateTime?: Date) => void;
    /** choose time，default: false */
    pickTime?: boolean;
    /** (web only) prefix class，default: rmc-calendar */
    prefixCls?: string;
    /** shortcut render, need showShortcut: true */
    renderShortcut?: (select: (startDate?: Date, endDate?: Date) => void) => React.ReactNode;
    /** show header, default: true */
    showHeader?: boolean;
    /** show shortcut, default: false */
    showShortcut?: boolean;
    /** header title, default: {locale.title} */
    title?: string;
    /** select type, default: range，one: one-day, range: range */
    type?: 'one' | 'range';
    /** visible, default: false */
    visible?: boolean;

    // DatePicker Component
    /** default date for show, default: today */
    defaultDate?: Date;
    /** extra info of date */
    getDateExtra?: (date: Date) => DateModels.ExtraData;
    /** infinite scroll, default: true */
    infinite?: boolean;
    /** infinite scroll optimization, default: false */
    infiniteOpt?: boolean;
    /** inital generate months, default: 6 */
    initalMonths?: number;
    /** max date */
    maxDate?: Date;
    /** min date */
    minDate?: Date;
    /** select range has disable date */
    onSelectHasDisableDate?: (date: Date[]) => void;

    // TimePicker Component
    /** inital time of TimePicker */
    defaultTimeValue?: Date;
}
```

### DatePicker props
```ts
export default interface PropsType {
    /** default date for show, default: today */
    defaultDate?: Date;
    /** select value of start date */
    startDate?: Date;
    /** select value of end date */
    endDate?: Date;
    /** extra info of date */
    getDateExtra?: (date: Date) => Models.ExtraData;
    /** infinite scroll, default: true */
    infinite?: boolean;
    /** infinite scroll optimization, default: false */
    infiniteOpt?: boolean;
    /** inital generate months, default: 6 */
    initalMonths?: number;
    /** locale */
    locale?: GlobalModels.Locale;
    /** max date */
    maxDate?: Date;
    /** min date */
    minDate?: Date;
    /** callback when click the cell of date */
    onCellClick?: (date: Date) => void;
    /** select range has disable date */
    onSelectHasDisableDate?: (date: Date[]) => void;
    /** (web only) prefix class */
    prefixCls?: string;
    /** select type, default: range，one: one-day, range: range */
    type?: 'one' | 'range';
}
```

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-calendar is released under the MIT license.
