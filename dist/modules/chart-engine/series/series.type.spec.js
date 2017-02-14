"use strict";
var bootstrap_1 = require('../../../bootstrap');
var query_parser_type_1 = require('../../parser/models/query-parser.type');
var sample_query_terms_1 = require('../../../meta/mock/sample-query-terms');
var sample_response_terms_1 = require('../../../meta/mock/sample-response-terms');
describe('base series', function () {
    it('should format', function () {
        var formatterEngine = bootstrap_1.bootstrap().formatterEngine;
        var parser = new query_parser_type_1.KRQueryParser();
        var result = parser.parseQuery(sample_query_terms_1.sampleQueryTerms);
        var formattedData = formatterEngine.format(sample_response_terms_1.sampleResponseTerms, result);
    });
});
//# sourceMappingURL=series.type.spec.js.map