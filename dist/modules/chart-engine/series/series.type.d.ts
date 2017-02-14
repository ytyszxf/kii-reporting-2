import { IECSeriesOptions } from '../interfaces/echarts-mapper/series-options.interface';
import { SeriesType } from '../models/series-type.type';
import { KRChartContainer } from '../chart-container.type';
import { AggregationValueType } from '../../parser/models/aggregation-value-type.enum';
import { DataDictionary } from '../../formatter/models/data-dictionary.type';
import { IKRChartSeries } from '../interfaces/series.interface';
import { ISeriesVariables } from '../interfaces/series-variable.interface';
export declare abstract class KRSeries {
    /**
     * @desc describes which type of chart this may handles
     */
    static seriesTypes: SeriesType[];
    /**
     * @desc describes if series has axises;
     */
    static hasAxises: boolean;
    /**
     * @desc echart compatable series settings
     */
    protected _echartSeriesOptions: IECSeriesOptions[];
    /**
     * Chart Container
     */
    protected _chartContainer: KRChartContainer;
    /**
     * @desc input dataset that used to generate output
     */
    protected _dataDict: DataDictionary;
    /**
     * @desc y axis index
     */
    protected _axisIndex: number;
    /**
     * @desc series type that called.
     */
    protected _seriesType: SeriesType;
    /**
     * @desc series data type
     */
    protected _dataType: AggregationValueType;
    /**
     * @desc series variables
     */
    protected _variables: ISeriesVariables;
    /**
     * @desc series options
     */
    protected _seriesOptions: IKRChartSeries;
    protected getName(path?: string[]): string;
    /**
     * @desc return production of render
     * @returns IECSeriesOptions
     */
    readonly series: IECSeriesOptions[];
    /**
     *
     */
    protected readonly _options: IKRChartSeries;
    protected readonly _isVertical: boolean;
    /**
     * @param  {IKRChartBindingOptions} bindingOptions
     * @param  {any} dataset
     */
    constructor(chartContainer: KRChartContainer, seriesType: SeriesType, dataType: AggregationValueType, seriesOptions: IKRChartSeries, axisIndex?: number, dataset?: any);
    /**
     * @desc render series to make it ready
     */
    render(): IECSeriesOptions[];
    /**
     *
     */
    update(dataDict: DataDictionary): IECSeriesOptions[];
    /**
     * @desc core function that produce output
     */
    protected abstract _render(): void;
    protected readonly abstract variables: ISeriesVariables;
    protected readonly data: {
        path: string[];
        data: any[];
    }[];
    /**
     * @desc format data
     * @param  {string} bucket
     * @param  {string|string[]} metrics
     */
    protected getData(variables: ISeriesVariables): {
        path: string[];
        data: Array<any>;
    }[];
    /**
     * @param  {string} bucket
     * @param  {string|string[]} metrics
     * @return {string[]} categories
     */
    protected getCategories(bucket: string, metrics: string | string[]): string[];
    /**
     * @return {string} get Symbol
     */
    protected getSymbol(): string;
    /**
     * @desc render script
     */
    protected renderScript(): {
        path: string[];
        data: Array<any>;
    }[];
    /**
     * @param  {Object} target
     * @param  {Object} source
     * @param  {string} key
     */
    protected putProperty(target: Object, source: Object, key: string): void;
}
