# History
----

## 0.11.0 / 2017-10-09
- Add `pullToRefresh` prop.
- Remove `useZscroller` `scrollerOptions` `refreshControl` `pullUpEnabled` `pullUpRefreshing` `pullUpOnRefresh` `pullUpDistanceToRefresh` `pullUpRenderer` props.
- Remove `ListView.RefreshControl` components.

### Upgrade tips

**Note: 0.11.0 version has very big optimization**, if you use `useZscroller`/`ListView.RefreshControl` before. You need to follow new usage.

Now `useZscroller` `scrollerOptions` `refreshControl` these props no longer work. **Use the web's native scroller instead of zscroller, using the [`PullToRefresh`](https://github.com/react-component/m-pull-to-refresh) component instead of the `ListView.RefreshControl` component**.

Upgrade example:

  ```diff
  + import { ListView, PullToRefresh } from 'antd-mobile';
  <ListView
     dataSource={this.state.dataSource}
  -  refreshControl={<RefreshControl
  +  pullToRefresh={<PullToRefresh
       refreshing={this.state.refreshing}
       onRefresh={this.onRefresh}
  -    icon={this.renderCustomIcon()}
  +    indicator={{ deactivate: '下拉' }}
     />}
  />
  ```

#### zscroller

> **Note: we do not recommend using simulated scroller**. But you can also use [zscroller](https://github.com/yiminghe/zscroller) to simulate the implementation of rolling containers like bofore.
You can use 'rmc-list-view/lib/Zscroller'(or archive it yourself) and the complete example is here: [zscroller example](http://react-component.github.io/m-list-view/examples/zscroller.html).

The following props table is in the `ListView.RefreshControl` before,

Properties | Descrition | Type | Default
-----------|------------|------|--------
| icon | refresh indicator, include `pull` and `release` state | react node | - |
| loading | loading indicator | react node | - |
| distanceToRefresh | distance to refresh | number | 25 |
| onRefresh | required, Called when the view starts refreshing. | () => void | - |
| refreshing | Whether the view should be indicating an active refresh | bool | false |

now just directly attach them in `ListView` component, and they will still work like before. Upgrade example:

  ```diff
  + import Zscroller from 'rmc-list-view/lib/Zscroller';
  <ListView
     dataSource={this.state.dataSource}
  -  refreshControl={<RefreshControl
  -    refreshing={this.state.refreshing}
  -    onRefresh={this.onRefresh}
  -    icon={this.renderCustomIcon()}
  -  />}
  +  renderScrollComponent={props => <Zscroller {...props} />}
  +  refreshControl
  +  refreshing={this.state.refreshing}
  +  onRefresh={this.onRefresh}
  +  icon={this.renderCustomIcon()}
  />
  ```

The complete example is here: [zscroller-pulldown example](http://react-component.github.io/m-list-view/examples/zscroller-pulldown.html)


## 0.10.1 / 2017-09-28
- Rename `pullUpDistance` prop to `pullUpDistanceToRefresh`.

## 0.10.0 / 2017-09-28

- Remove `stickyHeader` prop and [react-sticky](https://github.com/captivationsoftware/react-sticky) dependency, but you can also use react-sticky and `useBodyScroll` in listview by your self. (see demo)
    > Because this feature is not commonly used and does not contain UI, so it is not suitable for integration.
- Add `renderSectionWrapper` prop, for more precise control.

## 0.9.1 / 2017-09-26

- Change `RefreshControl`'s inner dom className
    - from `${prefixCls}-ptr` to `${prefixCls}-indicator`
    - from `${prefixCls}-ptr-icon` to `${prefixCls}-indicator-icon-wrapper`
    - from `${prefixCls}-ptr-loading` to `${prefixCls}-indicator-loading-wrapper`
- Remove `Promise`.
- Support pull-up fully.

## 0.9.0 / 2017-09-21

- Change `ref` from `string` to `function`.
    - ListView component's `refs.listviewscroll` change to `ListViewRef`
    - ScrollView component's `refs.ScrollView` change to `ScrollViewRef`
    - ScrollView component's `refs.InnerScrollView` change to `InnerScrollViewRef`
    - ScrollView component's `refs.refreshControl` change to `RefreshControlRef`
