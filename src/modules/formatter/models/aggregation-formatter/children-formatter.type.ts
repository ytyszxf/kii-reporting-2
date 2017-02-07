import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { AggFormatter, FormatMode } from './aggregation-formatter.annotation';

@AggFormatter({
  aggType: 'children',
  formatMode: FormatMode.INSERT
})
export class KRChildrenFormatter extends KRAggregationFormatter {

  public format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext {
    let subContext = {};
    context[opt.field] = [[opt.field, subContext]];

    return {
      subContexts: [subContext],
      subDataset: [data]
    };
  }

}