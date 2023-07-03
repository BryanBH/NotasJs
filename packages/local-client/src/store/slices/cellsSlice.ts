import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Cell } from '../../models';
import { fetchCells, saveCells } from '../asyncThunks';
import {
  UpdateCellAction,
  InsertCellAfterAction,
  MoveCellAction,
} from '../actions/index';

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
    updateCell: (state, action: PayloadAction<UpdateCellAction>) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    /**
     * Delete cell
     * @param state
     * @param action string id of cell being deleted
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
    moveCellByID: (state, action: PayloadAction<MoveCellAction>) => {
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
    insertCellAfter: (state, action: PayloadAction<InsertCellAfterAction>) => {
      const { id, cellType } = action.payload;

      let cell: Cell;

      // filter number of created code cells
      let numCodeCells = Object.keys(
        Object.fromEntries(
          Object.entries(state.data).filter(
            ([key, cell]) => cell.type === 'code'
          )
        )
      ).length;

      if (cellType === 'text') {
        cell = {
          content: '# Click To Edit',
          type: cellType,
          id: randomId(),
        };
      } else {
        const codeContent =
          numCodeCells < 1
            ? tempReactContent
            : '// Show(content) displays content on cell frame';
        cell = {
          content: codeContent,
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
  extraReducers: (builder) => {
    builder.addCase(fetchCells.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCells.fulfilled, (state, action) => {
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload?.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as cellState['data']);
    });
    builder.addCase(fetchCells.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload.error;
    });
    builder.addCase(saveCells.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(saveCells.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(saveCells.rejected, (state, action) => {
      const error: any = action.payload;
      state.error = error;
    });
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
// Show(content) displays content on cell frame
show(<App/>)
`;
