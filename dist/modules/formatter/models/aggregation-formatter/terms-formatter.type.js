"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
var KRTermsFormatter = (function (_super) {
    __extends(KRTermsFormatter, _super);
    function KRTermsFormatter() {
        _super.apply(this, arguments);
    }
    KRTermsFormatter.prototype.format = function (context, data, opt) {
        var result = data.buckets.map(function (bucket) { return [bucket.key, {}]; });
        context[opt.field] = result;
        return {
            subContexts: result.map(function (r) { return r[1]; }),
            subDataset: data.buckets
        };
    };
    KRTermsFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: 'terms',
            formatMode: aggregation_formatter_annotation_1.FormatMode.EXPAND
        }), 
        __metadata('design:paramtypes', [])
    ], KRTermsFormatter);
    return KRTermsFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.KRTermsFormatter = KRTermsFormatter;
//# sourceMappingURL=terms-formatter.type.js.map