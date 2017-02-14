import { KRSeries } from './series.type';
import { ISeriesVariables } from '../interfaces/series-variable.interface';
export declare class KRScatterSeries extends KRSeries {
    private _sizeValRange;
    protected _render(): void;
    protected readonly variables: ISeriesVariables;
    private buildOptions(opts);
}
