import { ITEM_COLORS } from './settings/colors';
import { SeriesType } from './models/series-type.type';
import { IKRChartBindingOptions } from './interfaces/chart-options.interface';
import { KRSeries } from './series/series.type';
import { IKRChartSettings } from './chart-engine.type';
import * as ECharts from 'echarts';
import { IKRXAxis } from './interfaces/x-axis.interface';
import { IKRYAxis } from './interfaces/y-axis.interface';
import { KRXAxis } from './components/x-axis.type';
import { KRYAxis } from './components/y-axis.type';
import { IESXAggregationFormatter } from '../formatter/interfaces/aggregation-formatter.interface';
import { AggregationValueType } from '../parser/models/aggregation-value-type.enum';

/**
 * @author george.lin ljz135790@gmail.com
 */
export class KRChartContainer {
  /**
   * @desc pointer index of color pool
   */
  private _colorIndex: number;

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
  private _dataset: any;

  /**
   * @desc chart settings
   */
  private _chartSettings: IKRChartSettings;

  /**
   * @desc echart instance
   */
  private _echartInstance: ECharts.ECharts;

  /**
   * @desc x axis
   */
  private _xAxis: KRXAxis;

  /**
   * @desc y axis array, upto 2
   */
  private _yAxises: KRYAxis[];

  /**
   * @desc formatter
   */
  private _formatter: IESXAggregationFormatter;


  constructor(
    ele: HTMLDivElement,
    formatter: IESXAggregationFormatter
  ) {
    this._colorIndex = 0;
    this._symbolIndex = 0;
    this._colors = ITEM_COLORS;
    this._containerElement = ele;
    this._yAxises = [];
    this._series = [];
    this._formatter = formatter;
  }

  public update(dataset: any, settings: IKRChartSettings) {
    this._dataset = dataset;
    this._chartSettings = settings;
    this.render();
  }

  public addSeries(typeName: SeriesType,
    seriesType: typeof KRSeries, opts: IKRChartBindingOptions, yAxisGroupIndex?: number) {
    
    /**
     * @desc this class only helps to
     * add constrains for ts compiler
     */
    class VirtualSeries extends KRSeries { protected _render() { }; protected get metrics() { return [];} }

    let dataType =
      this._xAxis.options.type ||
      this._formatter.children.find(f => f.field === this._xAxis.field).type;
    
    let series = new (<typeof VirtualSeries>seriesType)(opts, this, typeName, dataType, yAxisGroupIndex);
    this._series.push(series);
  }

  public render() {
    this._echartInstance = ECharts.init(this._containerElement);
    this._series.forEach(s => {
      s.update(this._dataset);
    });

    let esOptions: ECharts.EChartOption = {};

    // get series    
    let series = [];
    this._series.forEach((s) => {
      series = series.concat(s.series);
    });

    esOptions.series = series;

    // **************************************************************

    // get axis
    let formatterDataType = this._formatter
      .children.find(f => f.field === this._xAxis.field).type;
    let dataType: AggregationValueType = this._xAxis.options.type;
    if (dataType === 'category') {
      this._xAxis.data = (<Array<any>>this._dataset[this._xAxis.field]).map(d => d[0]);
      if (this._xAxis.options.formatter) {
        let formatter = this._xAxis.options.formatter;
        this._xAxis.data = (<Array<any>>this._xAxis.data).map(d => formatter(d));
      } else if (formatterDataType === 'time') {
        this._xAxis.data = (<Array<any>>this._xAxis.data).map(d => this._formateTimeData(d));
      }
    }
    esOptions.xAxis = this._xAxis.options;

    esOptions.yAxis = this._yAxises.map(y => y.options);
    esOptions.color = this._colors;

    // **************************************************************

    // get tooltip

    // **************************************************************
    

    // get legend
    // **************************************************************
    

    // get data zoom
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
  public addXAxis(xOpts: IKRXAxis) {
    this._addXAxis(xOpts);
  }

  /**
   * @desc add Y aixs
   * @param  {IKRYAxis} yOpts
   */
  public addYAxis(yOpts: IKRYAxis) {
    this._addYAxis(yOpts);
  }

  /**
   * @param  {IKRXAxis} xOpts
   */
  private _addXAxis(xOpts: IKRXAxis) {

    this._xAxis = new KRXAxis(xOpts);
    let dataType: AggregationValueType = xOpts.options.type || this._formatter
      .children.find(f => f.field === xOpts.field)
      .type;
    
    this._xAxis.setOptions({ type: dataType });
  }

  /**
   * @param  {IKRYAxis} yOpts
   */
  private _addYAxis(yOpts: IKRYAxis) {
    this._yAxises.push(new KRYAxis(yOpts));
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