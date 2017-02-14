"use strict";
var aggregation_formatter_type_1 = require('./aggregation-formatter.type');
var aggregation_formatter_annotation_1 = require('./aggregation-formatter.annotation');
exports.ROOT_AGG_FORMATTER = 'ROOT';
var RootAggregationFormatter = (function (_super) {
    __extends(RootAggregationFormatter, _super);
    function RootAggregationFormatter() {
        _super.apply(this, arguments);
    }
    RootAggregationFormatter.prototype.format = function (context, data, opt) {
        return {
            subContexts: [context],
            subDataset: [data]
        };
    };
    RootAggregationFormatter = __decorate([
        aggregation_formatter_annotation_1.AggFormatter({
            aggType: exports.ROOT_AGG_FORMATTER,
            formatMode: aggregation_formatter_annotation_1.FormatMode.INSERT
        }), 
        __metadata('design:paramtypes', [])
    ], RootAggregationFormatter);
    return RootAggregationFormatter;
}(aggregation_formatter_type_1.KRAggregationFormatter));
exports.RootAggregationFormatter = RootAggregationFormatter;
//# sourceMappingURL=root-agg-formatter.type.js.map