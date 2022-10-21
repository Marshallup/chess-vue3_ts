import { Cell } from '@/models/Cell';

export interface BoardData {
  // Обозначить по определенной логике в соотвествии с доской
  [key: string]: Cell;
}
