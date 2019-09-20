import React from 'react';
import { DrawerWebProps } from './PropsType';
export default class Drawer extends React.Component<DrawerWebProps, any> {
    static defaultProps: {
        prefixCls: string;
        enableDragHandle: boolean;
    };
    render(): JSX.Element;
}
