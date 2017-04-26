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
import { ChartDirection } from './models/chart-direction.type';

export interface KRChartConfig {
  xAxis?: IKRAxis;
  yAxis?: IKRAxis;
  legend?: IKRLegend;
  textStyle?: IKRTextStyle;
  colors?: string[];
};

export class KRChartEngine {

  private _defaultSettings: KRChartConfig;
  private _configSettings: KRChartConfig;
  private _seriesTypes: { [name: string]: typeof KRSeries };

  constructor(seriesTypes: Array<typeof KRSeries>) {
    this._seriesTypes = {};
    this._defaultSettings = {};
    this._configSettings = {};
    this._loadSeriesTypes(seriesTypes);
  }

  public set config(conf: KRChartConfig) {
    this._configSettings = conf;
  }

  public get config() {
    return this._configSettings;
  }

  /**
   * @returns KRChartConfig
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
    formatter: IESXAggregationFormatter,
    parentContainer?: KRChartContainer
  ): KRChartContainer {

    if (!this.validateInputJSON(opts)) throw new Error('input not valid');

    let chartContainer = new KRChartContainer(target, formatter, opts, this._settings, this, parentContainer);

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
      let x, y;
      x = opts.axises.x;
      y = opts.axises.y;
      this.updateChartContainer(chartContainer, x, y, opts.direction);
    } else {
      for (let seriesTypeName of SeriesTypeNames) {
        if (!opts[seriesTypeName]) continue;

        let seriesType = this._findSeriesType(<SeriesType>seriesTypeName);
        let series: IKRChartBindingOptions = opts[seriesTypeName];
        if (seriesType.hasAxises) {
          let x = series.x instanceof Array ?
            KRUtils.deepClone(series.x) : [KRUtils.deepClone(series.x)];
          let y = series.y instanceof Array ?
            KRUtils.deepClone(series.y) : [KRUtils.deepClone(series.y)];
          
          if (opts.direction === 'LeftToRight' || opts.direction === 'RightToLeft') {
            x.forEach(_x => {
              if (_x.series instanceof Array) {
                _x.series.forEach(s => {
                  s.type = <SeriesType>seriesTypeName;
                });
              } else {
                _x.series.type = <SeriesType>seriesTypeName;
              }
            });
          } else {
            y.forEach(_y => {
              if (_y.series instanceof Array) {
                _y.series.forEach(s => {
                  s.type = <SeriesType>seriesTypeName;
                });
              } else {
                _y.series.type = <SeriesType>seriesTypeName;
              }
            });
          }
          
          this.updateChartContainer(chartContainer, x, y, opts.direction);
        } else {
          let _series = series.series instanceof Array ?
            series.series : [series.series];
          
          this.updateChartContainerWithoutAxis(chartContainer, _series, <SeriesType>seriesTypeName);
        }
      }
    }

    chartContainer.update(data);
    
    return chartContainer;
  }

  private updateChartContainer(
    chartContainer: KRChartContainer,
    x: IKRXAxis | IKRXAxis[],
    y: IKRYAxis | IKRYAxis[],
    direction: ChartDirection
  ) {
    let ys: Array<IKRAxis> = y instanceof Array ? y : [y];
    let xs: Array<IKRAxis> = x instanceof Array ? x : [x];
    xs.forEach((_x, xAxisIndex) => {
      chartContainer.addXAxis(_x);
    });
    
    ys.forEach((_y, yAxisIndex) => {
      chartContainer.addYAxis(_y);
    });

    if (direction === 'LeftToRight' || direction === 'RightToLeft') {
      xs.forEach((_x, xAxisIndex) => {
        let series: Array<IKRChartSeries> = _x.series instanceof Array ?
          _x.series : [_x.series];

        series.forEach(s => {
          let seriesType = this._findSeriesType(s.type);
          chartContainer.addSeries(s.type, seriesType, s, xAxisIndex);
        });
      });
    } else {
      ys.forEach((_y, yAxisIndex) => {
        let series: Array<IKRChartSeries> = _y.series instanceof Array ?
          _y.series : [_y.series];

        series.forEach(s => {
          let seriesType = this._findSeriesType(s.type);
          chartContainer.addSeries(s.type, seriesType, s, yAxisIndex);
        });
      });
    }
  }

  private updateChartContainerWithoutAxis(
    chartContainer: KRChartContainer,
    series: IKRChartSeries[],
    seriesTypeName: SeriesType
  ) {
    let seriesType = this._findSeriesType(seriesTypeName);
    series.forEach(_s => {
      let s = KRUtils.deepClone(_s);
      s.type = seriesTypeName;
      chartContainer.addSeries(seriesTypeName, seriesType, s);
    });
  }

  private validateInputJSON(input: IKRChartOptions) {
    return true;
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