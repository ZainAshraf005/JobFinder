import { createSlice } from "@reduxjs/toolkit";

// Helper function to get persisted user
const persistAuthUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("applicaions")
      ? JSON.parse(window.localStorage.getItem("applications")!)
      : null;
  } catch {
    return null; // Return null if parsing fails
  }
};

// Define the user state interface
interface applicationState {
  applications:
    | [
        {
          id: string;
          jobId: string;
          coverLetter: string;
          appliedAt: string;
        }
      ]
    | null;
}

// Define the initial state
const initialState: applicationState = {
  applications: persistAuthUser(),
};

// Create the user slice
const appliedJobsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
      if (typeof window !== "undefined")
        window.localStorage.setItem(
          "applications",
          JSON.stringify(action.payload)
        );
    },
    clearApplications: (state) => {
      state.applications = null;
      if (typeof window !== null)
        window.localStorage.removeItem("applications");
    },
  },
});

// Export the actions and reducer
export const { setApplications, clearApplications } = appliedJobsSlice.actions;
export default appliedJobsSlice.reducer;
