import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Stock = {
  ticker: string;
  change_price: string;
  price: string;
  change_percentage: string;
};

export type WatchList = {
  name: string;
  stocks: Stock[];
};

export type WatchListState = {
  watchlists: WatchList[];
};

const initialState: WatchListState = {
  watchlists: [],
};

const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    createWatchList(state, action) {
      const { watchlistName } = action.payload;
      state.watchlists.push({
        name: watchlistName,
        stocks: [],
      });
    },
    addStock(
      state,
      action: PayloadAction<{ watchlistName: string; stock: Stock }>
    ) {
      const { watchlistName, stock } = action.payload;
      const wl = state.watchlists.find((wl) => wl.name === watchlistName);
      if (wl) {
        wl.stocks.push(stock);
      } else {
        state.watchlists.push({
          name: watchlistName,
          stocks: [stock],
        });
      }
    },
    removeStock(
      state,
      action: PayloadAction<{ watchlistName: string; ticker: string }>
    ) {
      const { watchlistName, ticker } = action.payload;
      const wl = state.watchlists.find((wl) => wl.name === watchlistName);
      if (wl) {
        wl.stocks = wl.stocks.filter((stock) => stock.ticker !== ticker);
      }
    },
    addWatchList(state, action: PayloadAction<string>) {
      if (!state.watchlists.some((wl) => wl.name === action.payload)) {
        state.watchlists.push({ name: action.payload, stocks: [] });
      }
    },
    removeWatchList(state, action: PayloadAction<string>) {
      state.watchlists = state.watchlists.filter(
        (wl) => wl.name !== action.payload
      );
    },
    setWatchLists(state, action: PayloadAction<WatchList[]>) {
      state.watchlists = action.payload;
    },
    clearAllWatchLists(state) {
      state.watchlists = [];
    },
  },
});

export const {
  addStock,
  removeStock,
  addWatchList,
  removeWatchList,
  setWatchLists,
  clearAllWatchLists,
} = watchListSlice.actions;
export default watchListSlice.reducer;
