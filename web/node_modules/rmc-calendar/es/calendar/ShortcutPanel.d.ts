import * as React from 'react';
import { Models } from '../date/DataTypes';
export interface PropsType {
    locale: Models.Locale;
    onSelect: (startDate?: Date, endDate?: Date) => void;
}
export default class ShortcutPanel extends React.PureComponent<PropsType, {}> {
    onClick: (type: string) => void;
    render(): JSX.Element;
}
