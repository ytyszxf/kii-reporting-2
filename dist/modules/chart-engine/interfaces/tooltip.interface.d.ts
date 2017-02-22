import { IKRTextStyle } from './text-style.interface';
export interface IKRToolTip {
    show?: boolean;
    showContent?: boolean;
    trigger?: 'item' | 'axis';
    triggerOn?: 'mousemove' | 'click' | 'none';
    alwaysShowContent?: boolean;
    showDelay?: number;
    hideDelay?: number;
    enterable?: boolean;
    position?: string | Array<any> | Function;
    confine?: boolean;
    transitionDuration?: number;
    formatter?: string | Function;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number;
    textStyle?: IKRTextStyle;
    extraCssText?: string;
    axisPointer?: any;
}
