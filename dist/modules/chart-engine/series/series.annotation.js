"use strict";
function ChartSeries(opt) {
    return function (clazz) {
        clazz.seriesTypes = opt.seriesTypes;
        clazz.hasAxises = opt.hasAxises;
    };
}
exports.ChartSeries = ChartSeries;
//# sourceMappingURL=series.annotation.js.map