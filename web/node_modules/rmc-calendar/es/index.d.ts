import { Models } from './date/DataTypes';
export { default as Calendar, ExtraData, PropsType as CalendarPropsType } from './Calendar';
export { default as DatePicker, PropsType as DatePickerPropsType } from './DatePicker';
declare const Locale: {
    zhCN: Models.Locale;
    enUS: Models.Locale;
};
declare type LocaleType = Models.Locale;
export { Locale, LocaleType };
