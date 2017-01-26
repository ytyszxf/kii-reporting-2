import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { AggFormatter } from './aggregation-formatter.annotation';

@AggFormatter({
  aggType: 'terms'
})
export class KRTermsFormatter extends KRAggregationFormatter {

  public format(context: any, data: {buckets: Array<any>}, opt: IESXAggregationFormatter): IFormatContext {
    let result = data.buckets.map(bucket => [bucket.key, {}]);
    context[opt.field] = result;

    return {
      subContexts: result.map(r => r[1]),
      subDataset: data.buckets
    };
  }

}