import { createSlice } from "@reduxjs/toolkit";

// Helper function to get persisted user
const persistAuthUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("user")
      ? JSON.parse(window.localStorage.getItem("user")!)
      : null;
  } catch {
    return null; // Return null if parsing fails
  }
};

// Helper function to get login status
const persistLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("isLoggedIn") ? true : false;
};

// Define the user state interface
interface userState {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
    role: string;
    resume: boolean;
    photo: string;
  } | null;
  isLoggedIn: boolean;
}

// Define the initial state
const initialState: userState = {
  isLoggedIn: persistLoggedIn(),
  user: persistAuthUser(),
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("isLoggedIn", "true");
        window.localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("isLoggedIn");
        window.localStorage.removeItem("user");
      }
    },
  },
});

// Export the actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
