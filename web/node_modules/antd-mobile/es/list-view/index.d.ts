import React from 'react';
import IndexedList from './Indexed';
import { ListViewPropsType } from './PropsType';
export interface ListViewProps extends ListViewPropsType {
    onQuickSearch?: (sectionID: any, topId?: any) => void;
    quickSearchBarStyle?: React.CSSProperties;
    quickSearchBarTop?: {
        value: string;
        label: string;
    };
    delayTime?: number;
    delayActivityIndicator?: any;
}
export default class ListView extends React.Component<ListViewProps, any> {
    static defaultProps: {
        prefixCls: string;
        listPrefixCls: string;
    };
    static DataSource: any;
    static IndexedList: typeof IndexedList;
    listviewRef: any;
    scrollTo: (...args: any[]) => any;
    getInnerViewNode: () => any;
    render(): JSX.Element;
}
