import { IKRChartOptions } from './interfaces/chart-options.interface';
import { IKRAxis } from './interfaces/axis.interface';
import { IKRLegend } from './interfaces/legend.interface';
import { IKRTextStyle } from './interfaces/text-style.interface';
import { KRChartContainer } from './chart-container.type';
import { KRSeries } from './series/series.type';
import { IESXAggregationFormatter } from '../formatter/interfaces/aggregation-formatter.interface';
import { DataDictionary } from '../formatter/models/data-dictionary.type';
export interface KRChartConfig {
    xAxis?: IKRAxis;
    yAxis?: IKRAxis;
    legend?: IKRLegend;
    textStyle?: IKRTextStyle;
}
export declare class KRChartEngine {
    private _defaultSettings;
    private _configSettings;
    private _seriesTypes;
    constructor(seriesTypes: Array<typeof KRSeries>);
    config: KRChartConfig;
    /**
     * @returns KRChartConfig
     */
    private readonly _settings;
    /**
     * @param  {HTMLDivElement} target
     * @param  {IKRChartOptions} opts
     * @param  {DataDictionary} data
     * @param  {IESXAggregationFormatter} formatter
     * @returns KRChartContainer
     * @desc render data and return a chart container instance
     */
    render(target: HTMLDivElement, opts: IKRChartOptions, data: DataDictionary, formatter: IESXAggregationFormatter, parentContainer?: KRChartContainer): KRChartContainer;
    private updateChartContainer(chartContainer, x, y, direction);
    private updateChartContainerWithoutAxis(chartContainer, series, seriesTypeName);
    private validateInputJSON(input);
    /**
     * @param  {SeriesType} type
     * @return {typeof KRSeries} description
     */
    private _findSeriesType(type);
    /**
     * @param  {Array<typeofKRSeries>} seriesTypes
     * @desc load series into chart engine
     */
    private _loadSeriesTypes(seriesTypes);
}
