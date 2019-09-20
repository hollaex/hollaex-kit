import * as React from 'react';
import { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
export { RenderEmptyHandler };
export interface CSPConfig {
    nonce?: string;
}
export interface ConfigConsumerProps {
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    rootPrefixCls?: string;
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
    renderEmpty: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    locale?: Locale;
}
export declare const configConsumerProps: string[];
export interface ConfigProviderProps {
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    prefixCls?: string;
    children?: React.ReactNode;
    renderEmpty?: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    locale?: Locale;
}
export declare const ConfigConsumer: React.ComponentClass<import("@ant-design/create-react-context").ConsumerProps<ConfigConsumerProps>, any>;
declare class ConfigProvider extends React.Component<ConfigProviderProps> {
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string | undefined) => string;
    renderProvider: (context: ConfigConsumerProps, legacyLocale: Locale) => JSX.Element;
    render(): JSX.Element;
}
declare type IReactComponent<P = any> = React.StatelessComponent<P> | React.ComponentClass<P> | React.ClassicComponentClass<P>;
interface BasicExportProps {
    prefixCls?: string;
}
interface ConsumerConfig {
    prefixCls: string;
}
export declare function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig): <ComponentDef>(Component: IReactComponent<any>) => React.FunctionComponent<ExportProps> & ComponentDef;
export default ConfigProvider;
