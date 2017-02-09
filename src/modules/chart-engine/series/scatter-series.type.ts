import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRChartSeries } from '../interfaces/series.interface';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';


interface IECScatterOptions extends IECSeriesOptions{
  stack?: boolean;
  symbol?: SymbolName;
  symbolSize?: number | Function;
  showSymbol?: boolean;
  xAxisIndex?: number;
  yAxisIndex?: number;
  areaStyle?: {
    normal?: {
      color?: string;
    }
  }
}

@ChartSeries({
  seriesTypes: ['scatter', 'bubble'],
    hasAxises: true
})
export class KRScatterSeries extends KRSeries {

  private _sizeValRange: [number, number] = [Infinity, -Infinity];

  protected _render() {
    
    let data = this.data;
    this.data.forEach(d => {
      d.data.forEach(_d => {
        if (_d[2] === null || _d[2] === undefined) return;
        this._sizeValRange[0] = this._sizeValRange[0] < _d[2] ? this._sizeValRange[0] : _d[2];
        this._sizeValRange[1] = this._sizeValRange[1] > _d[2] ? this._sizeValRange[1] : _d[2];
      });
    });

    if (this._sizeValRange[0] === Infinity) {
      this._sizeValRange = [0, 1];
    }

    let seriesOpt: IECScatterOptions[] = [];
    seriesOpt = data.map((d) => {
      return this.buildOptions({
        name: this.getName(d.path),
        data: this._dataType === 'category' ? d.data.map(_d => _d[1]) : d.data
      });
    });

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get variables(): ISeriesVariables {
    let variables: ISeriesVariables = {
      independentVar: this._chartContainer.independentAxis[0].field,
      dependentVar: [this._seriesOptions.field]
    };
    if (this._seriesOptions.symbolSizeField) {
      variables.dependentVar.push(this._options.symbolSizeField);
    }
    return variables;
  }

  private buildOptions(opts: IECScatterOptions) {
    let max = this._sizeValRange[1],
      min = this._sizeValRange[0],
      range = max - min;

    var symbolSize: (d: number) => number;

    if (this._options.symbolSize) {
      symbolSize = this._options.symbolSize;
    } else {
      symbolSize = (x) => {
        if (x === undefined || x === null) return 10;
        var y = Math.pow((x - min) / range, 5) + 0.2;
        return y * 60;
      };
    }

    let _opts: IECScatterOptions = {
      type: <SeriesType>'scatter',
      showSymbol: this._options.showSymbol,
      symbolSize: symbolSize instanceof Function ? (val) => {
        return symbolSize(val[2]);
      } : symbolSize
    };

    if (this._axisIndex !== undefined) {
      if (this._isVertical) {
        _opts.yAxisIndex = this._axisIndex;
      } else {
        _opts.xAxisIndex = this._axisIndex;
      }
    }

    Object.assign(_opts, opts);

    return _opts;
  }
  
}