import { IKRLegend } from '../interfaces/legend.interface';
import { DataDictionary } from '../../formatter/models/data-dictionary.type';
import { KRChartContainer } from '../chart-container.type';
export declare class KRLegend {
    private _container;
    private _options;
    private _data;
    constructor(_container: KRChartContainer, _options?: IKRLegend);
    private _init();
    setData(data: DataDictionary): void;
    readonly options: IKRLegend;
}
