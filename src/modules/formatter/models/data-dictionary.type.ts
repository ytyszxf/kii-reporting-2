import { IESXFormatter } from '../interfaces/formatter.interface';
import { IESAggregation } from '../interfaces/es/es-aggregation.interface';
import { IESXAggregationFormatter } from '../interfaces/aggregation-formatter.interface';
import { KRAggregationFormatter } from './aggregation-formatter/aggregation-formatter.type';
import { FormatterEngine } from '../formatter-engine.type';
import { FormatMode, AggFormatter } from './aggregation-formatter/aggregation-formatter.annotation';

export class DataDictionary {

  public raw;
  private pathMapper: { [path: string]: Set<any> } = {};

  public static isFinal(d) {
    return d.data && d.data instanceof Array;
  }
  
  constructor(
    private data: any,
    public aggFormatter: IESXAggregationFormatter,
    private formatterEngine: FormatterEngine
  ) { 
    this.raw = data;
    this.init();
  }

  private init() {
    let self = this;
    literate(this.data, this.aggFormatter, []);
    this.fillGap(this.data, this.aggFormatter, []);

    function literate (data, agg: IESXAggregationFormatter, path: string[]) {
      agg.children
        .forEach(child => {
          let newPath = path.concat([child.field]),
            newPathStr = newPath.join('-');  
          let aggMethod = self.getKRFormatter(child.aggregationName);
          if (aggMethod.formatMode !== FormatMode.EXPAND) {
            self.pathMapper[newPathStr] = new Set([data[child.field][0][0]]);
            literate(data[child.field][1], child, newPath);
            return;
          }

          if (aggMethod.aggType !== 'terms') {
            if (!self.pathMapper[newPathStr]) {
              self.pathMapper[newPathStr] = new Set(data[child.field].map(d => d[0]));
            }
            data[child.field].forEach(d => {
              literate(d[1], child, path.concat([child.field]));
            });
          } else {
            if (!self.pathMapper[newPathStr]) {
              self.pathMapper[newPathStr] = new Set();
            }
            data[child.field].forEach(d => {
              if (!self.pathMapper[newPathStr].has(d[0])) {
                self.pathMapper[newPathStr].add(d[0]);
              }
              literate(d[1], child, path.concat([child.field]));
            });
          }
        });
    }
  }

  private fillGap(data, agg: IESXAggregationFormatter, path: string[]) {
    let self = this;
    agg.children.forEach(child => {
      let newPath = path.concat([child.field]),
        newdata = data[child.field];
        
      if (child.aggregationName === 'terms') {
        let newPathStr = newPath.join('-');
        this.pathMapper[newPathStr]
          .forEach(key => {
            if (!newdata.find(d => d[0] === key)) {
              fill(newdata, key, child, newPath);
            }
          });
      } else {
        newdata.forEach((d) => {
          this.fillGap(d[1], child, newPath);
        });
      }
    });

    function fill(dataset: Array<any>, value, agg: IESXAggregationFormatter, path) {
      let subset = {};
      dataset.push([value, subset]);
      agg.metrics.forEach(metric => {
        subset[metric.field] = null;
      });
      agg.children.forEach(child => {
        let newPath = path.concat([child.field]),
          newPathStr = newPath.join('-');
        
        subset[child.field] = [];
        self.pathMapper[newPathStr].forEach(key => {
          fill(subset[child.field], key, child, newPath);
        });
      });
    }
  }
  

  /**
   * @param {string} root 
   * @param {Array<any>} path
   */  
  public getBucketKeys(root: string, path: any[] = []) {
    if(!this.validateRootAndPath(root, path)){
      throw new Error('root path not match path params!');
    }
    let dataRoot: Array<any> = this.getDataRoot(this.data, root, path);
    return dataRoot.map(d => d[0]);
  }

  public search(root: string, query: string, path: any[] = []) {
    return this._search(root, query, path);
  }

  private _search(root: string, query: string, path: any[] = []) {
    if(!this.validateRootAndPath(root, path)){
      throw new Error('root path not match path params!');
    }
    if (!this.validateQuery(root, query)) {
      throw new Error('root path not math query path!');
    }

    let dataRoot = this.getDataRoot(this.data, root, path);
    let rootPath = root.split('>');
    let pathLink = query.split('>');
    let startIndex = rootPath.length;
    let metric = pathLink.pop();
    let result: any;
    let self = this;

    if (pathLink.length > rootPath.length) {
      result = {};
      dataRoot.forEach((raw) => {
        literate(raw[1][pathLink[startIndex]], result, pathLink, startIndex + 1);
        function literate(data, r, pathLink: string[], i: number) {
          let formatter = self.getFormatter(pathLink.concat([]).splice(0, i));
          
          if (pathLink.length === i) {
            data.forEach(d => {
              if (formatter.formatMode === FormatMode.EXPAND) {
                r[d[0]] = r[d[0]] || { data: [] };
                r[d[0]].data.push([raw[0], d[1][metric]]);
              } else {
                r.data = r.data || [];
                r.data.push([raw[0], d[1][metric]]);
              }
            });
          } else {
            data.forEach(d => {
              let _d = d[1][pathLink[i]];
              
              if (formatter.formatMode === FormatMode.EXPAND) {
                if (!r[d[0]]) { r[d[0]] = {}; }
                let _r = r[d[0]];
                literate(_d, _r, pathLink, i + 1);
              } else {
                literate(_d, r, pathLink, i + 1);
              }
            });
          }
        }
      });
    } else {
      result = {data: dataRoot.map(d => [d[0], d[1][metric]])};
    }    
    
    return new SearchResult(result);
  }

  private getFormatter(rootPath: string[]): typeof KRAggregationFormatter {
    let currentAgg = this.aggFormatter;

    rootPath.forEach(pace => {
      currentAgg = currentAgg.children.find(f => f.field === pace);
    });
    return this.getKRFormatter(currentAgg.aggregationName);
  }

  private getKRFormatter(aggregationName) {
    return <typeof KRAggregationFormatter>this.formatterEngine
      .findAggregationFormatter(aggregationName).constructor;
  }

  private getDataRoot(data, root: string, path: any[]): Array<Array<any>> {
    let rootPath = root.split('>');
    // for (let i = 0; i < rootPath.length - 1; i++){
    //   _dataRoot = _dataRoot[rootPath[i]][path[i]];
    // }
    return data[rootPath[rootPath.length - 1]];
  }

  private validateRootAndPath(root: string, path: any[]) {
    let rootPath = root.split('>');
    if (path.length != rootPath.length - 1) {
      return false;
    }
    return true;
  }

  private validateQuery(root: string, query: string) {
    let rootPath = root.split('>');
    let queryPath = query.split('>');
    for (let i = 0; i < rootPath.length; i++){
      if (rootPath[i] !== queryPath[i]) return false;
    }
    return true;
  }

  public setData(data: any) {
    this.data = data;
  }

  public getSubset(independentVal: number | string, agg: string) {
    let dataset = this.data[agg.split('>').pop()].find(d => d[0] === independentVal);
    if (!dataset) throw new Error(`dataset not found for independentVal: ${independentVal}. Data: ${this.data}`);
    let data = dataset[1];
    let aggFormatter = this.aggFormatter.children.find(o => o.field === agg);
    return new DataDictionary(data, aggFormatter, this.formatterEngine);
  }
}

export class SearchResult {

  constructor(
    public data
  ) { }
  
  public merge(result: SearchResult) {
    if (DataDictionary.isFinal(this.data)) {
      (<Array<Array<any>>>this.data.data).forEach((d, i) => {
        (<Array<any>>result.data.data[i])
          .slice(1)
          .forEach((d1) => {
            d.push(d1);
          });
      });
    } else {
      this._literate(this.data, result.data);
    }
  }

  private _literate(o1: Object, o2: Object) {
    if (DataDictionary.isFinal(o1)) {
      (<Array<any>>o2['data']).forEach((datum, i) => {
        datum.slice(1).forEach(d => {
          o1['data'][i].push(d);
        });
      })
    } else {
      for (let key in (<Object>o1)) {
        this._literate(o1[key], o2[key]);
      }
    }
  }
}
