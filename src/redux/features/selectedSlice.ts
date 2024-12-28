import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Function to persist selected value
const persistSelected = (): string => {
  if (typeof window === "undefined") return "account"; // Default value if in server-side environment
  const storedValue = window.localStorage.getItem("selected");
  return storedValue ? storedValue : "account"; // Fallback to "account" if not found
};

// Initial state with selected value from localStorage or default
const initialState = {
  selected: persistSelected(),
};

const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
      if (typeof window !== "undefined") {
        // Set the selected value in localStorage
        window.localStorage.setItem("selected", action.payload);
      }
    },
    clearSelected: (state) => {
      state.selected = "account"; // Reset to default
      if (typeof window !== "undefined") {
        // Remove the selected value from localStorage
        window.localStorage.removeItem("selected");
      }
    },
  },
});

// Export actions and reducer
export const { setSelected, clearSelected } = selectedSlice.actions;
export default selectedSlice.reducer;
