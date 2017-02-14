"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
var KRFilterFormatter = (function (_super) {
    __extends(KRFilterFormatter, _super);
    function KRFilterFormatter() {
        _super.apply(this, arguments);
    }
    KRFilterFormatter.prototype.format = function (context, data, opt) {
        var subContext = {};
        context[opt.field] = [[opt.field, subContext]];
        return {
            subContexts: [subContext],
            subDataset: [data]
        };
    };
    KRFilterFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: 'filter',
            formatMode: aggregation_formatter_annotation_1.FormatMode.INSERT
        }), 
        __metadata('design:paramtypes', [])
    ], KRFilterFormatter);
    return KRFilterFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.KRFilterFormatter = KRFilterFormatter;
//# sourceMappingURL=filter-formatter.type.js.map