import { KRSeries } from './series.type';
import { SeriesType } from '../models/series-type.type';
import { TriggerType } from '../interfaces/trigger.type';
export interface IChartSeriesOptions {
    seriesTypes: SeriesType[];
    hasAxises: boolean;
    defaultTrigger: TriggerType;
}
export declare function ChartSeries(opt: IChartSeriesOptions): (clazz: typeof KRSeries) => void;
