import { IKRChartBindingOptions } from '../interfaces/chart-options.interface';
import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SeriesType } from '../models/series-type.type';
import { KRChartContainer } from '../chart-container.type';
import { AggregationValueType } from '../../parser/models/aggregation-value-type.enum';
import { IHaltHanlder, HaltHandlerProvider } from '../models/halt-handler.type';
import { DataDictionary } from '../../formatter/models/data-dictionary.type';
import { IKRYAxis } from '../interfaces/y-axis.interface';
import { IKRChartSeries } from '../interfaces/series.interface';
import { IKRXAxis } from '../interfaces/x-axis.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';

export abstract class KRSeries {

  /**
   * @desc describes which type of chart this may handles
   */
  public static seriesTypes: SeriesType[];

  /**
   * @desc describes if series has axises;
   */
  public static hasAxises: boolean;

  /**
   * @desc echart compatable series settings
   */
  protected _echartSeriesOptions: IECSeriesOptions[];

  /**
   * Chart Container
   */
  protected _chartContainer: KRChartContainer;

  /**
   * @desc input dataset that used to generate output
   */
  protected _dataDict: DataDictionary;

  /**
   * @desc y axis index
   */
  protected _yAxisIndex: number;

  /**
   * @desc series type that called.
   */ 
  protected _seriesType: SeriesType;

  /**
   * @desc series data type
   */
  protected _dataType: AggregationValueType;

  /**
   * @desc series variables
   */
  protected _variables: ISeriesVariables;

  /**
   * @desc series options
   */
  protected _seriesOptions: IKRChartSeries;

  protected getName(path: string[] = []): string {
    if (typeof this._options.name === 'string') {
      return this._options.name;
    } else if (this._options.name instanceof Function) {
      return (<Function>this._options.name).apply(this, [path]);
    }
    return path.join('-');
  }
  
  /**
   * @desc return production of render
   * @returns IECSeriesOptions
   */
  public get series(): IECSeriesOptions[] {
    return this._echartSeriesOptions;
  }

  /**
   * 
   */
  protected get _options(): IKRChartSeries {
    return this._seriesOptions;
  }

  /**
   * @param  {IKRChartBindingOptions} bindingOptions
   * @param  {any} dataset
   */
  constructor(
    chartContainer: KRChartContainer,
    seriesType: SeriesType,
    dataType: AggregationValueType,
    variables: ISeriesVariables,
    seriesOptions: IKRChartSeries,
    yAxisIndex?: number,
    dataset?: any,
  ) {
    this._dataDict = dataset;
    this._seriesType = seriesType;
    this._chartContainer = chartContainer;
    this._yAxisIndex = yAxisIndex;
    this._dataType = dataType;
  }

  /**
   * @desc render series to make it ready
   */
  public render() {
    this._render();
    return this.series;
  }

  /**
   *
   */
  public update(dataDict: DataDictionary) {
    this._dataDict = dataDict;
    return this.render();
  }
  
  /**
   * @desc core function that produce output
   */
  protected abstract _render(): void;

  protected abstract get metrics(): string[];
  
  protected get data() {
    if (!this.metrics.length) throw new Error('No metrics given.');
    if (this._options.field) {
      return this.getData(this._variables.independentVar, this.metrics);
    }else if (this._options.script){
      return this.renderScript();
    } else {
      throw new Error('no data source provided!');
    }
  }

  /**
   * @desc format data
   * @param  {string} bucket
   * @param  {string|string[]} metrics
   */
  protected getData(bucket: string, metrics: string[]): { path: string[], data: Array<any> }[] {

    let haltHandler = this._options.haltHandler;
    let searchResult = null;
    for (let metric of metrics) {
      if (!searchResult) {
        searchResult = this._dataDict.search(bucket, metric);
      } else {
        searchResult.merge(this._dataDict.search(bucket, metric));
      }
    }
    let result = searchResult.data;

    let output = DataDictionary.isFinal(result) ? [result] : getFinalArrays([], result);
    output.forEach((ar) => {
      HaltHandlerProvider.processDataset(ar.data, haltHandler);
    });
    return output;

    function getFinalArrays(path: string[], obj: Object): { path: string[]; data: Array<any> }[] {
      let keys = Object.keys(obj);
      if (DataDictionary.isFinal(obj[keys[0]])) {
        return keys.map(key => {
          return { path: path.concat([key]), data: obj[key].data };
        });
      } else {
        let result = [];
        for (let key of keys) {
          result = result.concat(getFinalArrays(path.concat([key]), obj[key]));
        }
      }
    }
  }

  /**
   * @param  {string} bucket
   * @param  {string|string[]} metrics
   * @return {string[]} categories
   */
  protected getCategories(bucket: string, metrics: string | string[]): string[] {
    let _metrics: string[] = metrics instanceof Array ?
      metrics : [metrics];
    let result = _metrics[0].split('>').slice(1)
    result.pop();
    return result;
  }

  /**
   * @return {string} get Symbol
   */
  protected getSymbol() {
    return this._chartContainer.getSymbol();
  }

  /**
   * @desc render script 
   */
  protected renderScript(): {path: string[], data: Array<any>}[] {
    if (!this._options.context || !this._options.context.length)
      throw new Error('context is required by script method.');

    let contexts: {path: string[], data: any[]}[][] = this._options.context.map(field => {
      return this.getData(this._variables.independentVar, [field]);
    });

    let context = contexts[0];
    return context.map((d, i) => {
      let _cxts = contexts.map(c => c[i].data);
      let result: any[] = this._options.script.apply(this._options.script, [d.path].concat(_cxts));
      return { path: d.path, data: result };
    });
  }

  /**
   * @param  {Object} target
   * @param  {Object} source
   * @param  {string} key
   */
  protected putProperty(target: Object, source: Object, key: string) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}