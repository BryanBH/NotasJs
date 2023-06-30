import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Cell } from '../../models';

export const fetchCells = createAsyncThunk(
  'cellSlice/fetchCells',
  async (args: void, { rejectWithValue }) => {
    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  }
);
