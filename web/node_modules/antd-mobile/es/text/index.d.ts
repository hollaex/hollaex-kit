import React from 'react';
import { ViewProps } from '../view';
export default class Text extends React.Component<ViewProps<HTMLSpanElement>, any> {
    static defaultProps: {
        Component: string;
    };
    render(): JSX.Element;
}
