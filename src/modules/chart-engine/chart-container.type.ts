import { ITEM_COLORS } from './settings/colors';
import { SeriesType } from './models/series-type.type';
import { IKRChartBindingOptions, IKRChartOptions } from './interfaces/chart-options.interface';
import { KRSeries } from './series/series.type';
import { KRChartConfig, KRChartEngine } from './chart-engine.type';
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
import { KRLegend } from './components/legend.type';
import { KRToolTip } from './components/tooltip.type';

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
  private _targetElement: HTMLDivElement;

  /**
   * @desc dataset
   */
  private _dataDict: DataDictionary;

  /**
   * @desc chart settings
   */
  private _chartSettings: KRChartConfig;

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

  private _legend: KRLegend;

  private _tooltip: KRToolTip;

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
    private _containerEle: HTMLDivElement,
    formatter: IESXAggregationFormatter,
    chartOptions: IKRChartOptions,
    settings: KRChartConfig,
    private _chartEngine: KRChartEngine,
    private _parent?: KRChartContainer
  ) {
    this._symbolIndex = 0;
    this._colors = ITEM_COLORS;
    let _ele = document.createElement('div');
    _ele.style.height = "100%";
    _ele.style.width = "100%";
    _containerEle.appendChild(_ele);
    this._targetElement = _ele;
    this._xAxises = [];
    this._yAxises = [];
    this._series = [];
    if (chartOptions.legend) {
      this._legend = new KRLegend(this, chartOptions.legend);
    }
    if (chartOptions.tooltip) {
      this._tooltip = new KRToolTip(this, chartOptions.tooltip);
    }
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
    this._echartInstance = ECharts.init(this._targetElement);
    this._series.forEach(s => {
      s.update(this._dataDict);
    });

    let esOptions: ECharts.EChartOption = {};

    // get series    
    let series = [];
    this._series.forEach((s) => {
      let result = s.series;
      s.seriesIndexes = [];
      for (let i = 0; i < result.length; i++){
        s.seriesIndexes.push(series.length + i); 
      }
      series = series.concat(result);
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
        independentAxisOptions.data = independentAxisOptions.data
          || this._dataDict.getBucketKeys(this.independentAxis[0].field);
        if (this.independentAxis[0].options.formatter) {
          let formatter = this.independentAxis[0].options.formatter;
          independentAxisOptions.data = independentAxisOptions.data
            || (<Array<any>>independentAxisOptions.data).map(d => formatter(d));
        } else if (formatterDataType === 'time') {
          independentAxisOptions.data = independentAxisOptions.data
            || (<Array<any>>independentAxisOptions.data).map(d => this._formateTimeData(d));
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
    if (this._tooltip) {
      esOptions.tooltip = this._tooltip.options;
    }
    // **************************************************************
    
    // get legend
    if (this._legend && this._legend.options.show) {
      this._legend.setData(this._dataDict);
      esOptions.legend = this._legend.options;
    }
    // **************************************************************
    

    // get data zoom
    // **************************************************************

    // get visual map
    if (KRUtils.notEmpty(this._chartOptions.visualMap)) {
      esOptions.visualMap = this._chartOptions.visualMap;
    }
    // **************************************************************

    // get grid
    if (KRUtils.notEmpty(this._chartOptions.grid)) {
      esOptions.grid = this._chartOptions.grid;
    }
    // **************************************************************

    // get toolbox    
    esOptions.toolbox = {
      feature: {}
    };
    if (KRUtils.notEmpty(this._chartOptions.toolbox)) {
      Object.assign(esOptions.toolbox, this._chartOptions.toolbox);
    }

    if (this._parent) {
      let customFeature = {
        "myBack": {
          show: true,
          title: 'Back',
          icon: 'path://M384.834,180.699c-0.698,0-348.733,0-348.733,0l73.326-82.187c4.755-5.33,4.289-13.505-1.041-18.26    c-5.328-4.754-13.505-4.29-18.26,1.041l-82.582,92.56c-10.059,11.278-10.058,28.282,0.001,39.557l82.582,92.561    c2.556,2.865,6.097,4.323,9.654,4.323c3.064,0,6.139-1.083,8.606-3.282c5.33-4.755,5.795-12.93,1.041-18.26l-73.326-82.188    c0,0,348.034,0,348.733,0c55.858,0,101.3,45.444,101.3,101.3s-45.443,101.3-101.3,101.3h-61.58    c-7.143,0-12.933,5.791-12.933,12.933c0,7.142,5.79,12.933,12.933,12.933h61.58c70.12,0,127.166-57.046,127.166-127.166    C512,237.745,454.954,180.699,384.834,180.699z',
          onclick: ()=> {
            this.destroy();
            this._parent.show();
          }
        }
      };
      Object.assign(esOptions.toolbox['feature'], customFeature);
    }

    console.log(esOptions);

    this._echartInstance.on('click', (event) => {
      if (!KRUtils.notEmpty(event.seriesIndex)) {
        return;
      }

      let series = this._series.find(s => s.seriesIndexes.indexOf(event.seriesIndex) > -1);
      if (
        this.independentAxis &&
        this.independentAxis.length &&
        this._chartOptions.drilldown
      ) {
        let independentVal = null;
        if (series.dataType === 'category') {
          independentVal = event.name;
        } else {
          independentVal = event.value[0];
        }

        let newDataDict = (this._dataDict.getSubset(independentVal, this.independentAxis[0].field));
        let child = this._chartEngine.render(
          this._containerEle,
          this._chartOptions.drilldown,
          newDataDict,
          newDataDict.aggFormatter,
          this
        );
        this.hide();
      } else {
        series.onClick(event);
      }
    });

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

  public getSeries() {
    return this._series;
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

  public show() {
    this._echartInstance.getDom().hidden = false;
  }

  public hide() {
    this._echartInstance.getDom().hidden = true;
  }

  public destroy() {
    this._echartInstance.clear();
    this._targetElement.remove();
  }
  
}