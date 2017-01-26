import { IESAggregation } from './es/es-aggregation.interface';
import { IESFilter } from './es/es-filter.interface';

export interface IChartQuery{
  filter: IESFilter;
  aggregation: IESAggregation;
}