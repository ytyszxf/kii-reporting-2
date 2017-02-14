import { IKRXAxis } from '../interfaces/x-axis.interface';
import { IKRAxisOptions } from '../interfaces/axis.interface';
export declare class KRAxis {
    private _options;
    constructor(opts: IKRXAxis);
    readonly field: string;
    setOptions(opts: IKRAxisOptions): void;
    readonly options: IKRAxisOptions;
    data: any;
}
