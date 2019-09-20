import React from 'react';
import RMCInputNumber from 'rmc-input-number';
import { StepPropsType } from './PropsType';
export interface StepProps extends StepPropsType {
    prefixCls?: string;
    showNumber?: boolean;
    className?: string;
}
export default class Stepper extends React.Component<StepProps, any> {
    static defaultProps: {
        prefixCls: string;
        step: number;
        readOnly: boolean;
        showNumber: boolean;
        focusOnUpDown: boolean;
    };
    stepperRef: RMCInputNumber | null;
    render(): JSX.Element;
}
