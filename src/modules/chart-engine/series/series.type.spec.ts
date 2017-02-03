import { KRSeries } from './series.type';
import { KRLineSeries } from './line-series.type';
import { bootstrap } from '../../../bootstrap';
import { KRQueryParser } from '../../parser/models/query-parser.type';
import { sampleQueryTerms } from '../../../meta/mock/sample-query-terms';
import { sampleResponseTerms } from '../../../meta/mock/sample-response-terms';
import { KRChartContainer } from '../chart-container.type';

describe('base series', () => {
  it('should format', () => {
    let formatterEngine = bootstrap().formatterEngine;
    let parser = new KRQueryParser();
    let result = parser.parseQuery(sampleQueryTerms);
    let formattedData = formatterEngine.format(sampleResponseTerms, result);
    let lineSeries = new KRLineSeries({}, new KRChartContainer(document.getElementsByTagName('div')[0], null), 'line', formattedData);
    
  });
});