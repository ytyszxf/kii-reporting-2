import { IKRChartOptions, IKRChartBindingOptions } from './interfaces/chart-options.interface';
import { IKRAxis } from './interfaces/axis.interface';
import { IKRLegend } from './interfaces/legend.interface';
import { IKRTextStyle } from './interfaces/text-style.interface';
import { KRUtils } from './utils.type';
import { KRChartContainer } from './chart-container.type';
import { KRSeries } from './series/series.type';
import { SeriesType, SeriesTypeNames } from './models/series-type.type';
import { IAggFormatter } from '../formatter/models/aggregation-formatter/aggregation-formatter.annotation';
import { IESXAggregationFormatter } from '../formatter/interfaces/aggregation-formatter.interface';
import { DataDictionary } from '../formatter/models/data-dictionary.type';
import { IKRYAxis } from './interfaces/y-axis.interface';
import { IKRChartSeries } from './interfaces/series.interface';
import { IKRXAxis } from './interfaces/x-axis.interface';

export interface IKRChartSettings {
    xAxis?: IKRAxis;
    yAxis?: IKRAxis;
    legend?: IKRLegend;
    textStyle?: IKRTextStyle;
};

export class KRChartEngine {

  private _defaultSettings: IKRChartSettings;
  private _configSettings: IKRChartSettings;
  private _seriesTypes: { [name: string]: typeof KRSeries };

  constructor(seriesTypes: Array<typeof KRSeries>) {
    this._seriesTypes = {};
    this._defaultSettings = {};
    this._configSettings = {};
    this._loadSeriesTypes(seriesTypes);
  }

  public set config(conf: IKRChartSettings) {
    this._configSettings = conf;
  }

  public get config() {
    return this._configSettings;
  }

  /**
   * @returns IKRChartSettings
   */
  private get _settings() {
    let settings = {};
    KRUtils.mergeObj(settings, this._defaultSettings);
    KRUtils.mergeObj(settings, this._configSettings);
    return settings;
  }
  
  /**
   * @param  {HTMLDivElement} target
   * @param  {IKRChartOptions} opts
   * @param  {DataDictionary} data
   * @param  {IESXAggregationFormatter} formatter
   * @returns KRChartContainer
   * @desc render data and return a chart container instance
   */
  public render(
    target: HTMLDivElement,
    opts: IKRChartOptions,
    data: DataDictionary,
    formatter: IESXAggregationFormatter
  ): KRChartContainer {

    let chartContainer = new KRChartContainer(target, formatter);

    /**
     * if axis is specified, can not longer read from chart name field
     * example:
     * {
     *   axises: {
     *     x: '..',
     *     y: '..'
     *   },
     *   // ignored
     *   line: {
     *   }
     * }
     */
    if (opts.axises) {
      this.updateChartContainer(chartContainer, opts.axises.x, opts.axises.y);
    } else {
      for (let seriesTypeName of SeriesTypeNames) {
        if (!opts[seriesTypeName]) continue;

        let seriesType = this._findSeriesType(<SeriesType>seriesTypeName);

        let series: IKRChartBindingOptions = opts[seriesTypeName];
        if (seriesType.hasAxises) {
          let y = series.y instanceof Array ?
            KRUtils.deepClone(series.y) : [KRUtils.deepClone(series.y)];

          y.forEach(_y => {
            if (_y.series instanceof Array) {
              _y.series.forEach(s => {
                s.type = <SeriesType>seriesTypeName;
              })
            } else {
              _y.series.type = <SeriesType>seriesTypeName;
            }
          });
          this.updateChartContainer(chartContainer, series.x, y);
        } else {
          let _series = series.series instanceof Array ?
            series.series : [series.series];
          
          _series.forEach(_s => {
            let opt: IKRChartBindingOptions = {
              series: _s
            };
            chartContainer.addSeries(<SeriesType>seriesTypeName, seriesType, opt);
          });
        }
      }
    }

    chartContainer.update(data, this._settings);    
    
    return chartContainer;
  }

  private updateChartContainer(chartContainer: KRChartContainer, x: IKRXAxis, y: IKRYAxis) {
    let ys: Array<IKRYAxis> = y instanceof Array ? y : [y];
    chartContainer.addXAxis(x);
    ys.forEach((y, yAxisIndex) => {
      chartContainer.addYAxis(y);
      let series: Array<IKRChartSeries> = y.series instanceof Array ?
        y.series : [y.series];

      series.forEach(s => {
        let seriesType = this._findSeriesType(s.type);
        let bindingOptions: IKRChartBindingOptions = {
          x: x,
          y: {
            series: s
          }
        };
        chartContainer.addSeries(s.type, seriesType, bindingOptions, yAxisIndex);
      });
    });
  }

  private updateChartContainerWithoutAxis() {
    
  }

  /**
   * @param  {SeriesType} type
   * @return {typeof KRSeries} description
   */
  private _findSeriesType(type: SeriesType) {
    return this._seriesTypes[type];
  }

  /**
   * @param  {Array<typeofKRSeries>} seriesTypes
   * @desc load series into chart engine
   */
  private _loadSeriesTypes(seriesTypes: Array<typeof KRSeries>) {
    seriesTypes.forEach((t) => {
      t.seriesTypes.forEach((type) => {
        this._seriesTypes[type] = t;
      });
    });
  }
}