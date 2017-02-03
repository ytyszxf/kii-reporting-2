import { IKRChartOptions, IKRChartBindingOptions } from './interfaces/chart-options.interface';
import { IKRAxis } from './interfaces/axis.interface';
import { IKRLegend } from './interfaces/legend.interface';
import { IKRTextStyle } from './interfaces/text-style.interface';
import { KRUtils } from './utils.type';
import { KRChartContainer } from './chart-container.type';
import { KRSeries } from './series/series.type';
import { SeriesType, SeriesTypeNames } from './models/series-type.type';
import { IKRYAxis, IKRChartSeries } from './interfaces/y-axis.interface';

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

  private get _settings() {
    let settings = {};
    KRUtils.mergeObj(settings, this._defaultSettings);
    KRUtils.mergeObj(settings, this._configSettings);
    return settings;
  }
  
  public render(target: HTMLDivElement, opts: IKRChartOptions, data: any): KRChartContainer {
    let chartContainer = new KRChartContainer(target);

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
      chartContainer.addXAxis(opts.axises.x);
      let ys: Array<IKRYAxis> = opts.axises.y instanceof Array
        ? opts.axises.y : [opts.axises.y];
      ys.forEach((y, yAxisIndex) => {
        chartContainer.addYAxis(y);
        let series: Array<IKRChartSeries> = y.series instanceof Array ?
          y.series : [y.series];

        series.forEach(s => {
          let seriesType = this._findSeriesType(s.type);
          let bindingOptions: IKRChartBindingOptions = {
            x: opts.axises.x,
            y: {
              series: s
            }
          };

          chartContainer.addSeries(s.type, seriesType, bindingOptions, yAxisIndex);
        });
      });
    } else {
      SeriesTypeNames.forEach(typeName => {
        
      });
    }

    chartContainer.update(data, this._settings);    
    
    return chartContainer;
  }

  private _findSeriesType(type: SeriesType) {
    return this._seriesTypes[type];
  }

  private _loadSeriesTypes(seriesTypes: Array<typeof KRSeries>) {
    seriesTypes.forEach((t) => {
      t.seriesTypes.forEach((type) => {
        this._seriesTypes[type] = t;
      });
    });
  }
}