import * as React from 'react';
export interface TypographyProps {
    id?: string;
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    ['aria-label']?: string;
}
interface InternalTypographyProps extends TypographyProps {
    component?: string;
    setContentRef?: (node: HTMLElement) => void;
}
declare const Typography: React.SFC<InternalTypographyProps>;
export default Typography;
