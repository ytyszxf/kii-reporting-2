import { start } from '../../../dev/dev';
export type HaltHandler = "AVG" | "IGNORE" | "VOID" | "ZERO";

export interface IHaltHanlder {
  (data: any[], index: number, context: Array<any>): any[];
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

  public static processDataset(dataset: Array<Array<any>>, method: HaltHandler | IHaltHanlder) {
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
  private static _averageHandler(data: [any, any], index: number, context: Array<any>): any[] {

    let result = [data[0]];
    for (let i = 1; i < data.length; i++){
      let start = index,
        end = index,
        startVal = null,
        endVal = null;
      
      while (start > 0) {
        start--;
        if (context[start][i] !== null) {
          startVal = context[start][i];
          break;
        }
      }

      while (end < context.length - 1) {
        end++;
        if (context[end][i] !== null) {
          endVal = context[end][i];
          break;
        }
      }

      if (startVal === null || endVal === null) {
        return undefined;
      }
      result.push((startVal + endVal) / 2);
    }
    
    
    return result;
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc remove the value from array
   */
  private static _ignoreHandler(data: [any, any], index: number, context: Array<any>): any[] {
    return undefined;
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc no interrupt
   */  
  private static _voidHandler(data: [any, any], index: number, context: Array<any>): any[] {
    return data;
  }

  /**
   * @param  {[any, any]} data 
   * @param  {number} index
   * @param  {Array<any>} context
   * @return {[any, any]} new data
   * @desc return zero value
   */  
  private static _zeroHandler(data: [any, any], index: number, context: Array<any>): any[] {
    let result = [];
    for (let i = 0; i < data.length; i++){
      if (data[i] === undefined || data[i] === null) {
        result.push(0);
      } else {
        result.push(data[i]);
      }
    }
    return result;
  }
}