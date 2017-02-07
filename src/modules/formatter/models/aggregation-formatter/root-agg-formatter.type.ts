import { KRAggregationFormatter, IFormatContext } from './aggregation-formatter.type';
import { IESXAggregationFormatter } from '../../interfaces/aggregation-formatter.interface';
import { AggFormatter, FormatMode } from './aggregation-formatter.annotation';

export const ROOT_AGG_FORMATTER = 'ROOT';

@AggFormatter({
  aggType: ROOT_AGG_FORMATTER,
  formatMode: FormatMode.INSERT
})
export class RootAggregationFormatter extends KRAggregationFormatter {

  public format(context: any, data: any, opt: IESXAggregationFormatter): IFormatContext {
    return {
      subContexts: [context],
      subDataset: [data]
    };
  }

}