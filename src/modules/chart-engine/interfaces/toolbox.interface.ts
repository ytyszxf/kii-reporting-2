export interface IToolBox {
  show: boolean;
  orientation: 'horizontal' | 'vertical';
  itemSize: number; // default: 15
  itemGap: number; // default: 10
  showTitle: boolean; // default: true
  feature: any;
  iconStyle: any;
  zlevel: number; // default: 0;
  z: number; // default: 2
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}