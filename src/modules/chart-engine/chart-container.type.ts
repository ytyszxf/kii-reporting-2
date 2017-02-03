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


  constructor(ele: HTMLDivElement) {
    this._colorIndex = 0;
    this._symbolIndex = 0;
    this._colors = ITEM_COLORS;
    this._containerElement = ele;
    this._yAxises = [];
    this._series = [];
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
    class A extends KRSeries { protected _render() { } }
    
    let series = new (<typeof A>seriesType)(opts, this, typeName, yAxisGroupIndex);
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

    esOptions.xAxis = this._xAxis.options;
    esOptions.yAxis = this._yAxises.map(y => y.options);

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
   * @desc get color from color enum
   * color will repeat if number of series exceed the total size of color pool.
   */
  public getColor() {
    let color = this._colors[this._colorIndex++];
    this._colorIndex = (this._colorIndex >= this._colors.length) ?
      0 : this._colorIndex;
    return color;
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
  }

  /**
   * @param  {IKRYAxis} yOpts
   */
  private _addYAxis(yOpts: IKRYAxis) {
    this._yAxises.push(new KRYAxis(yOpts));
  }
}