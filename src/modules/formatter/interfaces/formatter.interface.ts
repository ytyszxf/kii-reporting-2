import { IESXAggregationFormatter } from './aggregation-formatter.interface';
import { IESXMetricFormatter } from './metric-formatter.interface';

export interface IESXFormatter {
  aggFormatters: IESXAggregationFormatter[];
  metricFormatters: IESXMetricFormatter[];
}
