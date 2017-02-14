"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
var KRHistogramFormatter = (function (_super) {
    __extends(KRHistogramFormatter, _super);
    function KRHistogramFormatter() {
        _super.apply(this, arguments);
    }
    KRHistogramFormatter.prototype.format = function (context, data, opt) {
        var result = data.buckets.map(function (bucket) { return [bucket.key, {}]; });
        context[opt.field] = result;
        return {
            subContexts: result.map(function (r) { return r[1]; }),
            subDataset: data.buckets
        };
    };
    KRHistogramFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: 'histogram',
            formatMode: aggregation_formatter_annotation_1.FormatMode.EXPAND
        }), 
        __metadata('design:paramtypes', [])
    ], KRHistogramFormatter);
    return KRHistogramFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.KRHistogramFormatter = KRHistogramFormatter;
//# sourceMappingURL=histogram-formatter.type.js.map