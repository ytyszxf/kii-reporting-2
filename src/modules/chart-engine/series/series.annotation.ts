import { KRSeries } from './series.type';
import { SeriesType } from '../models/series-type.type';

export interface IChartSeriesOptions{
  seriesTypes: SeriesType[]
}

export function ChartSeries(opt: IChartSeriesOptions) {
  return function (clazz: typeof KRSeries) {
    clazz.seriesTypes = opt.seriesTypes;
  }
}