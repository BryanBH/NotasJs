import { createSlice } from '@reduxjs/toolkit';
import { createBundle } from '../asyncThunks/createBundle';

interface bundleState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: bundleState = {};

const bundleSlice = createSlice({
  name: 'bundleSlice',
  initialState,
  reducers: {},
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

export const bundleReducer = bundleSlice.reducer;
