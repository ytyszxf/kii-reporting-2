import { IKRXAxis } from './x-axis.interface';
import { IKRYAxis } from './y-axis.interface';
import { IKRTextStyle } from './text-style.interface';
import { IKRLegend } from './legend.interface';
import { IKRChartSeries } from './series.interface';
import { ChartDirection } from '../models/chart-direction.type';

export interface IKRChartBindingOptions{
  x?: IKRXAxis[] | IKRXAxis;
  y?: IKRYAxis[] | IKRYAxis;
  series?: IKRChartSeries | IKRChartSeries[];
  rootField?: string;
}

export interface IKRChartOptions{
  /**
   * @desc chart direction
   * by default bottom to Top
   * if LeftToRight or RightToLeft, data binds to x axis,
   * otherwise data binds to y axis
   */
  direction: ChartDirection;

  /**
   * @desc create a chart container, that may contains multi chart type
   * only works when sertiesType is not specified
   */
  axises?: IKRChartBindingOptions;

  /**
   * @desc create a single series type chart
   */
  [seriesType: string]: IKRChartBindingOptions;
  
  /**
   * @desc legends settings
   */
  legends?: IKRLegend[];

  /**
   * text style settings
   */
  textStyle?: IKRTextStyle;
}
