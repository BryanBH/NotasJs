import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Cell, direction, cellType } from '../../models';

// cell object type
interface cells {
  [id: string]: Cell;
}

interface cellState {
  data: cells;
  loading: boolean;
  error: string | null;
  order: string[];
}

const initialState: cellState = {
  data: {},
  loading: false,
  error: null,
  order: [],
};

const cellSlice = createSlice({
  name: 'cellSlice',
  initialState,
  reducers: {
    /**
     *  Update cell content
     * @param state
     * @param action id of cell and content to be updated
     */
    updateCell: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    /**
     * Delete cell
     * @param state
     * @param action stirng id id of cell being deleted
     */
    deleteCellByID: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      //remove cell from data
      delete state.data[id];

      //remove cell from order
      state.order = state.order.filter((cellId) => cellId !== id);
    },
    /**
     * Moves cell in deisred direction by one cell
     * @param state
     * @param action object { id: string, direction: "up" | "down"}
     */
    moveCellByID: (
      state,
      action: PayloadAction<{ id: string; direction: direction }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((cellIds) => cellIds === id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      // out of bounds handling
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return;

      //swap
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
    },
    /**
     * Creates cell and inserts it before selected cell in correct order
     * @param state
     * @param action id and cell type of cell that the newly created cell will be inserted after the current cell
     * if no cell exist, new cell will be inserted as the last element in the order
     */
    insertCellAfter: (
      state,
      action: PayloadAction<{ id: string | null; cellType: cellType }>
    ) => {
      const { id, cellType } = action.payload;

      let cell: Cell;

      if (cellType === 'text') {
        cell = {
          content: '# Click To Edit',
          type: cellType,
          id: randomId(),
        };
      } else {
        cell = {
          content: tempReactContent,
          type: cellType,
          id: randomId(),
        };
      }

      //insert to data
      state.data[cell.id] = cell;

      //insert to order
      const index = state.order.findIndex((cellIds) => cellIds === id);

      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }
    },
  },
});
// generate random 3 string
const randomId = () => Math.random().toString(36).substring(2, 5);

export const { updateCell, deleteCellByID, moveCellByID, insertCellAfter } =
  cellSlice.actions;

export const cellsReducer = cellSlice.reducer;
const tempReactContent = `const App = () => {
  return <h1 style={{ color: 'black' }}>Hello world</h1>;
};
show(<App/>)
`;
