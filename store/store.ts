import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import watchListReducer from "./watchListSlice";
import userReducer from "./userSlice";
import listReducer from "./topList";

const rootReducer = combineReducers({
  watchList: watchListReducer,
  user: userReducer,
  stockList: listReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["watchList", "user", "stockList"], // persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
