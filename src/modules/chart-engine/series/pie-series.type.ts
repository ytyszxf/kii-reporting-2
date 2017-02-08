import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';


interface IECPieOptions extends IECSeriesOptions{
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
  seriesTypes: ['pie'],
  hasAxises: false
})
export class KRPieSeries extends KRSeries {

  protected _render() {
    
    this._bindingOtions.x.options;
    let data = this.data;

    let seriesOpt: IECPieOptions[] = [];
    seriesOpt = data.map((d) => {
      return this.buildOptions({
        name: this.getName(d.path),
        data: d.data.map(_d => _d[1])
      });
    });

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get metrics() {
    let x = this._bindingOtions.x;
    let y = <IKRYAxis>this._bindingOtions.y;
    let series = <IKRChartSeries>y.series;
    return [series.field];
  }

  private buildOptions(opts: IECPieOptions) {
    let _opts: IECPieOptions  = {
      type: <SeriesType>'pie',
    };

    Object.assign(_opts, opts);

    return _opts;
  }
  
}