import { IESXAggregationFormatter } from '../../formatter/interfaces/aggregation-formatter.interface';
import { IChartQuery } from '../../formatter/interfaces/chart-query.interface';
export declare class KRQueryParser {
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
    parseQuery(query: IChartQuery): IESXAggregationFormatter;
    /**
     * @param  {IESAggregation} aggregation
     * @param  {IESXAggregationFormatter} parentFormatter
     * @desc retrival aggregation tree and parse aggregation
     */
    private parse(aggregation, parentFormatter);
    /**
     * @param  {any} obj
     * @desc decide if given node is a metric or an aggregation
     */
    private isMetric(obj);
    private getType(aggregationName);
}
