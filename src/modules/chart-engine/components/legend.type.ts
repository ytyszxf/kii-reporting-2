import { IKRLegend } from '../interfaces/legend.interface';
import { DataDictionary } from '../../formatter/models/data-dictionary.type';
import { KRChartContainer } from '../chart-container.type';
import { KRUtils } from '../utils.type';
export class KRLegend {

  private _data: DataDictionary;

  constructor(
    private _container: KRChartContainer,  
    private _options: IKRLegend = {}
  ) {  
    this._init();
  }

  private _init() {
    this._options.show = KRUtils.notEmpty(this._options.show) ?
      this._options.show : false;
  }

  setData(data: DataDictionary) {
    this._data = data;
  }

  get options() {
    let options: IKRLegend = Object.assign({}, this._options);
    if (options.bind) delete options.bind;

    if (!this._options.data && this._options.bind) {
      let bind: Array<string> = this._options.bind instanceof String ?
        [this._options.bind] : this._options.bind;
      let names = [];
      
      bind.forEach((id) => {
        this._container.series
          .filter((s) => s.id === id)
          .forEach(s => {
            s.names.forEach(name => {
              names.indexOf(name) === -1 && names.push(name);
            });
          });
      });
      options.data = names;
    } else if (!this._options.data && !this._options.bind
      && this._container.series) {
      let names = [];
      this._container.series.forEach(s => {
        s.names.forEach(n => {
          names.indexOf(n) === -1 && names.push(n);
        });
      });
      options.data = names;
    }

    return options;
  }
}