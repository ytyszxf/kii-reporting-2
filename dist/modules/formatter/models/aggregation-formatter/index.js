"use strict";
var date_histogram_formatter_type_1 = require('./date-histogram-formatter.type');
var root_agg_formatter_type_1 = require('./root-agg-formatter.type');
var filter_formatter_type_1 = require('./filter-formatter.type');
var terms_formatter_type_1 = require('./terms-formatter.type');
var histogram_formatter_type_1 = require('./histogram-formatter.type');
var children_formatter_type_1 = require('./children-formatter.type');
exports.AGG_FORMATTERS = [
    histogram_formatter_type_1.KRHistogramFormatter,
    date_histogram_formatter_type_1.KRDateHistogramFormatter,
    root_agg_formatter_type_1.RootAggregationFormatter,
    filter_formatter_type_1.KRFilterFormatter,
    terms_formatter_type_1.KRTermsFormatter,
    children_formatter_type_1.KRChildrenFormatter,
];
//# sourceMappingURL=index.js.map