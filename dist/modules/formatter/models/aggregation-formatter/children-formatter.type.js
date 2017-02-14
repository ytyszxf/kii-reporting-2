"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
var KRChildrenFormatter = (function (_super) {
    __extends(KRChildrenFormatter, _super);
    function KRChildrenFormatter() {
        _super.apply(this, arguments);
    }
    KRChildrenFormatter.prototype.format = function (context, data, opt) {
        var subContext = {};
        context[opt.field] = [[opt.field, subContext]];
        return {
            subContexts: [subContext],
            subDataset: [data]
        };
    };
    KRChildrenFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: 'children',
            formatMode: aggregation_formatter_annotation_1.FormatMode.INSERT
        }), 
        __metadata('design:paramtypes', [])
    ], KRChildrenFormatter);
    return KRChildrenFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.KRChildrenFormatter = KRChildrenFormatter;
//# sourceMappingURL=children-formatter.type.js.map