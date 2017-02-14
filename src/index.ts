// import 'core-js/es6';
// Added parts of es6 which are necessary for your project or your browser support requirements.
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';
import 'core-js/es6/reflect';
// import 'core-js/es6/promise';

import 'core-js/es7/reflect';

// Typescript emit helpers polyfill
import 'ts-helpers';
import { start } from './dev/dev';
import { KRChartContainer } from './modules/chart-engine/chart-container.type';
import { bootstrap } from './bootstrap';
import { KRChartEngine } from './modules/chart-engine/chart-engine.type';
import { KRQueryParser } from './modules/parser/models/query-parser.type';

if (window) {
  window['KRChartContainer'] = KRChartContainer;
  window['bootstrap'] = bootstrap;
  window['KRChartEngine'] = KRChartEngine;
  window['KRQueryParser'] = KRQueryParser;
}

export * from './modules/chart-engine/chart-container.type';
export * from './bootstrap';
export * from './modules/chart-engine/chart-engine.type';
export * from './modules/parser/models/query-parser.type';