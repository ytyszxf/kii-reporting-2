import { FormatterEngine } from './modules/formatter/formatter-engine.type';
import { AGG_FORMATTERS } from './modules/formatter/models/aggregation-formatter/index';
import { METRIC_FORMATTERS } from './modules/formatter/models/metric-formatter/index';
import { KRAggregationFormatter } from './modules/formatter/models/aggregation-formatter/aggregation-formatter.type';
import { KRMetricFormatter } from './modules/formatter/models/metric-formatter.type';

export interface IConfigOptions {
  aggFormatters?: typeof KRAggregationFormatter[];
  metricFormatters?: typeof KRMetricFormatter[];
}

export function bootstrap(conf?: IConfigOptions) {
  let formatterEngine = new FormatterEngine();
  formatterEngine.registerAggFormatters(AGG_FORMATTERS);
  formatterEngine.registerMetricFormatters(METRIC_FORMATTERS);

  if (conf) {
    conf.aggFormatters &&
      formatterEngine.registerAggFormatters(conf.aggFormatters);
    conf.metricFormatters &&
      formatterEngine.registerMetricFormatters(conf.metricFormatters);  
  }

  return {
    formatterEngine: formatterEngine
  };
}