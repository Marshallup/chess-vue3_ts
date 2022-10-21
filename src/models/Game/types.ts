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

export type ScoreInfoI = FIGURE_TYPE[];

export interface ScoreI {
  [FIGURE_SIDE.WHITE]: ScoreInfoI;
  [FIGURE_SIDE.BLACK]: ScoreInfoI;
}
