import { SeriesType } from './models/series-type.type';
import { IKRChartOptions } from './interfaces/chart-options.interface';
import { KRSeries } from './series/series.type';
import { IKRChartSettings } from './chart-engine.type';
import { IESXAggregationFormatter } from '../formatter/interfaces/aggregation-formatter.interface';
import { DataDictionary } from '../formatter/models/data-dictionary.type';
import { IKRAxis } from './interfaces/axis.interface';
import { KRAxis } from './components/axis.type';
import { IKRChartSeries } from './interfaces/series.interface';
/**
 * @author george.lin ljz135790@gmail.com
 */
export declare class KRChartContainer {
    /**
     * @desc pointer index of symbol pool
     */
    private _symbolIndex;
    /**
     * @desc color pool
     */
    private _colors;
    /**
     * @desc symbol pool
     */
    private _symbols;
    /**
     * @desc series
     */
    private _series;
    /**
     * @desc dom element that hold the chart
     */
    private _containerElement;
    /**
     * @desc dataset
     */
    private _dataDict;
    /**
     * @desc chart settings
     */
    private _chartSettings;
    /**
     * @desc chart Options
     */
    private _chartOptions;
    /**
     * @desc echart instance
     */
    private _echartInstance;
    /**
     * @desc x axis
     */
    private _xAxises;
    /**
     * @desc y axis array, upto 2
     */
    private _yAxises;
    private _legend;
    private _tooltip;
    /**
     * @desc formatter
     */
    private _formatter;
    /**
     * @desc chart direction
     */
    private _chartDirection;
    readonly isVertical: boolean;
    readonly series: KRSeries[];
    readonly independentAxis: KRAxis[];
    readonly dependentAxis: KRAxis[];
    readonly color: string[];
    constructor(ele: HTMLDivElement, formatter: IESXAggregationFormatter, chartOptions: IKRChartOptions, settings: IKRChartSettings);
    update(dataDict: DataDictionary): void;
    addSeries(typeName: SeriesType, seriesType: typeof KRSeries, seriesOpt: IKRChartSeries, yAxisGroupIndex?: number): void;
    render(): void;
    /**
     * @desc get symbol from symbol enum
     * color will repeat if number of series exceed the total size of symbol pool.
     */
    getSymbol(): string;
    /**
     * @desc add X axis
     * @param  {IKRXAxis} xOpts
     */
    addXAxis(xOpts: IKRAxis): void;
    /**
     * @desc add Y aixs
     * @param  {IKRYAxis} yOpts
     */
    addYAxis(yOpts: IKRAxis): void;
    getSeries(): KRSeries[];
    /**
     * @param  {IKRXAxis} xOpts
     */
    private _addXAxis(opts);
    /**
     * @param  {IKRYAxis} yOpts
     */
    private _addYAxis(opts);
    private _formateTimeData(date);
}
