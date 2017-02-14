import { IESXAggregationFormatter } from './interfaces/aggregation-formatter.interface';
import { KRMetricFormatter } from './models/metric-formatter/metric-formatter.type';
import { KRAggregationFormatter } from './models/aggregation-formatter/aggregation-formatter.type';
import { DataDictionary } from './models/data-dictionary.type';
export declare class FormatterEngine {
    /**
     * metric formatters
     */
    private _metricFormatters;
    /**
     * aggregation formatters
     */
    private _aggFormatters;
    constructor();
    format(response: any, formatOpt: IESXAggregationFormatter): DataDictionary;
    /**
     * @param  {string} name
     * @param  {KRQueryFormatter} formatter
     * @desc description
     */
    registerAggFormatters(formatters: typeof KRAggregationFormatter[]): void;
    /**
     * @param  {string} name
     * @param  {KRQueryFormatter} formatter
     */
    registerMetricFormatters(formatters: typeof KRMetricFormatter[]): void;
    private _format(data, context, formatOpt);
    findAggregationFormatter(name: string): KRAggregationFormatter;
    /**
     * @param  {string} name formatter name
     * @return {KRQueryFormatter} formatter
     */
    private _findAggregationFormatter(name);
    /**
     * @param  {string} name formatter name
     * @return {KRQueryFormatter} formatter
     */
    private _findMetricFormatter(name);
}
