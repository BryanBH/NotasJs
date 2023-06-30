export type cellType = 'text' | 'code';
export type direction = 'up' | 'down';
export interface Cell {
  id: string;
  type: cellType;
  content: string;
}
