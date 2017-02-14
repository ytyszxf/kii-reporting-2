"use strict";
var formatter_engine_type_1 = require('./modules/formatter/formatter-engine.type');
var index_1 = require('./modules/formatter/models/aggregation-formatter/index');
var index_2 = require('./modules/formatter/models/metric-formatter/index');
var chart_engine_type_1 = require('./modules/chart-engine/chart-engine.type');
var index_3 = require('./modules/chart-engine/series/index');
function bootstrap(conf) {
    var formatterEngine = new formatter_engine_type_1.FormatterEngine();
    formatterEngine.registerAggFormatters(index_1.AGG_FORMATTERS);
    formatterEngine.registerMetricFormatters(index_2.METRIC_FORMATTERS);
    if (conf) {
        conf.aggFormatters &&
            formatterEngine.registerAggFormatters(conf.aggFormatters);
        conf.metricFormatters &&
            formatterEngine.registerMetricFormatters(conf.metricFormatters);
    }
    var chartEngine = new chart_engine_type_1.KRChartEngine(index_3.SERIES_TYPES);
    return {
        formatterEngine: formatterEngine,
        chartEngine: chartEngine
    };
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map