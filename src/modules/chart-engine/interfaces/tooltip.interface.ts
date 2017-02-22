import { IKRTextStyle } from './text-style.interface';

export interface IKRToolTip {
  show?: boolean; // default: true
  showContent?: boolean; // default: true
  trigger?: 'item' | 'axis'; // default: item;
  triggerOn?: 'mousemove' | 'click' | 'none'; // default: mousemove
  alwaysShowContent?: boolean; // default: false;
  showDelay?: number; // default: 0;
  hideDelay?: number; // default: 100;
  enterable?: boolean; // default: false;
  position?: string | Array<any> | Function;
  confine?: boolean; // default: false;
  transitionDuration?: number; // default: 0.4;
  formatter?: string | Function;
  backgroundColor?: string; // default: rgba(50,50,50,0.7)
  borderColor?: string; // default: #333;
  borderWidth?: number; // default: 1;
  padding?: number; // default: 5;
  textStyle?: IKRTextStyle;
  extraCssText?: string;
  axisPointer?: any;
}