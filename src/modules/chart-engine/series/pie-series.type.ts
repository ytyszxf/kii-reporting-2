import { KRSeries } from './series.type';
import { ChartSeries } from './series.annotation';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SymbolName } from '../models/symbol-name.type';
import { SeriesType } from '../models/series-type.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';


interface IECPieOptions extends IECSeriesOptions{
  radius?: any[];
}

@ChartSeries({
  seriesTypes: ['pie'],
  hasAxises: false
})
export class KRPieSeries extends KRSeries {

  protected _render() {
    
    let data = this.data;
    let mergeData: { path: string[]; data: any }[] = [];
    data.forEach((d) => {
      d.data.forEach((_d) => {
        mergeData.push({ path: d.path, data: _d });
      });
    });

    let seriesOpt: IECPieOptions[] = [this.buildOptions({
      data: mergeData.map(_d => {
        return { name: _d.data[0]+ '-' + this.getName(_d.path), value: _d.data[1] };
      })
    })];

    this._echartSeriesOptions = seriesOpt;
    console.log(this._echartSeriesOptions);
  }

  protected get variables(): ISeriesVariables {
    return {
      independentVar: this._seriesOptions.field.split('>')[0],
      dependentVar: [this._seriesOptions.field]
    };
  }

  private buildOptions(opts: IECPieOptions) {
    let _opts: IECPieOptions  = {
      type: <SeriesType>'pie',
    };

    if (this._options.radius) {
      this.putProperty(_opts, this._options, 'radius'); 
    } else {
      _opts.radius = [
        [["0%", "80%"]],
        [["0%", "50%"], ["60%", "80%"]],
        [["0", "40%"], ["48%", "62%"], ["70%", "80%"]]
      ][this._chartContainer.series.length - 1][this._chartContainer.series.indexOf(this)]
    }

    Object.assign(_opts, opts);

    return _opts;
  }

  getSize
  
}