"use strict";
var query_parser_type_1 = require('./query-parser.type');
var sample_query_1_1 = require('../../../meta/mock/sample-query-1');
var query = sample_query_1_1.sampleQuery1;
describe("App", function () {
    it("should has children", function () {
        var parser = new query_parser_type_1.KRQueryParser();
        var result = parser.parseQuery(query);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].children.length).toEqual(2);
        expect(result.children[0].children[0].metrics.length).toEqual(2);
    });
});
//# sourceMappingURL=query-parser.type.spec.js.map