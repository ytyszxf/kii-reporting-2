import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { IKRYAxis, IKRChartSeries } from '../interfaces/y-axis.interface';
import { SeriesType } from '../models/series-type.type';

interface IEBarOptions extends IECSeriesOptions{
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
  seriesTypes: ['bar']
})
export class KRBarSeries extends KRSeries {

  protected _render() {
    
    this._bindingOtions.x.options;
    let data = this.data;

    let seriesOpt: IEBarOptions[] = [];
    if (this._options.split) {
      data.forEach((d, i) => {
        d.data.forEach(datum => {
          seriesOpt.push(this.buildOptions({
            name: this.getName(d.path),
            data: this._dataType === 'category' ? [datum[1]] : [datum]
          }));
        });
      });
    } else {
      seriesOpt = data.map((d, i) => {
        return this.buildOptions({
          name: this.getName(d.path),
          data: this._dataType === 'category' ? d.data.map(_d => _d[1]) : d.data
        });
      });
    }
    

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get metrics() {
    let x = this._bindingOtions.x;
    let y = <IKRYAxis>this._bindingOtions.y;
    let series = <IKRChartSeries>y.series;
    return [series.field];
  }

  private buildOptions(opts: IEBarOptions) {
    let _opts: IEBarOptions  = {
      type: <SeriesType>'bar',
      showSymbol: this._options.showSymbol,
      stack: this._options.stack || this._seriesType === 'area' ? true : false,
    };

    if (this._yAxisIndex !== undefined) {
      _opts.yAxisIndex = this._yAxisIndex;
    }

    this.putProperty(_opts, this._options, 'showSymbol');
    this.putProperty(_opts, this._options, 'smooth');
    this.putProperty(_opts, this._options, 'stack');
    Object.assign(_opts, opts);

    return _opts;
  }
}