import React from 'react';
import { PropsType } from './PropsType';
export default class PullToRefresh extends React.Component<PropsType, any> {
    static defaultProps: PropsType;
    state: {
        currSt: string;
        dragOnEdge: boolean;
    };
    containerRef: any;
    contentRef: any;
    _to: any;
    _ScreenY: any;
    _startScreenY: any;
    _lastScreenY: any;
    _timer: any;
    _isMounted: boolean;
    shouldUpdateChildren: boolean;
    shouldComponentUpdate(nextProps: any): boolean;
    componentDidUpdate(prevProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    triggerPullToRefresh: () => void;
    init: (ele: any) => void;
    destroy: (ele: any) => void;
    onTouchStart: (_ele: any, e: any) => void;
    isEdge: (ele: any, direction: string) => boolean | undefined;
    damping: (dy: number) => number;
    onTouchMove: (ele: any, e: any) => void;
    onTouchEnd: () => void;
    reset: () => void;
    setContentStyle: (ty: number) => void;
    render(): JSX.Element;
}
