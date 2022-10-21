import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';
import { Move } from '../Move';
import { Board } from '../Board/Board';
import { CheckMateInfo, PlayerSide, ScoreI } from './types';

export class Game {
  private checkMateInfo: CheckMateInfo = {
    [FIGURE_SIDE.WHITE]: {
      isCheck: false,
      checkInfo: {
        figureCellKeyCheck: null,
      },
      isMate: false,
    },
    [FIGURE_SIDE.BLACK]: {
      isCheck: false,
      checkInfo: {
        figureCellKeyCheck: null,
      },
      isMate: false,
    },
  };

  private score: ScoreI = {
    [FIGURE_SIDE.BLACK]: [],
    [FIGURE_SIDE.WHITE]: [],
  };

  availableCellKeys: string[] = [];

  private _playerSide: PlayerSide;

  Board: Board;

  Move: Move;

  constructor() {
    this.Board = new Board();
    this.Move = new Move(this.Board, this.getEnemySide);
    this._playerSide = FIGURE_SIDE.WHITE;
    this.availableCellKeys = this.Board.getCellKeyFiguresBySide(FIGURE_SIDE.WHITE);
  }

  get playerSide() {
    return this._playerSide;
  }

  setAvailableCellKeys(cellKeys: string[]) {
    this.availableCellKeys = cellKeys;
  }

  cellKeyIsAvailable(cellKey: string) {
    return this.availableCellKeys.includes(cellKey);
  }

  setPlayerSide(side: PlayerSide) {
    this._playerSide = side;
    this.setAvailableCellKeys(this.getAvailableActionCellKeys());
  }

  isAvailableActionCellKey(cellKey: string) {
    return this.availableCellKeys.includes(cellKey);
  }

  togglePlayerSide() {
    if (this.playerSide === FIGURE_SIDE.WHITE) {
      this.setPlayerSide(FIGURE_SIDE.BLACK);
    } else {
      this.setPlayerSide(FIGURE_SIDE.WHITE);
    }
  }

  setCheck(playerSide: PlayerSide, checkValue: boolean, figureCheck = '') {
    this.checkMateInfo[playerSide].isCheck = checkValue;
    this.checkMateInfo[playerSide].checkInfo.figureCellKeyCheck = figureCheck;
  }

  getCheck(playerSide = this.playerSide) {
    return this.checkMateInfo[playerSide].isCheck;
  }

  getCheckCellKey(playerSide = this.playerSide) {
    return this.checkMateInfo[playerSide].checkInfo.figureCellKeyCheck;
  }

  checkCheck(cellKey: string, playerSide: PlayerSide, figureType: FIGURE_TYPE) {
    const kingCheck = this.Move.getCutCellKeyKing(cellKey, playerSide, figureType);

    if (kingCheck) {
      console.log(kingCheck, 'kingCheck !!!');
      this.setCheck(this.getEnemySide, true, kingCheck);
    } else {
      this.setCheck(this.getEnemySide, false);
    }
  }

  getAvailableActionCellKeys() {
    const isCheck = this.getCheck();
    const checkCellKey = this.getCheckCellKey();
    const allCellKeys = this.Board.getCellKeyFiguresBySide(this.playerSide);

    if (isCheck && checkCellKey) {
      const availableCellKeys: string[] = [];
      const cellCheck = this.Board.getCell(checkCellKey);
      const [cellKeyKing, cellKeysBesideKing] = this.Board.getFiguresBesidesKing(allCellKeys);

      if (cellCheck) {
        const cellKeysToKing = this.Move.getPathCellKeysToKing(
          checkCellKey,
          this.getEnemySide,
          cellCheck.figure.type
        );

        const cellKeysInfo = this.Move.getActionCellsInfo(cellKeysBesideKing, this.playerSide);

        Object.entries(cellKeysInfo).forEach(([cellKeyFigure, cellActionKeys]) => {
          cellKeysToKing.forEach((cellKeyToKing) => {
            if (availableCellKeys.includes(cellKeyFigure)) {
              return;
            }

            if (cellActionKeys.moveCellKeys.includes(cellKeyToKing)) {
              availableCellKeys.push(cellKeyFigure);
            } else if (cellActionKeys.cutCellKeys.includes(checkCellKey)) {
              availableCellKeys.push(cellKeyFigure);
            }
          });
        });
      }

      return [...availableCellKeys, cellKeyKing];
    }

    return allCellKeys;
  }

  initActiveCell(cellKey: string) {
    const { activeCellKey } = this.Board;
    const cell = this.Board.getCell(cellKey);
    const isAvailableActionCellKey = this.isAvailableActionCellKey(cellKey);

    if (!cell) {
      return;
    }

    const isRightSide = cell.figure.side === this.playerSide;
    const isFriendFigureCell = isRightSide && cellKey !== activeCellKey;
    const isCanActionCell = cell.canMove || cell.canCut;

    this.Move.setEnemySide(this.getEnemySide);

    if (activeCellKey) {
      if (isFriendFigureCell) {
        if (!isAvailableActionCellKey) {
          return;
        }

        this.Move.clearMovedCells();
        this.Move.clearCutedCells();
        this.Board.setActiveCellKey(cellKey);
        this.Move.initMovedCells(cellKey, cell.active, this.playerSide, cell.figure.type);
      } else if (isCanActionCell) {
        this.Move.moveFigure(activeCellKey, cellKey, cell.figure.type !== FIGURE_TYPE.CELL);

        this.checkCheck(cellKey, this.playerSide, cell.figure.type);

        this.Board.disableActiveCell();
        this.Move.clearMovedCells();
        this.Move.clearCutedCells();

        this.togglePlayerSide();
      } else {
        this.Board.disableActiveCell();
        this.Move.clearMovedCells();
        this.Move.clearCutedCells();
      }
    } else if (isRightSide) {
      if (!isAvailableActionCellKey) {
        return;
      }
      this.Board.setActiveCellKey(cellKey);
      this.Move.initMovedCells(cellKey, cell.active, this.playerSide, cell.figure.type);
    }
  }

  get getEnemySide(): PlayerSide {
    if (this.playerSide === FIGURE_SIDE.WHITE) {
      return FIGURE_SIDE.BLACK;
    }

    return FIGURE_SIDE.WHITE;
  }
}
