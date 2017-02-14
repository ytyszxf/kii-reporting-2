import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { FormatMode } from './aggregation-formatter.annotation';
export interface IFormatContext {
    subContexts: Array<any>;
    subDataset: Array<any>;
}
export declare abstract class KRAggregationFormatter {
    static aggType: string;
    static formatMode: FormatMode;
    abstract format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext;
}
