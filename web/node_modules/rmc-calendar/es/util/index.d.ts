import { Models } from '../date/DataTypes';
export declare const mergeDateTime: (date?: Date | undefined, time?: Date | undefined) => Date;
export declare const formatDate: (date: Date, format: string, locale?: Models.Locale | undefined) => string;
export declare function shallowEqual(objA: any, objB: any, exclude?: string[]): boolean;
