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

  private GAME_OVER = false;

  availableCellKeys: string[] = [];

  private _playerSide: PlayerSide;

  Board: Board;

  Move: Move;

  get isGameOver() {
    return this.GAME_OVER;
  }

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

    this.checkCheck(this.playerSide);
    this.checkCheck(this.getEnemySide);

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

  setMate(playerSide: PlayerSide, checkValue = true) {
    this.checkMateInfo[playerSide].isMate = checkValue;
    this.GAME_OVER = true;
    this.Board.disableActiveCell();
    this.Move.clearMovedCells();
    this.Move.clearCutedCells();
  }

  getCheck(playerSide = this.playerSide) {
    return this.checkMateInfo[playerSide].isCheck;
  }

  getCheckCellKey(playerSide = this.playerSide) {
    return this.checkMateInfo[playerSide].checkInfo.figureCellKeyCheck;
  }

  checkMate(playerSide: PlayerSide, enemySide: PlayerSide) {
    const cellKingInfo = this.Board.getKingCellKey(playerSide);

    if (cellKingInfo) {
      const [kingCellKey] = cellKingInfo;
      const kingMoves = this.Move.getAvailbleActionMoveKing(kingCellKey, playerSide, enemySide);
      const availableCellKeys = this.getAvailableActionCellKeys();

      const saveMovesCellKeys = [
        ...kingMoves,
        ...availableCellKeys.filter((cellKey) => cellKey !== kingCellKey),
      ];

      if (!saveMovesCellKeys.length) {
        this.setMate(playerSide);
      }
    }
  }

  checkCheck(playerSide: PlayerSide) {
    const enemySide = Game.getEnemySideBySide(playerSide);
    const kingDataCell = this.Board.getKingCellKey(playerSide);

    if (kingDataCell) {
      const figureCellKeys = this.Board.getCellKeyFiguresBySide(enemySide);
      const [, figuresBesidesKing] = this.Board.getFiguresBesidesKing(figureCellKeys);
      const getCheck = this.getCheck(playerSide);

      const cutPathsToKingInfo = figuresBesidesKing
        .map((cellKeyFigure) => ({
          cellKeyFigure,
          cutPathToKing: this.Move.getPathCellKeysToKing(
            cellKeyFigure,
            enemySide,
            this.Board.data[cellKeyFigure].figure.type
          ),
        }))
        .flat();

      const cutPathsToKing = cutPathsToKingInfo.filter((item) => item.cutPathToKing.length);

      const hasCheck = cutPathsToKing.length !== 0;

      if (playerSide !== this.playerSide && getCheck && hasCheck) {
        this.setMate(playerSide);
        return;
      }
      // По дефолту ставим название клетки первой фигуры,
      // которая поставила шах, без реализации множественного шаха
      this.setCheck(playerSide, hasCheck, cutPathsToKing[0]?.cellKeyFigure || '');

      if (hasCheck) {
        this.checkMate(playerSide, enemySide);
      }
    }
  }

  getAvailableActionCellKeys(
    playerSide = this.playerSide,
    enemySide = this.getEnemySide,
    checkCellKey = this.getCheckCellKey()
  ) {
    const isCheck = this.getCheck();
    const allCellKeys = this.Board.getCellKeyFiguresBySide(playerSide);

    if (isCheck && checkCellKey) {
      const availableCellKeys: string[] = [];
      const cellCheck = this.Board.getCell(checkCellKey);
      const [cellKeyKing, cellKeysBesideKing] = this.Board.getFiguresBesidesKing(allCellKeys);

      if (cellCheck) {
        const cellKeysToKing = this.Move.getPathCellKeysToKing(
          checkCellKey,
          enemySide,
          cellCheck.figure.type
        );

        const cellKeysInfo = this.Move.getActionCellsInfo(cellKeysBesideKing, playerSide);

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
    if (this.isGameOver) {
      return;
    }

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

  static getEnemySideBySide(playerSide: PlayerSide) {
    if (playerSide === FIGURE_SIDE.WHITE) {
      return FIGURE_SIDE.BLACK;
    }

    return FIGURE_SIDE.WHITE;
  }

  get getEnemySide(): PlayerSide {
    return Game.getEnemySideBySide(this.playerSide);
  }
}
