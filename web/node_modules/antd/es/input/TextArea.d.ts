import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
export interface AutoSizeType {
    minRows?: number;
    maxRows?: number;
}
export declare type HTMLTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface TextAreaProps extends HTMLTextareaProps {
    prefixCls?: string;
    autosize?: boolean | AutoSizeType;
    onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}
export interface TextAreaState {
    textareaStyles?: React.CSSProperties;
    /** We need add process style to disable scroll first and then add back to avoid unexpected scrollbar  */
    resizing?: boolean;
}
declare class TextArea extends React.Component<TextAreaProps, TextAreaState> {
    nextFrameActionId: number;
    resizeFrameId: number;
    state: {
        textareaStyles: {};
        resizing: boolean;
    };
    private textAreaRef;
    componentDidMount(): void;
    componentDidUpdate(prevProps: TextAreaProps): void;
    componentWillUnmount(): void;
    saveTextAreaRef: (textArea: HTMLTextAreaElement) => void;
    handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    resizeOnNextFrame: () => void;
    resizeTextarea: () => void;
    focus(): void;
    blur(): void;
    renderTextArea: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default TextArea;
