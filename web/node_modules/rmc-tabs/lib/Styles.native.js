'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports['default'] = {
    Tabs: {
        container: {
            flex: 1
        },
        topTabBarSplitLine: {
            borderBottomColor: '#eee',
            borderBottomWidth: 1
        },
        bottomTabBarSplitLine: {
            borderTopColor: '#eee',
            borderTopWidth: 1
        }
    },
    TabBar: {
        container: {
            height: 43.5
        },
        tabs: {
            flex: 1,
            flexDirection: 'row',
            height: 43.5,
            backgroundColor: '#fff',
            justifyContent: 'space-around'
        },
        tab: {
            height: 43.5,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 2,
            paddingLeft: 2,
            flexDirection: 'row'
        },
        underline: {
            height: 2,
            backgroundColor: '#108ee9'
        },
        textStyle: {
            fontSize: 15
        },
        activeTextColor: '#108ee9',
        inactiveTextColor: '#000'
    }
};
module.exports = exports['default'];