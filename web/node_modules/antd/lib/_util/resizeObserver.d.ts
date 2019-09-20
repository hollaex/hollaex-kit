import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
interface ResizeObserverProps {
    children?: React.ReactNode;
    disabled?: boolean;
    onResize?: () => void;
}
declare class ReactResizeObserver extends React.Component<ResizeObserverProps, {}> {
    resizeObserver: ResizeObserver | null;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    onComponentUpdated(): void;
    onResize: () => void;
    destroyObserver(): void;
    render(): {} | null;
}
export default ReactResizeObserver;
