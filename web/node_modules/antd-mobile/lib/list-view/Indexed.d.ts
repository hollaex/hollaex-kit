import React from 'react';
import { ListViewPropsType } from './PropsType';
export interface MIndexedListProps extends ListViewPropsType {
    onQuickSearch?: (sectionID: any, topId?: any) => void;
    quickSearchBarStyle?: React.CSSProperties;
    quickSearchBarTop?: {
        value: string;
        label: string;
    };
    delayTime?: number;
    delayActivityIndicator?: React.ReactNode;
}
export default class MIndexedList extends React.Component<MIndexedListProps, any> {
    static defaultProps: {
        prefixCls: string;
        listPrefixCls: string;
        listViewPrefixCls: string;
    };
    indexedListRef: any;
    render(): JSX.Element;
}
