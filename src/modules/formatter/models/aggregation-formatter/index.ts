import { KRDateHistogramFormatter } from './date-histogram-formatter.type';
import { RootAggregationFormatter } from './root-agg-formatter.type';
import { KRFilterFormatter } from './filter-formatter.type';
import { KRTermsFormatter } from './terms-formatter.type';
import { KRHistogramFormatter } from './histogram-formatter.type';
import { KRChildrenFormatter } from './children-formatter.type';

export const AGG_FORMATTERS = [
  KRHistogramFormatter,
  KRDateHistogramFormatter,
  RootAggregationFormatter,
  KRFilterFormatter,
  KRTermsFormatter,
  KRChildrenFormatter,
];