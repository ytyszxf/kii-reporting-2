import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
export declare const ROOT_AGG_FORMATTER: string;
export declare class RootAggregationFormatter extends KRAggregationFormatter {
    format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext;
}
