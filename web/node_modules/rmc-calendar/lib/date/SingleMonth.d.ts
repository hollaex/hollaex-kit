import * as React from 'react';
import { Models } from './DataTypes';
export interface PropsType {
    locale: Models.Locale;
    monthData: Models.MonthData;
    rowSize?: 'normal' | 'xl';
    getDateExtra?: (date: Date) => Models.ExtraData;
    onCellClick?: (data: Models.CellData, monthData: Models.MonthData) => void;
}
export default class SingleMonth extends React.PureComponent<PropsType, {
    weekComponents: React.ReactNode[];
}> {
    static defaultProps: PropsType;
    wrapperDivDOM: HTMLDivElement | null;
    constructor(props: PropsType);
    componentWillMount(): void;
    genWeek: (weeksData: Models.CellData[], index: number) => void;
    updateWeeks: (monthData?: Models.MonthData | undefined) => void;
    componentWillReceiveProps(nextProps: PropsType): void;
    setWarpper: (dom: HTMLDivElement) => void;
    render(): JSX.Element;
}
