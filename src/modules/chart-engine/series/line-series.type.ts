import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { IKRYAxis, IKRChartSeries } from '../interfaces/y-axis.interface';
import { SeriesType } from '../models/series-type.type';


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
  seriesTypes: ['line', 'area']
})
export class KRLineSeries extends KRSeries {

  protected _render() {
    
    this._bindingOtions.x.options;
    let data = this.data;

    let seriesOpt: IECLineOptions[] = [];
    if (data instanceof Array) {
      if (this._dataType === 'category') {
        data = (<Array<any>>data).map(d => d[1]);
      }
      seriesOpt = [
        Object.assign({
          name: !!this._options.name ? this._options.name : this._options.field,
          data: (<Array<any>>data)
        }, this.getOptions())
      ];
    } else {
      let _data = this._literateData('', data);
      seriesOpt = _data.map(_d => {
        if (this._dataType === 'category') {
          _d.data = _d.data.map(d => d[1]);
        }
        return Object.assign({
          name: _d.name,
          itemStyle: {
            normal: {
            }
          },
          data: _d.data,
        }, this.getOptions()) ;
      });
    }

    this._echartSeriesOptions = seriesOpt;
    console.log(data);
  }

  protected get metrics() {
    let x = this._bindingOtions.x;
    let y = <IKRYAxis>this._bindingOtions.y;
    let series = <IKRChartSeries>y.series;
    return [series.field];
  }

  private getOptions() {
    let opts: IECLineOptions  = {
      type: <SeriesType>'line',
      showSymbol: this._options.showSymbol,
      stack: this._options.stack || this._seriesType === 'area' ? true : false,
    };

    if (this._yAxisIndex !== undefined) {
      opts.yAxisIndex = this._yAxisIndex;
    }

    if (this._seriesType === 'area') {
      opts.areaStyle = {
        normal: {}
      };
    }

    this.putProperty(opts, this._options, 'showSymbol');
    this.putProperty(opts, this._options, 'smooth');

    return opts;
  }

  private _literateData(name: string, obj: Object): { name: string; data: Array<any> }[] {
    let keys = Object.keys(obj);
    if (keys.length > 0) {
      if (obj[keys[0]] instanceof Array) {
        return keys.map(key => {
          return { name: name + key, data: obj[key] };
        });
      }
    } else {
      let result = [];
      for (let key of keys) {
        result = result.concat(this._literateData(name + key, obj[key]));
      }
    }
  }
  
}