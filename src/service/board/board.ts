import { LETTERS, NUMBERS } from '@/constants/board';
import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';
import { MoveDirType } from '@/models/Move/types';

export function splitCellKey(cellKey: string): [number, string] {
  const [number, letter] = cellKey.split('');

  return [+number, letter];
}

export function getEndIterationNum(
  numberCell: number,
  letterIdx: number,
  moveCount: number,
  dr: MoveDirType
) {
  switch (dr) {
    case 'top':
    case 'top-right':
    case 'top-left':
    case 'top-g-right':
    case 'top-g-left':
      return numberCell + moveCount >= 8 ? NUMBERS + 1 : numberCell + moveCount;
    case 'right':
    case 'right-g-top':
    case 'right-g-bottom':
      return letterIdx + moveCount >= 8 ? NUMBERS + 1 : letterIdx + moveCount;
    case 'left':
    case 'left-g-top':
    case 'left-g-bottom':
      return letterIdx - 1 - moveCount < 1 ? -1 : letterIdx - moveCount - 1;
    case 'bottom':
    case 'bottom-left':
    case 'bottom-right':
    case 'bottom-g-left':
    case 'bottom-g-right':
      return numberCell - moveCount <= 1 ? 0 : numberCell - moveCount;
    default:
      return numberCell;
  }
}

export function getStartIterationNum(numberCell: number, letterIdx: number, dr: MoveDirType) {
  switch (dr) {
    case 'right':
      return letterIdx;
    case 'right-g-top':
    case 'right-g-bottom':
      return letterIdx;
    case 'left':
    case 'left-g-top':
    case 'left-g-bottom':
      return letterIdx - 1;
    default:
      return numberCell;
  }
}

export function getBoardLetter(rowNumBoard: number) {
  if (rowNumBoard === 0) {
    return LETTERS[0];
  }

  if (rowNumBoard < NUMBERS) {
    return LETTERS[NUMBERS - rowNumBoard];
  }

  return undefined;
}

export function getRowNumBoard(idx: number) {
  return idx % NUMBERS;
}

export function getFigureInitBoard(cellKey: string): { type: FIGURE_TYPE; side: FIGURE_SIDE } {
  const [rowNum] = cellKey.split('');
  const rowNumNumber = +rowNum;
  const obj = {
    type: FIGURE_TYPE.CELL,
    side: FIGURE_SIDE.NONE,
  };

  switch (cellKey) {
    case '1a':
    case '1h':
    case '8h':
    case '8a':
      obj.type = FIGURE_TYPE.ROOK;

      switch (cellKey) {
        case '1a':
        case '1h':
          obj.side = FIGURE_SIDE.WHITE;
          break;
        default:
          obj.side = FIGURE_SIDE.BLACK;
      }
      break;
    case '1b':
    case '1g':
    case '8b':
    case '8g':
      obj.type = FIGURE_TYPE.KNIGHT;

      switch (cellKey) {
        case '1b':
        case '1g':
          obj.side = FIGURE_SIDE.WHITE;
          break;
        default:
          obj.side = FIGURE_SIDE.BLACK;
      }
      break;
    case '1c':
    case '1f':
    case '8c':
    case '8f':
      obj.type = FIGURE_TYPE.BISHOP;

      switch (cellKey) {
        case '1c':
        case '1f':
          obj.side = FIGURE_SIDE.WHITE;
          break;
        default:
          obj.side = FIGURE_SIDE.BLACK;
      }
      break;
    case '1e':
    case '8e':
      obj.type = FIGURE_TYPE.QUEEN;

      switch (cellKey) {
        case '1e':
          obj.side = FIGURE_SIDE.WHITE;
          break;
        default:
          obj.side = FIGURE_SIDE.BLACK;
      }
      break;
    case '1d':
    case '8d':
      obj.type = FIGURE_TYPE.KING;

      switch (cellKey) {
        case '1d':
          obj.side = FIGURE_SIDE.WHITE;
          break;
        default:
          obj.side = FIGURE_SIDE.BLACK;
      }
      break;
    default:
      break;
  }

  if (rowNumNumber === 2 || rowNumNumber === 7) {
    obj.type = FIGURE_TYPE.PAWN;

    switch (rowNumNumber) {
      case 2:
        obj.side = FIGURE_SIDE.WHITE;
        break;
      default:
        obj.side = FIGURE_SIDE.BLACK;
        break;
    }
  }

  return obj;
}
