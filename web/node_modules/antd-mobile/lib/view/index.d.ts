import React from 'react';
export interface ViewProps<T> extends React.HTMLProps<T> {
    Component?: string;
}
export default class View extends React.Component<ViewProps<HTMLDivElement>, any> {
    static defaultProps: {
        Component: string;
    };
    render(): JSX.Element;
}
