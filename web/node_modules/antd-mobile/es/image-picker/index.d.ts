import React from 'react';
import { ImagePickerPropTypes as BasePropsType } from './PropsType';
export interface ImagePickerPropTypes extends BasePropsType {
    prefixCls?: string;
    className?: string;
}
declare function noop(): void;
export default class ImagePicker extends React.Component<ImagePickerPropTypes, any> {
    static defaultProps: {
        prefixCls: string;
        files: never[];
        onChange: typeof noop;
        onImageClick: typeof noop;
        onAddImageClick: typeof noop;
        onFail: typeof noop;
        selectable: boolean;
        multiple: boolean;
        accept: string;
        length: number;
    };
    fileSelectorInput: HTMLInputElement | null;
    getOrientation: (file: any, callback: (_: number) => void) => void;
    getRotation: (orientation?: number) => number;
    removeImage: (index: number) => void;
    addImage: (imgItem: any) => void;
    onImageClick: (index: number) => void;
    onFileChange: () => void;
    parseFile: (file: any, index: number) => void;
    render(): JSX.Element;
}
export {};
