import { Models } from './date/DataTypes';
export default interface PropsType {
    /** 默认日期，default: today */
    defaultDate?: Date;
    /** 选择值 */
    startDate?: Date;
    /** 选择值 */
    endDate?: Date;
    /** 日期扩展数据 */
    getDateExtra?: (date: Date) => Models.ExtraData;
    /** 无限滚动优化（大范围选择），default: false */
    infiniteOpt?: boolean;
    /** 初始化月个数，default: 6 */
    initalMonths?: number;
    /** 本地化 */
    locale?: Models.Locale;
    /** 最大日期 */
    maxDate?: Date;
    /** 最小日期 */
    minDate?: Date;
    /** 日期点击回调 */
    onCellClick?: (date: Date) => void;
    onLayout?: (clientHight: number) => void;
    /** 选择区间包含不可用日期 */
    onSelectHasDisableDate?: (date: Date[]) => void;
    /** (web only) 样式前缀 */
    prefixCls?: string;
    /** 行大小 */
    rowSize?: 'normal' | 'xl';
    /** 选择类型，default: range，one: 单日，range: 日期区间 */
    type?: 'one' | 'range';
}
