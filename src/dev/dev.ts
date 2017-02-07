import { main } from '../index';
import { IChartQuery } from '../modules/formatter/interfaces/chart-query.interface';
import { KRQueryParser } from '../modules/parser/models/query-parser.type';
import { sampleQuery1 } from '../meta/mock/sample-query-1';
import { KRDateHistogramFormatter } from '../modules/formatter/models/aggregation-formatter/date-histogram-formatter.type';
import { sampleResponse1 } from '../meta/mock/sample-response-1';
import { bootstrap } from '../bootstrap';
import { sampleQueryTerms } from '../meta/mock/sample-query-terms';
import { sampleResponseTerms } from '../meta/mock/sample-response-terms';
import { KRLineSeries } from '../modules/chart-engine/series/line-series.type';
import { IKRChartBindingOptions, IKRChartOptions } from '../modules/chart-engine/interfaces/chart-options.interface';
import { IKRChartSeries, IKRYAxis } from '../modules/chart-engine/interfaces/y-axis.interface';
import { KRChartContainer } from '../modules/chart-engine/chart-container.type';
import * as createEditor from 'javascript-editor';
import { IKRChartSettings } from '../modules/parser/models/chart-settings.interface';
import { IESFilter } from '../modules/formatter/interfaces/es/es-filter.interface';
import { Http, RequestMethod } from './http';

declare var editorResult: IKRChartSettings;
declare var editorUrl: string;
declare var editorHeaders: Object;

export function start() {
  _prepareUI().then((editor: any) => {
    updateConsole('Ready to go.');
    document.getElementById('btn-run').addEventListener('click', () => {
      let value = `
        ${editor.getValue()}

        window.editorResult = opts;
        window.editorUrl = url;
        window.editorHeaders = headers;
      `;
      eval(value);
      _execute(editorResult);
      console.log(editorResult);
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

  var _opts: IKRChartSettings = {
    chartOptions: {
      axises: {
        x: {
          field: 'byHour',
          options: {
            name: "Time"
          }
        },
        y: [{
          series: {
            type: 'line',
            name: 'A line',
            field: 'byHour>byType>avg_brightness'
          },
          options: {
            name: "Brightness"
          }
        }]
      }
    },
    chartQuery: {
      "filter": {},
      "aggregation": {
        "byHour": {
          "aggs": {
            "byType": {
              "terms": {
                "field": "type"
              },
              "aggs": {
                "avg_brightness": {
                  "avg": {
                    "field": "brightness"
                  }
                },
                "sum_brightness": {
                  "sum": {
                    "field": "brightness"
                  }
                }
              }
            },
            "avg_brightness": {
              "avg": {
                "field": "brightness"
              }
            },
            "avg_power": {
              "avg": {
                "field": "power"
              }
            }
          },
           
          "date_histogram": {
            "field": "date",
            "interval": "hour"
          }
        }
      }
    }
  };

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
      //editor.setValue(`var headers = {};\r\nvar url = 'http://localhost:9200/demo/_search';\r\nvar opts = ${JSON.stringify(_opts, null, 2)}`);
      editor.setValue(require('../meta/mock/local-query.txt'));
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
