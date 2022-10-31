import { FIGURE_SIDE, FIGURE_TYPE } from '@/enums/figure';

export type PlayerSide = FIGURE_SIDE.BLACK | FIGURE_SIDE.WHITE;

export interface ICheckInfo {
  figureCellKeyCheck: string | null;
}

export interface CheckMateType {
  isCheck: boolean;
  checkInfo: ICheckInfo;
  isMate: boolean;
}

export interface CheckMateInfo {
  [FIGURE_SIDE.WHITE]: CheckMateType;
  [FIGURE_SIDE.BLACK]: CheckMateType;
}

export interface IWinnerScore {
  [FIGURE_SIDE.WHITE]: number;
  [FIGURE_SIDE.BLACK]: number;
}

export type FiguresPlayer =
  | FIGURE_TYPE.BISHOP
  | FIGURE_TYPE.KNIGHT
  | FIGURE_TYPE.PAWN
  | FIGURE_TYPE.PAWN_KING
  | FIGURE_TYPE.QUEEN
  | FIGURE_TYPE.ROOK;

export type ScoreInfoI = {
  [FIGURE_TYPE.BISHOP]: number;
  [FIGURE_TYPE.KNIGHT]: number;
  [FIGURE_TYPE.PAWN]: number;
  [FIGURE_TYPE.PAWN_KING]: number;
  [FIGURE_TYPE.QUEEN]: number;
  [FIGURE_TYPE.ROOK]: number;
};

export interface ScoreI {
  [FIGURE_SIDE.WHITE]: ScoreInfoI;
  [FIGURE_SIDE.BLACK]: ScoreInfoI;
}
