import { IESAggregation } from '../../formatter/interfaces/es/es-aggregation.interface';
import { IESXFormatter } from '../../formatter/interfaces/formatter.interface';
import { IESXAggregationFormatter } from '../../formatter/interfaces/aggregation-formatter.interface';
import { IESXMetricFormatter } from '../../formatter/interfaces/metric-formatter.interface';
import { IChartQuery } from '../../formatter/interfaces/chart-query.interface';
import { AggregationValueType } from './aggregation-value-type.enum';

export class KRQueryParser {

  /**
   * @param  {IChartQuery} query
   * @desc parse ES query aggregation and generate data formatters
   * @example
   * <code>
   * {
      filter: {},
      aggregation: {
        "byHour": {
          "aggs": {
            "bulb": {
              "filter": {
                "terms": {
                  "thingID": ["5be567f6-7252-4c0b-9f19-f82bf07105f1", "25de2faf-107e-456f-9af3-950c33c92af3", "683d6331-1d83-4ab5-a8bb-4968a04908bc"]
                }
              },
              "aggs": {
                "avg_brightness": {
                  "avg": {
                    "field": "brightness"
                  }
                }
              }
            }
          },
          "date_histogram": {
            "field": "date",
            "interval": "hour"
          }
        }
      }
    }
    </code>
   */
  public parseQuery(query: IChartQuery): IESXAggregationFormatter {
    let formatter: IESXAggregationFormatter = {
      aggregationName: null,
      field: null,
      metrics: [],
      children: [],
      type: null,
    };

    this.format(query.aggregation, formatter);

    return formatter
  }
  
  /**
   * @param  {IESAggregation} aggregation
   * @param  {IESXAggregationFormatter} parentFormatter
   * @desc retrival aggregation tree and parse aggregation
   */
  private format(aggregation: IESAggregation, parentFormatter: IESXAggregationFormatter): void {
    Object.keys(aggregation).forEach((key) => {
      if (this.isMetric(aggregation[key])) {
        let metricName = Object.keys(aggregation[key])[0];
        let metric: IESXMetricFormatter = {
          metricName: metricName,
          field: key
        };
        parentFormatter.metrics.push(metric);
      } else {
        let aggregationName = Object.keys(aggregation[key]).find(k => k !== 'aggs' && k !== 'aggregations');

        let formatter: IESXAggregationFormatter = {
          aggregationName: aggregationName,
          field: key,
          metrics: [],
          children: [],
          type: this.getType(aggregationName)
        };
        let childAggreagations = aggregation[key].aggs || aggregation[key].aggregations;
        this.format(childAggreagations, formatter);

        parentFormatter.children.push(formatter);
      }
    });
  }

  /**
   * @param  {any} obj
   * @desc decide if given node is a metric or an aggregation
   */
  private isMetric(obj: any): boolean {
    return !(obj.aggs || obj.aggregations);
  }

  private getType(aggregationName: string): AggregationValueType {
    switch (aggregationName) {
      case 'date_histogram':
        return AggregationValueType.DATE;
      case 'histogram':
        return AggregationValueType.VALUE;
      default:
        return AggregationValueType.CATEGORY;
    }
  }
}