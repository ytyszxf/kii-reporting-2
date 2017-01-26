import { KRAggregationFormatter } from './aggregation-formatter.type';

export interface IAggFormatter{
  aggType: string;
};

export function AggFormatter(opt: IAggFormatter) {
  return function (clazz: typeof KRAggregationFormatter) {
    clazz.aggType = opt.aggType;
  };
}