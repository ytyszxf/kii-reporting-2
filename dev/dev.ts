import { IChartQuery } from '../src/modules/formatter/interfaces/chart-query.interface';
import { KRQueryParser } from '../src/modules/parser/models/query-parser.type';
import { sampleQuery1 } from './meta/mock/sample-query-1';
import { KRDateHistogramFormatter } from '../src/modules/formatter/models/aggregation-formatter/date-histogram-formatter.type';
import { sampleResponse1 } from './meta/mock/sample-response-1';
import { bootstrap } from '../src/bootstrap';
import { sampleQueryTerms } from './meta/mock/sample-query-terms';
import { sampleResponseTerms } from './meta/mock/sample-response-terms';
import { KRLineSeries } from '../src/modules/chart-engine/series/line-series.type';
import { IKRChartBindingOptions, IKRChartOptions } from '../src/modules/chart-engine/interfaces/chart-options.interface';
import { KRChartContainer } from '../src/modules/chart-engine/chart-container.type';
import * as createEditor from 'javascript-editor';
import { IKRChartSettings } from '../src/modules/parser/models/chart-settings.interface';
import { IESFilter } from '../src/modules/formatter/interfaces/es/es-filter.interface';
import { Http, RequestMethod } from './http';
import * as $ from 'jquery';

declare var editorResult: IKRChartSettings;
declare var editorUrl: string;
declare var editorHeaders: Object;
var toolTip = document.getElementById('toolTip');
toolTip.remove();

export function start() {
  _prepareUI().then((editor: any) => {
    updateConsole('Ready to go.');
    document.getElementById('btn-run').addEventListener('click', () => {
      try {
        let value = `
          ${editor.getValue()}

          window.editorResult = opts;
          window.editorUrl = url;
          window.editorHeaders = headers;
        `;
        eval(value);
        _execute(editorResult);
        console.log(editorResult);
      } catch (e) {
        showTip((<Error>e).message);
      }
    });
  });
}

function _execute(opts: IKRChartSettings) {
  let {
    formatterEngine, chartEngine
  } = bootstrap();
  updateConsole('fetching data...');

  _executeQuery(opts.chartQuery)
    .subscribe((response) => {
      updateConsole('rendering graph...');
      
      try {
        let startTime = new Date().getTime();
        let parser = new KRQueryParser();
        let formatter = parser.parseQuery(opts.chartQuery);
        let dataDict = formatterEngine.format(response, formatter);
        console.log(dataDict);
        let target = <HTMLDivElement>document.getElementById('target');
        chartEngine.render(target, opts.chartOptions, dataDict, formatter);
        let endTime = new Date().getTime();
        let msg = `Done. Time consumption: ${(endTime - startTime) / 1000}s`;
        updateConsole(msg);
      } catch (e){
        showTip((<Error>e).message);
      }
      
    });
}

function updateConsole(msg) {
  document.getElementById('time-consumption').innerText = msg;
}

function _executeQuery(chartQuery: IChartQuery) {
  
  let query = {
    "query": {
      "filtered": {
        "query": {
          "query_string": {
            "query": "*",
            "analyze_wildcard": true
          }
        },
        "filter": {
          "bool": chartQuery.filter
        }
      },
    },
    "size": 0,
    "aggregations": chartQuery.aggregation
  };

  let payload = {
    url: editorUrl || 'http://localhost:9200/demo/_search',
    method: <RequestMethod>'POST',
    body: query,
    headers: editorHeaders
  };

  return Http(payload);
}

function _prepareUI() {

  return new Promise((resolve, reject) => {
    document.onreadystatechange = function () {
      let editor = createEditor({
        container: document.querySelector('#editor'),
        value: "// hello world\n",
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        indentWithTabs: false,
        tabSize: 2,
        indentUnit: 2,
        updateInterval: 500,
        dragAndDrop: true
      });
      editor.setValue(require('./meta/mock/scatter-beehive-query.txt'));
      resolve(editor);
    };
    
    let style =
      require('codemirror/lib/codemirror.css')
      + require('javascript-editor/css/codemirror.css')
      + require('javascript-editor/css/theme.css')
      + `@media all { .CodeMirror { font-size: 12px !important; } }`;
    let header: HTMLHeadElement = document.getElementsByTagName('head')[0];
    let styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    header.appendChild(styleTag);
  });
}

function showTip(msg: string) {
  let body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  let node = body.appendChild(toolTip);
  $('.tool-tip .message').text(msg);
  $('.tool-tip button').click(() => {
    (<HTMLDivElement>node).remove();
  });
}
