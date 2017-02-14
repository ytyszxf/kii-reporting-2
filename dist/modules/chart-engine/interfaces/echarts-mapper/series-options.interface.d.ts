import { SeriesType } from '../../models/series-type.type';
export interface IECSeriesOptions {
    name?: string;
    type?: SeriesType;
    data?: Array<any>;
    itemStyle?: {
        normal?: {
            color?: string;
        };
    };
}
