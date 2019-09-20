import React, { CSSProperties } from 'react';
import { AccordionPropsTypes } from './PropsType';
export interface AccordionProps extends AccordionPropsTypes {
    className?: string;
    prefixCls?: string;
    openAnimation?: any;
    accordion?: boolean;
    style?: CSSProperties;
}
export default class Accordion extends React.Component<AccordionProps, any> {
    static Panel: any;
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
