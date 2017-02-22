import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';

interface IEBarOptions extends IECSeriesOptions {
  stack?: boolean;
  yAxisIndex?: number;
  xAxisIndex?: number;
  areaStyle?: {
    normal?: {
      color?: string;
    }
  }
  label?: {
    normal?: {
      show?: boolean;
      formatter?: string | Function;
    }
  },
}

@ChartSeries({
  seriesTypes: ['bar'],
  hasAxises: true,
  defaultTrigger: 'item'
})
export class KRBarSeries extends KRSeries {

  protected _render() {
    
    let data = this.data;
    let seriesOpt: IEBarOptions[] = [];
    this.names = [];

    seriesOpt = data.map((d, i) => {
      let data;
      if (this._dataType === 'category') {
        data = d.data.map((_d, j) => {
          return {
            value: _d[1],
          };
        });
      } else {
        data = d.data.map((_d, j) => {
          return {
            value: _d
          };
        });
      }

      if (this._seriesOptions.split) {
        data.map((_d, j) => {
          _d['itemStyle'] = {
            normal: {
              color: this._chartContainer.color[j % this._chartContainer.color.length]
            }
          };
        });
      }
      let name = this.getName(d.path);
      this.names.indexOf(name) === -1 && this.names.push(name);

      return this.buildOptions({
        name: name,
        data: data
      });
    });
    

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get variables(): ISeriesVariables {
    return {
      independentVar: this._chartContainer.independentAxis[0].field,
      dependentVar: [this._seriesOptions.field]
    };
  }

  private buildOptions(opts: IEBarOptions) {
    let _opts: IEBarOptions  = {
      type: <SeriesType>'bar',
      stack: this._options.stack || this._seriesType === 'area' ? true : false,
    };

    if (this._axisIndex !== undefined) {
      if (this._isVertical) {
        _opts.yAxisIndex = this._axisIndex;
      } else {
        _opts.xAxisIndex = this._axisIndex;
      }
    }

    this.putProperty(_opts, this._options, 'showSymbol');
    this.putProperty(_opts, this._options, 'smooth');
    this.putProperty(_opts, this._options, 'stack');
    this.putProperty(_opts, this._options, 'label');
    this.putProperty(_opts, this._options, 'itemStyle');
    
    Object.assign(_opts, opts);

    return _opts;
  }
}