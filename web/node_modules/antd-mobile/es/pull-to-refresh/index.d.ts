import React from 'react';
import PropTypes from 'prop-types';
import { PropsType } from 'rmc-pull-to-refresh/lib/PropsType';
export default class PullToRefresh extends React.Component<PropsType, any> {
    static defaultProps: {
        prefixCls: string;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    render(): JSX.Element;
}
