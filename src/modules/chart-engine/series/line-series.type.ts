import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';


interface IECLineOptions extends IECSeriesOptions{
  stack?: boolean;
  symbol?: SymbolName;
  symbolSize?: number;
  showSymbol?: boolean;
  yAxisIndex?: number;
  xAxisIndex?: number;
  areaStyle?: {
    normal?: {
      color?: string;
    }
  }
}

@ChartSeries({
  seriesTypes: ['line', 'area'],
  hasAxises: true,
  defaultTrigger: 'axis'
})
export class KRLineSeries extends KRSeries {

  protected _render() {
    
    let data = this.data;
    this.names = [];    

    let seriesOpt: IECLineOptions[] = [];
    seriesOpt = data.map((d) => {
      let name = this.getName(d.path),
        data = this._dataType === 'category' ? d.data.map(_d => _d[1]) : d.data;
      
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

  private buildOptions(opts: IECLineOptions) {
    let _opts: IECLineOptions  = {
      type: <SeriesType>'line',
      showSymbol: this._options.showSymbol,
      stack: this._options.stack || this._seriesType === 'area' ? true : false,
    };

    if (this._axisIndex !== undefined) {
      if (this._isVertical) {
        _opts.yAxisIndex = this._axisIndex;
      } else {
        _opts.xAxisIndex = this._axisIndex;
      }
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