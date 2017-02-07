import { KRAggregationFormatter } from './aggregation-formatter.type';

export enum FormatMode {
  INSERT,
  EXPAND
}

export interface IAggFormatter{
  aggType: string;
  formatMode: FormatMode
};

export function AggFormatter(opt: IAggFormatter) {
  return function (clazz: typeof KRAggregationFormatter) {
    clazz.aggType = opt.aggType;
    clazz.formatMode = opt.formatMode;
  };
}