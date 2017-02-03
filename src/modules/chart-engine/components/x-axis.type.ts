import { IKRXAxis } from '../interfaces/x-axis.interface';
import { IKRAxis } from '../interfaces/axis.interface';

export class KRXAxis {
  private _options: IKRAxis;

  constructor(opts: IKRXAxis) {
    this._options = opts;
  }

  public get options() {
    let options = {};

    Object.assign(options, this._options.options);
    options['type'] = options['type'] || 'value';

    return options;
  }
}