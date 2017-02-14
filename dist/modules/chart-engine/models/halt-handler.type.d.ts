export declare type HaltHandler = "AVG" | "IGNORE" | "VOID" | "ZERO";
export interface IHaltHanlder {
    (data: any[], index: number, context: Array<any>): any[];
}
export declare class HaltHandlerProvider {
    static getHandler(handler: HaltHandler): IHaltHanlder;
    static processDataset(dataset: Array<Array<any>>, method: HaltHandler | IHaltHanlder): void;
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc get the average value of the nearest values before and after current index
     */
    private static _averageHandler(data, index, context);
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc remove the value from array
     */
    private static _ignoreHandler(data, index, context);
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc no interrupt
     */
    private static _voidHandler(data, index, context);
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc return zero value
     */
    private static _zeroHandler(data, index, context);
}
