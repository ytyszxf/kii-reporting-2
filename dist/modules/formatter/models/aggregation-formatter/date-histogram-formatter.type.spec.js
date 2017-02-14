"use strict";
var query_parser_type_1 = require('../../../parser/models/query-parser.type');
var sample_response_1_1 = require('../../../../meta/mock/sample-response-1');
var sample_query_1_1 = require('../../../../meta/mock/sample-query-1');
var date_histogram_formatter_type_1 = require('./date-histogram-formatter.type');
describe('date-histogram-formatter', function () {
    it('should formatted', function () {
        var parser = new query_parser_type_1.KRQueryParser();
        var result = parser.parseQuery(sample_query_1_1.sampleQuery1).children[0];
        var formatter = new date_histogram_formatter_type_1.KRDateHistogramFormatter;
        var context = {};
        var subContext = formatter.format(context, sample_response_1_1.sampleResponse1.aggregations.byHour, result);
        expect(context['byHour'] instanceof Array).toBeTruthy();
    });
});
//# sourceMappingURL=date-histogram-formatter.type.spec.js.map