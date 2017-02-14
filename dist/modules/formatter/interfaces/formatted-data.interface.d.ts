export interface IFormattedData {
    [dimensionName: string]: [string | number, IFormattedData][] | string | number;
}
