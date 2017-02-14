import { KRSeries } from './series.type';
import { SeriesType } from '../models/series-type.type';
export interface IChartSeriesOptions {
    seriesTypes: SeriesType[];
    hasAxises: boolean;
}
export declare function ChartSeries(opt: IChartSeriesOptions): (clazz: typeof KRSeries) => void;
