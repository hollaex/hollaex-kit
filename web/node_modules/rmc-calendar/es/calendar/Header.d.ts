import * as React from 'react';
import { Models } from '../date/DataTypes';
export interface PropsType {
    title?: string;
    locale?: Models.Locale;
    showClear?: boolean;
    onCancel?: () => void;
    onClear?: () => void;
    closeIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
}
export default class Header extends React.PureComponent<PropsType, {}> {
    static defaultProps: {
        closeIcon: string;
    };
    render(): JSX.Element;
}
