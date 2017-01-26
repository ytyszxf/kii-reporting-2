import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';

export interface IFormatContext {
  subContexts: Array<Array<any>>;
  subDataset: Array<any>;
}

export abstract class KRAggregationFormatter {
  public static aggType: string;
  public abstract format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext
}