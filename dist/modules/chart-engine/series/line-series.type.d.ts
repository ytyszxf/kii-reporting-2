import { KRSeries } from './series.type';
import { ISeriesVariables } from '../interfaces/series-variable.interface';
export declare class KRLineSeries extends KRSeries {
    protected _render(): void;
    protected readonly variables: ISeriesVariables;
    private buildOptions(opts);
}
