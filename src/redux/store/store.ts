import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import selectedReducer from "../features/selectedSlice"
import applicationsReducer from "../features/appliedJobsSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    selected:selectedReducer,
    application:applicationsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
