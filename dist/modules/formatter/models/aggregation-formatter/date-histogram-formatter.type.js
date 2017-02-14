"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
var KRDateHistogramFormatter = (function (_super) {
    __extends(KRDateHistogramFormatter, _super);
    function KRDateHistogramFormatter() {
        _super.apply(this, arguments);
    }
    KRDateHistogramFormatter.prototype.format = function (context, data, opt) {
        var result = data.buckets.map(function (bucket) { return [bucket.key, {}]; });
        context[opt.field] = result;
        return {
            subContexts: result.map(function (r) { return r[1]; }),
            subDataset: data.buckets
        };
    };
    KRDateHistogramFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: 'date_histogram',
            formatMode: aggregation_formatter_annotation_1.FormatMode.EXPAND
        }), 
        __metadata('design:paramtypes', [])
    ], KRDateHistogramFormatter);
    return KRDateHistogramFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.KRDateHistogramFormatter = KRDateHistogramFormatter;
//# sourceMappingURL=date-histogram-formatter.type.js.map