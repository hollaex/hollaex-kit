import React from 'react';
export interface PropsType {
    visible: boolean;
    className?: string;
    displayType?: string;
}
export default class AnimateWrapper extends React.PureComponent<PropsType, {}> {
    static defaultProps: PropsType;
    render(): JSX.Element;
}
