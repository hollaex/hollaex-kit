/// <reference types="react" />
import BaseComponent, { PropsType as BasePropsType, StateType as BaseStateType } from './base';
export interface PropsType extends BasePropsType {
    styles?: any;
    upStyle?: any;
    downStyle?: any;
    inputStyle?: any;
    keyboardType?: any;
}
export interface StateType extends BaseStateType {
}
export default class InputNumber extends BaseComponent<PropsType, StateType> {
    _stepDown: any;
    _stepDownText: any;
    _stepUp: any;
    _stepUpText: any;
    onPressIn(type: string): void;
    onPressOut(type: any): void;
    onPressInDown: (e: any) => void;
    onPressOutDown: () => void;
    onPressInUp: (e: any) => void;
    onPressOutUp: () => void;
    getValueFromEvent(e: any): any;
    render(): JSX.Element;
}
