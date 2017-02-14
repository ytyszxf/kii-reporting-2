import { IKRTextStyle } from './text-style.interface';
import { IKRLineStyle } from './line-style.interface';
import { IKRChartSeries } from './series.interface';
export interface IKRAxisLine {
    show?: boolean;
    onZero?: boolean;
    lineStyle?: IKRLineStyle;
}
export interface IKRAxisTick {
    show?: boolean;
    alignWithLabel?: boolean;
    interval?: number;
    inside?: boolean;
    length?: number;
    lineStyle?: IKRLineStyle;
}
export interface IKRAxisLabel {
    show?: boolean;
    interval?: number;
    inside?: boolean;
    rotate?: number;
    margin?: number;
    formatter?: string | Function;
    textStyle?: IKRTextStyle;
}
export interface IKRAxisOptions {
    position?: 'top' | 'bottom';
    type?: 'value' | 'time' | 'category';
    name?: string;
    nameLocation?: 'start' | 'middle' | 'end';
    nameTextStyle?: IKRTextStyle;
    nameGap?: number;
    nameRotation?: number;
    inverse?: boolean;
    boundaryGap?: boolean | [string, string];
    min?: number;
    max?: number;
    scale?: boolean;
    splitNumber?: number;
    minInterval?: number;
    interval?: number;
    axisLine?: IKRAxisLine;
    axisTick?: IKRAxisTick;
    axisLabel?: IKRAxisLabel;
    formatter?: Function;
    data?: Array<any>;
}
export interface IKRAxis {
    options?: IKRAxisOptions;
    field?: string;
    series?: IKRChartSeries | IKRChartSeries[];
}
