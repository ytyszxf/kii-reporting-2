"use strict";
var bootstrap_1 = require('../../bootstrap');
var query_parser_type_1 = require('../parser/models/query-parser.type');
var sample_query_1_1 = require('../../meta/mock/sample-query-1');
var sample_response_1_1 = require('../../meta/mock/sample-response-1');
describe('Formatter Engine', function () {
    it('should init', function () {
        var formatterEngine = bootstrap_1.bootstrap().formatterEngine;
        expect(Object.keys(formatterEngine['_aggFormatters']).length).toBeGreaterThan(0);
    });
    it('should format', function () {
        var formatterEngine = bootstrap_1.bootstrap().formatterEngine;
        var parser = new query_parser_type_1.KRQueryParser();
        var result = parser.parseQuery(sample_query_1_1.sampleQuery1);
        var formattedData = formatterEngine.format(sample_response_1_1.sampleResponse1, result);
        expect(formattedData.raw['byHour']).toBeDefined;
    });
});
//# sourceMappingURL=formatter-engine.type.spec.js.map