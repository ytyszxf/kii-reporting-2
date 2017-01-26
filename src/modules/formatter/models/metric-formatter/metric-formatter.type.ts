import { IESXMetricFormatter } from '../../interfaces/metric-formatter.interface';

export abstract class KRMetricFormatter {

  public static metricType: string;

  public abstract format(context: any, data: any, opt: IESXMetricFormatter): void;
}