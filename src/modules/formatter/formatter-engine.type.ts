import { KRQueryFormatter } from './models/query-formatter.type';
import { IESXAggregationFormatter } from './interfaces/aggregation-formatter.interface';
import { KRMetricFormatter } from './models/metric-formatter/metric-formatter.type';
import { KRAggregationFormatter } from './models/aggregation-formatter/aggregation-formatter.type';
import { ROOT_AGG_FORMATTER } from './models/aggregation-formatter/root-agg-formatter.type';
import { DEFAULT_METRIC_FORMMATTER } from './models/metric-formatter/default-metric-formatter.type';
import { DataDictionary } from './models/data-dictionary.type';

export class FormatterEngine {

  /**
   * metric formatters
   */
  private _metricFormatters: { [formatterName: string]: KRMetricFormatter };
  
  /**
   * aggregation formatters
   */
  private _aggFormatters: { [formatterName: string]: KRAggregationFormatter };

  constructor() {
    this._metricFormatters = {};
    this._aggFormatters = {};
  }

  public format(response: any, formatOpt: IESXAggregationFormatter): DataDictionary {
    let context = {};
    return this._format(response.aggregations, context, formatOpt);
  }

  /**
   * @param  {string} name
   * @param  {KRQueryFormatter} formatter
   * @desc description
   */
  public registerAggFormatters(formatters: typeof KRAggregationFormatter[]) {
    formatters.forEach(formatter => {
      this._aggFormatters[formatter.aggType] = new (<any>formatter);
    });
  }

  /**
   * @param  {string} name
   * @param  {KRQueryFormatter} formatter
   */
  public registerMetricFormatters(formatters: typeof KRMetricFormatter[]) {
    formatters.forEach(formatter => {
      this._metricFormatters[formatter.metricType] = new (<any>formatter);
    });
  }

  private _format(data, context: any, formatOpt: IESXAggregationFormatter): DataDictionary {
    let formatter = this._findAggregationFormatter(formatOpt.aggregationName);
    let formatContexts = formatter.format(context, data, formatOpt);

    formatOpt.metrics.forEach((metric) => {
      let metricFormatter = this._findMetricFormatter(metric.metricName);
      formatContexts.subContexts.forEach((subContext, i) => {
        metricFormatter.format(subContext, formatContexts.subDataset[i][metric.field], metric);
      });
    });

    formatOpt.children.forEach(agg => {
      let aggFormatter = this._findAggregationFormatter(agg.aggregationName);
      formatContexts.subContexts.forEach((subContext, i) => {
        this._format(formatContexts.subDataset[i][agg.field], subContext, agg);
      });
    });

    return new DataDictionary(context, formatOpt, this);
  }

  public findAggregationFormatter(name: string) {
    return this._findAggregationFormatter(name);
  }
  
  /**
   * @param  {string} name formatter name
   * @return {KRQueryFormatter} formatter
   */
  private _findAggregationFormatter(name: string) {
    if (!name) {
      return this._aggFormatters[ROOT_AGG_FORMATTER];
    }
    return this._aggFormatters[name];
  }

  /**
   * @param  {string} name formatter name
   * @return {KRQueryFormatter} formatter
   */
  private _findMetricFormatter(name: string) {
    return this._metricFormatters[name] || this._metricFormatters[DEFAULT_METRIC_FORMMATTER];
  }
}