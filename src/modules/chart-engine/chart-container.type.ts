import { ITEM_COLORS } from './settings/colors';
export class KRChartContainer {
  private _colorIndex: number;
  private _symbolIndex: number;
  private _colors: string[];
  private _symbols: string[];

  constructor() {
    this._colorIndex = 0;
    this._symbolIndex = 0;
    this._colors = ITEM_COLORS;
  }

  public getColor() {
    let color = this._colors[this._colorIndex++];
    this._colorIndex = (this._colorIndex >= this._colors.length) ?
      0 : this._colorIndex;
    return color;
  }

  public getSymbol() {
    let symbol = this._symbols[this._symbolIndex++];
    this._symbolIndex = this._symbolIndex >= this._symbols.length ?
      0 : this._symbolIndex;
    return symbol;
  }
}