import React from 'react';
import { CallbackOrActions } from './PropsType';
export default function prompt(title: React.ReactNode, message: React.ReactNode, callbackOrActions: CallbackOrActions<React.CSSProperties>, type?: string, defaultValue?: string, placeholders?: string[], platform?: string): {
    close: () => void;
};
