import { main } from './index';
import { IChartQuery } from './modules/formatter/interfaces/chart-query.interface';
import { KRQueryParser } from './modules/parser/models/query-parser.type';
import { sampleQuery1 } from './meta/mock/sample-query-1';
import { KRDateHistogramFormatter } from './modules/formatter/models/aggregation-formatter/date-histogram-formatter.type';
import { sampleResponse1 } from './meta/mock/sample-response-1';
import { bootstrap } from './bootstrap';
import { sampleQueryTerms } from './meta/mock/sample-query-terms';
import { sampleResponseTerms } from './meta/mock/sample-response-terms';
import { KRLineSeries } from './modules/chart-engine/series/line-series.type';
import { IKRChartBindingOptions } from './modules/chart-engine/interfaces/chart-options.interface';
import { IKRChartSeries } from './modules/chart-engine/interfaces/y-axis.interface';
import { KRChartContainer } from './modules/chart-engine/chart-container.type';



export function test() {
  let formatterEngine = bootstrap().formatterEngine;
  let parser = new KRQueryParser();
  let result = parser.parseQuery(sampleQueryTerms);
  let formattedData = formatterEngine.format(sampleResponseTerms, result);

  let series: IKRChartSeries = {
    type: 'line',
    name: 'A line',
    field: 'byHour>byType>avg_brightness'
  };

  let opt: IKRChartBindingOptions = {
    x: {
      field: 'byHour'
    },
    y: {
      series: series
    }
  };
  
  let lineSeries = new KRLineSeries(opt, formattedData, 'line', new KRChartContainer);
  console.log(formattedData);
  lineSeries.render();
  console.log(lineSeries.series); 
}
