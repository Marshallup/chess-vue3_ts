import { LETTERS, NUMBERS } from '@/constants/board';
import { ACTION_CELL_TYPE } from '@/enums/board';
import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';
import { getEndIterationNum, getStartIterationNum, splitCellKey } from '@/service/board';
import { DirectionInfo, MoveDirType, CellMoveT } from './types';
import { Board } from '../Board';
import { Cell } from '../Cell';
import { FiguresPlayer, PlayerSide } from '../Game/types';

export class Move {
  private canMovedCells: string[] = [];

  private canCutedCells: string[] = [];

  private enemySide: PlayerSide;

  private Board;

  constructor(boardEl: Board, enemySide: PlayerSide) {
    this.Board = boardEl;
    this.enemySide = enemySide;
  }

  setEnemySide(side: PlayerSide) {
    this.enemySide = side;
  }

  getCutCellKeyKing(cellKey: string, activeSide: PlayerSide, figureType: FIGURE_TYPE): string {
    const [, cutCellKeys] = this.getActionMoveCellKeys(
      figureType,
      cellKey,
      activeSide,
      false,
      true
    );

    const kingCheck = cutCellKeys.find((cutCellKey) => {
      const cell = this.Board.getCell(cutCellKey);

      return cell?.figure?.type === FIGURE_TYPE.KING;
    });

    if (kingCheck) {
      return cellKey;
    }

    return '';
  }

  getPathCellKeysToKing(cellKey: string, activeSide: PlayerSide, figureType: FIGURE_TYPE) {
    const [, cutCellKeys] = this.getActionMoveCellKeys(
      figureType,
      cellKey,
      activeSide,
      true,
      true,
      true
    );

    return cutCellKeys;
  }

  getActionCellsInfo(
    figureCellKeys: string[],
    playerSide: PlayerSide
  ): { [key: string]: { moveCellKeys: string[]; cutCellKeys: string[] } } {
    const obj: { [key: string]: { moveCellKeys: string[]; cutCellKeys: string[] } } = {};

    figureCellKeys.forEach((figureCellKey) => {
      const cell = this.Board.getCell(figureCellKey);

      if (cell && cell?.figure?.type !== FIGURE_TYPE.CELL) {
        const [moveCell, cutCell] = this.getActionMoveCellKeys(
          cell.figure.type,
          figureCellKey,
          playerSide,
          true
        );

        obj[figureCellKey] = {
          moveCellKeys: moveCell,
          cutCellKeys: cutCell,
        };
      }
    });

    return obj;
  }

  getAvailbleActionMoveKing(cellKey: string, activeSide: PlayerSide, enemySide: PlayerSide) {
    const enemiesCutInfoKeys = this.getCutCellKeysFigures(enemySide);
    const [movedCellKeys, cutCellKeys] = this.getActionMoveCellKeys(
      FIGURE_TYPE.KING,
      cellKey,
      activeSide
    );
    const moveCellKeysKing = movedCellKeys.filter(
      (moveCellKey) => enemiesCutInfoKeys.indexOf(moveCellKey) === -1
    );

    return [moveCellKeysKing, cutCellKeys];
  }

  initMovedCells(
    cellKey: string,
    activeCell: Cell['active'],
    activeSide: PlayerSide,
    figureType: FIGURE_TYPE
  ) {
    if (activeCell) {
      let cellKeys: CellMoveT = [[], []];

      switch (figureType) {
        case FIGURE_TYPE.KING:
          {
            const [moveCellKeysKing, cutCellKeys] = this.getAvailbleActionMoveKing(
              cellKey,
              activeSide,
              this.enemySide
            );

            cellKeys[0] = moveCellKeysKing;
            cellKeys[1] = cutCellKeys;
          }
          break;
        default:
          cellKeys = this.getActionMoveCellKeys(figureType, cellKey, activeSide);
          break;
      }

      this.setMovedCells(cellKeys[0]);
      this.setCutedCells(cellKeys[1]);
    }
  }

  moveFigure(
    fromCellKey: string,
    toCellKey: string,
    isCutFigure: boolean,
    onCutCb?: (cellFigure: FiguresPlayer) => void
  ) {
    const fromCellFigure = this.Board.getCell(fromCellKey)?.figure;
    const toCellFigure = this.Board.getCell(toCellKey)?.figure;

    if (fromCellFigure && toCellFigure) {
      this.Board.setFigureCell(toCellKey, fromCellFigure);

      if (!isCutFigure) {
        this.Board.setFigureCell(fromCellKey, toCellFigure);
      } else {
        this.Board.setCell(fromCellKey, false);
        if (toCellFigure.type !== FIGURE_TYPE.CELL && toCellFigure.type !== FIGURE_TYPE.KING) {
          onCutCb?.(toCellFigure.type);
        }
      }

      if (fromCellFigure.firstMove) {
        fromCellFigure.setFirstMove(false);
      }
    }
  }

  setMovedCells(cellKeys: string[]) {
    this.canMovedCells = cellKeys;
    cellKeys.forEach((cell) => this.Board.setCanMoveFigureByKey(cell));
  }

  setCutedCells(cellKeys: string[]) {
    this.canCutedCells = cellKeys;
    cellKeys.forEach((cell) => this.Board.setCanCutFigureByKey(cell));
  }

  clearMovedCells() {
    this.canMovedCells.forEach((cellKey) => {
      this.Board.setCanMoveFigureByKey(cellKey, false);
    });
    this.canMovedCells = [];
  }

  clearCutedCells() {
    this.canCutedCells.forEach((cellKey) => {
      this.Board.setCanCutFigureByKey(cellKey, false);
    });
    this.canCutedCells = [];
  }

  private getActionCellKeys(
    cellKey: string,
    countMove: number,
    activeSide: PlayerSide,
    drs: MoveDirType[] = ['top'],
    cellAction: ACTION_CELL_TYPE = ACTION_CELL_TYPE.BOTH,
    getCellCutKing = false,
    infoCut = false,
    getOnlyPathToKing = false
  ): CellMoveT {
    const [numberCell, letterCell] = splitCellKey(cellKey);
    const letterIdx = LETTERS.findIndex((letter) => letter === letterCell);
    const cellKeysMove: string[] = [];
    const drsInfo: DirectionInfo = {
      top: {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx,
        startNumberCell: numberCell + 1,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'top-right': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 1,
        startNumberCell: numberCell + 1,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'top-g-right': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 1,
        startNumberCell: numberCell + 2,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'top-left': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 1,
        startNumberCell: numberCell + 1,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'top-g-left': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 1,
        startNumberCell: numberCell + 2,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      right: {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 1,
        startNumberCell: numberCell,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'right-g-top': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 2,
        startNumberCell: numberCell + 1,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      'right-g-bottom': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 2,
        startNumberCell: numberCell - 1,
        positiveNumberCell: true,
        cellsCut: [],
        canCutKing: false,
      },
      bottom: {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx,
        startNumberCell: numberCell - 1,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'bottom-right': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 1,
        startNumberCell: numberCell - 1,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'bottom-g-right': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx + 1,
        startNumberCell: numberCell - 2,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'bottom-left': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 1,
        startNumberCell: numberCell - 1,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'bottom-g-left': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 1,
        startNumberCell: numberCell - 2,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      left: {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 1,
        startNumberCell: numberCell,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'left-g-top': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 2,
        startNumberCell: numberCell + 1,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
      'left-g-bottom': {
        stopped: false,
        hasCuttedCell: false,
        startLetterIdx: letterIdx - 2,
        startNumberCell: numberCell - 1,
        positiveNumberCell: false,
        cellsCut: [],
        canCutKing: false,
      },
    };

    function getCutCells() {
      const arrDrsInfo = Object.values(drsInfo);
      let arrCutCellKeys: string[][] = [[]];

      if (getOnlyPathToKing) {
        const onlyPathToKingCells = arrDrsInfo.filter((drInfo) => drInfo.canCutKing);

        arrCutCellKeys = onlyPathToKingCells.map((drInfo) => drInfo.cellsCut);
      } else {
        arrCutCellKeys = arrDrsInfo.map((drInfo) => drInfo.cellsCut);
      }

      return arrCutCellKeys.flat();
    }

    drs.forEach((dr) => {
      let startI = getStartIterationNum(numberCell, letterIdx + 1, dr);
      const endI = getEndIterationNum(startI, letterIdx + 1, countMove, dr);
      const isPositionDr = drsInfo[dr].positiveNumberCell;

      while (isPositionDr ? startI < endI : startI > endI) {
        const { stopped } = drsInfo[dr];

        if (stopped) {
          break;
        }

        const cellKeyInfo = this.Board.getCellKey(
          drsInfo[dr].startLetterIdx,
          drsInfo[dr].startNumberCell
        );

        if (cellKeyInfo) {
          const cell = this.Board.getCell(cellKeyInfo);

          if (cell) {
            const isFrendFigure = this.Board.data[cellKeyInfo]?.figure?.side === activeSide;
            const isEmptyCell = cell.figure.type === FIGURE_TYPE.CELL;
            const isKing = cell.figure.type === FIGURE_TYPE.KING;

            if (isFrendFigure) {
              drsInfo[dr].stopped = true;
              break;
            }

            if (!stopped) {
              if (
                isEmptyCell &&
                (cellAction === ACTION_CELL_TYPE.MOVE || cellAction === ACTION_CELL_TYPE.BOTH)
              ) {
                cellKeysMove.push(cellKeyInfo);
              }

              if (
                !isFrendFigure &&
                (!isEmptyCell || infoCut) &&
                (cellAction === ACTION_CELL_TYPE.CUT || cellAction === ACTION_CELL_TYPE.BOTH)
              ) {
                if (
                  (getCellCutKing && isKing) ||
                  (!getCellCutKing && !isKing) ||
                  getOnlyPathToKing
                ) {
                  drsInfo[dr].cellsCut.push(cellKeyInfo);

                  if (isKing) {
                    drsInfo[dr].canCutKing = true;
                  }
                }
              }
            }

            if (!isEmptyCell && !isFrendFigure) {
              drsInfo[dr].stopped = true;
            }
          }
        } else {
          drsInfo[dr].stopped = true;
          break;
        }

        switch (dr) {
          case 'top':
            drsInfo[dr].startNumberCell += 1;
            break;
          case 'top-right':
            drsInfo[dr].startNumberCell += 1;
            drsInfo[dr].startLetterIdx += 1;
            break;
          case 'top-left':
            drsInfo[dr].startNumberCell += 1;
            drsInfo[dr].startLetterIdx -= 1;
            break;
          case 'left':
            drsInfo[dr].startLetterIdx -= 1;
            break;
          case 'bottom':
            drsInfo[dr].startNumberCell -= 1;
            break;
          case 'bottom-right':
            drsInfo[dr].startNumberCell -= 1;
            drsInfo[dr].startLetterIdx += 1;
            break;
          case 'bottom-left':
            drsInfo[dr].startNumberCell -= 1;
            drsInfo[dr].startLetterIdx -= 1;
            break;
          default:
            drsInfo[dr].startLetterIdx += 1;
            break;
        }

        if (isPositionDr) {
          startI += 1;
        } else {
          startI -= 1;
        }
      }
    });

    return [cellKeysMove, getCutCells()];
  }

  getCutCellKeysFigures(playerSide: PlayerSide): string[] {
    const cellKeys = this.Board.getCellKeyFiguresBySide(playerSide);

    return Array.from(
      new Set(
        cellKeys
          .map((cellKey) => {
            const cellData = this.Board.getCell(cellKey);

            if (cellData) {
              return this.getActionMoveCellKeys(cellData.figure.type, cellKey, playerSide, true)[1];
            }

            return [];
          })
          .flat()
      )
    );
  }

  getActionMoveCellKeys(
    figure: FIGURE_TYPE,
    cellKey: string,
    activeSide: PlayerSide,
    infoCut = false,
    getCellCutKing = false,
    getOnlyPathToKing = false
  ): CellMoveT {
    switch (figure) {
      case FIGURE_TYPE.PAWN: {
        const cell = this.Board.data[cellKey];

        const [, cutPawnCells] = this.getActionCellKeys(
          cellKey,
          1,
          activeSide,
          cell.figure.side === FIGURE_SIDE.WHITE
            ? ['top-left', 'top-right']
            : ['bottom-left', 'bottom-right'],
          ACTION_CELL_TYPE.CUT,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
        const [movedPawnCells] = this.getActionCellKeys(
          cellKey,
          cell.figure.firstMove ? 2 : 1,
          activeSide,
          cell.figure.side === FIGURE_SIDE.WHITE ? ['top'] : ['bottom'],
          ACTION_CELL_TYPE.MOVE,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );

        return [movedPawnCells, cutPawnCells];
      }
      case FIGURE_TYPE.ROOK:
        return this.getActionCellKeys(
          cellKey,
          8,
          activeSide,
          ['top', 'right', 'bottom', 'left'],
          undefined,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
      case FIGURE_TYPE.KNIGHT:
        return this.getActionCellKeys(
          cellKey,
          1,
          activeSide,
          [
            'top-g-right',
            'top-g-left',
            'left-g-top',
            'left-g-bottom',
            'right-g-top',
            'right-g-bottom',
            'bottom-g-right',
            'bottom-g-left',
          ],
          undefined,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
      case FIGURE_TYPE.BISHOP:
        return this.getActionCellKeys(
          cellKey,
          NUMBERS,
          activeSide,
          ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          undefined,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
      case FIGURE_TYPE.QUEEN:
        return this.getActionCellKeys(
          cellKey,
          NUMBERS,
          activeSide,
          [
            'top',
            'top-left',
            'top-right',
            'right',
            'left',
            'bottom',
            'bottom-left',
            'bottom-right',
          ],
          undefined,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
      case FIGURE_TYPE.KING:
        return this.getActionCellKeys(
          cellKey,
          1,
          activeSide,
          [
            'top',
            'top-left',
            'top-right',
            'right',
            'left',
            'bottom',
            'bottom-left',
            'bottom-right',
          ],
          undefined,
          getCellCutKing,
          infoCut,
          getOnlyPathToKing
        );
      default:
        return [[], []];
    }
  }
}
