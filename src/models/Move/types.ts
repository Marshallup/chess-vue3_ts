export type CellMoveT = [string[], string[]];

export type MoveDirType =
  | 'top'
  | 'top-left'
  | 'top-g-left'
  | 'top-right'
  | 'top-g-right'
  | 'left'
  | 'left-g-top'
  | 'left-g-bottom'
  | 'right'
  | 'right-g-top'
  | 'right-g-bottom'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-g-left'
  | 'bottom-right'
  | 'bottom-g-right';

export type DirectionInfo = {
  [k in MoveDirType]: {
    stopped: boolean;
    hasCuttedCell: boolean;
    startLetterIdx: number;
    startNumberCell: number;
    positiveNumberCell: boolean;
    cellsCut: string[];
    canCutKing: boolean;
  };
};
