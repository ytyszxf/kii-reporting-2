import { IChartQuery } from '../../formatter/interfaces/chart-query.interface';
import { KRQueryParser } from './query-parser.type';
import { sampleQuery1 } from '../../../meta/mock/sample-query-1';

let query: IChartQuery = sampleQuery1;

describe(`App`, () => {
  it(`should has children`, () => {
    let parser = new KRQueryParser();
    let result = parser.parseQuery(query);
    expect(result.children.length).toEqual(1);
    expect(result.children[0].children.length).toEqual(2);
    expect(result.children[0].children[0].metrics.length).toEqual(2);
  });
});