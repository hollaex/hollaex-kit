export declare function getTransformPropValue(v: any): {
    transform: any;
    WebkitTransform: any;
    MozTransform: any;
};
export declare function getPxStyle(value: number | string, unit?: string, vertical?: boolean): string;
export declare function setPxStyle(el: HTMLElement, value: number | string, unit?: string, vertical?: boolean, useLeft?: boolean): void;
export declare function setTransform(style: any, v: any): void;
