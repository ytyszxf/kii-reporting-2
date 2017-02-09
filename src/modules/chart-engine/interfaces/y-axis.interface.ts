import { IKRAxis } from './axis.interface';
import { IKRChartSeries } from './series.interface';

export interface IKRYAxis extends IKRAxis {
  series?: IKRChartSeries | IKRChartSeries[];
  field?: string;
}
