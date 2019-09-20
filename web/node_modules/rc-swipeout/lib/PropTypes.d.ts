import * as React from 'react';
interface IPropTypes {
    left?: Array<{
        text: React.ReactNode;
        onPress?: () => void;
        type?: any;
        style?: any;
        className?: string;
    }>;
    right?: Array<{
        text: React.ReactNode;
        onPress?: () => void;
        type?: any;
        style?: any;
        className?: string;
    }>;
    autoClose?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    disabled?: boolean;
    style?: any;
    prefixCls?: string;
}
export default IPropTypes;
