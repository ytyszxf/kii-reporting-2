import { IKRAxis } from './axis.interface';
import { SeriesType } from '../models/series-type.type';


export interface IKRChartSeries {
  /**
   * @desc series type, pie type is not supported hear.
   * @example 'line', ['line', 'bar']
   */
  type: SeriesType | Array<SeriesType>;

  /**
   * @desc bind field name
   * @example 'hour>brightness'
   */
  field?: string;

  /**
   * @desc script that parses origin data into series,
   *  only works when field is not specified
   * @example script: "doc['maxPower'] - doc['minPower']"
   */
  script?: string;

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
  bubbleSize?: string;

  /**
   * @desc bubbleColor bind field, only works for series: 'bubble';
   */
  bubbleColor?: string;
}

export interface IKRYAxis extends IKRAxis{
  series: IKRChartSeries | IKRChartSeries[];
}
