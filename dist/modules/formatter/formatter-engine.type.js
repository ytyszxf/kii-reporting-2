"use strict";
var root_agg_formatter_type_1 = require('./models/aggregation-formatter/root-agg-formatter.type');
var default_metric_formatter_type_1 = require('./models/metric-formatter/default-metric-formatter.type');
var data_dictionary_type_1 = require('./models/data-dictionary.type');
var FormatterEngine = (function () {
    function FormatterEngine() {
        this._metricFormatters = {};
        this._aggFormatters = {};
    }
    FormatterEngine.prototype.format = function (response, formatOpt) {
        var context = {};
        return this._format(response.aggregations, context, formatOpt);
    };
    /**
     * @param  {string} name
     * @param  {KRQueryFormatter} formatter
     * @desc description
     */
    FormatterEngine.prototype.registerAggFormatters = function (formatters) {
        var _this = this;
        formatters.forEach(function (formatter) {
            _this._aggFormatters[formatter.aggType] = new formatter;
        });
    };
    /**
     * @param  {string} name
     * @param  {KRQueryFormatter} formatter
     */
    FormatterEngine.prototype.registerMetricFormatters = function (formatters) {
        var _this = this;
        formatters.forEach(function (formatter) {
            _this._metricFormatters[formatter.metricType] = new formatter;
        });
    };
    FormatterEngine.prototype._format = function (data, context, formatOpt) {
        var _this = this;
        var formatter = this._findAggregationFormatter(formatOpt.aggregationName);
        var formatContexts = formatter.format(context, data, formatOpt);
        formatOpt.metrics.forEach(function (metric) {
            var metricFormatter = _this._findMetricFormatter(metric.metricName);
            formatContexts.subContexts.forEach(function (subContext, i) {
                metricFormatter.format(subContext, formatContexts.subDataset[i][metric.field], metric);
            });
        });
        formatOpt.children.forEach(function (agg) {
            var aggFormatter = _this._findAggregationFormatter(agg.aggregationName);
            formatContexts.subContexts.forEach(function (subContext, i) {
                _this._format(formatContexts.subDataset[i][agg.field], subContext, agg);
            });
        });
        return new data_dictionary_type_1.DataDictionary(context, formatOpt, this);
    };
    FormatterEngine.prototype.findAggregationFormatter = function (name) {
        return this._findAggregationFormatter(name);
    };
    /**
     * @param  {string} name formatter name
     * @return {KRQueryFormatter} formatter
     */
    FormatterEngine.prototype._findAggregationFormatter = function (name) {
        if (!name) {
            return this._aggFormatters[root_agg_formatter_type_1.ROOT_AGG_FORMATTER];
        }
        return this._aggFormatters[name];
    };
    /**
     * @param  {string} name formatter name
     * @return {KRQueryFormatter} formatter
     */
    FormatterEngine.prototype._findMetricFormatter = function (name) {
        return this._metricFormatters[name] || this._metricFormatters[default_metric_formatter_type_1.DEFAULT_METRIC_FORMMATTER];
    };
    return FormatterEngine;
}());
exports.FormatterEngine = FormatterEngine;
//# sourceMappingURL=formatter-engine.type.js.map