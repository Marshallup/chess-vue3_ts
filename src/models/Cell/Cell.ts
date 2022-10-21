import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';
import { Figure } from '../Figure';

export class Cell {
  figure: Figure;

  private _active = false;

  private _canMove = false;

  private _canCut = false;

  constructor(type: FIGURE_TYPE, side: FIGURE_SIDE) {
    this.figure = new Figure(type, side);
  }

  get active() {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get canCut() {
    return this._canCut;
  }

  set canCut(value: boolean) {
    this._canCut = value;
  }

  get canMove() {
    return this._canMove;
  }

  set canMove(value: boolean) {
    this._canMove = value;
  }

  static getEmptyCell(): Cell {
    return new Cell(FIGURE_TYPE.CELL, FIGURE_SIDE.NONE);
  }
}
