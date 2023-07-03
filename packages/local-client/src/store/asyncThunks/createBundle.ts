import { createAsyncThunk } from '@reduxjs/toolkit';
import bundle from '../../bundler';

interface asyncArgs {
  cellId: string;
  input: string;
}

/**
 * async call to bundle the user's code
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
