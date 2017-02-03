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
  yAxisGroupIndex?: number;
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
    let x = this._bindingOtions.x;
    let y = <IKRYAxis>this._bindingOtions.y;
    let series = <IKRChartSeries>y.series;
    
    this._bindingOtions.x.options;
    let data = this.getData(x.field, series.field);
    let categories = this.getCategories(x.field, series.field);

    let seriesOpt: IECLineOptions[] = [];
    if (!categories.length) {
      seriesOpt = [{
        name: !!series.name ? series.name : series.field,
        type: 'line',
        stack: this._seriesType === 'area' ? true : false,
        data: <Array<any>>data
      }];
      
    } else {
      let depth = categories.length;
      let _data = this._literateData('', data);
      seriesOpt = _data.map(_d => {
        return {
          name: _d.name,
          type: <SeriesType>'line',
          stack: this._seriesType === 'area' ? true : false,
          itemStyle: {
            normal: {
              color: this.getColor()
            }
          },
          data: _d.data
        };
      });
    }

    if (this._yAxisGroupIndex !== undefined) {
      seriesOpt.forEach(opt => {
        opt.yAxisGroupIndex = this._yAxisGroupIndex;
      });
    }

    this._echartSeriesOptions = seriesOpt;
    console.log(data);
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