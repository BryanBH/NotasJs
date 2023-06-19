import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bundle from '../../bundler';

interface bundleState {
  [key: string]: {
    loading: boolean;
    code: string;
    err: string;
  } | undefined;
}

interface asyncArgs {
  cellId: string;
  input: string;
}
const initialState: bundleState = {};

/**
 * async call to bundle the user code 
 */
export const createBundle = createAsyncThunk(
  'bundleSlice/createBundle',
  async (args: asyncArgs, { rejectWithValue }) => {
    const { cellId, input } = args;
    try {
      const result = await bundle(input);
      return { cellId, result };
    } catch (err) {
      return rejectWithValue({ cellId, result: { code: '', err } });
    }
  }
);

const bundleSlice = createSlice({
  name: 'bundleSlice',
  initialState,
  reducers: {
    /**
     * empties the cell's bundle code and error to allow for new code to be updated
     * @param action payload is the cell id
     */
    bundleStart: (state, action: PayloadAction<string>) => {
      // action.payload is cell id
      state[action.payload] = {
        loading: true,
        code: '',
        err: '',
      };
    },
    /**
     *  updates bundle state with with new bundled code
     * @param action { cellId, bundle { code, err} }
     */
    bundleComplete: (
      state,
      action: PayloadAction<{
        cellId: string;
        bundle: { code: string; err: string };
      }>
    ) => {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBundle.pending, (state, action) => {
      // the pending action should have that ID value passed in available as action.meta.arg.
      state[action.meta.arg.cellId] = {
        loading: true,
        code: '',
        err: '',
      };
    });
    builder.addCase(createBundle.fulfilled, (state, action) => {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.result.code,
        err: action.payload.result.err,
      };
    });

    builder.addCase(createBundle.rejected, (state, action) => {
      const result: any = action.payload;
      state[action.meta.arg.cellId] = {
        loading: false,
        code: result.result.code,
        err: result.result.err,
      };
    });
  },
});

export const { bundleStart, bundleComplete } = bundleSlice.actions;
export const bundleReducer = bundleSlice.reducer;
