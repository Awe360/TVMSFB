"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import AuthSlice from "../authSlice/index.jsx";

// Configure Redux Persist
const persistConfig = {
  key: "auth",
  storage, // Persist in localStorage
  blacklist: ["error"], // Don't persist error
};

const persistedAuthReducer = persistReducer(persistConfig, AuthSlice);

// Create Redux Store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use persisted reducer for auth
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevent serialization warning
    }),
});

// Create Persistor
export const persistor = persistStore(store);
