import { KRQueryParser } from '../../../parser/models/query-parser.type';
import { sampleResponse1 } from '../../../../meta/mock/sample-response-1';
import { sampleQuery1 } from '../../../../meta/mock/sample-query-1';
import { KRDateHistogramFormatter } from './date-histogram-formatter.type';

describe('date-histogram-formatter', () => {
  it('should formatted', () => {
    let parser = new KRQueryParser();
    let result = parser.parseQuery(sampleQuery1).children[0];
    let formatter = new KRDateHistogramFormatter;
    let context = {};
    let subContext = formatter.format(context, sampleResponse1.aggregations.byHour, result);
    expect(context['byHour'] instanceof Array).toBeTruthy();
  });
});