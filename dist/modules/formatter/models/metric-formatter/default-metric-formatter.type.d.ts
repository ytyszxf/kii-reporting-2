import { KRMetricFormatter } from './metric-formatter.type';
import { IESXMetricFormatter } from '../../interfaces/metric-formatter.interface';
export declare const DEFAULT_METRIC_FORMMATTER: string;
export declare class DefaultMetricFormatter extends KRMetricFormatter {
    format(context: any, data: any, opt: IESXMetricFormatter): void;
}
