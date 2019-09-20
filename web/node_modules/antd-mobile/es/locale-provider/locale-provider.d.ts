import PropTypes from 'prop-types';
import React from 'react';
export interface LocaleProviderProps {
    locale: {
        Pagination?: object;
        DatePicker?: object;
        DatePickerView?: object;
        InputItem?: object;
    };
    children?: React.ReactElement<any>;
}
export default class LocaleProvider extends React.Component<LocaleProviderProps, any> {
    static propTypes: {
        locale: PropTypes.Requireable<object>;
    };
    static childContextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    getChildContext(): {
        antLocale: {
            exist: boolean;
            Pagination?: object | undefined;
            DatePicker?: object | undefined;
            DatePickerView?: object | undefined;
            InputItem?: object | undefined;
        };
    };
    render(): React.ReactElement<any>;
}
