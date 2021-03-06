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
  itemGap?: number; //default: 10
  itemWidth?: number; //default: 25
  itemHeight?: number; //default: 14
  formatter?: string | Function;
  selectedMode?: boolean; // default: true;
  inactiveColor?: string;
  selected?: { [seriesName: string]: boolean };
  textStyle?: IKRTextStyle;
  backgroundColor?: string; // default: transparent;
  bind?: Array<string> | string;
  data?: string[];
}