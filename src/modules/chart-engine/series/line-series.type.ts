import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';


interface IECLineOptions extends IECSeriesOptions{
  stack?: boolean;
  symbol?: SymbolName;
  symbolSize?: number;
  showSymbol?: boolean;
  yAxisIndex?: number;
  areaStyle?: {
    normal?: {
      color?: string;
    }
  }
}

@ChartSeries({
  seriesTypes: ['line', 'area'],
  hasAxises: true
})
export class KRLineSeries extends KRSeries {

  protected _render() {
    
    let data = this.data;

    let seriesOpt: IECLineOptions[] = [];
    seriesOpt = data.map((d) => {
      return this.buildOptions({
          name: this.getName(d.path),
          data: this._dataType === 'category' ? d.data.map(_d => _d[1]) : d.data
        });
    });

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get metrics() {
    let y = <IKRYAxis>this._bindingOtions.y;
    let series = <IKRChartSeries>y.series;
    return [series.field];
  }

  private buildOptions(opts: IECLineOptions) {
    let _opts: IECLineOptions  = {
      type: <SeriesType>'line',
      showSymbol: this._options.showSymbol,
      stack: this._options.stack || this._seriesType === 'area' ? true : false,
    };

    if (this._yAxisIndex !== undefined) {
      _opts.yAxisIndex = this._yAxisIndex;
    }

    if (this._seriesType === 'area') {
      _opts.areaStyle = {
        normal: {}
      };
    }

    this.putProperty(_opts, this._options, 'showSymbol');
    this.putProperty(_opts, this._options, 'smooth');
    Object.assign(_opts, opts);

    return _opts;
  }
  
}