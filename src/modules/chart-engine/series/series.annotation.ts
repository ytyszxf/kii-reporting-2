import { KRSeries } from './series.type';
import { SeriesType } from '../models/series-type.type';
import { TriggerType } from '../interfaces/trigger.type';

export interface IChartSeriesOptions{
  seriesTypes: SeriesType[];
  hasAxises: boolean;
  defaultTrigger: TriggerType;
}

export function ChartSeries(opt: IChartSeriesOptions) {
  return function (clazz: typeof KRSeries) {
    clazz.seriesTypes = opt.seriesTypes;
    clazz.hasAxises = opt.hasAxises;
    clazz.defaultTrigger = opt.defaultTrigger;
  }
}