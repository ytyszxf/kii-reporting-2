import { IKRXAxis } from './x-axis.interface';
import { IKRYAxis } from './y-axis.interface';
import { IKRTextStyle } from './text-style.interface';
import { IKRLegend } from './legend.interface';
import { IKRChartSeries } from './series.interface';

export interface IKRChartBindingOptions{
  x?: IKRXAxis;
  y?: IKRYAxis[] | IKRYAxis;
  series?: IKRChartSeries | IKRChartSeries[];
}

export interface IKRChartOptions{
  /**
   * @desc create a chart container, that may contains multi chart type
   * only works when sertiesType is not specified
   */
  axises?: IKRChartBindingOptions

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
