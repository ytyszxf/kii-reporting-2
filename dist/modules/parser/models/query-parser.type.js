"use strict";
var KRQueryParser = (function () {
    function KRQueryParser() {
    }
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
    KRQueryParser.prototype.parseQuery = function (query) {
        var formatter = {
            aggregationName: null,
            field: null,
            metrics: [],
            children: [],
            type: null,
        };
        this.parse(query.aggregation, formatter);
        return formatter;
    };
    /**
     * @param  {IESAggregation} aggregation
     * @param  {IESXAggregationFormatter} parentFormatter
     * @desc retrival aggregation tree and parse aggregation
     */
    KRQueryParser.prototype.parse = function (aggregation, parentFormatter) {
        var _this = this;
        Object.keys(aggregation).forEach(function (key) {
            if (_this.isMetric(aggregation[key])) {
                var metricName = Object.keys(aggregation[key])[0];
                var metric = {
                    metricName: metricName,
                    field: key
                };
                parentFormatter.metrics.push(metric);
            }
            else {
                var aggregationName = Object.keys(aggregation[key]).find(function (k) { return k !== 'aggs' && k !== 'aggregations'; });
                var formatter = {
                    aggregationName: aggregationName,
                    field: key,
                    metrics: [],
                    children: [],
                    type: _this.getType(aggregationName)
                };
                var childAggreagations = aggregation[key].aggs || aggregation[key].aggregations;
                _this.parse(childAggreagations, formatter);
                parentFormatter.children.push(formatter);
            }
        });
    };
    /**
     * @param  {any} obj
     * @desc decide if given node is a metric or an aggregation
     */
    KRQueryParser.prototype.isMetric = function (obj) {
        return !(obj.aggs || obj.aggregations);
    };
    KRQueryParser.prototype.getType = function (aggregationName) {
        switch (aggregationName) {
            case 'date_histogram':
                return 'time';
            case 'histogram':
                return 'value';
            default:
                return 'category';
        }
    };
    return KRQueryParser;
}());
exports.KRQueryParser = KRQueryParser;
//# sourceMappingURL=query-parser.type.js.map