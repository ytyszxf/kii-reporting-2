"use strict";
var metric_formatter_type_1 = require('./metric-formatter.type');
var metric_formatter_annotation_1 = require('./metric-formatter.annotation');
exports.DEFAULT_METRIC_FORMMATTER = 'DEFAULT';
var DefaultMetricFormatter = (function (_super) {
    __extends(DefaultMetricFormatter, _super);
    function DefaultMetricFormatter() {
        _super.apply(this, arguments);
    }
    DefaultMetricFormatter.prototype.format = function (context, data, opt) {
        context[opt.field] = data.value;
    };
    DefaultMetricFormatter = __decorate([
        metric_formatter_annotation_1.MetricFormatter({
            metricType: exports.DEFAULT_METRIC_FORMMATTER
        }), 
        __metadata('design:paramtypes', [])
    ], DefaultMetricFormatter);
    return DefaultMetricFormatter;
}(metric_formatter_type_1.KRMetricFormatter));
exports.DefaultMetricFormatter = DefaultMetricFormatter;
//# sourceMappingURL=default-metric-formatter.type.js.map