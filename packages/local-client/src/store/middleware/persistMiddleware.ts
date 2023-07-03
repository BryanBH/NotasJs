import { saveCells } from '../index';

import {
  deleteCellByID,
  updateCell,
  insertCellAfter,
  moveCellByID,
} from '../index';

import { createListenerMiddleware } from '@reduxjs/toolkit';
/**
 * listener middleware that will debounce after the 4 major actions are called
 * it will then call the save cells thunk
 */
export const persistMiddleware = createListenerMiddleware();

persistMiddleware.startListening({
  actionCreator: deleteCellByID,
  effect: async (action, api) => {
    api.cancelActiveListeners();
    console.log('cell was deleted');
    await api.delay(4000);
    api.dispatch(saveCells());
  },
});

persistMiddleware.startListening({
  actionCreator: updateCell,
  effect: async (action, api) => {
    api.cancelActiveListeners();
    await api.delay(4000);
    console.log('update cell delay');
    api.dispatch(saveCells());
  },
});

persistMiddleware.startListening({
  actionCreator: moveCellByID,
  effect: async (action, api) => {
    api.cancelActiveListeners();
    await api.delay(1000);
    console.log('move cell delay');
    api.dispatch(saveCells());
  },
});
persistMiddleware.startListening({
  actionCreator: insertCellAfter,
  effect: async (action, api) => {
    api.cancelActiveListeners();
    await api.delay(1000);
    console.log('new cell delay');
    api.dispatch(saveCells());
  },
});
