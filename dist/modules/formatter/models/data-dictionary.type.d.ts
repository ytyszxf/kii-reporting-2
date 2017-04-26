import { IESXAggregationFormatter } from '../interfaces/aggregation-formatter.interface';
import { FormatterEngine } from '../formatter-engine.type';
export declare class DataDictionary {
    private data;
    aggFormatter: IESXAggregationFormatter;
    private formatterEngine;
    raw: any;
    private pathMapper;
    static isFinal(d: any): boolean;
    constructor(data: any, aggFormatter: IESXAggregationFormatter, formatterEngine: FormatterEngine);
    private init();
    private fillGap(data, agg, path);
    /**
     * @param {string} root
     * @param {Array<any>} path
     */
    getBucketKeys(root: string, path?: any[]): any[];
    search(root: string, query: string, path?: any[]): SearchResult;
    private _search(root, query, path?);
    private getFormatter(rootPath);
    private getKRFormatter(aggregationName);
    private getDataRoot(data, root, path);
    private validateRootAndPath(root, path);
    private validateQuery(root, query);
    setData(data: any): void;
    getSubset(independentVal: number | string, agg: string): DataDictionary;
}
export declare class SearchResult {
    data: any;
    constructor(data: any);
    merge(result: SearchResult): void;
    private _literate(o1, o2);
}
