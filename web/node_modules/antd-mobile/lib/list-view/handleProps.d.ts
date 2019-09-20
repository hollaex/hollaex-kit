import React from 'react';
import { ListViewProps } from './index';
export default function handleProps(props: ListViewProps, isIndexed: boolean): {
    restProps: {
        onQuickSearch?: ((sectionID: any, topId?: any) => void) | undefined;
        quickSearchBarStyle?: React.CSSProperties | undefined;
        quickSearchBarTop?: {
            value: string;
            label: string;
        } | undefined;
        delayTime?: number | undefined;
        delayActivityIndicator?: any;
        dataSource: any;
        initialListSize?: number | undefined;
        onEndReached?: ((e?: any) => void) | undefined;
        onEndReachedThreshold?: number | undefined;
        pageSize?: number | undefined;
        renderRow: (rowData: any, sectionID: string | number, rowID: string | number, highlightRow?: boolean | undefined) => React.ReactElement<any>;
        renderScrollComponent?: ((p: any) => React.ReactElement<any>) | undefined;
        renderSeparator?: ((sectionID: string | number, rowID: string | number, adjacentRowHighlighted?: boolean | undefined) => React.ReactElement<any>) | undefined;
        scrollRenderAheadDistance?: number | undefined;
        horizontal?: boolean | undefined;
        onContentSizeChange?: ((w: number, h: number) => void) | undefined;
        onScroll?: ((e?: any) => void) | undefined;
        scrollEventThrottle?: number | undefined;
        onLayout?: ((event: any) => void) | undefined;
        style?: React.CSSProperties | undefined;
        contentContainerStyle?: React.CSSProperties | undefined;
        renderSectionWrapper?: (() => React.ReactElement<any>) | undefined;
        renderSectionBodyWrapper?: (() => React.ReactElement<any>) | undefined;
        useBodyScroll?: boolean | undefined;
        pullToRefresh?: React.ReactNode;
        className?: string | undefined;
        prefixCls?: string | undefined;
        listPrefixCls?: string | undefined;
        listViewPrefixCls?: string | undefined;
        sectionBodyClassName?: string | undefined;
    };
    extraProps: {
        renderHeader: any;
        renderFooter: any;
        renderSectionHeader: any;
        renderBodyComponent: () => React.ReactElement<any>;
    };
};
