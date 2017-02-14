import { IESXAggregationFormatter } from '../interfaces/aggregation-formatter.interface';
import { FormatterEngine } from '../formatter-engine.type';
export declare class DataDictionary {
    private data;
    private aggFormatter;
    private formatterEngine;
    raw: any;
    constructor(data: any, aggFormatter: IESXAggregationFormatter, formatterEngine: FormatterEngine);
    static isFinal(d: any): boolean;
    getBucketKeys(root: string, path?: any[]): any[];
    search(root: string, query: string, path?: any[]): SearchResult;
    private _search(root, query, path?);
    private getFormatter(rootPath);
    private getDataRoot(root, path);
    private validateRootAndPath(root, path);
    private validateQuery(root, query);
    setData(data: any): void;
}
export declare class SearchResult {
    data: any;
    constructor(data: any);
    merge(result: SearchResult): void;
}
