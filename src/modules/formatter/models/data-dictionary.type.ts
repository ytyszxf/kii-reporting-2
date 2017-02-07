import { IESXFormatter } from '../interfaces/formatter.interface';
import { IESAggregation } from '../interfaces/es/es-aggregation.interface';
import { IESXAggregationFormatter } from '../interfaces/aggregation-formatter.interface';
import { KRAggregationFormatter } from './aggregation-formatter/aggregation-formatter.type';
import { FormatterEngine } from '../formatter-engine.type';
import { FormatMode } from './aggregation-formatter/aggregation-formatter.annotation';

export class DataDictionary {

  public raw;
  
  constructor(
    private data: any,
    private aggFormatter: IESXAggregationFormatter,
    private formatterEngine: FormatterEngine
  ) { 
    this.raw = data;
  }

  public static isFinal(d) {
    return d.data && d.data instanceof Array;
  }

  public getBucketKeys(root: string, path: any[] = []) {
    if(!this.validateRootAndPath(root, path)){
      throw new Error('root path not match path params!');
    }
    let dataRoot: Array<any> = this.getDataRoot(root, path);
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

    let dataRoot = this.getDataRoot(root, path);
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
              let _d = d[1][pathLink[0]];
              
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

    return <typeof KRAggregationFormatter>this.formatterEngine
      .findAggregationFormatter(currentAgg.aggregationName).constructor;
  }

  private getDataRoot(root: string, path: any[]): Array<Array<any>> {
    let rootPath = root.split('>');
    let _dataRoot = this.data;
    for (let i = 0; i < rootPath.length - 1; i++){
      _dataRoot = this.data[rootPath[i]][path[i]];
    }
    return _dataRoot[rootPath[rootPath.length - 1]];
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
}

class SearchResult {

  constructor(
    public data
  ) { }
  
  public merge(result: SearchResult) {
    if (this.data instanceof Array) {
      (<Array<Array<any>>>this.data).forEach((d, i) => {
        (<Array<any>>result.data[i])
          .slice(1)
          .forEach((d1) => {
            d.push(d1);
          });
      });
    } else {
      literate(this.data, result.data);
    }

    function literate(o1: Object | Array<any>, o2: Object | Array<any>) {
      if (o1 instanceof Array) {
        (<Array<any>>o2).slice(1).forEach(d => {
          o1.push(d);
        });
      } else {
        for (let key in (<Object>o1)) {
          literate(o1[key], o2[key]);
        }
      }
    }
  }
}
