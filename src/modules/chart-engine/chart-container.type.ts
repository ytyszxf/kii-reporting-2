import { ITEM_COLORS } from './settings/colors';
import { SeriesType } from './models/series-type.type';
import { IKRChartBindingOptions, IKRChartOptions } from './interfaces/chart-options.interface';
import { KRSeries } from './series/series.type';
import { IKRChartSettings } from './chart-engine.type';
import * as ECharts from 'echarts';
import { IKRXAxis } from './interfaces/x-axis.interface';
import { IKRYAxis } from './interfaces/y-axis.interface';
import { IESXAggregationFormatter } from '../formatter/interfaces/aggregation-formatter.interface';
import { AggregationValueType } from '../parser/models/aggregation-value-type.enum';
import { DataDictionary } from '../formatter/models/data-dictionary.type';
import { ChartDirection } from './models/chart-direction.type';
import { IKRAxis } from './interfaces/axis.interface';
import { KRUtils } from './utils.type';
import { KRAxis } from './components/axis.type';
import { IKRChartSeries } from './interfaces/series.interface';

/**
 * @author george.lin ljz135790@gmail.com
 */
export class KRChartContainer {

  /**
   * @desc pointer index of symbol pool
   */
  private _symbolIndex: number;

  /**
   * @desc color pool
   */
  private _colors: string[];

  /**
   * @desc symbol pool
   */
  private _symbols: string[];

  /**
   * @desc series
   */
  private _series: KRSeries[];

  /**
   * @desc dom element that hold the chart
   */
  private _containerElement: HTMLDivElement;

  /**
   * @desc dataset
   */
  private _dataDict: DataDictionary;

  /**
   * @desc chart settings
   */
  private _chartSettings: IKRChartSettings;

  /**
   * @desc chart Options
   */
  private _chartOptions: IKRChartOptions;

  /**
   * @desc echart instance
   */
  private _echartInstance: ECharts.ECharts;

  /**
   * @desc x axis
   */
  private _xAxises: KRAxis[];

  /**
   * @desc y axis array, upto 2
   */
  private _yAxises: KRAxis[];

  /**
   * @desc formatter
   */
  private _formatter: IESXAggregationFormatter;

  /**
   * @desc chart direction
   */
  private _chartDirection: ChartDirection;

  public get isVertical(): boolean{
    return this._chartDirection === 'TopToBottom' || this._chartDirection === 'BottomToTop';
  }

  public get series(): KRSeries[] {
    return this._series;
  }

  public get independentAxis(): KRAxis[] {
    return this.isVertical ?
      this._xAxises : this._yAxises;
  }

  public get dependentAxis(): KRAxis[] {
    return this.isVertical ?
      this._yAxises : this._xAxises;
  }

  public get color() {
    return this._colors;
  }

  constructor(
    ele: HTMLDivElement,
    formatter: IESXAggregationFormatter,
    chartOptions: IKRChartOptions,
    settings: IKRChartSettings,
  ) {
    this._symbolIndex = 0;
    this._colors = ITEM_COLORS;
    this._containerElement = ele;
    this._xAxises = [];
    this._yAxises = [];
    this._series = [];
    this._formatter = formatter;
    this._chartSettings = settings;
    this._chartDirection = chartOptions.direction || 'BottomToTop';
    this._chartOptions = chartOptions;
  }

  public update(
    dataDict: DataDictionary,
  ) {
    this._dataDict = dataDict;
    this.render();
  }

  public addSeries(typeName: SeriesType,
    seriesType: typeof KRSeries, seriesOpt: IKRChartSeries, yAxisGroupIndex?: number) {
    
    /**
     * @desc this class only helps to
     * add constrains for ts compiler
     */
    class VirtualSeries extends KRSeries { protected _render() { }; protected get variables() { return null;} }

    let dataType = null;

    if (this.independentAxis[0]) {
      dataType = this.independentAxis[0].options.type ||
        this._formatter.children.find(f => f.field === this.independentAxis[0].field).type;
    }
    
    let series = new (<typeof VirtualSeries>seriesType)(this, typeName, <AggregationValueType>dataType, seriesOpt, yAxisGroupIndex);
    this._series.push(series);
  }

  public render() {
    this._echartInstance = ECharts.init(this._containerElement);
    this._series.forEach(s => {
      s.update(this._dataDict);
    });

    let esOptions: ECharts.EChartOption = {};

    // get series    
    let series = [];
    this._series.forEach((s) => {
      series = series.concat(s.series);
    });

    esOptions.series = series;
    esOptions.color = this._colors;
    
    // **************************************************************

    // get axis
    if (this.independentAxis.length) {
      let independentAxisOptions = this.independentAxis[0];
      let formatterDataType = this._formatter
        .children.find(f => f.field === this.independentAxis[0].field).type;
      let dataType: AggregationValueType = this.independentAxis[0].options.type;
      if (dataType === 'category') {
        independentAxisOptions.data = this._dataDict.getBucketKeys(this.independentAxis[0].field);
        if (this.independentAxis[0].options.formatter) {
          let formatter = this.independentAxis[0].options.formatter;
          independentAxisOptions.data = (<Array<any>>independentAxisOptions.data).map(d => formatter(d));
        } else if (formatterDataType === 'time') {
          independentAxisOptions.data = (<Array<any>>independentAxisOptions.data).map(d => this._formateTimeData(d));
        }
      }

      let dependentAxisOtions = this.dependentAxis.map((axis) => {
        return axis.options;
      });

      if (this._chartDirection === 'LeftToRight' || this._chartDirection === 'RightToLeft') {
        esOptions.xAxis = dependentAxisOtions;
        esOptions.yAxis = independentAxisOptions.options;
      } else {
        esOptions.xAxis = independentAxisOptions.options;
        esOptions.yAxis = dependentAxisOtions;
      }
    }

    // **************************************************************

    // get tooltip

    // **************************************************************
    

    // get legend
    esOptions.legend = this._chartOptions.legend;
    // **************************************************************
    

    // get data zoom
    // **************************************************************

    // get visual map
    esOptions.visualMap = this._chartOptions.visualMap;
    // **************************************************************

    // get grid
    esOptions.grid = this._chartOptions.grid;
    // **************************************************************

    console.log(esOptions);

    this._echartInstance.setOption(esOptions);
  }

  /**
   * @desc get symbol from symbol enum
   * color will repeat if number of series exceed the total size of symbol pool.
   */
  public getSymbol() {
    let symbol = this._symbols[this._symbolIndex++];
    this._symbolIndex = this._symbolIndex >= this._symbols.length ?
      0 : this._symbolIndex;
    return symbol;
  }

  /**
   * @desc add X axis
   * @param  {IKRXAxis} xOpts
   */
  public addXAxis(xOpts: IKRAxis) {
    this._addXAxis([xOpts]);
  }

  /**
   * @desc add Y aixs
   * @param  {IKRYAxis} yOpts
   */
  public addYAxis(yOpts: IKRAxis) {
    this._addYAxis([yOpts]);
  }

  /**
   * @param  {IKRXAxis} xOpts
   */
  private _addXAxis(opts: IKRAxis[]) {
    opts.forEach((opt, i) => {
      let xAxis = new KRAxis(opt);
      this._xAxises.push(xAxis);
      if (this.isVertical) {
        let dataType: AggregationValueType = opt.options.type || this._formatter
          .children.find(f => f.field === opt.field)
          .type;
        
        xAxis.setOptions({ type: dataType });
      }
    });
  }

  /**
   * @param  {IKRYAxis} yOpts
   */
  private _addYAxis(opts: IKRAxis[]) {
    opts.forEach((opt, i) => {
      let yAxis = new KRAxis(opt);
      this._yAxises.push(yAxis);
      if (!this.isVertical) {
        let dataType: AggregationValueType = opt.options.type || this._formatter
          .children.find(f => f.field === opt.field)
          .type;
        
        yAxis.setOptions({ type: dataType });
      }
    });
  }

  private _formateTimeData(date) {
    var d = new Date(date);
    return [
      d.getFullYear(),
      ('0' + (d.getMonth() + 1)).slice(-2),
      ('0' + d.getDate()).slice(-2)
    ].join('/')
      + ' ' +
    [
      ('0' + d.getHours()).slice(-2),
      ('0' + d.getMinutes()).slice(-2)
    ].join(':');
  }
  
}