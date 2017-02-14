import { SeriesType } from '../models/series-type.type';
import { IHaltHanlder, HaltHandler } from '../models/halt-handler.type';
export interface IKRChartSeries {
    /**
     * @desc series type, pie type is not supported hear.
     * @example 'line', ['line', 'bar']
     */
    type: SeriesType;
    /**
     * @desc bind field name
     * @example 'hour>brightness'
     */
    field?: string;
    /**
     * @desc script that parses origin data into series,
     *  only works when field is not specified
     * @example script: function(context1, context2, ...){
     *
     * }
     */
    script?: Function;
    /**
     * @desc context data that will be input of script
     */
    context?: Array<string>;
    /**
     * @desc series name that shows on legend,
     * if not specified, will use metric's name instead.
     */
    name?: string;
    /**
     * @desc stack bar chart, only works for series: 'bar';
     */
    stack?: boolean;
    /**
     * @desc bubbleSize bind field, only works for series: 'bubble';
     */
    symbolSizeField?: string;
    /**
     * @desc symbol size | function
     */
    symbolSize?: () => number | number;
    /**
     * @desc bubbleColor bind field, only works for series: 'bubble';
     */
    bubbleColor?: string;
    /**
     * @desc halt Method
     */
    haltHandler?: IHaltHanlder | HaltHandler;
    /**
     * @desc es showSymbol
     */
    showSymbol?: boolean;
    /**
     * @desc smooth
     */
    smooth?: boolean;
    /**
     * @desc only works for bar chart
     * split bar chart series data into single items
     */
    split?: boolean;
    /**
     * @desc pie charts only
     * radius of pie
     */
    radius?: [any, any];
    /**
     * @desc bar chart item label settings
     */
    label?: any;
}
