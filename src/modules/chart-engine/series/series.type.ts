import { IKRChartBindingOptions } from '../interfaces/chart-options.interface';
import { IECSeriesOptions } from '../interfaces/series-options.interface';
import { SeriesType } from '../models/series-type.type';
import { KRChartContainer } from '../chart-container.type';

export abstract class KRSeries {

  /**
   * @desc describes which type of chart this may handles
   */
  public static seriesTypes: SeriesType[];

  /**
   * @desc echart compatable series settings
   */
  protected _echartSeriesOptions: IECSeriesOptions[];

  /**
   * Chart Container
   */
  protected _chartContainer: KRChartContainer;

  /**
   * @desc input options that used to generate output
   */
  protected _bindingOtions: IKRChartBindingOptions;

  /**
   * @desc input dataset that used to generate output
   */
  protected _dataSet: any;

  protected _yAxisGroupIndex: number;

  protected _seriesType: SeriesType;
  
  /**
   * @desc return production of render
   * @returns IECSeriesOptions
   */
  public get series(): IECSeriesOptions[] {
    return this._echartSeriesOptions;
  }

  /**
   * @param  {IKRChartBindingOptions} bindingOptions
   * @param  {any} dataset
   */
  constructor(
    bindingOptions: IKRChartBindingOptions,
    chartContainer: KRChartContainer,
    seriesType: SeriesType,
    yAxisGroupIndex?: number,
    dataset?: any
  ) {
    this._bindingOtions = bindingOptions;
    this._dataSet = dataset;
    this._seriesType = seriesType;
    this._chartContainer = chartContainer;
    this._yAxisGroupIndex = yAxisGroupIndex;
  }

  /**
   * @desc render series to make it ready
   */
  public render() {
    this._render();
    return this.series;
  }

  /**
   *
   */
  public update(dataset: any) {
    this._dataSet = dataset;
    return this.render();
  }
  
  /**
   * @desc core function that produce output
   */
  protected abstract _render(): void;

  /**
   * @desc format data
   * @param  {string} bucket
   * @param  {string|string[]} metrics
   */
  protected getData(bucket: string, metrics: string | string[]): Array<any> | Object {

    let _metrics: string[] = metrics instanceof Array ?
      metrics : [metrics];  

    /**
     *  byDate: [
     *    ['day1',
     *      {
     *        "byType": [
     *          ["lap",
     *            {
     *              "byLocation": [
     *                ['B1', {brightness: 5}],
     *                ...
     *              ]
     *            }
     *          ],
     *          ...
     *        ]
     *      }
     *    ]
     *  ] 
     */
    let metricNames = _metrics.map(m => m.split('>').pop());
    let result = {};
    let pathLink = _metrics[0].split('>').slice(1);
    let metricName = pathLink.pop();
    if (pathLink.length > 0) {
      (<Array<any>>this._dataSet[bucket])
        .forEach((raw) => {
          /**
           * @example
           *  {
           *    "byType": [
           *      ["lap",
           *        {
           *          "byLocation": [
           *            ['B1',
           *              {
           *                brightness: 5
           *              }
           *            ]
           *          ]
           *        }
           *      ]
           *    ]
           *  }
           */
          let x = raw[0];
          if (pathLink.length) {
            literate(raw[1][pathLink[0]], result, pathLink.slice(1));
          }

          function literate(data, r, pathLink: string[]) {
            if (!pathLink.length) {
              data.forEach(d => {
                if (!r[d[0]]) { r[d[0]] = [];}
                r[d[0]].push([x, ...metricNames.map(n=> d[1][n])]);
              })
            } else {
              data.forEach(d => {
                if (!r[d[0]]) { r[d[0]] = {}; }
                let _r = r[d[0]];
                let _d = d[1][pathLink[0]];
                let _pathLink = pathLink.slice(1);
                literate(_d, _r, _pathLink);
              });
            }
          }
        });
      return result;
    } else {
      return (<Array<any>>this._dataSet[bucket])
        .map((d) => {
          return [d[0], ...metricNames.map(n => d[1][n])];
        });
    }
  }

  /**
   * @param  {string} bucket
   * @param  {string|string[]} metrics
   * @return {string[]} categories
   */
  protected getCategories(bucket: string, metrics: string | string[]): string[] {
    let _metrics: string[] = metrics instanceof Array ?
      metrics : [metrics];
    let result = _metrics[0].split('>').slice(1)
    result.pop();
    return result;
  }

  /**
   * @return {string} get Color
   */
  protected getColor() {
    return this._chartContainer.getColor();
  }

  /**
   * @return {string} get Symbol
   */
  protected getSymbol() {
    return this._chartContainer.getSymbol();
  }

}