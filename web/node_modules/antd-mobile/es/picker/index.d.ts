import React from 'react';
import AbstractPicker from './AbstractPicker';
import PropTypes from 'prop-types';
export declare const nonsense: JSX.Element;
export default class Picker extends AbstractPicker {
    static defaultProps: {
        triggerType: string;
        prefixCls: string;
        pickerPrefixCls: string;
        popupPrefixCls: string;
        format: (values: React.ReactNode[]) => string | React.ReactNode[];
        cols: number;
        cascade: boolean;
        title: string;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    protected popupProps: {
        WrapComponent: string;
        transitionName: string;
        maskTransitionName: string;
    };
}
