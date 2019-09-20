import * as React from 'react';
import { IPickerProps } from './PickerTypes';
declare class Picker extends React.Component<IPickerProps, {}> {
    static defaultProps: {
        children: any[];
    };
    static Item(): void;
    getValue(): any;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): JSX.Element;
}
export default Picker;
