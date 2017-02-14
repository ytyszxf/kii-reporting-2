"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// import 'core-js/es6';
// Added parts of es6 which are necessary for your project or your browser support requirements.
require('core-js/es6/symbol');
require('core-js/es6/object');
require('core-js/es6/function');
require('core-js/es6/parse-int');
require('core-js/es6/parse-float');
require('core-js/es6/number');
require('core-js/es6/math');
require('core-js/es6/string');
require('core-js/es6/date');
require('core-js/es6/array');
require('core-js/es6/regexp');
require('core-js/es6/map');
require('core-js/es6/set');
require('core-js/es6/weak-map');
require('core-js/es6/weak-set');
require('core-js/es6/typed');
require('core-js/es6/reflect');
// import 'core-js/es6/promise';
require('core-js/es7/reflect');
// Typescript emit helpers polyfill
require('ts-helpers');
var chart_container_type_1 = require('./modules/chart-engine/chart-container.type');
var bootstrap_1 = require('./bootstrap');
var chart_engine_type_1 = require('./modules/chart-engine/chart-engine.type');
var query_parser_type_1 = require('./modules/parser/models/query-parser.type');
if (window) {
    window['KRChartContainer'] = chart_container_type_1.KRChartContainer;
    window['bootstrap'] = bootstrap_1.bootstrap;
    window['KRChartEngine'] = chart_engine_type_1.KRChartEngine;
    window['KRQueryParser'] = query_parser_type_1.KRQueryParser;
}
__export(require('./modules/chart-engine/chart-container.type'));
__export(require('./bootstrap'));
__export(require('./modules/chart-engine/chart-engine.type'));
__export(require('./modules/parser/models/query-parser.type'));
//# sourceMappingURL=index.js.map