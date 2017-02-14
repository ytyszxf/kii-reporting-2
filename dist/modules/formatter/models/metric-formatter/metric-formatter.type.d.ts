import { IESXMetricFormatter } from '../../interfaces/metric-formatter.interface';
export declare abstract class KRMetricFormatter {
    static metricType: string;
    abstract format(context: any, data: any, opt: IESXMetricFormatter): void;
}
