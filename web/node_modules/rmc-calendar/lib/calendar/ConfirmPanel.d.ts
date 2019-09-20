import * as React from 'react';
import { Models } from '../date/DataTypes';
export interface ConfirmPanelPropsType {
    type?: 'one' | 'range';
    locale: Models.Locale;
    onlyConfirm?: boolean;
    disableBtn?: boolean;
    startDateTime?: Date;
    endDateTime?: Date;
    formatStr?: string;
    onConfirm: () => void;
}
export default class ConfirmPanel extends React.PureComponent<ConfirmPanelPropsType, {}> {
    static defaultProps: ConfirmPanelPropsType;
    onConfirm: () => void;
    formatDate(date: Date): string;
    render(): JSX.Element;
}
