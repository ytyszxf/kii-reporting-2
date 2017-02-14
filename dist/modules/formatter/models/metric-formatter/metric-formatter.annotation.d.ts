import { KRMetricFormatter } from './metric-formatter.type';
export interface IMetricFormatter {
    metricType: string;
}
export declare function MetricFormatter(opt: IMetricFormatter): (clazz: typeof KRMetricFormatter) => void;
