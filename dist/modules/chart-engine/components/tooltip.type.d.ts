import { IKRToolTip } from '../interfaces/tooltip.interface';
import { KRChartContainer } from '../chart-container.type';
export declare class KRToolTip {
    private _container;
    private _opts;
    constructor(_container: KRChartContainer, _opts?: IKRToolTip);
    private _init();
    /**
     * @desc
     * by default, when independentAxis data type is category,
     * trigger should be axis, otherwise trigger should be item.
     * if trigger type is given, then it won't be overrided.
     */
    readonly options: {} & IKRToolTip;
}
