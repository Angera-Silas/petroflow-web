// filepath: /home/angera/Projects/PetroFlow/petroflow_web/src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // Use sessionStorage
import userReducer from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;