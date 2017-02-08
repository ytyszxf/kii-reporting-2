import { IKRAxis } from './axis.interface';
import { SeriesType } from '../models/series-type.type';
import { HaltHandler, IHaltHanlder } from '../models/halt-handler.type';
import { IKRChartSeries } from './series.interface';

export interface IKRYAxis extends IKRAxis {
  series?: IKRChartSeries | IKRChartSeries[];
}
