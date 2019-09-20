import React from 'react';
import { MarqueeProps } from './Marquee';
import { NoticeBarPropsType } from './PropsType';
export interface NoticeWebProps extends NoticeBarPropsType {
    marqueeProps?: MarqueeProps;
    className?: string;
    prefixCls?: string;
    style?: React.CSSProperties;
}
export default class NoticeBar extends React.Component<NoticeWebProps, any> {
    static defaultProps: {
        prefixCls: string;
        mode: string;
        icon: JSX.Element;
        onClick(): void;
    };
    constructor(props: NoticeWebProps);
    onClick: () => void;
    render(): JSX.Element | null;
}
