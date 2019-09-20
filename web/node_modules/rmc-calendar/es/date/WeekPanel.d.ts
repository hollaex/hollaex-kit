import * as React from 'react';
import { Models } from './DataTypes';
export interface PropsType {
    locale: Models.Locale;
}
export default class WeekPanel extends React.PureComponent<PropsType, {}> {
    constructor(props: PropsType);
    render(): JSX.Element;
}
