import { start } from '../../../dev/dev';
export type HaltHandler = "AVG" | "IGNORE" | "VOID" | "ZERO";

export interface IHaltHanlder {
  (data: [any, any], index: number, context: Array<any>): [any, any];
}

export class HaltHandlerProvider {
  
  public static getHandler(handler: HaltHandler): IHaltHanlder {
    switch (handler) {
      case 'AVG':
        return this._averageHandler;
      case 'IGNORE':
        return this._ignoreHandler;
      case 'VOID':
        return this._voidHandler;
      case 'ZERO':
        return this._zeroHandler
      default:
        return this._voidHandler;
    }
  }

  public static processDataset(dataset: Array<[any, any]>, method: HaltHandler | IHaltHanlder) {
    let _method: IHaltHanlder = typeof method === 'string' ?
      HaltHandlerProvider.getHandler(method) : method;
    
    for (let i = 0, d = dataset[i]; i < dataset.length; ++i, d = dataset[i]) {
      if (d.findIndex(_d => _d === undefined || _d === null) === -1) continue;
      let r = _method(d, i, dataset);
      if (r !== undefined) {
        dataset[i] = r;
      } else {
        dataset.splice(i, 1);
        i--;
      }
    }
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc get the average value of the nearest values before and after current index
   */
  private static _averageHandler(data: [any, any], index: number, context: Array<any>): [any, any] {
    let start = index,
      end = index,
      startVal = null,
      endVal = null;
    
    while (start > 0) {
      start--;
      if (context[start][1] !== null) {
        startVal = context[start][1];
        break;
      }
    }

    while (end < context.length - 1) {
      end++;
      if (context[end][1] !== null) {
        endVal = context[end][1];
        break;
      }
    }

    if (startVal === null || endVal === null) {
      return undefined;
    }
    
    return [data[0], (startVal + endVal) / 2];
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc remove the value from array
   */
  private static _ignoreHandler(data: [any, any], index: number, context: Array<any>): any {
    return undefined;
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc no interrupt
   */  
  private static _voidHandler(data: [any, any], index: number, context: Array<any>): [any, any] {
    return data;
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc return zero value
   */  
  private static _zeroHandler(data: [any, any], index: number, context: Array<any>): [any, any] {
    return [data[0], 0];
  }
}