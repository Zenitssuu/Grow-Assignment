import { createSlice } from "@reduxjs/toolkit";

type StockList = {
  top_gainers: [];
  top_losers: [];
};

const initialState: StockList = {
  top_gainers: [],
  top_losers: [],
};

const stockSlice = createSlice({
  name: "topList",
  initialState,
  reducers: {
    setList: (state, action) => {
      state.top_gainers = action.payload.top_gainers;
      state.top_losers = action.payload.top_losers;
    },
    removeList: (state, action) => {
      state.top_gainers = [];
      state.top_losers = [];
    },
  },
});

export const { setList, removeList } = stockSlice.actions;
export default stockSlice.reducer;
