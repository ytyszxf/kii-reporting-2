"use strict";
function ChartSeries(opt) {
    return function (clazz) {
        clazz.seriesTypes = opt.seriesTypes;
        clazz.hasAxises = opt.hasAxises;
        clazz.defaultTrigger = opt.defaultTrigger;
    };
}
exports.ChartSeries = ChartSeries;
//# sourceMappingURL=series.annotation.js.map