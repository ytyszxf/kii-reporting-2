import { FormatterEngine } from './modules/formatter/formatter-engine.type';
import { KRAggregationFormatter } from './modules/formatter/models/aggregation-formatter/aggregation-formatter.type';
import { KRMetricFormatter } from './modules/formatter/models/metric-formatter.type';
import { KRChartEngine } from './modules/chart-engine/chart-engine.type';
export interface IConfigOptions {
    aggFormatters?: typeof KRAggregationFormatter[];
    metricFormatters?: typeof KRMetricFormatter[];
}
export declare function bootstrap(conf?: IConfigOptions): {
    formatterEngine: FormatterEngine;
    chartEngine: KRChartEngine;
};
