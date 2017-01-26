import { KRDateHistogramFormatter } from './date-histogram-formatter.type';
import { RootAggregationFormatter } from './root-agg-formatter.type';
import { KRFilterFormatter } from './filter-formatter.type';
import { KRTermsFormatter } from './terms-formatter.type';

export const AGG_FORMATTERS = [
  KRDateHistogramFormatter,
  RootAggregationFormatter,
  KRFilterFormatter,
  KRTermsFormatter
];