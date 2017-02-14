"use strict";
function MetricFormatter(opt) {
    return function (clazz) {
        clazz.metricType = opt.metricType;
    };
}
exports.MetricFormatter = MetricFormatter;
//# sourceMappingURL=metric-formatter.annotation.js.map