import { NUMBERS } from '@/constants/board';

export function isFillCell(idx: number) {
  if ((idx / NUMBERS) % 2 < 1) {
    if (idx % 2 === 0) {
      return false;
    }
    return true;
  }

  if (idx % 2 === 0) {
    return true;
  }

  return false;
}
