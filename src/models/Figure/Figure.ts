import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';

export class Figure {
  private _type: FIGURE_TYPE;

  private _side: FIGURE_SIDE;

  private _firstMove = false;

  constructor(type: FIGURE_TYPE, side: FIGURE_SIDE) {
    this._type = type;
    this._side = side;

    if (type !== FIGURE_TYPE.CELL) {
      this._firstMove = true;
    }
  }

  get type() {
    return this._type;
  }

  get side() {
    return this._side;
  }

  get firstMove() {
    return this._firstMove;
  }

  setFirstMove(value: Figure['firstMove']) {
    this._firstMove = value;
  }

  setFigureType(type: Figure['type']) {
    this._type = type;
  }
}
