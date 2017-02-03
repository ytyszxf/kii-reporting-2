import { IKRXAxis } from '../interfaces/x-axis.interface';
import { IKRAxisOptions } from '../interfaces/axis.interface';

export class KRXAxis {
  private _options: IKRXAxis;

  constructor(opts: IKRXAxis) {
    this._options = opts;
  }

  public get field(): string{
    return this._options.field;
  }

  public setOptions(opts: IKRAxisOptions) {
    Object.assign(this._options.options, opts);
  }

  public get options(): IKRAxisOptions {
    let options = {};

    Object.assign(options, this._options.options);

    return options;
  }

  set data(data: any) {
    this._options.options.data = data;
  }

  get data() {
    return this._options.options.data;
  }
}