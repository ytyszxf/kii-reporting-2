import { IKRChartBindingOptions } from '../interfaces/chart-options.interface';
import { IECSeriesOptions } from '../interfaces/series-options.interface';
import { SeriesType } from '../models/series-type.type';
import { KRChartContainer } from '../chart-container.type';
import { AggregationValueType } from '../../parser/models/aggregation-value-type.enum';
import { IKRYAxis, IKRChartSeries } from '../interfaces/y-axis.interface';
import { IHaltHanlder, HaltHandlerProvider } from '../models/halt-handler.type';

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

  /**
   * @desc y axis index
   */
  protected _yAxisIndex: number;

  /**
   * @desc series type that called.
   */ 
  protected _seriesType: SeriesType;

  /**
   * @desc series data type
   */
  protected _dataType: AggregationValueType;
  
  /**
   * @desc return production of render
   * @returns IECSeriesOptions
   */
  public get series(): IECSeriesOptions[] {
    return this._echartSeriesOptions;
  }

  /**
   * 
   */
  protected get _options() {
    let x = this._bindingOtions.x;
    let y = <IKRYAxis>this._bindingOtions.y;
    return <IKRChartSeries>y.series;;
  }

  /**
   * @param  {IKRChartBindingOptions} bindingOptions
   * @param  {any} dataset
   */
  constructor(
    bindingOptions: IKRChartBindingOptions,
    chartContainer: KRChartContainer,
    seriesType: SeriesType,
    dataType: AggregationValueType,
    yAxisIndex?: number,
    dataset?: any,
  ) {
    this._bindingOtions = bindingOptions;
    this._dataSet = dataset;
    this._seriesType = seriesType;
    this._chartContainer = chartContainer;
    this._yAxisIndex = yAxisIndex;
    this._dataType = dataType;
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

  protected abstract get metrics(): string[];
  
  protected get data() {
    if (this._options.field) {
      return this.getData(this._bindingOtions.x.field, this.metrics);
    }else if (this._options.script){
      return this.renderScript();
    } else {
      throw new Error('no data source provided!');
    }
  }

  /**
   * @desc format data
   * @param  {string} bucket
   * @param  {string|string[]} metrics
   */
  protected getData(bucket: string, metrics: string[]): Array<any> | Object {

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
    let haltHandler = this._options.haltHandler;
    let metricNames = metrics.map(m => m.split('>').pop());
    let result: Array<any> | Object;
    let pathLink = metrics[0].split('>').slice(1);
    let metricName = pathLink.pop();
    if (pathLink.length > 0) {
      result = {};
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
      getFinalArrays(result).forEach((ar) => {
        HaltHandlerProvider.processDataset(ar, haltHandler);
      });
    } else {
      result = (<Array<any>>this._dataSet[bucket])
        .map((d) => {
          return [d[0], ...metricNames.map(n => d[1][n])];
        });
      HaltHandlerProvider.processDataset((<Array<any>>result), haltHandler);
    }

    return result;

    function getFinalArrays(object: Object): Array<Array<any>> {
      let result = [];
      for (let key in object) {
        if (object[key] instanceof Array) {
          result.push(object[key])
        } else {
          result = result.concat(getFinalArrays(object[key]));
        }
      }
      return result;
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
   * @return {string} get Symbol
   */
  protected getSymbol() {
    return this._chartContainer.getSymbol();
  }

  /**
   * @desc render script 
   */
  protected renderScript() {
    if (!this._options.context || !this._options.context.length) throw new Error('context is required by script method.');

    let contexts = this._options.context.map(field => {
      return this.getData(this._bindingOtions.x.field, [field]);
    });

    let fullPath = this._options.context[0];

    let pathLink = fullPath.split('>')
    pathLink.pop();
    pathLink.splice(0, 1);
    if (!pathLink.length) {
      return this._options.script.apply(this._options.script, contexts);
    } else {
      let paths = getPath(contexts[0]);

      let result = {};
      let currentObject = result;

      paths.forEach((path, i) => {
        let _subContexts: any[] = contexts;
        path.forEach((pace, j) => {
          _subContexts = contexts.map(_context => {
            return _context[pace];
          });
          currentObject[pace] = j === path.length - 1 ?
            this._options.script.apply(this._options.script, [path].concat(_subContexts)) : {};
        });
      });

      return result;
    }

    function getPath(o: Object): Array<Array<string>> {
      if (o instanceof Array) {
        return null;
      }

      /**
       * [['p1'], ['p2']]
       */
      let result = [];
      for (let key in o) {
        let _result = getPath(o[key]);
        if (!_result) {
          result.push([key]);
        } else {
          _result.forEach(r => {
            result.push([key].concat(r));
          });
        }
      }
      return result;
    }
    
  }

  /**
   * @param  {Object} target
   * @param  {Object} source
   * @param  {string} key
   */
  protected putProperty(target: Object, source: Object, key: string) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}