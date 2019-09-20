import React from 'react';
import { ResultPropsType } from './PropsType';
export interface ResultProps extends ResultPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class Result extends React.Component<ResultProps, any> {
    static defaultProps: {
        prefixCls: string;
        buttonType: string;
        onButtonClick: () => void;
    };
    render(): JSX.Element;
}
