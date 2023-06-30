import { createAsyncThunk } from '@reduxjs/toolkit';
import { Rootstate } from '../index';
import axios from 'axios';

export const saveCells = createAsyncThunk(
  'cellSlice/saveCells',
  async (args, { getState, rejectWithValue }) => {
    try {
      const {
        cells: { data, order },
      } = getState() as Rootstate;

      const cells = order.map((id) => data[id]);

      await axios.post('/cells', { cells });
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  }
);
