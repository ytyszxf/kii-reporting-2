import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { AggFormatter } from './aggregation-formatter.annotation';

@AggFormatter({
  aggType: 'filter'
})
export class KRFilterFormatter extends KRAggregationFormatter {

  public format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext {
    context[opt.field] = [opt.field, {}];

    return {
      subContexts: [context[opt.field][1]],
      subDataset: [data]
    };
  }

}