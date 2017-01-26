import { KRMetricFormatter } from './metric-formatter.type';
import { MetricFormatter } from './metric-formatter.annotation';
import { IESXMetricFormatter } from '../../interfaces/metric-formatter.interface';

export const DEFAULT_METRIC_FORMMATTER = 'DEFAULT';

@MetricFormatter({
  metricType: DEFAULT_METRIC_FORMMATTER
})
export class DefaultMetricFormatter extends KRMetricFormatter{

  public format(context: any, data: any, opt: IESXMetricFormatter): void {
    context[opt.field] = data.value;
  }

}