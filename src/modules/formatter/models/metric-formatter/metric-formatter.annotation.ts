import { KRMetricFormatter } from './metric-formatter.type';
export interface IMetricFormatter {
  metricType: string;
}

export function MetricFormatter(opt: IMetricFormatter) {
  return function (clazz: typeof KRMetricFormatter) {
    clazz.metricType = opt.metricType;
  };
}