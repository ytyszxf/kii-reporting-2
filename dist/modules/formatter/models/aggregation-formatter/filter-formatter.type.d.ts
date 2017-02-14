import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
export declare class KRFilterFormatter extends KRAggregationFormatter {
    format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext;
}
