import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { FormatMode } from './aggregation-formatter.annotation';

export interface IFormatContext {
  subContexts: Array<any>;
  subDataset: Array<any>;
}

export abstract class KRAggregationFormatter {
  public static aggType: string;
  public static formatMode: FormatMode;
  public abstract format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext;
}