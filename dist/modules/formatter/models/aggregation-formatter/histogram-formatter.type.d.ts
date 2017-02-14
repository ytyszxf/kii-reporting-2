import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
export declare class KRHistogramFormatter extends KRAggregationFormatter {
    format(context: any, data: {
        buckets: Array<any>;
    }, opt: IESXAggregationFormatter): IFormatContext;
}
