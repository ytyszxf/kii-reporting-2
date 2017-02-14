import { KRAggregationFormatter } from './aggregation-formatter.type';
export declare enum FormatMode {
    INSERT = 0,
    EXPAND = 1,
}
export interface IAggFormatter {
    aggType: string;
    formatMode: FormatMode;
}
export declare function AggFormatter(opt: IAggFormatter): (clazz: typeof KRAggregationFormatter) => void;
