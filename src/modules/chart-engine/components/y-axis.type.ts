import { IKRYAxis } from '../interfaces/y-axis.interface';

export class KRYAxis {

  private _options: IKRYAxis;

  constructor(opts: IKRYAxis) {
    this._options = opts;
  }

  public get options() {
    let options = {};

    Object.assign(options, this._options.options);
    options['type'] = options['type'] || 'value';

    return options;
  }
}