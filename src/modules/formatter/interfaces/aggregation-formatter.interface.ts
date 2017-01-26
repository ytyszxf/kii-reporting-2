import { IESXMetricFormatter } from './metric-formatter.interface';
import { AggregationValueType } from '../../parser/models/aggregation-value-type.enum';

export interface IESXAggregationFormatter {
  aggregationName: string;
  field: string;
  metrics: IESXMetricFormatter[];
  children: IESXAggregationFormatter[];
  type: AggregationValueType;
}
