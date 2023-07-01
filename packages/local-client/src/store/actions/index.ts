import { Cell, cellType } from '../../models';
import { ActionType } from '../actionTypes';

export type Direction = 'up' | 'down';

export interface MoveCellAction {
  // type: ActionType.MOVE_CELL;
  id: string;
  direction: Direction;
}

export interface DeleteCellAction {
  // type: ActionType.DELETE_CELL;
  info: { id: string };
}

export interface InsertCellAfterAction {
  // type: ActionType.INSERT_CELL_AFTER;
  id: string | null;
  cellType: cellType;
}

export interface UpdateCellAction {
  // type: ActionType.UPDATE_CELL;
  id: string;
  content: string;
}

export interface BundleStartAction {
  id: string;
}

export interface BundleCompleteAction {
  id: string;
  code: string;
  err: string;
}

export interface FetchCellsLoadingAction {
  loading: boolean;
}

export interface FetchCellsCompleteAction {
  data: Cell[];
}

export interface FetchCellsErrorAction {
  errorMessage: string;
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction;
