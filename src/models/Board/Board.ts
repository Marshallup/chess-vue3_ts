import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';
import { COUNT_CELLS, LETTERS, NUMBERS } from '@/constants/board';
import { getBoardLetter, getFigureInitBoard, getRowNumBoard } from '@/service/board';
import { BoardData } from './types';
import { Cell } from '../Cell';
import { Figure } from '../Figure';
import { PlayerSide } from '../Game/types';

export class Board {
  private _data: BoardData = {};

  private _activeCellKey = '';

  get activeCellKey() {
    return this._activeCellKey;
  }

  get data() {
    return this._data;
  }

  constructor() {
    this.initBoardData();
  }

  getCell(cellKey: string): Cell | undefined {
    return this.data[cellKey];
  }

  setActiveCellKey(cellKey: string, active = true) {
    const cell = this.getCell(cellKey);

    this.disableActiveCell(false);

    this._activeCellKey = cellKey;

    if (cell) {
      this.data[cellKey].active = active;
    }
  }

  getKingCellKey(playerSide: PlayerSide) {
    return Object.entries(this.data).find(
      ([, cellData]) =>
        cellData.figure.type === FIGURE_TYPE.KING && cellData.figure.side === playerSide
    );
  }

  getFiguresBesidesKing(cellKeys: string[]): [string, string[]] {
    let cellKeyKing = '';

    const figureKeys = cellKeys.filter((cellKey) => {
      const cell = this.getCell(cellKey);

      if (cell) {
        if (cell.figure.type === FIGURE_TYPE.KING) {
          cellKeyKing = cellKey;
        }

        return cell.figure.type !== FIGURE_TYPE.CELL && cell.figure.type !== FIGURE_TYPE.KING;
      }

      return false;
    });

    return [cellKeyKing, figureKeys];
  }

  setCanMoveFigureByKey(cellKey: string, value = true) {
    this.data[cellKey].canMove = value;
  }

  setCanCutFigureByKey(cellKey: string, value = true) {
    this.data[cellKey].canCut = value;
  }

  disableActiveCell(removeCellKey = true) {
    const activeCell = this.getCell(this.activeCellKey);

    if (activeCell) {
      activeCell.active = false;
    }

    if (removeCellKey) {
      this._activeCellKey = '';
    }
  }

  setFigureCell(cellKey: string, figure: Figure) {
    this.data[cellKey].figure = figure;
  }

  setCell(cellKey: string, cell: Cell | false) {
    if (!cell) {
      this.data[cellKey] = Cell.getEmptyCell();
    } else {
      this.data[cellKey] = cell;
    }
  }

  getCellKey(letterIdx: number, number: number) {
    const letter = LETTERS[letterIdx];
    const numberRow = number <= 8 && number > 0 ? number : undefined;

    if (!letter || numberRow === undefined) {
      return undefined;
    }

    const cellKey = `${numberRow}${letter}`;

    if (!this.data[cellKey]) {
      return undefined;
    }

    return cellKey;
  }

  getCellKeyFiguresBySide(side: PlayerSide) {
    const figureKeys: string[] = [];

    Object.entries(this.data).forEach(([cellKey, cellData]) => {
      if (cellData.figure.side === side && cellData.figure.type !== FIGURE_TYPE.CELL) {
        figureKeys.push(cellKey);
      }
    });

    return figureKeys;
  }

  initBoardData(testFigure?: FIGURE_TYPE) {
    const isTestFigure = (testFigure as number) >= 0;
    let rowNum = NUMBERS;

    for (let i = COUNT_CELLS; i >= 1; i -= 1) {
      const rowNumBoard = getRowNumBoard(i);
      const boardLetter = getBoardLetter(rowNumBoard);
      const boardCellKey = `${rowNum}${boardLetter}`;

      if (!isTestFigure) {
        const { type, side } = getFigureInitBoard(boardCellKey);

        this.data[boardCellKey] = new Cell(type, side);
      } else {
        this.data[boardCellKey] = new Cell(FIGURE_TYPE.CELL, FIGURE_SIDE.NONE);
      }

      if (rowNumBoard === 1) {
        rowNum -= 1;
      }
    }

    if (isTestFigure) {
      this.data['4d'] = new Cell(testFigure as FIGURE_TYPE, FIGURE_SIDE.WHITE);
      this.data['8a'] = new Cell(FIGURE_TYPE.PAWN, FIGURE_SIDE.BLACK);
    }
  }
}
