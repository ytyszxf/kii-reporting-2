import { IKRTextStyle } from './text-style.interface';
export interface IKRLegend {
    show?: boolean;
    left?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: string | number;
    height?: string | number;
    orient?: 'horizontal' | 'vertical';
    align?: 'auto' | 'left' | 'right';
    padding?: number | [number, number] | [number, number, number, number];
    itemGap?: number;
    itemWidth?: number;
    itemHeight?: number;
    formatter?: string | Function;
    selectedMode?: boolean;
    inactiveColor?: string;
    selected?: {
        [seriesName: string]: boolean;
    };
    textStyle?: IKRTextStyle;
    backgroundColor?: string;
}
