import { IKRToolTip } from '../interfaces/tooltip.interface';
import { KRChartContainer } from '../chart-container.type';
import { TriggerType } from '../interfaces/trigger.type';
import { KRSeries } from '../series/series.type';

const triggerTypeSequence: Array<TriggerType> = ['item', 'axis'];

export class KRToolTip {

  constructor(
    private _container: KRChartContainer,
    private _opts?: IKRToolTip
  ) {
    this._init();
  }

  private _init() {
    
  }

  /**
   * @desc
   * by default, when independentAxis data type is category,
   * trigger should be axis, otherwise trigger should be item.
   * if trigger type is given, then it won't be overrided.
   */
  public get options() {
    let independentAxis = this._container.independentAxis;
    let options = Object.assign({}, this._opts);
    if (!options.trigger) {
      let triggerTypeIndex: number = 0;
      this._container.series.forEach(s => {
        let defaultTriggerTypeIndex = triggerTypeSequence
          .indexOf((<typeof KRSeries>s.constructor).defaultTrigger);
        triggerTypeIndex = triggerTypeIndex > defaultTriggerTypeIndex ?
          triggerTypeIndex : defaultTriggerTypeIndex;
        
      });
      options.trigger = triggerTypeSequence[triggerTypeIndex];
    }
    return options;
  }
  
}