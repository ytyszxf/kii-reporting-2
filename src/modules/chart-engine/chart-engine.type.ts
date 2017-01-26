import { IKRChartOptions } from './interfaces/chart-options.interface';
import { IKRAxis } from './interfaces/axis.interface';
import { IKRLegend } from './interfaces/legend.interface';
import { IKRTextStyle } from './interfaces/text-style.interface';
import { KRUtils } from './utils.type';
import { KRChartContainer } from './chart-container.type';

export interface IKRChartSettings {
    xAxis?: IKRAxis;
    yAxis?: IKRAxis;
    legend?: IKRLegend;
    textStyle?: IKRTextStyle;
};

export class KRChartEngine {

  private _defaultSettings: IKRChartSettings;

  private _configSettings: IKRChartSettings;

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
  
  public render(target: Element, opts: IKRChartOptions): KRChartContainer {
    let chartContainer = new KRChartContainer();
    
    return chartContainer;
  }
}