# rmc-list-view
---

React ListView Component, port from [React Native ListView](https://facebook.github.io/react-native/docs/listview.html)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-list-view.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-list-view
[travis-image]: https://img.shields.io/travis/react-component/m-list-view.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-list-view
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-list-view.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-list-view?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-list-view.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-list-view
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-list-view.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-list-view

port from [React Native ListView](https://facebook.github.io/react-native/docs/listview.html#content)
(v0.26)

## Screenshots

<img src="https://os.alipayobjects.com/rmsportal/ddyjYtQFAIywppH.png" width="288"/>


## Development

```
npm install
npm start
```

## Example

http://localhost:8999/examples/

online example: http://react-component.github.io/m-list-view/

## install

[![rmc-list-view](https://nodei.co/npm/rmc-list-view.png)](https://npmjs.org/package/rmc-list-view)

## Usage
see examples

## API

Properties | Descrition | Type | Default
-----------|------------|------|--------
| dataSource | An instance of [ListView.DataSource](http://facebook.github.io/react-native/releases/0.26/docs/listviewdatasource.html) to use | ListViewDataSource | - |
| initialListSize | How many rows to render on initial component mount. | number | - |
| onEndReached | Called when all rows have been rendered and the list has been scrolled to within `onEndReachedThreshold` of the bottom. | (event?) => {} | - |
| onEndReachedThreshold | Threshold in pixels (virtual, not physical) for calling `onEndReached`. | number | 1000 |
| pageSize | Number of rows to render per event loop. | number | 1 |
| renderHeader / renderFooter | The header and footer are always rendered (if these props are provided) on every render pass. If they are expensive to re-render, wrap them in StaticContainer or other mechanism as appropriate. Footer is always at the bottom of the list, and header at the top, on every render pass. | () => renderable | - |
| renderRow | Takes a data entry from the data source and its ids and should return a renderable component to be rendered as the row. By default the data is exactly what was put into the data source, but it's also possible to provide custom extractors. ListView can be notified when a row is being highlighted by calling highlightRow function. | (rowData, sectionID, rowID, highlightRow) => renderable | - |
| renderScrollComponent | A function that returns the scrollable component in which the list rows are rendered. Defaults to returning a ScrollView with the given props. | (props) => renderable | - |
| renderSectionHeader | If provided, a header is rendered for this section. | (sectionData, sectionID) => renderable | - |
| renderSeparator | If provided, a renderable component to be rendered as the separator below each row but not the last row if there is a section header below. Take a sectionID and rowID of the row above and whether its adjacent row is highlighted. | (sectionID, rowID, adjacentRowHighlighted) => renderable | - |
| scrollRenderAheadDistance | How early to start rendering rows before they come on screen, in pixels. | number | 1000 |
| contentContainerStyle | These styles will be applied to the scroll view content container which wraps all of the child views. | Object | - |
| horizontal | When true, the scroll view's children are arranged horizontally in a row instead of vertically in a column. | bool | false |
| onContentSizeChange | Called when scrollable content view of the ScrollView changes. | (contentWidth, contentHeight) => {} | - |
| onScroll | Fires at most once per frame during scrolling. The frequency of the events can be controlled using the `scrollEventThrottle` prop. | e => {} | - |
| scrollEventThrottle | This controls how often the scroll event will be fired while scrolling | number | 50 |
| onLayout | Invoked on mount and layout changes with | ({nativeEvent:{ layout:{ width, height }}}) => {} | - |
| ---- |
| renderBodyComponent (`web only`) | render listview body wrapper component | () => renderable | - |
| renderSectionWrapper (`web only`) | | render listview section wrapper component | (sectionID) => renderable | - |
| renderSectionBodyWrapper (`web only`) | render listview section body wrapper component | (sectionID) => renderable | - |
| useBodyScroll (`web only`) | use html `body`'s scroll | bool | false |
| pullToRefresh (`web only`) | Whether enable pullToRefresh, you need use it with [rmc-pull-to-refresh](https://github.com/react-component/m-pull-to-refresh) | bool | false |

### Methods

- getMetrics() - Exports some data, e.g. for perf investigations or analytics.
- scrollTo(...args) - Scrolls to a given x, y offset(not support smooth animation).


## ListView.IndexedList

This component is often used in the "Contacts" / "city list" scenes, support for index navigation.

> You can use almost all APIs on the ListView.
>
> Note: Only two-step rendering is supported, so that the first screen priority display can be achieved, but if the list data volume is too large, the overall performance will still be affected.

Properties | Descrition | Type | Default
-----------|------------|------|--------
| quickSearchBarTop | top button object of navigation bar | object{value:string, label:string} | `{ value: '#', label: '#' }` |
| quickSearchBarStyle |  quickSearchBar's style | object | - |
| onQuickSearch | fire on clicking navigation bar. | (sectionID: any, topId?:any) => void | - |
| showQuickSearchIndicator | whether show quick search indicator | bool | false |
| delayTime | delay rendering time setting (for the first screen optimization, the initial rendering of the number of `initialListSize` data, after which time rendering the remaining data items, ie `totalRowCount - initialListSize`) | number |`100ms` |
| delayActivityIndicator | the loading indicator for delayed rendering. | react node | - |


## Tips

ListView has two types of scroll containers:

1. Partial div container
    - default, note: **need to manually set the height of the ListView**
2. html body container
    - set `useBodyScroll` to take effect (do not need to set height)

> please see [0.11.0 upgrade tips](./HISTORY.md#upgrade-tips).


## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-list-view is released under the MIT license.
