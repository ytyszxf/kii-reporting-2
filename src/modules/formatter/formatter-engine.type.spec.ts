import { bootstrap } from '../../bootstrap';
import { KRQueryParser } from '../parser/models/query-parser.type';
import { sampleQuery1 } from '../../meta/mock/sample-query-1';
import { KRDateHistogramFormatter } from './models/aggregation-formatter/date-histogram-formatter.type';
import { sampleResponse1 } from '../../meta/mock/sample-response-1';

describe('Formatter Engine', () => {
  it('should init', () => {
    let formatterEngine = bootstrap().formatterEngine;

    expect(Object.keys(formatterEngine['_aggFormatters']).length).toBeGreaterThan(0);
  });

  it('should format', () => {
    let formatterEngine = bootstrap().formatterEngine;
    let parser = new KRQueryParser();
    let result = parser.parseQuery(sampleQuery1);
    let formattedData = formatterEngine.format(sampleResponse1, result);

    expect(formattedData.raw['byHour']).toBeDefined;
  })
});